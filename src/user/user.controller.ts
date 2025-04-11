import { Body, Controller, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './user.service';
import { currentUser } from 'src/auth/decorators/getUser.decorator';
import { user } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/userRole.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
@UseGuards(jwtGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userServices: UsersService) {}
  @Get('me')
  getMe(@currentUser() user: user) {
    return user;
  }
  @UseInterceptors(FileInterceptor('image'))
  @Roles('admin')
  @Put('picture/:userId')
  @ApiOperation({ summary: 'Update user picture' })
  updateUserPicture(
    @currentUser() user: user,
    @Param('userId') userId: string,
    @UploadedFile() data: Express.Multer.File,
  ) {
    return this.userServices.updateUserPicture(userId, data);
  }
  //TODO: figure out a way to auth the model
  @ApiOperation({ summary: 'Get all employees pictures' })
  @Get('employees/pictures')
  getEmployeesPictures(@currentUser() user: user) {
    return this.userServices.getEmployeesPictures(user.companyId);
  }
}
