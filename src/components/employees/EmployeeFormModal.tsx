'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Employee } from '../../lib/api/employees';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'probation', label: 'Probation' },
];

export default function EmployeeFormModal({ isOpen, onClose, employee, onSuccess }: EmployeeFormModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Employee>>({
    employee_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    join_date: '',
    status: 'active',
  });

  // Populate form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        join_date: employee.join_date?.split('T')[0] || '',
      });
    } else {
      // Reset form for new employee
      setFormData({
        employee_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        join_date: '',
        status: 'active',
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { employeesApi } = await import('../../lib/api/employees');

      // Fix empty date - convert "" or undefined to null
      const dataToSave = {
        ...formData,
        join_date: !formData.join_date || formData.join_date === '' ? null : formData.join_date,
      };

      if (employee && employee.employee_id) {
        // Update existing employee
        await employeesApi.update(employee.employee_id, dataToSave);
      } else {
        // Create new employee
        await employeesApi.create(dataToSave);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Gagal menyimpan employee. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Tambah Employee Baru'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-bold text-wit-text mb-4">Employee Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Employee Name *
              </label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => handleChange('employee_name', e.target.value)}
                className="mac-input w-full"
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mac-input w-full"
                placeholder="employee@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="mac-input w-full"
                placeholder="+62 xxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="mac-input w-full"
                placeholder="e.g., Sales Manager, Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="mac-input w-full"
                placeholder="e.g., Sales, IT, Marketing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Join Date
              </label>
              <input
                type="date"
                value={formData.join_date || ''}
                onChange={(e) => handleChange('join_date', e.target.value)}
                className="mac-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="mac-input w-full"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-wit-border">
          <button
            type="button"
            onClick={onClose}
            className="mac-button" style={{ background: "linear-gradient(135deg, rgba(60, 60, 60, 0.9) 0%, rgba(60, 60, 60, 0.7) 100%)" }}"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="mac-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : (employee ? 'Update' : 'Create')} Employee
          </button>
        </div>
      </form>
    </Modal>
  );
}
