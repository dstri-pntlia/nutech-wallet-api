export interface IRegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  status: number;
  message: string;
  data: {
    token?: string;
  } | null;
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_image?: string;
  balance?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IJwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}