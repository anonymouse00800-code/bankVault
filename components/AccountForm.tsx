
import React, { useState } from 'react';
import { AccountRecord } from '../types';
import { saveAccountDetails } from '../services/supabaseService';
import { LucideSave, LucideCheckCircle, LucideAlertCircle, LucideLoader2, LucideDollarSign } from 'lucide-react';

interface AccountFormProps {
  onSuccess: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<AccountRecord>({
    acc_name: '',
    amount: '',
    acc_num: '',
    bsb: '',
    payid: '',
    label: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    // Auto-format BSB and Account Number: remove spaces
    if (name === 'bsb' || name === 'acc_num') {
      value = value.replace(/\s+/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    // Validation Logic:
    // Condition 1: BSB and Acc Num are present.
    // Condition 2: PayID is present.
    // One of these conditions must be true.
    const hasBankDetails = formData.bsb.trim().length > 0 && formData.acc_num.trim().length > 0;
    const hasPayId = formData.payid.trim().length > 0;

    if (!hasBankDetails && !hasPayId) {
      setStatus('error');
      setErrorMessage('Please provide either Bank Details (BSB & Account Number) OR a PayID.');
      setLoading(false);
      return;
    }

    // Additional validation for Account Number length if provided
    if (hasBankDetails) {
       if (formData.acc_num.length < 6 || formData.acc_num.length > 9) {
          setStatus('error');
          setErrorMessage('Account Number must be between 6 and 9 digits.');
          setLoading(false);
          return;
       }
    }

    const response = await saveAccountDetails(formData);

    setLoading(false);

    if (response.error) {
      setStatus('error');
      setErrorMessage(response.error.message);
    } else {
      setStatus('success');
      setFormData({ acc_name: '', amount: '', acc_num: '', bsb: '', payid: '', label: '' });
      onSuccess();
      // Reset success status after a delay
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Payment Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Label <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="label"
              name="label"
              placeholder="e.g. Invoice #123"
              value={formData.label}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="acc_name" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="acc_name"
              name="acc_name"
              required
              placeholder="e.g. John Doe"
              value={formData.acc_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LucideDollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Option A: Bank Details</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">Required if no PayID</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bsb" className="block text-sm font-medium text-gray-700 mb-1">
                BSB
              </label>
              <input
                type="text"
                id="bsb"
                name="bsb"
                placeholder="e.g. 062000"
                value={formData.bsb}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-400">Format: 6 digits (e.g. 062000)</p>
            </div>
            <div>
              <label htmlFor="acc_num" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="acc_num"
                name="acc_num"
                placeholder="e.g. 12345678"
                value={formData.acc_num}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-400">Format: 6-9 digits (no spaces)</p>
            </div>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Option B: PayID</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">Required if no Bank Details</span>
          </div>
          <div>
            <label htmlFor="payid" className="block text-sm font-medium text-gray-700 mb-1">
              PayID / Email / Phone
            </label>
            <input
              type="text"
              id="payid"
              name="payid"
              placeholder="e.g. user@example.com or 0400..."
              value={formData.payid}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold transition-all shadow-md hover:shadow-lg ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <LucideLoader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <LucideSave className="w-5 h-5" />
                <span>Save Record</span>
              </>
            )}
          </button>
        </div>

        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
            <LucideCheckCircle className="w-5 h-5" />
            <span>Account details saved successfully!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
            <LucideAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage || 'Failed to save data. Check your connection or table setup.'}</span>
          </div>
        )}
      </form>
    </div>
  );
};