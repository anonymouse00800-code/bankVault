import React from 'react';
import { AccountForm } from './components/AccountForm';
import { SqlHelper } from './components/SqlHelper';
import { LucideLandmark, LucideShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  // onSuccess handler is kept simple as we no longer need to trigger a list refresh
  const handleSuccess = () => {
    // Optional: Add global toast or notification logic here if needed in future
    console.log("Entry saved successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro Text */}
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Account Management
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Securely record account details to your Supabase database instance.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Form */}
          <AccountForm onSuccess={handleSuccess} />
          
          {/* SQL Helper Section */}
          <SqlHelper />

          {/* Project Info Footer */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="text-blue-800 font-semibold text-sm">Project Info</h4>
            <p className="text-xs text-blue-600 font-mono break-all">
              https://rehxsplpkrbbcqfankbg.supabase.co
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;