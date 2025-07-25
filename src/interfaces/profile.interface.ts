export interface IProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  balance?: number;
}

export interface IUpdateProfile {
  first_name: string;
  last_name: string;
}

export interface IUpdateProfileImage {
  profile_image: string;
}

export interface IProfileResponse {
  status: number;
  message: string;
  data: IProfile | null;
}