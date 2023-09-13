import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UserController } from './controllers/user.controller';
import { user } from './models/user.model';
import { UserService } from './services/user.service';

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
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
