'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';

interface Transaction {
  id: number;
  client_name: string;
  client_email: string | null;
  amount: number;
  tax_type: string;
  tax_amount: number;
  tx_hash: string;
  payment_dai: number;
  status: string;
  pdf_sent: boolean;
  created_at: string;
}

interface Stats {
  total_reports: number;
  total_revenue_dai: number;
  total_revenue_rub: number;
  recent_transactions: Transaction[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_TOKEN = 'globe_audit_admin_2026';

  const fetchStats = async () => {
    if (!token) {
      setError('Please enter admin token');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        headers: {
          'X-Admin-Token': token
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid admin token');
        }
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
      setAuthenticated(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setAuthenticated(false);
    setStats(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">Globe Audit Hub Analytics</p>
              </div>
            </div>
            {authenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!authenticated ? (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                <p className="text-slate-400">Enter your admin token to continue</p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Admin Token"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && fetchStats()}
                />

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={fetchStats}
                  disabled={loading || !token}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Access Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Reports */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.total_reports || 0}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Total Reports</h3>
                <p className="text-sm text-slate-400">Generated PDF documents</p>
              </div>

              {/* Revenue DAI */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-3xl font-bold text-white">{stats?.total_revenue_dai || 0} DAI</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Revenue (DAI)</h3>
                <p className="text-sm text-slate-400">Total crypto payments</p>
              </div>

              {/* Revenue RUB */}
              <div className="bg-gradient-to-br from-green-900/30 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-3xl font-bold text-white">{(stats?.total_revenue_rub || 0).toLocaleString()} ₽</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Revenue (RUB)</h3>
                <p className="text-sm text-slate-400">Total taxable amount</p>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-6 border-b border-slate-700/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Transactions
                </h3>
                <p className="text-sm text-slate-400 mt-1">Last 10 reports generated</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">TX Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {stats?.recent_transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          <div className="text-4xl mb-3">📊</div>
                          <p>No transactions yet</p>
                        </td>
                      </tr>
                    ) : (
                      stats?.recent_transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-700/20 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {new Date(tx.created_at).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{tx.client_name}</div>
                            {tx.client_email && (
                              <div className="text-sm text-slate-400">{tx.client_email}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {tx.amount.toLocaleString()} ₽
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-300">{tx.tax_amount.toLocaleString()} ₽</span>
                            <span className="ml-2 text-xs text-slate-500">({tx.tax_type})</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                              {tx.payment_dai} DAI
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`https://polygonscan.com/tx/${tx.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:text-blue-300 font-mono"
                            >
                              {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {tx.status}
                              {tx.pdf_sent && (
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
