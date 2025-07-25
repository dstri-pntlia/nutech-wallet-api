import { query } from '../config/db';
import { hashPassword } from '../utils/hashPassword';

export const registerUser = async (email: string, firstName: string, lastName: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  const result = await query(
    'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING id',
    [email, firstName, lastName, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};