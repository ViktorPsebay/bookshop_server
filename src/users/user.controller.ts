import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './decorators/user.decorator';
import { IUser } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    return this.userService.create(body, res);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.updateUser(id, body, res);
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @User() user: IUser,
    @Res() res: Response,
  ) {
    return this.userService.deleteUser(id, user, res);
  }
}
