import { query } from '../config/db';
import { ITransaction } from '../interfaces/transaction.interface';

export const getUserBalance = async (userId: number): Promise<number> => {
  try {
    const result = await query('SELECT balance FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.balance || 0;
  } catch (error) {
    throw new Error(`Error fetching user balance: ${error}`);
  }
};

export const updateUserBalance = async (userId: number, amount: number): Promise<void> => {
  try {
    await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);
  } catch (error) {
    throw new Error(`Error updating user balance: ${error}`);
  }
};

export const createTransaction = async (
  transactionData: Omit<ITransaction, 'id' | 'created_on'>
): Promise<ITransaction> => {
  try {
    const { invoice_number, user_id, service_code, service_name, transaction_type, total_amount } = transactionData;

    const result = await query(
      `INSERT INTO transactions
      (invoice_number, user_id, service_code, service_name, transaction_type, total_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [invoice_number, user_id, service_code, service_name, transaction_type, total_amount]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating transaction: ${error}`);
  }
};

export const getTransactionsByUserId = async (
  userId: number,
  limit?: number
): Promise<ITransaction[]> => {
  try {
    const baseQuery = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_on DESC';
    const finalQuery = limit ? `${baseQuery} LIMIT $2` : baseQuery;
    const values = limit ? [userId, limit] : [userId];

    const result = await query(finalQuery, values);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error}`);
  }
};


