import * as AuthService from '../services/AuthService.js';

const handleError = (res, error) => {
  console.error(error);

  return res.status(error.status || 500).json({
    status: 'fail',
    message: error.message || 'Terjadi kesalahan pada server.',
  });
};

const register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil.',
      dataUser: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil.',
      token: result.token,
      dataUser: result.user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export { register, login };
