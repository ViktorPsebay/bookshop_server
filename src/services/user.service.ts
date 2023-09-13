import { createHmac } from 'crypto';
import { Injectable } from '@nestjs/common';
import Jwt from 'jsonwebtoken';

import { user } from '../models/user.model';

const salt = 'salt';
const secretKey = 'Random_Secret_Key';

const generateAccessToken = (id, email) => {
  const payload = {
    id,
    email,
  };
  return Jwt.sign(payload, secretKey, { expiresIn: '2h' });
};

@Injectable()
export class UserService {
  async getAllUsers() {
    try {
      const users = await user.findAll({
        raw: true,
        attributes: ['id', 'fullName', 'email', 'birthday'],
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async getOneUser(id: string) {
    try {
      const users = await user.findOne({
        where: { id },
        raw: true,
        attributes: ['id', 'fullName', 'email', 'birthday'],
      });
      return users;
    } catch (e) {
      console.log(e);
    }
  }

  async create(req, res) {
    try {
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
    } catch (e) {
      console.log(e);
    }
  }

  async updateUser(req, res) {
    try {
      const { fullName, birthday, email } = req.body;
      const hasRight = req.user.email === email;

      if (!hasRight) {
        return res.status(401).json({ message: 'У вас нет прав доступа' });
      }

      const updatedUser = await user.update(
        { fullName, birthday, email },
        { where: { email } },
      );

      return res.status(200).json(updatedUser);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const hasRight = req.user.id === +id;
      if (!hasRight) {
        return res.status(401).json({ message: 'У вас нет прав доступа' });
      }

      await user.destroy({ where: { id } });

      return res.status(200).json({ message: 'Пользователь был удален' });
    } catch (e) {
      console.log(e);
    }
  }

  async registration(req, res) {
    try {
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
    } catch (e) {
      console.log(e);
    }
  }

  async authorization(req, res) {
    try {
      const { email, password } = req.body;
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
      const token = generateAccessToken(candidate.id, candidate.email);
      return res.status(200).json(token);
    } catch (e) {
      console.log(e);
    }
  }
}
