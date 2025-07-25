import { Request, Response } from 'express';
import { query } from '../config/db';
import { apiResponse } from '../utils/apiResponse';
import { createBanner as createBannerModel } from '../models/banner.model';
import { IBanner } from '../interfaces/banner.interface';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM banners WHERE is_active = true');
    return apiResponse(res, 200, 'Get banner berhasil', result.rows);
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { banner_name, banner_image, description} = req.body;

    if (!banner_name || !banner_image || !description) {
      return apiResponse(res, 400, 'Field wajib tidak boleh kosong', null);
    }

    const newBanner: IBanner = {
      banner_name,
      banner_image,
      description,
    };

    const createdBanner = await createBannerModel(newBanner);
    return apiResponse(res, 201, 'Banner berhasil ditambahkan', createdBanner);
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
}