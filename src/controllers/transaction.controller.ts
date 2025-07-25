import { Request, Response } from 'express';
import {
  getUserBalance,
  topUpBalance,
  getTransactionsByUserId
} from '../models/transaction.model';
import { apiResponse } from '../utils/apiResponse';
import { query } from '../config/db';
import { generateInvoiceNumber } from '../utils/generateInvoice';

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const balance = await getUserBalance(userId);
    return apiResponse(res, 200, 'Get balance berhasil', { balance });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const topUp = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { top_up_amount } = req.body;

    if (typeof top_up_amount !== 'number' || top_up_amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
        data: null,
      });
    }

    const newBalance = await topUpBalance(userId, top_up_amount);
    return apiResponse(res, 200, 'Top Up Balance berhasil', {
      balance: newBalance
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { service_code } = req.body;

    const serviceResult = await query(
      'SELECT * FROM services WHERE service_code = $1 AND is_active = true',
      [service_code]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null,
      });
    }

    const service = serviceResult.rows[0];
    const totalAmount = Number(service.service_tariff);

    const userResult = await query('SELECT balance FROM users WHERE id = $1', [userId]);
    const userBalance = Number(userResult.rows[0].balance);

    if (userBalance < totalAmount) {
      return apiResponse(res, 400, 'Saldo tidak mencukupi', null);
    }
    await query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [totalAmount, userId]
    );

    const invoiceNumber = generateInvoiceNumber();
    const transactionResult = await query(
      `INSERT INTO transactions
      (invoice_number, user_id, service_code, service_name, transaction_type, total_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING invoice_number, service_code, service_name, transaction_type, total_amount, created_on`,
      [
        invoiceNumber,
        userId,
        service.service_code,
        service.service_name,
        'PAYMENT',
        totalAmount
      ]
    );

    const transaction = transactionResult.rows[0];

    return apiResponse(res, 200, 'Transaksi berhasil', {
      invoice_number: transaction.invoice_number,
      service_code: transaction.service_code,
      service_name: transaction.service_name,
      transaction_type: transaction.transaction_type,
      total_amount: Number(transaction.total_amount),
      created_on: transaction.created_on
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const transactions = await getTransactionsByUserId(userId, limit);

    return apiResponse(res, 200, 'Get History Berhasil', {
      offset: 0,
      limit: limit || transactions.length,
      records: transactions.map(tx => ({
        invoice_number: tx.invoice_number,
        transaction_type: tx.transaction_type,
        description: tx.transaction_type === 'TOPUP' ? 'Top Up balance' : tx.service_name,
        total_amount: tx.total_amount,
        created_on: tx.created_on
      }))
    });
  } catch (error) {
    console.error(error);
    return apiResponse(res, 500, 'Internal Server Error', null);
  }
};