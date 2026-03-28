'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Calendar, MapPin, Camera, Clock, CheckCircle, XCircle, AlertCircle, 
  Coffee, TrendingUp, Users, Filter, Download, Search, ChevronDown,
  Sun, Moon, Cloud
} from 'lucide-react';

// DUMMY DATA - Will be replaced with real API from mobile app
const DUMMY_EMPLOYEES = [
  { employee_id: '1', name: 'Muhamad Ilham Kurniawan', position: 'CEO', department: 'C-Level' },
  { employee_id: '2', name: 'Fahmi Muhammad Syaban', position: 'CTO', department: 'Technology' },
  { employee_id: '3', name: 'Siti Nurhaliza', position: 'Designer', department: 'Marketing' },
  { employee_id: '4', name: 'Ahmad Rizki', position: 'Developer', department: 'Technology' },
  { employee_id: '5', name: 'Budi Santoso', position: 'QA Engineer', department: 'Technology' },
  { employee_id: '6', name: 'Dewi Lestari', position: 'HR Manager', department: 'HR' },
  { employee_id: '7', name: 'Eko Prasetyo', position: 'Sales', department: 'Marketing' },
  { employee_id: '8', name: 'Fitri Handayani', position: 'Finance', department: 'Finance' },
];

// Generate dummy attendance records
const generateDummyAttendance = () => {
  const records = [];
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'LATE', 'ABSENT', 'LEAVE', 'WORK_FROM_HOME'];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const employee = DUMMY_EMPLOYEES[Math.floor(Math.random() * DUMMY_EMPLOYEES.length)];
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const checkIn = status === 'PRESENT' || status === 'LATE' ? 
      new Date(date.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))) : null;
    const checkOut = status === 'PRESENT' || status === 'LATE' ?
      new Date(date.setHours(17 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60))) : null;
    
    records.push({
      attendance_id: `ATT-${String(i).padStart(4, '0')}`,
      employee_id: employee.employee_id,
      employee_name: employee.name,
      position: employee.position,
      department: employee.department,
      date: date.toISOString().split('T')[0],
      check_in: checkIn ? checkIn.toISOString() : null,
      check_out: checkOut ? checkOut.toISOString() : null,
      status: status,
      latitude: status !== 'ABSENT' ? -6.2088 + (Math.random() * 0.1 - 0.05) : null,
      longitude: status !== 'ABSENT' ? 106.8456 + (Math.random() * 0.1 - 0.05) : null,
      photo_url: status !== 'ABSENT' ? `/attendance/photos/ATT-${String(i).padStart(4, '0')}.jpg` : null,
      notes: status === 'LATE' ? 'Traffic jam' : status === 'WORK_FROM_HOME' ? 'Remote work approved' : '',
    });
  }
  
  return records;
};

const DUMMY_ATTENDANCE = generateDummyAttendance();

const STATUS_COLORS: Record<string, string> = {
  PRESENT: 'text-green-500 bg-green-500/10 border-green-500/30',
  LATE: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  ABSENT: 'text-red-500 bg-red-500/10 border-red-500/30',
  LEAVE: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  WORK_FROM_HOME: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
};

const STATUS_ICONS: Record<string, any> = {
  PRESENT: CheckCircle,
  LATE: AlertCircle,
  ABSENT: XCircle,
  LEAVE: Coffee,
  WORK_FROM_HOME: Cloud,
};

const formatTime = (isoString: string | null) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
};

const calculateAttendanceRate = (employeeName: string) => {
  const employeeRecords = DUMMY_ATTENDANCE.filter(r => r.employee_name === employeeName);
  const presentCount = employeeRecords.filter(r => r.status === 'PRESENT' || r.status === 'WORK_FROM_HOME').length;
  const totalDays = employeeRecords.filter(r => r.status !== 'LEAVE').length;
  return totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
};

