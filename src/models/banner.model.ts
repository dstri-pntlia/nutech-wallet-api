import { query } from '../config/db';
import { IBanner } from '../interfaces/banner.interface';

export const getActiveBanners = async (): Promise<IBanner[]> => {
  try {
    const result = await query('SELECT * FROM banners WHERE is_active = true');
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching banners: ${error}`);
  }
};

export const getBannerById = async (id: number): Promise<IBanner | null> => {
  try {
    const result = await query('SELECT * FROM banners WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching banner: ${error}`);
  }
};

export const createBanner = async (bannerData: IBanner): Promise<IBanner> => {

  const { banner_name, banner_image, description } = bannerData;

  try {
    const result = await query(
      `INSERT INTO banners (banner_name, banner_image, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [banner_name, banner_image, description]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating banner: ${error}`);
  }

}