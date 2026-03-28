'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, PieChart } from 'lucide-react';

// DUMMY DATA - Will be replaced with real API later
const DUMMY_PROJECTS = [
  {
    project_id: '1',
    project_name: 'Rental Management System',
    budget: 500000000,
    actual: 225000000,
    category: 'Software Development',
    status: 'Active',
  },
  {
    project_id: '2',
    project_name: 'Procurement GNSS Chipset',
    budget: 300000000,
    actual: 350000000,
    category: 'Procurement',
    status: 'Active',
  },
  {
    project_id: '3',
    project_name: 'Mobile Force App',
    budget: 400000000,
    actual: 50000000,
    category: 'Mobile Development',
    status: 'Planning',
  },
  {
    project_id: '4',
    project_name: 'BNI Rise x KNPI',
    budget: 450000000,
    actual: 270000000,
    category: 'Integration',
    status: 'Active',
  },
  {
    project_id: '5',
    project_name: 'ION Network - 10 Projects',
    budget: 800000000,
    actual: 600000000,
    category: 'System Integration',
    status: 'Active',
  },
  {
    project_id: '6',
    project_name: 'Website Redesign',
    budget: 150000000,
    actual: 45000000,
    category: 'Web Development',
    status: 'Active',
  },
  {
    project_id: '7',
    project_name: 'Database Migration',
    budget: 200000000,
    actual: 0,
    category: 'Database',
    status: 'On Hold',
  },
  {
    project_id: '8',
    project_name: 'Training Program Q2',
    budget: 100000000,
    actual: 0,
    category: 'Training',
    status: 'Planning',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCurrencyCompact = (amount: number) => {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  }
  return formatCurrency(amount);
};

export default function BudgetVsActualPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredProjects = DUMMY_PROJECTS.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  // Calculate totals
  const totalBudget = DUMMY_PROJECTS.reduce((sum, p) => sum + p.budget, 0);
  const totalActual = DUMMY_PROJECTS.reduce((sum, p) => sum + p.actual, 0);
  const totalVariance = totalBudget - totalActual;
  const totalVariancePercent = (totalVariance / totalBudget) * 100;

  // Calculate per-project metrics
  const projectsWithMetrics = DUMMY_PROJECTS.map(p => {
    const variance = p.budget - p.actual;
    const variancePercent = (variance / p.budget) * 100;
    const utilizationPercent = (p.actual / p.budget) * 100;
    
    let status: 'ON_TRACK' | 'UNDER_BUDGET' | 'OVER_BUDGET' | 'NOT_STARTED';
    if (p.actual === 0) {
      status = 'NOT_STARTED';
    } else if (variance < 0) {
      status = 'OVER_BUDGET';
    } else if (variancePercent > 20) {
      status = 'UNDER_BUDGET';
    } else {
      status = 'ON_TRACK';
    }

    return { ...p, variance, variancePercent, utilizationPercent, budgetStatus: status };
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      ON_TRACK: { color: 'text-green-500 bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'On Track' },
      UNDER_BUDGET: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', icon: TrendingDown, label: 'Under Budget' },
      OVER_BUDGET: { color: 'text-red-500 bg-red-500/10 border-red-500/30', icon: AlertTriangle, label: 'Over Budget' },
      NOT_STARTED: { color: 'text-gray-500 bg-gray-500/10 border-gray-500/30', icon: DollarSign, label: 'Not Started' },
    };
    const badge = badges[status] || badges.ON_TRACK;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const getUtilizationColor = (percent: number) => {
    if (percent > 100) return 'text-red-500';
    if (percent >= 80) return 'text-yellow-500';
    if (percent >= 50) return 'text-blue-500';
    return 'text-gray-500';
  };

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Projects' },
    { value: 'Active', label: 'Active' },
    { value: 'Planning', label: 'Planning' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Budget vs Actual</h1>
            <p className="text-sm md:text-base text-wit-muted">Track project budgets and spending</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4 md:p-5">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Total Budget</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-wit-text">{formatCurrencyCompact(totalBudget)}</p>
              <p className="text-xs text-wit-muted mt-1">{formatCurrency(totalBudget)}</p>
            </div>

            <div className="glass border border-blue-500/30 rounded-xl p-4 md:p-5">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-blue-500">Actual Spent</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-blue-500">{formatCurrencyCompact(totalActual)}</p>
              <p className="text-xs text-wit-muted mt-1">{formatCurrency(totalActual)}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-4 md:p-5">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Remaining</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-wit-text">{formatCurrencyCompact(totalVariance)}</p>
              <p className="text-xs text-wit-muted mt-1">{formatCurrency(totalVariance)}</p>
            </div>

            <div className={`glass border rounded-xl p-4 md:p-5 ${
              totalVariancePercent >= 20 ? 'border-green-500/30' : 
              totalVariancePercent >= 0 ? 'border-yellow-500/30' : 'border-red-500/30'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {totalVariancePercent >= 0 ? (
                  <TrendingDown className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-xs text-wit-muted">Variance</span>
              </div>
              <p className={`text-xl md:text-2xl font-bold ${
                totalVariancePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {totalVariancePercent >= 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
              </p>
              <p className="text-xs text-wit-muted mt-1">
                {totalVariancePercent >= 0 ? 'Under budget' : 'Over budget'}
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-wit-muted">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Actual</th>
                    <th>Variance</th>
                    <th>Utilization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsWithMetrics.filter(p => {
                    if (filterStatus === 'ALL') return true;
                    return p.status === filterStatus;
                  }).map((project) => (
                    <tr key={project.project_id} className="hover:bg-wit-red/5 transition-colors">
                      <td>
                        <div className="font-medium text-wit-text">{project.project_name}</div>
                        <div className="text-xs text-wit-muted">{project.status}</div>
                      </td>
                      <td>
                        <div className="text-wit-text text-sm">{project.category}</div>
                      </td>
                      <td>
                        <div className="text-wit-text font-medium">{formatCurrencyCompact(project.budget)}</div>
                        <div className="text-xs text-wit-muted">{formatCurrency(project.budget)}</div>
                      </td>
                      <td>
                        <div className="text-blue-500 font-medium">{formatCurrencyCompact(project.actual)}</div>
                        <div className="text-xs text-wit-muted">{formatCurrency(project.actual)}</div>
                      </td>
                      <td>
                        <div className={`font-medium ${
                          project.variance >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {project.variance >= 0 ? '+' : ''}{formatCurrencyCompact(project.variance)}
                        </div>
                        <div className="text-xs text-wit-muted">
                          {project.variancePercent >= 0 ? '+' : ''}{project.variancePercent.toFixed(1)}%
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-wit-card rounded-full h-2 min-w-[80px]">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                project.utilizationPercent > 100 ? 'bg-red-500' :
                                project.utilizationPercent >= 80 ? 'bg-yellow-500' :
                                project.utilizationPercent >= 50 ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`}
                              style={{ width: `${Math.min(project.utilizationPercent, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-12 text-right ${getUtilizationColor(project.utilizationPercent)}`}>
                            {project.utilizationPercent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(project.budgetStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget Distribution Chart */}
          <div className="glass border border-wit-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-wit-text mb-4">Budget Distribution</h3>
            <div className="space-y-4">
              {projectsWithMetrics.slice(0, 6).map((project) => (
                <div key={project.project_id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-wit-text">{project.project_name}</span>
                    <span className="text-sm text-wit-muted">
                      {formatCurrencyCompact(project.actual)} / {formatCurrencyCompact(project.budget)}
                    </span>
                  </div>
                  <div className="relative h-3 bg-wit-card rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        project.utilizationPercent > 100 ? 'bg-red-500' :
                        project.utilizationPercent >= 80 ? 'bg-yellow-500' :
                        project.utilizationPercent >= 50 ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${Math.min(project.utilizationPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-wit-muted">0%</span>
                    <span className="text-xs text-wit-muted">{project.utilizationPercent.toFixed(0)}%</span>
                    <span className="text-xs text-wit-muted">100%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
