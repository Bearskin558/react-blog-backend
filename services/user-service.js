import { toPng } from 'jdenticon';
import bcrypt from 'bcryptjs';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';
import { UserDto } from '../dtos/user-dto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UserService {
  async registration(email, password, name) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest('пользователь с таким email уже существует');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const png = toPng(name, 200);
    const avatarName = `${name}_${Date.now()}.png`;
    const avatarPath = path.join(__dirname, '../uploads', avatarName);
    fs.writeFileSync(avatarPath, png);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatarUrl: `/uploads/${avatarPath}`,
      },
    });
    const userDto = new UserDto(user);
    console.log(`Пользователь с email: ${email} успешно зарегистрирован`);
    return userDto;
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не был найден');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw ApiError.BadRequest('Неверный логин или пароль');
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
    console.log(`Пользователь с email: ${email} успешно залогинен`);
    return token;
  }

  async getUserByID(id, userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followers: true,
          following: true,
        },
      });

      if (!user) {
        throw ApiError.BadRequest('Пользователь не найден');
      }
      const isFollowing = Boolean(
        await prisma.follows.findFirst({
          where: {
            AND: [
              {
                followerId: userId,
              },
              { followingId: id },
            ],
          },
        }),
      );
      const userDto = new UserDto(user);
      return { userDto, isFollowing };
    } catch (error) {
      console.log(error);
      throw ApiError.BadRequest('Пользователь не найден', error);
    }
  }

  async updateUser(id, params) {
    const { email, name, dateOfBirth, bio, location, filePath } = params;
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email: email },
      });
      if (existingUser?.id !== id) {
        throw ApiError.BadRequest('Данный email уже кем-то используется');
      }
    }
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: email || undefined,
        name: name || undefined,
        avatarUrl: filePath ? `/${filePath}` : undefined,
        dateOfBirth: dateOfBirth || undefined,
        bio: bio || undefined,
        location: location || undefined,
      },
    });
    const userDto = new UserDto(user);
    console.log(`Пользователь с id: ${id} успешно обновил данные своего профиля`);
    return userDto;
  }

  async current(id) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.BadRequest('Не удалось найти пользователя');
    }
    const useDto = new UserDto(user);
    return useDto;
  }
}

export default new UserService();
