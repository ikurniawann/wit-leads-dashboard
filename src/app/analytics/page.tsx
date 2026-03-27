'use client';

import Sidebar from '../../components/Sidebar';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="ml-72 pt-16 pb-12">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-wit-text mb-2">Analytics</h1>
            <p className="text-wit-muted">Advanced analytics and insights (Coming Soon)</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-wit-text">Rp 1.32M</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Win Rate</h3>
              <p className="text-3xl font-bold text-wit-text">6.7%</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Active Clients</h3>
              <p className="text-3xl font-bold text-wit-text">4</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Avg Deal Size</h3>
              <p className="text-3xl font-bold text-wit-text">Rp 330jt</p>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="glass border border-wit-border rounded-xl p-12 text-center">
            <BarChart3 className="w-20 h-20 mx-auto mb-6 text-wit-red opacity-50" />
            <h2 className="text-2xl font-bold text-wit-text mb-4">Advanced Analytics Coming Soon</h2>
            <p className="text-wit-muted mb-6 max-w-md mx-auto">
              We're working on bringing you detailed analytics including:
            </p>
            <ul className="text-wit-muted text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-wit-red rounded-full mr-3"></span>
                Revenue by PIC performance
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-wit-red rounded-full mr-3"></span>
                Monthly trends & forecasts
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-wit-red rounded-full mr-3"></span>
                Conversion funnel analysis
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-wit-red rounded-full mr-3"></span>
                Client acquisition metrics
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
