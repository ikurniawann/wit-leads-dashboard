'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { 
  FileText, ClipboardList, Users, Database, Briefcase, GraduationCap,
  TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Calendar,
  ArrowRight, Search, Plus, Filter
} from 'lucide-react';
import Link from 'next/link';

// DUMMY DATA
const DUMMY_STATS = {
  open_positions: 12,
  active_candidates: 45,
  interviews_this_week: 8,
  offers_pending: 3,
  avg_time_to_hire: 21, // days
  avg_cost_per_hire: 15000000, // IDR
  offers_accepted: 18,
  offers_declined: 2,
};

const DUMMY_REQUISITIONS = [
  { id: 'REQ-2026-001', position: 'Senior Developer', department: 'Technology', status: 'INTERVIEW', priority: 'HIGH', days_open: 14 },
  { id: 'REQ-2026-002', position: 'UX Designer', department: 'Marketing', status: 'SCREENING', priority: 'MEDIUM', days_open: 7 },
  { id: 'REQ-2026-003', position: 'Sales Manager', department: 'Marketing', status: 'OFFER', priority: 'HIGH', days_open: 21 },
  { id: 'REQ-2026-004', position: 'QA Engineer', department: 'Technology', status: 'POSTED', priority: 'MEDIUM', days_open: 5 },
  { id: 'REQ-2026-005', position: 'Finance Staff', department: 'Finance', status: 'APPROVED', priority: 'LOW', days_open: 3 },
];

const DUMMY_ACTIVITIES = [
  { id: '1', type: 'application', message: 'New application for Senior Developer', time: '5 min ago', icon: Users },
  { id: '2', type: 'interview', message: 'Interview scheduled: Ahmad Rizki - UX Designer', time: '1 hour ago', icon: Calendar },
  { id: '3', type: 'offer', message: 'Offer accepted: Siti Nurhaliza - Sales Manager', time: '2 hours ago', icon: Briefcase },
  { id: '4', type: 'requisition', message: 'New requisition: Finance Staff', time: '3 hours ago', icon: FileText },
  { id: '5', type: 'onboarding', message: 'Onboarding completed: Budi Santoso', time: '1 day ago', icon: GraduationCap },
];

const MENU_CARDS = [
  {
    id: 'requirement',
    title: 'Requirement Planning',
    description: 'Annual headcount & workforce planning',
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    href: '/hris/talent-acquisition/requirement',
    stats: { label: 'Active Plans', value: '3', trend: '+1' },
  },
  {
    id: 'request',
    title: 'Request Form',
    description: 'Submit new hiring requisition',
    icon: ClipboardList,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    href: '/hris/talent-acquisition/request',
    stats: { label: 'Pending Approval', value: '2', trend: '0' },
  },
  {
    id: 'requisition',
    title: 'Requisition Tracker',
    description: 'Track all open positions',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    href: '/hris/talent-acquisition/requisition',
    stats: { label: 'Open Positions', value: '12', trend: '+3' },
  },
  {
    id: 'candidate',
    title: 'Candidate Application',
    description: 'Applicant tracking & pipeline',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    href: '/hris/talent-acquisition/candidate',
    stats: { label: 'Active Candidates', value: '45', trend: '+8' },
  },
  {
    id: 'talent',
    title: 'Talent Pooling',
    description: 'Candidate database & pipeline',
    icon: Database,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    href: '/hris/talent-acquisition/talent',
    stats: { label: 'Total Profiles', value: '234', trend: '+15' },
  },
  {
    id: 'offering',
    title: 'Offering & Hiring',
    description: 'Offer management & acceptance',
    icon: Briefcase,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    href: '/hris/talent-acquisition/offering',
    stats: { label: 'Pending Offers', value: '3', trend: '-1' },
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'New hire integration program',
    icon: GraduationCap,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    href: '/hris/talent-acquisition/onboarding',
    stats: { label: 'Active Onboardings', value: '4', trend: '+2' },
  },
];

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'text-blue-500 bg-blue-500/10',
  POSTED: 'text-purple-500 bg-purple-500/10',
  SCREENING: 'text-yellow-500 bg-yellow-500/10',
  INTERVIEW: 'text-orange-500 bg-orange-500/10',
  OFFER: 'text-green-500 bg-green-500/10',
  HIRED: 'text-teal-500 bg-teal-500/10',
};

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'text-red-500 bg-red-500/10 border-red-500/30',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  LOW: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
};

