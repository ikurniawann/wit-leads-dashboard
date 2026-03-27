'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import EmployeeFormModal from '../../components/employees/EmployeeFormModal';
import DeleteConfirmModal from '../../components/shared/DeleteConfirmModal';
import { employeesApi, Employee } from '../../lib/api/employees';
import { Plus, Search, UserCheck, Mail, Phone, Briefcase } from 'lucide-react';

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadEmployees();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    
    try {
      await employeesApi.delete(selectedEmployee.employee_id);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wit-darker flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header - Mobile Responsive */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Employees</h1>
              <p className="text-sm md:text-base text-wit-muted">Manage employee database and PIC assignments</p>
            </div>
            <button
              onClick={handleAddEmployee}
              className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Stats Cards - Mobile Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Total Employees</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.total}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Active</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.active}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-500/10 rounded-lg">
                  <UserCheck className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Inactive</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.inactive}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
              <input
                type="text"
                placeholder="Search employees by name, email, position, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark w-full pl-10"
              />
            </div>
          </div>

          {/* Employees Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Join Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state py-12">
                          <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-wit-text text-lg mb-2">No employees found</h3>
                          <p className="text-wit-muted text-sm">
                            {searchTerm ? 'Try adjusting your search' : 'Click "Add Employee" to get started'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.employee_id} className="border-t border-wit-border hover:bg-wit-red/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-wit-text">{employee.employee_name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted text-sm">{employee.position || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted text-sm">{employee.department || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted">{employee.email || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted">{employee.phone || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge ${employee.status === 'active' ? 'badge-done' : 'badge-cancelled'}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted text-sm">
                            {employee.join_date ? new Date(employee.join_date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }) : '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              className="p-2 text-wit-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee)}
                              className="p-2 text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        employee={null}
        onSuccess={handleModalSuccess}
      />

      <EmployeeFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        itemName={selectedEmployee?.employee_name || 'this employee'}
      />
    </div>
  );
}
