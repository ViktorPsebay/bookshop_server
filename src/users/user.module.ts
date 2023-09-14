import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './user.controller';
import { user } from './models/user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'viktor',
      password: 'viktor123',
      database: 'bookstore',
      models: [user],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