export default function TalentAcquisitionDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Talent Acquisition</h1>
                <p className="text-sm md:text-base text-wit-muted">End-to-end recruitment & hiring management</p>
              </div>
              <Link
                href="/hris/talent-acquisition/request"
                className="btn-primary flex items-center space-x-2 w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>New Requisition</span>
              </Link>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Open Positions</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{DUMMY_STATS.open_positions}</p>
            </div>

            <div className="glass border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-xs text-orange-500">Active Candidates</span>
              </div>
              <p className="text-2xl font-bold text-orange-500">{DUMMY_STATS.active_candidates}</p>
            </div>

            <div className="glass border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-blue-500">Interviews (Week)</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{DUMMY_STATS.interviews_this_week}</p>
            </div>

            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500">Offers Pending</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{DUMMY_STATS.offers_pending}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-wit-muted" />
                  <span className="text-xs text-wit-muted">Avg Time to Hire</span>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-wit-text">{DUMMY_STATS.avg_time_to_hire} days</p>
              <p className="text-xs text-wit-muted mt-1">Target: 25 days</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-wit-muted" />
                  <span className="text-xs text-wit-muted">Avg Cost per Hire</span>
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-xl font-bold text-wit-text">{formatCurrency(DUMMY_STATS.avg_cost_per_hire)}</p>
              <p className="text-xs text-wit-muted mt-1">Target: Rp 12M</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-wit-muted" />
                  <span className="text-xs text-wit-muted">Offer Acceptance Rate</span>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-wit-text">
                {Math.round((DUMMY_STATS.offers_accepted / (DUMMY_STATS.offers_accepted + DUMMY_STATS.offers_declined)) * 100)}%
              </p>
              <p className="text-xs text-wit-muted mt-1">
                {DUMMY_STATS.offers_accepted} accepted / {DUMMY_STATS.offers_declined} declined
              </p>
            </div>
          </div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {MENU_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className={`glass border ${card.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <ArrowRight className={`w-5 h-5 text-wit-muted group-hover:text-wit-red transition-all`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-wit-text mb-2">{card.title}</h3>
                  <p className="text-sm text-wit-muted mb-4">{card.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-wit-border/30">
                    <div>
                      <div className="text-xs text-wit-muted">{card.stats.label}</div>
                      <div className="text-xl font-bold text-wit-text">{card.stats.value}</div>
                    </div>
                    <div className={`text-xs font-medium ${
                      card.stats.trend.startsWith('+') ? 'text-green-500' :
                      card.stats.trend.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {card.stats.trend} this month
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Requisitions */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden mb-6">
            <div className="p-6 border-b border-wit-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-wit-text">Recent Requisitions</h3>
                <Link
                  href="/hris/talent-acquisition/requisition"
                  className="text-sm text-wit-red hover:underline"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Requisition ID</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Days Open</th>
                  </tr>
                </thead>
                <tbody>
                  {DUMMY_REQUISITIONS.map((req) => (
                    <tr key={req.id} className="hover:bg-wit-red/5 transition-colors">
                      <td>
                        <div className="font-medium text-wit-text">{req.id}</div>
                      </td>
                      <td>
                        <div className="text-wit-text">{req.position}</div>
                      </td>
                      <td>
                        <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                          {req.department}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${PRIORITY_COLORS[req.priority]}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2 text-wit-text">
                          <Clock className="w-4 h-4" />
                          <span>{req.days_open} days</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass border border-wit-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-wit-text mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {DUMMY_ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-wit-card rounded-lg">
                      <Icon className="w-5 h-5 text-wit-red" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-wit-text">{activity.message}</p>
                      <p className="text-xs text-wit-muted mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
