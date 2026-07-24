import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as AuthRepository from '../repository/AuthRepositories.js';
import { getCurrentTimestamp } from '../helpers/date.helper.js';

const register = async ({ username, password }) => {
  if (!username || !password) {
    throw {
      status: 400,
      message: 'Username dan password wajib diisi.',
    };
  }

  const existingUser = await AuthRepository.getUserByUsername(username);

  if (existingUser) {
    throw {
      status: 409,
      message: 'Username sudah digunakan.',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    password: hashedPassword,
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  };

  const createdUser = await AuthRepository.createUser(newUser);

  return {
    id: createdUser.id,
    username: createdUser.username,
  };
};

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw {
      status: 400,
      message: 'Username dan password wajib diisi.',
    };
  }

  const user = await AuthRepository.getUserByUsername(username);

  if (!user) {
    throw {
      status: 401,
      message: 'Username atau password salah.',
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw {
      status: 401,
      message: 'Username atau password salah.',
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET || 'supersecretresearchkey',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
};

export { register, login };
