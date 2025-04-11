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
  getEmployeesPictures(compnyId: string) {
    return this.db.user.findMany({
      where: {
        companyId: compnyId,
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
  async create(createUserDto: CreateUserDto) {
    const user = { ...createUserDto };
    try {
      //TODO: change the hash to more in prod
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;
      return this.db.user.create({
        data: {
          ...user,
          company: { create: { name: 'Dla3' } },
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
      return this.db.user.update({
        where: {
          id: id,
        },
        data: updateUserDto,
      });
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
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
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
}
