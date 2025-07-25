import { Request, Response } from 'express';
import { query } from '../config/db';
import { apiResponse } from '../utils/apiResponse';
import multer from 'multer';
import path from 'path';
import { getUserProfile, updateUserProfile } from '../models/profile.model';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();
const upload = multer({ storage }).single('profile_image');

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserProfile(userId);

    if (!user) {
      return apiResponse(res, 404, 'User tidak ditemukan', null);
    }

    return apiResponse(res, 200, 'Sukses', user);
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { first_name, last_name } = req.body;

    await updateUserProfile(userId, first_name, last_name);
    const user = await getUserProfile(userId);

    return apiResponse(res, 200, 'Update Profile berhasil', {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_image: user.profile_image ?? null,
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const updateProfileImage = (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    try {
      if (err) {
        return apiResponse(res, 400, 'Error uploading file', null);
      }

      const userId = (req as any).user.id;
      const file = req.file;

      if (!file) {
        return apiResponse(res, 400, 'No file uploaded', null);
      }


      const allowedMimeTypes = ['image/jpeg', 'image/png'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          status: 102,
          message: 'Format Image tidak sesuai',
          data: null,
        });
      }

       const streamUpload = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_images',
              public_id: `profile-${userId}-${Date.now()}`,
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const imageUrl = await streamUpload();

      await query(
        'UPDATE users SET profile_image = $1, updated_at = NOW() WHERE id = $2',
        [imageUrl, userId]
      );

      const result = await query(
        'SELECT email, first_name, last_name FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];

      return res.status(200).json({
        status: 0,
        message: 'Update Profile Image berhasil',
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: imageUrl,
        }
      });
    } catch (error) {
      console.error(error);
      return apiResponse(res, 500, 'Internal Server Error', null);
    }
  });
};