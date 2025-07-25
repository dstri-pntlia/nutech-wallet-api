import { query } from '../config/db';

export const getUserProfile = async (userId: number) => {
  const result = await query('SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

export const updateUserProfile = async (userId: number, firstName: string, lastName: string) => {
  await query(
    'UPDATE users SET first_name = $1, last_name = $2, updated_at = NOW() WHERE id = $3',
    [firstName, lastName, userId]
  );
};
