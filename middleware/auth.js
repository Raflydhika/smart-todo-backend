import jwt from 'jsonwebtoken';
import * as AuthRepository from '../repository/AuthRepositories.js';

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak ditemukan.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid.',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await AuthRepository.getUserById(payload.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User tidak ditemukan.',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized.',
    });
  }
};

export default authenticateToken;
