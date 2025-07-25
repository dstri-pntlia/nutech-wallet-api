import { Response } from 'express';

export const apiResponse = (res: Response, status: number, message: string, data: any) => {
  return res.status(status).json({
    status: status === 200 ? 0 : 1,
    message,
    data
  });
};