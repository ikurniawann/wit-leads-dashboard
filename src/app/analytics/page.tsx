'use client';

import Sidebar from '../../components/Sidebar';
import RevenueByPICChart from '../../components/analytics/RevenueByPICChart';
import MonthlyTrendChart from '../../components/analytics/MonthlyTrendChart';
import { BarChart3, TrendingUp, DollarSign, Users, Target, Award } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = {
    totalRevenue: 1318400000,
    winRate: 6.7,
    activeClients: 4,
    avgDealSize: 329600000,
    totalLeads: 14,
    conversionRate: 28.6,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-wit-text mb-2">Analytics</h1>
            <p className="text-wit-muted">Advanced analytics and pipeline insights</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-wit-red/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-wit-red" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Total Revenue</h3>
              <p className="text-xl font-bold text-wit-text">{formatCurrency(stats.totalRevenue)}</p>
            </div>

            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Win Rate</h3>
              <p className="text-xl font-bold text-wit-text">{stats.winRate}%</p>
            </div>

            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Active Clients</h3>
              <p className="text-xl font-bold text-wit-text">{stats.activeClients}</p>
            </div>

            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Avg Deal Size</h3>
              <p className="text-xl font-bold text-wit-text">{formatCurrency(stats.avgDealSize)}</p>
            </div>

            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Total Leads</h3>
              <p className="text-xl font-bold text-wit-text">{stats.totalLeads}</p>
            </div>

            <div className="mac-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-xs mb-1">Conversion Rate</h3>
              <p className="text-xl font-bold text-wit-text">{stats.conversionRate}%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue by PIC */}
            <div className="mac-card p-6">
              <h2 className="text-xl font-bold text-wit-text mb-4">Revenue by PIC</h2>
              <RevenueByPICChart />
            </div>

            {/* Monthly Trend */}
            <div className="mac-card p-6">
              <h2 className="text-xl font-bold text-wit-text mb-4">Monthly Trend</h2>
              <MonthlyTrendChart />
            </div>
          </div>

          {/* Performance Insights */}
          <div className="mac-card p-6">
            <h2 className="text-xl font-bold text-wit-text mb-4">Performance Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-wit-card rounded-lg">
                <h3 className="text-wit-muted text-sm mb-2">Top Performer</h3>
                <p className="text-2xl font-bold text-wit-text mb-1">Ilham</p>
                <p className="text-wit-muted text-sm">Rp 488.4M revenue</p>
              </div>
              <div className="p-4 bg-wit-card rounded-lg">
                <h3 className="text-wit-muted text-sm mb-2">Best Conversion</h3>
                <p className="text-2xl font-bold text-wit-text mb-1">28.6%</p>
                <p className="text-wit-muted text-sm">4 won from 14 leads</p>
              </div>
              <div className="p-4 bg-wit-card rounded-lg">
                <h3 className="text-wit-muted text-sm mb-2">Pipeline Health</h3>
                <p className="text-2xl font-bold text-green-500 mb-1">Healthy</p>
                <p className="text-wit-muted text-sm">10 active opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
