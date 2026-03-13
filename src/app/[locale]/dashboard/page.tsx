'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CryptoPayment = dynamic(() => import('@/components/CryptoPayment'), { ssr: false });
const BusinessProfile = dynamic(() => import('@/components/BusinessProfile'), { ssr: false });
const BankIntegration = dynamic(() => import('@/components/BankIntegration'), { ssr: false });

type Tab = 'overview' | 'reports' | 'bank' | 'settings';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalRevenue: 0,
    pendingReports: 0,
    complianceScore: 100
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/signin');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Load stats
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/stats', {
          headers: { 'X-Admin-Token': 'globe_audit_admin_2026' }
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalReports: data.total_reports || 0,
            totalRevenue: data.total_revenue_dai || 0,
            pendingReports: 0,
            complianceScore: 100
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar - Apple-style glassmorphism */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className={`text-lg font-bold text-white transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Globe Audit
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                activeTab === 'overview'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={sidebarOpen ? '' : 'lg:hidden'}>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                activeTab === 'reports'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={sidebarOpen ? '' : 'lg:hidden'}>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                activeTab === 'bank'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className={sidebarOpen ? '' : 'lg:hidden'}>Bank Sync</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                activeTab === 'settings'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={sidebarOpen ? '' : 'lg:hidden'}>Settings</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className={`flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl ${sidebarOpen ? '' : 'lg:justify-center'}`}>
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0 lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10">
          <div className="flex items-center justify-between px-8 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              <a href="/admin" className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10">
                Admin Panel
              </a>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.firstName || 'User'}! 👋
                </h1>
                <p className="text-slate-400">Here's your tax overview for today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  label="Total Reports"
                  value={stats.totalReports.toString()}
                  sublabel="Generated this month"
                  gradient="from-blue-500/20 to-cyan-500/20"
                  iconColor="text-blue-400"
                />

                <StatCard
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Total Revenue"
                  value={`${stats.totalRevenue} DAI`}
                  sublabel="From crypto payments"
                  gradient="from-purple-500/20 to-pink-500/20"
                  iconColor="text-purple-400"
                />

                <StatCard
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Pending"
                  value={stats.pendingReports.toString()}
                  sublabel="Reports to review"
                  gradient="from-amber-500/20 to-orange-500/20"
                  iconColor="text-amber-400"
                />

                <StatCard
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  label="Compliance"
                  value={`${stats.complianceScore}%`}
                  sublabel="Tax compliance score"
                  gradient="from-green-500/20 to-emerald-500/20"
                  iconColor="text-green-400"
                />
              </div>

              {/* Payment Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Make a Payment</h3>
                  <CryptoPayment />
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Tax Calc</h3>
                  <QuickTaxCalculator />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">Your Reports</h1>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-slate-400">No reports yet. Generate your first report after making a payment.</p>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">Bank Connections</h1>
              <BankIntegration />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
              <BusinessProfile />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, sublabel, gradient, iconColor }: any) {
  return (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl border border-white/10 p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{label}</h3>
      <p className="text-sm text-slate-400">{sublabel}</p>
    </div>
  );
}

// Quick Tax Calculator Component
function QuickTaxCalculator() {
  const [amount, setAmount] = useState('');
  const [regime, setRegime] = useState('USN_6');
  const [result, setResult] = useState<any>(null);

  const calculate = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/verify-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country_code: 'RU',
          amount: parseFloat(amount) || 0,
          regime
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Amount (RUB)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100000"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Tax Regime</label>
        <select
          value={regime}
          onChange={(e) => setRegime(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USN_6">USN 6% (Доходы)</option>
          <option value="USN_15">USN 15% (Доходы-Расходы)</option>
          <option value="OSNO">OSNO 22% (НДС)</option>
        </select>
      </div>
      <button
        onClick={calculate}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl transition"
      >
        Calculate
      </button>
      {result && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-slate-400 mb-2">Tax Amount:</p>
          <p className="text-2xl font-bold text-white">{result.tax_amount.toLocaleString()} ₽</p>
          <p className="text-xs text-slate-500 mt-2">Rate: {result.tax_rate}% ({result.tax_name})</p>
        </div>
      )}
    </div>
  );
}
