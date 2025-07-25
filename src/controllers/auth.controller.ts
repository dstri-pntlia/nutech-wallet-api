import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { generateToken } from '../config/jwt';
import { registerUser, getUserByEmail } from '../models/auth.model';
import { apiResponse } from '../utils/apiResponse';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: 'Paramter email tidak sesuai format',
        data: null,
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: 'Password minimal 8 karakter',
        data: null,
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return apiResponse(res, 400, 'Email sudah terdaftar', null);
    }

    await registerUser(email, first_name, last_name, password);
    return res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 102,
        message: 'Paramter email tidak sesuai format',
        data: null,
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: 'Password minimal 8 karakter',
        data: null,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const token = generateToken({ id: user.id, email: user.email });
    return res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: { token },
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};
