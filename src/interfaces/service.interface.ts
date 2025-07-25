export interface IService {
  id?: number;
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
  is_active: boolean;
  created_at?: Date;
}

export interface IServiceResponse {
  status: number;
  message: string;
  data: IService[] | null;
}