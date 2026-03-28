'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, 
  Plus, Download, Search, Filter, User, TrendingUp, Coffee,
  Heart, Baby, Gem, Users, Home, DollarSign
} from 'lucide-react';

// DUMMY DATA
const DUMMY_EMPLOYEES = [
  { employee_id: '1', name: 'Muhamad Ilham Kurniawan', position: 'CEO', department: 'C-Level', manager_id: null },
  { employee_id: '2', name: 'Fahmi Muhammad Syaban', position: 'CTO', department: 'Technology', manager_id: '1' },
  { employee_id: '3', name: 'Siti Nurhaliza', position: 'Designer', department: 'Marketing', manager_id: '1' },
  { employee_id: '4', name: 'Ahmad Rizki', position: 'Developer', department: 'Technology', manager_id: '2' },
  { employee_id: '5', name: 'Budi Santoso', position: 'QA Engineer', department: 'Technology', manager_id: '2' },
  { employee_id: '6', name: 'Dewi Lestari', position: 'HR Manager', department: 'HR', manager_id: '1' },
  { employee_id: '7', name: 'Eko Prasetyo', position: 'Sales', department: 'Marketing', manager_id: '3' },
  { employee_id: '8', name: 'Fitri Handayani', position: 'Finance', department: 'Finance', manager_id: '1' },
];

const LEAVE_TYPES = [
  { id: 'ANNUAL', name: 'Annual Leave', icon: Coffee, quota: 12, color: 'text-blue-500', paid: true },
  { id: 'SICK', name: 'Sick Leave', icon: Heart, quota: -1, color: 'text-red-500', paid: true }, // -1 = unlimited
  { id: 'MATERNITY', name: 'Maternity Leave', icon: Baby, quota: 90, color: 'text-pink-500', paid: true },
  { id: 'PATERNITY', name: 'Paternity Leave', icon: Baby, quota: 3, color: 'text-purple-500', paid: true },
  { id: 'MARRIAGE', name: 'Marriage Leave', icon: Gem, quota: 3, color: 'text-green-500', paid: true },
  { id: 'BEREAVEMENT', name: 'Bereavement Leave', icon: Heart, quota: 3, color: 'text-gray-500', paid: true },
  { id: 'MENSTRUAL', name: 'Menstrual Leave', icon: Heart, quota: 2, color: 'text-rose-500', paid: true },
  { id: 'UNPAID', name: 'Unpaid Leave', icon: DollarSign, quota: -1, color: 'text-yellow-500', paid: false },
  { id: 'COMPENSATORY', name: 'Compensatory Off', icon: Clock, quota: -1, color: 'text-orange-500', paid: true },
];

const generateLeaveBalances = () => {
  return DUMMY_EMPLOYEES.map(emp => {
    const balances: Record<string, any> = {};
    LEAVE_TYPES.forEach(type => {
      const used = Math.floor(Math.random() * (type.quota > 0 ? type.quota : 5));
      const pending = Math.floor(Math.random() * 3);
      balances[type.id] = {
        quota: type.quota,
        used: used,
        pending: pending,
        available: type.quota > 0 ? Math.max(0, type.quota - used - pending) : -1,
      };
    });
    return {
      employee_id: emp.employee_id,
      employee_name: emp.name,
      department: emp.department,
      balances,
    };
  });
};

const DUMMY_BALANCES = generateLeaveBalances();

const generateLeaveRequests = () => {
  const requests = [];
  const statuses = ['PENDING', 'PENDING', 'APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED'];
  const now = new Date();
  
  for (let i = 0; i < 25; i++) {
    const employee = DUMMY_EMPLOYEES[Math.floor(Math.random() * DUMMY_EMPLOYEES.length)];
    const leaveType = LEAVE_TYPES[Math.floor(Math.random() * LEAVE_TYPES.length)];
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 10);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const approver = status !== 'PENDING' ? DUMMY_EMPLOYEES[Math.floor(Math.random() * DUMMY_EMPLOYEES.length)] : null;
    
    requests.push({
      request_id: `LV-${String(i).padStart(4, '0')}`,
      employee_id: employee.employee_id,
      employee_name: employee.name,
      department: employee.department,
      leave_type: leaveType.id,
      leave_type_name: leaveType.name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      duration_days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      reason: ['Family emergency', 'Medical appointment', 'Vacation', 'Personal matters', 'Rest'][Math.floor(Math.random() * 5)],
      status: status,
      submitted_at: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      approved_by: approver?.name || null,
      approved_at: approver ? new Date(startDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() : null,
      notes: status === 'REJECTED' ? 'Project deadline conflict' : status === 'APPROVED' ? 'Approved - ensure handover' : '',
    });
  }
  
  return requests;
};

const DUMMY_REQUESTS = generateLeaveRequests();

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  APPROVED: 'text-green-500 bg-green-500/10 border-green-500/30',
  REJECTED: 'text-red-500 bg-red-500/10 border-red-500/30',
  CANCELLED: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
};

const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  CANCELLED: AlertCircle,
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
};

const getLeaveTypeIcon = (typeId: string) => {
  const type = LEAVE_TYPES.find(t => t.id === typeId);
  return type?.icon || Coffee;
};

