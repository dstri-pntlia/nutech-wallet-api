import { Request, Response, NextFunction } from 'express';
import { apiResponse } from '../utils/apiResponse';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return apiResponse(res, 500, 'Internal Server Error', null);
};