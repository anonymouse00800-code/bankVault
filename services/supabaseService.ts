import { createClient } from '@supabase/supabase-js';
import { AccountRecord, SupabaseResponse } from '../types';
import { SUPABASE_URL, SUPABASE_ANON_KEY, TABLE_NAME } from '../constants';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const saveAccountDetails = async (
  account: AccountRecord
): Promise<SupabaseResponse<AccountRecord[]>> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          acc_name: account.acc_name,
          acc_num: account.acc_num,
          bsb: account.bsb,
          payid: account.payid,
          amount: account.amount,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as AccountRecord[], error: null };
  } catch (err: any) {
    console.error('Unexpected Error:', err);
    return { data: null, error: new Error(err.message || 'An unexpected error occurred') };
  }
};

export const fetchRecentAccounts = async (): Promise<SupabaseResponse<AccountRecord[]>> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    return { data: data as AccountRecord[], error: null };
  } catch (err: any) {
    return { data: null, error: new Error(err.message) };
  }
}