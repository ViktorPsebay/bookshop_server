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

import { UserService } from '../services/user.service';
import { AuthUserDto, CreateUserDto } from 'src/dto/user.dto';

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
  updateUser(@Param('id') id: string, @Res() res: Response) {
    return this.userService.updateUser(id, res);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    return this.userService.deleteUser(id, res);
  }

  @Post('login')
  authUser(@Body() body: AuthUserDto, @Res() res: Response) {
    return this.userService.authorization(body, res);
  }
}
