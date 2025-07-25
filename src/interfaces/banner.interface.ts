export interface IBanner {
  id?: number;
  banner_name: string;
  banner_image: string;
  description: string;
  created_at?: Date;
}

export interface IBannerResponse {
  status: number;
  message: string;
  data: IBanner[] | null;
}