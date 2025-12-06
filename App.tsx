import React, { useState, useEffect } from 'react';
import { AccountForm } from './components/AccountForm';
import { SqlHelper } from './components/SqlHelper';
import { AccountRecord } from './types';
import { fetchRecentAccounts } from './services/supabaseService';
import { LucideLandmark, LucideShieldCheck, LucideLayoutList } from 'lucide-react';

const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [recentAccounts, setRecentAccounts] = useState<AccountRecord[]>([]);

  // Simple poller or trigger to fetch recent items when form submits
  useEffect(() => {
    const loadRecent = async () => {
      const { data } = await fetchRecentAccounts();
      if (data) {
        setRecentAccounts(data);
      }
    };
    loadRecent();
  }, [refreshTrigger]);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const formatCurrency = (amount: string | number) => {
    if (!amount) return '-';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LucideLandmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Vault<span className="text-blue-600">Keeper</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <LucideShieldCheck className="w-4 h-4 text-green-500" />
            <span className="hidden sm:inline">Secure Connection</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Text */}
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Account Management
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Securely record account details to your Supabase database instance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-8">
            <AccountForm onSuccess={handleSuccess} />
            
            {/* SQL Helper Section */}
            <SqlHelper />
          </div>

          {/* Sidebar / Recent List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <LucideLayoutList className="w-4 h-4 text-gray-400" />
                  Recent Entries
                </h3>
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  Live
                </span>
              </div>
              
              <div className="space-y-3">
                {recentAccounts.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-8">
                    No records found yet. <br/> Make sure to run the SQL setup!
                  </p>
                ) : (
                  recentAccounts.map((acc, idx) => (
                    <div key={acc.id || idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900">{acc.acc_name}</div>
                        {acc.amount && (
                          <div className="text-emerald-600 font-bold text-sm">
                            {formatCurrency(acc.amount)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 font-mono">{acc.bsb ? `BSB: ${acc.bsb}` : ''}</span>
                        <span className="text-xs text-gray-500 font-mono">{acc.acc_num ? `#${acc.acc_num}` : ''}</span>
                      </div>
                      {acc.payid && (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                           <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">PayID</span>
                           <span className="text-xs text-gray-600 font-mono">{acc.payid}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-blue-800 font-semibold text-sm mb-2">Project Info</h4>
              <p className="text-xs text-blue-600 break-all">
                <span className="font-bold">URL:</span> https://rehxsplpkrbbcqfankbg.supabase.co
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;