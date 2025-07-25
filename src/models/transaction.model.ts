import { query } from '../config/db';
import { ITransaction } from '../interfaces/transaction.interface';
import { generateInvoiceNumber } from '../utils/generateInvoice';

export const getUserBalance = async (userId: number): Promise<number> => {
  const result = await query('SELECT balance FROM users WHERE id = $1', [userId]);
  if (!result.rows[0]) throw new Error('USER_NOT_FOUND');
  return Number(result.rows[0].balance);
};

export const topUpBalance = async (
  userId: number,
  amount: number
): Promise<number> => {
  await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);

  const invoiceNumber = generateInvoiceNumber();
  await query(
    `INSERT INTO transactions
    (invoice_number, user_id, service_code, service_name, transaction_type, total_amount)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [invoiceNumber, userId, 'TOPUP', 'Top Up Balance', 'TOPUP', amount]
  );

  const result = await query('SELECT balance FROM users WHERE id = $1', [userId]);
  return Number(result.rows[0].balance);
};


export const getTransactionsByUserId = async (
  userId: number,
  limit?: number
): Promise<ITransaction[]> => {
  const baseQuery = `
    SELECT
      invoice_number,
      service_code,
      service_name,
      transaction_type,
      total_amount,
      created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_on DESC
  `;
  const finalQuery = limit ? `${baseQuery} LIMIT $2` : baseQuery;
  const values = limit ? [userId, limit] : [userId];

  const result = await query(finalQuery, values);
  return result.rows.map(row => ({
    ...row,
    total_amount: Number(row.total_amount)
  }));
};