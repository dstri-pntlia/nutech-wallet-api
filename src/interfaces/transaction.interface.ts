export interface ITransaction {
  id: number;
  invoice_number: string;
  user_id: number;
  service_code: string;
  service_name: string;
  transaction_type: 'TOPUP' | 'PAYMENT';
  total_amount: number;
  created_on: Date;
}

export interface IBalanceResponse {
  status: number;
  message: string;
  data: {
    balance: number;
  } | null;
}

export interface ITopUpRequest {
  top_up_amount: number;
}

export interface ITopUpResponse {
  status: number;
  message: string;
  data: {
    balance: number;
  } | null;
}

export interface ITransactionRequest {
  service_code: string;
}

export interface ITransactionResponse {
  status: number;
  message: string;
  data: {
    invoice_number: string;
    service_code: string;
    service_name: string;
    transaction_type: string;
    total_amount: number;
    created_on: Date;
  } | null;
}