import { createHmac } from 'crypto';
import { Body, Injectable } from '@nestjs/common';
import { Response } from 'express';

import { user } from './models/user.model';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';

const salt = 'salt';

@Injectable()
export class UserService {
  async getAllUsers() {
    const users = await user.findAll({
      raw: true,
      attributes: ['id', 'fullName', 'email', 'birthday'],
    });
    return users;
  }

  async getOneUser(id: string) {
    const users = await user.findOne({
      where: { id },
      raw: true,
      attributes: ['id', 'fullName', 'email', 'birthday'],
    });
    return users;
  }

  async create(req: CreateUserDto, res: Response) {
    const { fullName, email, password, birthday } = req;
    const emailNormalize = email.toLowerCase();
    const candidate = await user.findOne({
      where: { email: emailNormalize },
    });

    if (candidate) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: 'Пароль не может быть менее 5 символов' });
    }

    if (fullName.length < 3) {
      return res
        .status(400)
        .json({ message: 'Имя не может быть менее 3 символов' });
    }

    const regularExpEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (!regularExpEmail.test(String(email).toLowerCase())) {
      return res.status(400).json({ message: 'Неправильный формат email' });
    }

    if (!Date.parse(birthday)) {
      return res.status(400).json({ message: 'Неправильный формат даты' });
    }

    const hashPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    await user.create({
      fullName,
      password: hashPassword,
      email: emailNormalize,
      birthday: birthday || null,
    });

    return res.status(200).json('Пользователь успешно добавлен');
  }

  async updateUser(id: string, @Body() req: UpdateUserDto, res: Response) {
    const { fullName, birthday, email, password } = req;

    const candidate = await user.findOne({ where: { email } });

    if (!candidate) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    const validPassword =
      createHmac('sha256', salt).update(password).digest('hex') ===
      candidate.password;
    if (!validPassword) {
      return res.status(400).json({ message: 'Введен неверный пароль' });
    }

    const updatedUser = await user.update(
      { fullName, birthday, email },
      { where: { email } },
    );

    return res.status(200).json(updatedUser);
  }

  async deleteUser(id: string, deletedUser: IUser, res: Response) {
    const hasRight = deletedUser.id === +id;
    if (!hasRight) {
      return res.status(401).json({ message: 'У вас нет прав доступа' });
    }

    await user.destroy({ where: { id } });

    return res.status(200).json({ message: 'Пользователь был удален' });
  }

  async registration(req, res: Response) {
    const { fullName, email, password, birthday } = req.body;
    const emailNormalize = email.toLowerCase();
    const candidate = await user.findOne({
      where: { email: emailNormalize },
    });
    if (candidate) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
    }

    if (password.length < 5)
      return res
        .status(400)
        .json({ message: 'Пароль не может быть менее 5 символов' });
    if (fullName.length < 3)
      return res
        .status(400)
        .json({ message: 'Имя не может быть менее 3 символов' });

    const regularExpEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!regularExpEmail.test(String(email).toLowerCase()))
      return res.status(400).json({ message: 'Неправильный формат email' });

    if (!Date.parse(birthday))
      return res.status(400).json({ message: 'Неправильный формат даты' });

    const hashPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    const createdUser = await user.create({
      fullName,
      password: hashPassword,
      email: emailNormalize,
      birthday,
    });
    return res.status(200).json(createdUser);
  }
}
