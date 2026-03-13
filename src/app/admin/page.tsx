'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  total_reports: number;
  total_revenue_dai: number;
  total_revenue_rub: number;
  recent_transactions: any[];
  total_messages: number;
  new_messages: number;
  total_posts: number;
  published_posts: number;
}

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/signin');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/stats', {
          headers: { 'X-Admin-Token': 'globe_audit_admin_2026' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Access denied. Admin role required.');
        }
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-slate-400">Globe Audit Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition">User Dashboard</Link>
              <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon="📊"
                label="Total Reports"
                value={stats.total_reports.toString()}
                gradient="from-blue-500/20 to-cyan-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                icon="💰"
                label="Revenue (DAI)"
                value={`${stats.total_revenue_dai} DAI`}
                gradient="from-purple-500/20 to-pink-500/20"
                iconColor="text-purple-400"
              />
              <StatCard
                icon="💵"
                label="Revenue (RUB)"
                value={`${(stats.total_revenue_rub || 0).toLocaleString()} ₽`}
                gradient="from-green-500/20 to-emerald-500/20"
                iconColor="text-green-400"
              />
              <StatCard
                icon="📧"
                label="Messages"
                value={`${stats.new_messages}/${stats.total_messages}`}
                sublabel="New / Total"
                gradient="from-amber-500/20 to-orange-500/20"
                iconColor="text-amber-400"
              />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
              {stats.recent_transactions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No transactions yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-sm text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="text-left py-3 px-4">Client</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Tax</th>
                        <th className="text-left py-3 px-4">Payment</th>
                        <th className="text-left py-3 px-4">TX Hash</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div className="text-white font-medium">{tx.client_name}</div>
                            {tx.client_email && <div className="text-xs text-slate-400">{tx.client_email}</div>}
                          </td>
                          <td className="py-3 px-4 text-white">{tx.amount.toLocaleString()} ₽</td>
                          <td className="py-3 px-4 text-slate-300">{tx.tax_type}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                              {tx.payment_dai} DAI
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <a
                              href={`https://polygonscan.com/tx/${tx.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs font-mono"
                            >
                              {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString('ru-RU') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Blog Management */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Blog Management</h2>
                <Link
                  href="/admin/blog/new"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl transition"
                >
                  + New Post
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-1">{stats.total_posts}</div>
                  <div className="text-sm text-slate-400">Total Posts</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">{stats.published_posts}</div>
                  <div className="text-sm text-slate-400">Published Posts</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, sublabel, gradient, iconColor }: any) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl border border-white/10 p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ${iconColor}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{label}</h3>
      {sublabel && <p className="text-sm text-slate-400">{sublabel}</p>}
    </div>
  );
}
