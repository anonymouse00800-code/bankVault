
export interface AccountRecord {
  id?: number;
  created_at?: string;
  acc_name: string;
  acc_num: string;
  bsb: string;
  payid: string;
  amount: string;
  label: string;
}

export interface Bank {
  bankid: number;
  bankname: string;
  imageurl?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}