const getLeaveTypeColor = (typeId: string) => {
  const type = LEAVE_TYPES.find(t => t.id === typeId);
  return type?.color || 'text-gray-500';
};

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<'BALANCE' | 'REQUESTS' | 'CALENDAR'>('BALANCE');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRequests = DUMMY_REQUESTS.filter(req => {
    const statusMatch = statusFilter === 'ALL' || req.status === statusFilter;
    const searchMatch = req.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalPending = DUMMY_REQUESTS.filter(r => r.status === 'PENDING').length;
  const totalApproved = DUMMY_REQUESTS.filter(r => r.status === 'APPROVED').length;
  const totalRejected = DUMMY_REQUESTS.filter(r => r.status === 'REJECTED').length;
  const totalEmployees = DUMMY_EMPLOYEES.length;

  const handleApprove = (requestId: string) => {
    alert(`Request ${requestId} approved! (Demo only)`);
  };

  const handleReject = (requestId: string) => {
    alert(`Request ${requestId} rejected! (Demo only)`);
  };

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Leave Management</h1>
                <p className="text-sm md:text-base text-wit-muted">Manage employee leave requests and balances</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center space-x-2 w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Request Leave</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Total Employees</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{totalEmployees}</p>
            </div>

            <div className="glass border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-yellow-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{totalPending}</p>
            </div>

            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{totalApproved}</p>
            </div>

            <div className="glass border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-xs text-red-500">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{totalRejected}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass border border-wit-border rounded-xl p-2 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('BALANCE')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'BALANCE'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Leave Balances</span>
              </button>
              <button
                onClick={() => setActiveTab('REQUESTS')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'REQUESTS'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Requests</span>
                {totalPending > 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{totalPending}</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('CALENDAR')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'CALENDAR'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          {/* BALANCE TAB */}
          {activeTab === 'BALANCE' && (
            <div className="space-y-6">
              {DUMMY_BALANCES.map((emp) => (
                <div key={emp.employee_id} className="glass border border-wit-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-wit-red/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-wit-red" />
                      </div>
                      <div>
                        <h3 className="font-bold text-wit-text">{emp.employee_name}</h3>
                        <p className="text-sm text-wit-muted">{emp.department}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {LEAVE_TYPES.map((type) => {
                      const balance = emp.balances[type.id];
                      const Icon = type.icon;
                      const available = balance.available === -1 ? 'Unlimited' : balance.available;
                      
                      return (
                        <div key={type.id} className="bg-wit-card/50 rounded-lg p-4 border border-wit-border/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon className={`w-4 h-4 ${type.color}`} />
                            <span className="text-xs text-wit-muted">{type.name}</span>
                          </div>
                          <div className="text-2xl font-bold text-wit-text mb-1">
                            {available}
                            {balance.quota > 0 && <span className="text-sm text-wit-muted"> / {balance.quota}</span>}
                          </div>
                          <div className="text-xs text-wit-muted">
                            Used: <span className="text-wit-text">{balance.used}</span>
                            {balance.pending > 0 && (
                              <span> • Pending: <span className="text-yellow-500">{balance.pending}</span></span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'REQUESTS' && (
            <div className="glass border border-wit-border rounded-xl overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b border-wit-border">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
                    <input
                      type="text"
                      placeholder="Search employee name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-dark w-full pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-wit-red text-white rounded-lg text-sm hover:bg-wit-red/80 transition-all">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Duration</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => {
                      const StatusIcon = STATUS_ICONS[req.status] || Clock;
                      const LeaveIcon = getLeaveTypeIcon(req.leave_type);
                      const leaveColor = getLeaveTypeColor(req.leave_type);
                      
                      return (
                        <tr key={req.request_id} className="hover:bg-wit-red/5 transition-colors">
                          <td>
                            <div className="font-medium text-wit-text">{req.employee_name}</div>
                            <div className="text-xs text-wit-muted">{req.department}</div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <LeaveIcon className={`w-4 h-4 ${leaveColor}`} />
                              <span className="text-wit-text text-sm">{req.leave_type_name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="text-wit-text font-medium">{req.duration_days} days</div>
                          </td>
                          <td>
                            <div className="text-wit-muted text-sm">
                              {formatDate(req.start_date)} → {formatDate(req.end_date)}
                            </div>
                          </td>
                          <td>
                            <div className="text-wit-muted text-sm max-w-xs truncate">
                              {req.reason}
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[req.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{req.status}</span>
                            </span>
                          </td>
                          <td>
                            <div className="text-wit-muted text-sm">
                              {formatDate(req.submitted_at)}
                            </div>
                          </td>
                          <td>
                            {req.status === 'PENDING' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleApprove(req.request_id)}
                                  className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(req.request_id)}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : req.status === 'APPROVED' ? (
                              <div className="text-xs text-wit-muted">
                                By: {req.approved_by}
                              </div>
                            ) : (
                              <span className="text-wit-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'CALENDAR' && (
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-wit-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-wit-text mb-2">Leave Calendar</h3>
                <p className="text-wit-muted mb-4">Visual calendar view of employee leaves</p>
                <p className="text-sm text-wit-muted">Coming soon in next update!</p>
              </div>
            </div>
          )}

          {/* Leave Types Info */}
          <div className="glass border border-wit-border rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-wit-text mb-4">Leave Types & Quotas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEAVE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="flex items-center space-x-3 p-4 bg-wit-card/50 rounded-lg border border-wit-border/50">
                    <div className={`p-2 rounded-lg bg-wit-card ${type.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-wit-text">{type.name}</div>
                      <div className="text-xs text-wit-muted">
                        {type.quota > 0 ? `${type.quota} days/year` : type.id === 'SICK' ? 'Unlimited (with certificate)' : 'As needed'}
                        {!type.paid && ' • Unpaid'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Request Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-wit-darker border border-wit-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-wit-text">Request Leave</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-wit-muted hover:text-wit-text">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-wit-muted mx-auto mb-4" />
              <p className="text-wit-muted">Leave request form (Demo only)</p>
              <p className="text-sm text-wit-muted mt-2">Will be implemented in next update</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
