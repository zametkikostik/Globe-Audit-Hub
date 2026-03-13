'use client';

import { useState } from 'react';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: 'connected' | 'pending' | 'error';
}

export default function BankIntegration() {
  const [connecting, setConnecting] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Tinkoff Bank',
      accountNumber: '****4521',
      balance: 125000,
      currency: 'RUB',
      status: 'connected'
    },
    {
      id: '2',
      bankName: 'SberBank',
      accountNumber: '****8932',
      balance: 340000,
      currency: 'RUB',
      status: 'connected'
    }
  ]);

  const handleConnectBank = async () => {
    setConnecting(true);
    
    // Mock Plaid/Salt Edge integration
    setTimeout(() => {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        bankName: 'Alfa Bank',
        accountNumber: '****' + Math.floor(Math.random() * 9000 + 1000),
        balance: Math.floor(Math.random() * 500000),
        currency: 'RUB',
        status: 'connected'
      };
      
      setAccounts([...accounts, newAccount]);
      setConnecting(false);
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Connect Bank Button */}
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Your Bank</h3>
            <p className="text-slate-400">Securely connect your bank accounts via Plaid</p>
          </div>
          <button
            onClick={handleConnectBank}
            disabled={connecting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition flex items-center gap-2"
          >
            {connecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Connect Bank</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Connected Accounts</h3>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
              <div className="text-6xl mb-4">🏦</div>
              <p className="text-slate-400">No bank accounts connected yet</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{account.bankName}</h4>
                      <p className="text-sm text-slate-400">Account: {account.accountNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {account.balance.toLocaleString()} {account.currency}
                      </p>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-400">Connected</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-amber-300 mb-1">Bank-Level Security</h4>
            <p className="text-sm text-amber-200/80">
              Your bank credentials are encrypted and never stored on our servers. We use Plaid's secure API for all bank connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
