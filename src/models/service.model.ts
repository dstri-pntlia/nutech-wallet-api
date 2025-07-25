import { query } from '../config/db';
import { IService } from '../interfaces/service.interface';

export const getActiveServices = async (): Promise<IService[]> => {
  try {
    const result = await query('SELECT * FROM services WHERE is_active = true');
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching services: ${error}`);
  }
};

export const getServiceByCode = async (serviceCode: string): Promise<IService | null> => {
  try {
    const result = await query('SELECT * FROM services WHERE service_code = $1', [serviceCode]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching service: ${error}`);
  }
};

export const createService = async (serviceData: IService): Promise<IService> => {
  const { service_code, service_name, service_icon, service_tariff, is_active } = serviceData;

  try {
    const result = await query(
      `INSERT INTO services (service_code, service_name, service_icon, service_tariff, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [service_code, service_name, service_icon, service_tariff, is_active]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating service: ${error}`);
  }
};
