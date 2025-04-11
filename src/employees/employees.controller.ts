import {
  Controller,
  FileValidator,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationDtoReq } from 'src/common/dto/pagination-req.dto';
import { PaginationDtoRes } from 'src/common/dto/pagination-res.dto';

@UseGuards(jwtGuard, RoleGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Invalid file type. Only CSV files are allowed.'),
            false,
          );
        }
      },
    }),
  )
  @Roles('admin')
  @Post('upload')
  async getEmployees(
    @UploadedFile() emplyees: Express.Multer.File,
    @currentUser() user: user,
  ) {
    return this.employeesService.parseMulterToCsv(emplyees, user.companyId);
  }
  @ApiOperation({
    summary: 'Get Employees ',
    description: 'Get Employees of the company with pagination',
  })
  @ApiQuery({ type: PaginationDtoReq })
  @ApiResponse({ type: PaginationDtoRes })
  @Get()
  @Roles('admin')
  async getCompanyEmployees(
    @currentUser() user: user,
    @Query() q: PaginationDtoReq,
  ) {
    return this.employeesService.getCompanyEmployees(user.companyId, q);
  }
}
