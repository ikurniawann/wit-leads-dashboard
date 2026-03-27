'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { workloadApi, EmployeeWorkload, WorkloadStats } from '../../../lib/api/workload';
import { Users, AlertTriangle, CheckCircle, Coffee, TrendingUp } from 'lucide-react';

export default function WorkloadReportPage() {
  const [loading, setLoading] = useState(true);
  const [workloads, setWorkloads] = useState<EmployeeWorkload[]>([]);
  const [stats, setStats] = useState<WorkloadStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workloadData, statsData] = await Promise.all([
        workloadApi.getAll(),
        workloadApi.getStats(),
      ]);
      setWorkloads(workloadData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading workload data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkloads = workloads.filter(w => {
    if (filterStatus === 'ALL') return true;
    return w.workload_status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OVERLOADED: 'text-red-500 bg-red-500/10 border-red-500/30',
      OPTIMAL: 'text-green-500 bg-green-500/10 border-green-500/30',
      UNDERLOADED: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      AVAILABLE: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      OVERLOADED: AlertTriangle,
      OPTIMAL: CheckCircle,
      UNDERLOADED: TrendingUp,
      AVAILABLE: Coffee,
    };
    return icons[status] || Users;
  };

  const getAllocationColor = (percent: number) => {
    if (percent > 100) return 'text-red-500';
    if (percent >= 80) return 'text-green-500';
    if (percent >= 50) return 'text-yellow-500';
    return 'text-blue-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-content flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading workload report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Employee Workload Report</h1>
            <p className="text-sm md:text-base text-wit-muted">Track employee utilization and capacity</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="glass border border-wit-border rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-wit-muted" />
                  <span className="text-xs text-wit-muted">Total</span>
                </div>
                <p className="text-2xl font-bold text-wit-text">{stats.total_employees}</p>
              </div>

              <div className="glass border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-xs text-red-500">Overloaded</span>
                </div>
                <p className="text-2xl font-bold text-red-500">{stats.overloaded}</p>
              </div>

              <div className="glass border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-green-500">Optimal</span>
                </div>
                <p className="text-2xl font-bold text-green-500">{stats.optimal}</p>
              </div>

              <div className="glass border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-yellow-500">Under</span>
                </div>
                <p className="text-2xl font-bold text-yellow-500">{stats.underloaded}</p>
              </div>

              <div className="glass border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Coffee className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-blue-500">Available</span>
                </div>
                <p className="text-2xl font-bold text-blue-500">{stats.available}</p>
              </div>

              <div className="glass border border-wit-border rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-wit-muted" />
                  <span className="text-xs text-wit-muted">Avg Alloc</span>
                </div>
                <p className="text-2xl font-bold text-wit-text">{stats.average_allocation.toFixed(0)}%</p>
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-wit-muted">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
              >
                <option value="ALL">All Employees</option>
                <option value="OVERLOADED">Overloaded Only</option>
                <option value="OPTIMAL">Optimal Only</option>
                <option value="UNDERLOADED">Underloaded Only</option>
                <option value="AVAILABLE">Available Only</option>
              </select>
            </div>
          </div>

          {/* Workload Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Active Projects</th>
                    <th>Projects</th>
                    <th>Allocation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkloads.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state py-12">
                          <Users className="w-12 h-12 text-wit-muted mx-auto mb-4" />
                          <h3>No employees found</h3>
                          <p className="text-sm mt-2">No employees match the selected filter.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWorkloads.map((workload) => {
                      const StatusIcon = getStatusIcon(workload.workload_status);
                      return (
                        <tr key={workload.employee_id} className="hover:bg-wit-red/5 transition-colors">
                          <td>
                            <div className="font-medium text-wit-text">{workload.employee_name}</div>
                            <div className="text-xs text-wit-muted">{workload.employee_status}</div>
                          </td>
                          <td>
                            <div className="text-wit-text text-sm">{workload.position || '-'}</div>
                          </td>
                          <td>
                            <div className="text-wit-text text-sm">{workload.department || '-'}</div>
                          </td>
                          <td>
                            <div className="text-wit-text font-medium">{workload.active_projects_count || 0}</div>
                          </td>
                          <td>
                            <div className="text-wit-muted text-sm max-w-xs truncate">
                              {workload.project_names || '-'}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-wit-card rounded-full h-2 min-w-[100px]">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    workload.total_allocation_percent > 100 ? 'bg-red-500' :
                                    workload.total_allocation_percent >= 80 ? 'bg-green-500' :
                                    workload.total_allocation_percent >= 50 ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                  }`}
                                  style={{ width: `${Math.min(workload.total_allocation_percent, 100)}%` }}
                                />
                              </div>
                              <span className={`text-sm font-medium w-12 text-right ${getAllocationColor(workload.total_allocation_percent || 0)}`}>
                                {workload.total_allocation_percent?.toFixed(0) || 0}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workload.workload_status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{workload.workload_status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