export default function AttendancePage() {
  const [periodFilter, setPeriodFilter] = useState('THIS_MONTH');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'PERFORMANCE' | 'DATE' | 'NAME'>('PERFORMANCE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const periodOptions = [
    { value: 'TODAY', label: 'Today' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'THIS_MONTH', label: 'This Month' },
    { value: 'LAST_MONTH', label: 'Last Month' },
    { value: 'CUSTOM', label: 'Custom Range' },
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PRESENT', label: 'Present' },
    { value: 'LATE', label: 'Late' },
    { value: 'ABSENT', label: 'Absent' },
    { value: 'LEAVE', label: 'Leave' },
    { value: 'WORK_FROM_HOME', label: 'Work From Home' },
  ];

  const departments = ['ALL', ...Array.from(new Set(DUMMY_EMPLOYEES.map(e => e.department)))];

  const filteredAttendance = DUMMY_ATTENDANCE.filter(record => {
    const periodMatch = (() => {
      const recordDate = new Date(record.date);
      const now = new Date();
      switch (periodFilter) {
        case 'TODAY': return record.date === now.toISOString().split('T')[0];
        case 'THIS_WEEK': 
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return recordDate >= weekAgo;
        case 'THIS_MONTH': return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
        case 'LAST_MONTH': 
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return recordDate.getMonth() === lastMonth.getMonth() && recordDate.getFullYear() === lastMonth.getFullYear();
        default: return true;
      }
    })();

    const statusMatch = statusFilter === 'ALL' || record.status === statusFilter;
    const departmentMatch = departmentFilter === 'ALL' || record.department === departmentFilter;
    const searchMatch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase());

    return periodMatch && statusMatch && departmentMatch && searchMatch;
  }).sort((a, b) => {
    const rateA = calculateAttendanceRate(a.employee_name);
    const rateB = calculateAttendanceRate(b.employee_name);
    
    if (sortBy === 'PERFORMANCE') {
      return sortOrder === 'DESC' ? rateB - rateA : rateA - rateB;
    }
    if (sortBy === 'DATE') {
      return sortOrder === 'DESC' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'NAME') {
      return sortOrder === 'DESC'
        ? b.employee_name.localeCompare(a.employee_name)
        : a.employee_name.localeCompare(b.employee_name);
    }
    return 0;
  });

  // Calculate stats
  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(r => r.status === 'PRESENT').length;
  const lateCount = filteredAttendance.filter(r => r.status === 'LATE').length;
  const absentCount = filteredAttendance.filter(r => r.status === 'ABSENT').length;
  const attendanceRate = totalRecords > 0 ? Math.round(((presentCount + filteredAttendance.filter(r => r.status === 'WORK_FROM_HOME').length) / totalRecords) * 100) : 0;

  // Calculate employee performance ranking
  const employeePerformance = DUMMY_EMPLOYEES.map(emp => {
    const rate = calculateAttendanceRate(emp.name);
    const records = DUMMY_ATTENDANCE.filter(r => r.employee_name === emp.name);
    const lateCount = records.filter(r => r.status === 'LATE').length;
    const absentCount = records.filter(r => r.status === 'ABSENT').length;
    return {
      ...emp,
      attendance_rate: rate,
      late_count: lateCount,
      absent_count: absentCount,
      total_records: records.length,
    };
  }).sort((a, b) => b.attendance_rate - a.attendance_rate);

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Attendance Report</h1>
            <p className="text-sm md:text-base text-wit-muted">Comprehensive employee attendance tracking with geolocation</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Total Records</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{totalRecords}</p>
            </div>

            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500">Present</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{presentCount}</p>
            </div>

            <div className="glass border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-yellow-500">Late</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{lateCount}</p>
            </div>

            <div className="glass border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-xs text-red-500">Absent</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{absentCount}</p>
            </div>

            <div className={`glass border rounded-xl p-4 ${
              attendanceRate >= 90 ? 'border-green-500/30' : 
              attendanceRate >= 70 ? 'border-yellow-500/30' : 'border-red-500/30'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Attendance Rate</span>
              </div>
              <p className={`text-2xl font-bold ${
                attendanceRate >= 90 ? 'text-green-500' : 
                attendanceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {attendanceRate}%
              </p>
            </div>
          </div>

          {/* Employee Performance Ranking */}
          <div className="glass border border-wit-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-wit-text">Employee Performance Ranking</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-wit-muted" />
                <span className="text-sm text-wit-muted">{employeePerformance.length} employees</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Attendance Rate</th>
                    <th>Present</th>
                    <th>Late</th>
                    <th>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {employeePerformance.map((emp, index) => (
                    <tr key={emp.employee_id} className="hover:bg-wit-red/5 transition-colors">
                      <td>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-wit-card font-bold text-wit-text">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-wit-text">{emp.name}</div>
                      </td>
                      <td>
                        <div className="text-wit-text text-sm">{emp.position}</div>
                      </td>
                      <td>
                        <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                          {emp.department}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-wit-card rounded-full h-2 min-w-[80px]">
                            <div
                              className={`h-2 rounded-full ${
                                emp.attendance_rate >= 90 ? 'bg-green-500' :
                                emp.attendance_rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${emp.attendance_rate}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-10 text-right ${
                            emp.attendance_rate >= 90 ? 'text-green-500' :
                            emp.attendance_rate >= 70 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {emp.attendance_rate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-green-500 font-medium">
                          {emp.total_records - emp.late_count - emp.absent_count}
                        </span>
                      </td>
                      <td>
                        <span className="text-yellow-500 font-medium">{emp.late_count}</span>
                      </td>
                      <td>
                        <span className="text-red-500 font-medium">{emp.absent_count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Filters */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
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

              {/* Period Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-wit-muted" />
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-wit-muted" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'ALL' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-wit-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                >
                  <option value="PERFORMANCE">Sort by Performance</option>
                  <option value="DATE">Sort by Date</option>
                  <option value="NAME">Sort by Name</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
                  className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-card rounded-lg transition-all"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    sortOrder === 'ASC' ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>

              {/* Export */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-wit-red text-white rounded-lg text-sm hover:bg-wit-red/80 transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Photo</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => {
                    const StatusIcon = STATUS_ICONS[record.status] || CheckCircle;
                    return (
                      <tr key={record.attendance_id} className="hover:bg-wit-red/5 transition-colors">
                        <td>
                          <div className="font-medium text-wit-text">{record.employee_name}</div>
                          <div className="text-xs text-wit-muted">{record.position}</div>
                        </td>
                        <td>
                          <div className="text-wit-text text-sm">{formatDate(record.date)}</div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2 text-wit-text">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span>{formatTime(record.check_in)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2 text-wit-text">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span>{formatTime(record.check_out)}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[record.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{record.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td>
                          {record.latitude && record.longitude ? (
                            <div className="text-wit-muted text-xs">
                              <div className="flex items-center space-x-1 mb-1">
                                <MapPin className="w-3 h-3" />
                                <span>{record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}</span>
                              </div>
                              <a
                                href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-wit-red hover:underline text-xs"
                              >
                                View on Map →
                              </a>
                            </div>
                          ) : (
                            <span className="text-wit-muted">-</span>
                          )}
                        </td>
                        <td>
                          {record.photo_url ? (
                            <button
                              onClick={() => alert(`View photo: ${record.photo_url} (Demo only)`)}
                              className="flex items-center space-x-1 text-wit-red hover:underline text-sm"
                            >
                              <Camera className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          ) : (
                            <span className="text-wit-muted">-</span>
                          )}
                        </td>
                        <td>
                          <div className="text-wit-muted text-sm max-w-xs truncate">
                            {record.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="glass border border-blue-500/30 rounded-xl p-6 mt-6">
            <div className="flex items-start space-x-3">
              <Camera className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-wit-text mb-2">Mobile App Integration</h3>
                <p className="text-sm text-wit-muted">
                  Employees can check-in/out through the mobile application. The app will automatically capture:
                </p>
                <ul className="text-sm text-wit-muted mt-2 space-y-1">
                  <li>• 📸 Selfie photo for verification</li>
                  <li>• 📍 GPS location (latitude & longitude)</li>
                  <li>• ⏰ Timestamp (automatic)</li>
                  <li>• 📝 Optional notes (e.g., reason for late)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
