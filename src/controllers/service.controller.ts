import { Request, Response } from 'express';
import { query } from '../config/db';
import { apiResponse } from '../utils/apiResponse';
import { createService as createServiceModel } from '../models/service.model';
import { IService } from '../interfaces/service.interface';

export const getServices = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM services WHERE is_active = true');
    return apiResponse(res, 200, 'Sukses', result.rows);
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { service_code, service_name, service_icon, service_tariff, is_active } = req.body;

    if (!service_code || !service_name || !service_tariff) {
      return apiResponse(res, 400, 'Field wajib tidak boleh kosong', null);
    }

    const newService: IService = {
      service_code,
      service_name,
      service_icon: service_icon || null,
      service_tariff,
      is_active: is_active ?? true,
    };

    const createdService = await createServiceModel(newService);
    return apiResponse(res, 201, 'Service berhasil ditambahkan', createdService);
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};