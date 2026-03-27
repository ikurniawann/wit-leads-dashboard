'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase, leadsApi, Lead } from '../lib/supabase';
import { TrendingUp, TrendingDown, Users, FileText, Briefcase, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    approved: 0,
    inProgress: 0,
    done: 0,
    cancelled: 0,
    totalValue: 0,
  });
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsData, statsData] = await Promise.all([
        leadsApi.getAll(),
        leadsApi.getStats(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wit-darker flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="ml-72 pt-20 pb-12">
        <div className="px-6">
          {/* Last Updated */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-wit-muted text-sm">
                UPDATED AT {new Date().toLocaleString('id-ID', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 bg-wit-card border border-wit-border rounded-lg text-sm text-wit-muted hover:text-wit-text transition-all">
                Users
              </button>
              <button className="px-3 py-1.5 bg-wit-card border border-wit-border rounded-lg text-sm text-wit-muted hover:text-wit-text transition-all">
                Sales
              </button>
              <button className="px-3 py-1.5 bg-wit-card border border-wit-border rounded-lg text-sm text-wit-muted hover:text-wit-text transition-all">
                Years
              </button>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="glass border border-wit-border rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-wit-text mb-1">Pipeline Analytics</h2>
                <p className="text-wit-muted text-sm">Leads conversion dan revenue trend</p>
              </div>
            </div>
            
            {/* Chart Placeholder - nanti diganti dengan Recharts */}
            <div className="h-80 bg-gradient-to-b from-wit-red/5 to-transparent rounded-lg flex items-end justify-between px-4 pb-4 relative overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-wit-border/30" style={{ top: `${i * 25}%`, position: 'absolute', left: 0, right: 0 }} />
                ))}
              </div>
              
              {/* Area chart simulation */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c00000" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#c00000" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff3333" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff3333" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Red area (Leads) */}
                <path
                  d="M0,250 Q100,240 200,200 T400,150 T600,120 T800,80 T1000,50 L1000,300 L0,300 Z"
                  fill="url(#gradient1)"
                />
                <path
                  d="M0,250 Q100,240 200,200 T400,150 T600,120 T800,80 T1000,50"
                  fill="none"
                  stroke="#c00000"
                  strokeWidth="3"
                />
                
                {/* Light red area (Revenue) */}
                <path
                  d="M0,280 Q100,270 200,240 T400,180 T600,140 T800,100 T1000,70 L1000,300 L0,300 Z"
                  fill="url(#gradient2)"
                />
                <path
                  d="M0,280 Q100,270 200,240 T400,180 T600,140 T800,100 T1000,70"
                  fill="none"
                  stroke="#ff3333"
                  strokeWidth="3"
                />
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-wit-muted">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Users className="w-6 h-6 text-wit-red" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>2.45%</span>
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Total Leads</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.total}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-wit-red" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>3.24%</span>
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Active Leads</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.new + stats.approved + stats.inProgress}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-wit-red" />
                </div>
                <div className="flex items-center text-red-400 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>1.96%</span>
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Pipeline Value</h3>
              <p className="text-3xl font-bold text-wit-text">Rp {(stats.totalValue / 1000000).toFixed(1)}M</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <FileText className="w-6 h-6 text-wit-red" />
                </div>
                <div className="flex items-center text-red-400 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>1.88%</span>
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Won Deals</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.done}</p>
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-wit-text">Recent Leads</h2>
              <a href="/leads" className="text-wit-red hover:text-red-400 text-sm font-medium">
                View All →
              </a>
            </div>
            <div className="glass border border-wit-border rounded-xl overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-wit-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-wit-text mb-1">Daftar Leads</h3>
                    <p className="text-wit-muted text-sm">{leads.length} leads ditemukan</p>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Lead</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table-dark w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">Company</th>
                      <th className="text-left py-3 px-4">Project</th>
                      <th className="text-left py-3 px-4">PIC</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 5).map((lead) => (
                      <tr key={lead.id} className="border-t border-wit-border hover:bg-wit-red/5 transition-colors">
                        <td className="py-3 px-4 text-wit-text">{lead.company_name}</td>
                        <td className="py-3 px-4 text-wit-text">{lead.project_name}</td>
                        <td className="py-3 px-4 text-wit-text">{lead.pic_excel_name || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`badge badge-${lead.status_id.toLowerCase()}`}>
                            {lead.status_id}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-wit-text font-medium">
                          {lead.grand_total ? `Rp ${(lead.grand_total / 1000000).toFixed(1)}M` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
