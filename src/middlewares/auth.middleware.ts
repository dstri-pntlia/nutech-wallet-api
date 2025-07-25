import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }
};