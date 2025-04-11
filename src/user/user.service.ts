/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaService } from 'src/db/prisma.service';
import { NormalizedRow } from 'src/employees/employees.service';
import { user } from '@prisma/client';
import { PaginationDtoRes } from 'src/common/dto/pagination-res.dto';
import { PaginationDtoReq } from 'src/common/dto/pagination-req.dto';
@Injectable()
export class UsersService {
  updateUserPicture(userId: string, data: Express.Multer.File) {
    const image = data.buffer.toString('base64');
    console.log('Encoded image:', image);
    return this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        image,
      },
    });
  }
  async createEmployeesWithArray(
    employees: NormalizedRow[],
    companyId: string,
  ) {
    try {
      employees = employees.filter((employee) => {
        if (!this.validateEmployee(employee)) {
          return false;
        }

        return true;
      });
      const users = await this.db.user.createManyAndReturn({
        skipDuplicates: true,

        data: employees.map((employee) => ({
          name: employee.employee_name,
          email: employee.email,
          password: bcrypt.hashSync(employee.phone_number, 5),
          companyId,
        })),
      });
      return {
        insertedRows: users.length,
        users: users,
      };
    } catch (error) {
      console.error('Error creating employees:', error);
      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'User Already Exist Please login With your Email and Password',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      throw new HttpException(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  getEmployeesPictures(companyId: string) {
    return this.db.user.findMany({
      where: {
        companyId,
      },
      select: {
        image: true,
        id: true,
        name: true,
      },
    });
  }

  constructor(private readonly db: PrismaService) {}
  async addProfilePicture(id: string, image: string) {
    return this.db.user.update({
      where: { id },
      data: {
        image: image,
      },
    });
  }
  async create(createUserDto: CreateUserDto, companyId: string) {
    const user = { ...createUserDto };
    try {
      //TODO: change the hash to more in prod
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;
      return this.db.user.create({
        data: {
          ...user,
          company: { connect: { id: companyId } },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'User Already Exist Please login With your Email and Password',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      throw new HttpException(
        'Something went wrong, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    try {
      return this.db.user.findMany({
        select: {
          name: true,
          email: true,
          id: true,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findOne(id: string) {
    try {
      const user = await this.db.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userData = { ...updateUserDto };

      if (userData.password) {
        //TODO: change the hash to more in prod
        userData.password = await bcrypt.hash(userData.password, 5);
      }
      const res = await this.db.user.updateManyAndReturn({
        where: {
          AND: [
            { id: id },
            {
              OR: [{ role: 'employee' }, { id }],
            },
          ],
        },
        data: updateUserDto,
      });
      if (res.length == 0) {
        throw new HttpException(
          'user not found or you do not have access to update it',
          HttpStatus.NOT_FOUND,
        );
      }
      return res[0];
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string, uid: string) {
    try {
      const deleted = await this.db.user.deleteMany({
        where: {
          AND: [
            { id: id },
            {
              OR: [{ role: 'employee' }, { id: uid }],
            },
          ],
        },
      });
      if (deleted.count === 0) {
        throw new HttpException(
          'user not found or you do not have access to delete it ',
          HttpStatus.NOT_FOUND,
        );
      }
      return deleted;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findById(id: string) {
    return this.db.user.findUnique({
      where: {
        id,
      },
    });
  }
  async findByEmail(email: string) {
    try {
      return this.db.user.findFirst({
        where: {
          email: email,
        },
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async profile(userId: string) {
    return this.db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        company: true,
      },
    });
  }
  async getCompanyEmployees(companyId: string, q: PaginationDtoReq) {
    const content = await this.db.user.findMany({
      where: {
        companyId,
      },
      skip: q.page * q.limit,
      take: q.limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
      },
    });
    return {
      content,
      page: q.page,
      limit: q.limit,
      isLastPage: content.length < q.limit,
    };
  }
  validateEmployee(employe: object) {
    if (!employe) {
      console.log('Employee object is empty');
      return false;
    }
    if (!employe['email']) {
      console.log(employe['email']);
      console.log('Email not provided');
      return false;
    }
    if (!employe['phone_number']) {
      console.log('Phone number not provided');
      return false;
    }
    if (!employe['employee_name']) {
      console.log('Employee name not provided');
      return false;
    }
    if (!employe['age']) {
      console.log('Age not provided');
      return false;
    }
    return true;
  }
}
