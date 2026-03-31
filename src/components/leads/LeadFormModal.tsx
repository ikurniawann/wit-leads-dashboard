'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Lead } from '../../lib/api/leads';
import { clientsApi, Client } from '../../lib/api/clients';
import { employeesApi, Employee } from '../../lib/api/employees';

// Helper to convert empty string to null for dates
const sanitizeDate = (date: string) => date === '' ? null : date;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'NEW' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
  { value: 'DONE', label: 'DONE' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

export default function LeadFormModal({ isOpen, onClose, lead, onSuccess }: LeadFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [formData, setFormData] = useState<Partial<Lead>>({
    company_name: '',
    project_name: '',
    project_description: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_position: '',
    pic_employee_id: '',
    pic_excel_name: '',
    status_id: 'NEW',
    currency: 'IDR',
    unit_value: 0,
    grand_total: 0,
    tax_percent: 11,
    tax_amount: 0,
    discount_percent: 0,
    discount_amount: 0,
    total_value: 0,
    quotation_date: new Date().toISOString().split('T')[0],
    valid_until: '',
    follow_up_date: '',
    tags: [],
    internal_notes: '',
  });

  // Load clients and employees on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, employeesData] = await Promise.all([
          clientsApi.getAll(),
          employeesApi.getActive(),
        ]);
        setClients(clientsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (lead) {
      setFormData({
        ...lead,
        quotation_date: lead.quotation_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        valid_until: lead.valid_until?.split('T')[0] || '',
        follow_up_date: lead.follow_up_date?.split('T')[0] || '',
      });
    } else {
      // Reset form for new lead
      setFormData({
        company_name: '',
        project_name: '',
        project_description: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        client_position: '',
        pic_employee_id: '',
        pic_excel_name: '',
        status_id: 'NEW',
        currency: 'IDR',
        unit_value: 0,
        grand_total: 0,
        tax_percent: 11,
        tax_amount: 0,
        discount_percent: 0,
        discount_amount: 0,
        total_value: 0,
        quotation_date: new Date().toISOString().split('T')[0],
        valid_until: '',
        follow_up_date: '',
        tags: [],
        internal_notes: '',
      });
    }
  }, [lead]);

  // Calculate totals
  useEffect(() => {
    const unitValue = formData.unit_value || 0;
    const taxPercent = formData.tax_percent || 0;
    const discountPercent = formData.discount_percent || 0;

    const taxAmount = (unitValue * taxPercent) / 100;
    const discountAmount = (unitValue * discountPercent) / 100;
    const grandTotal = unitValue + taxAmount - discountAmount;

    setFormData(prev => ({
      ...prev,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      grand_total: grandTotal,
      total_value: grandTotal,
    }));
  }, [formData.unit_value, formData.tax_percent, formData.discount_percent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Import leadsApi dynamically to avoid circular dependency
      const { leadsApi } = await import('../../lib/api/leads');

      // Fix empty dates - convert "" to null
      const dataToSave = {
        ...formData,
        valid_until: sanitizeDate(formData.valid_until || ''),
        follow_up_date: sanitizeDate(formData.follow_up_date || ''),
      };

      console.log('=== FORM SUBMIT DEBUG ===');
      console.log('Lead ID:', lead?.quotation_id);
      console.log('Is Update:', !!lead?.quotation_id);
      console.log('Data to save:', JSON.stringify(dataToSave, null, 2));

      if (lead && lead.quotation_id) {
        // Update existing lead
        console.log('Calling leadsApi.update...');
        const result = await leadsApi.update(lead.quotation_id, dataToSave);
        console.log('Update success:', result);
      } else {
        // Create new lead
        console.log('Calling leadsApi.create...');
        const result = await leadsApi.create(dataToSave);
        console.log('Create success:', result);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('=== ERROR SAVING LEAD ===');
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Error details:', error?.details);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      // Extract error message dengan fallback
      let errorMessage = 'Unknown error';
      let errorCode = '';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error_description) {
        errorMessage = error.error_description;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      if (error?.code) {
        errorCode = error.code;
      }
      
      // Pesan error yang lebih user-friendly
      let userMessage = 'Gagal menyimpan lead.';
      
      if (errorMessage.includes('CORS') || errorMessage.includes('fetch')) {
        userMessage = 'Masalah koneksi ke server. Coba refresh halaman atau cek internet Anda.';
      } else if (errorMessage.includes('permission') || errorCode === '42501') {
        userMessage = 'Tidak memiliki izin. Pastikan Anda sudah login.';
      } else if (errorMessage.includes('not found') || errorCode === '404') {
        userMessage = 'Data tidak ditemukan. Mungkin sudah dihapus.';
      } else if (errorMessage.includes('duplicate')) {
        userMessage = 'Data sudah ada. Cek data yang sama.';
      } else if (errorMessage.includes('required') || errorMessage.includes('not-null')) {
        userMessage = 'Ada field wajib yang belum diisi (Company Name, Project Name).';
      }
      
      alert(`${userMessage}\n\nDetail teknis:\n${errorMessage}\nCode: ${errorCode || 'N/A'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'Tambah Lead Baru'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="input-dark w-full"
              placeholder="PT Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.project_name}
              onChange={(e) => handleChange('project_name', e.target.value)}
              className="input-dark w-full"
              placeholder="Project Name"
            />
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => handleChange('client_name', e.target.value)}
              className="input-dark w-full"
              placeholder="Contact Person"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.client_email}
              onChange={(e) => handleChange('client_email', e.target.value)}
              className="input-dark w-full"
              placeholder="client@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Phone
            </label>
            <input
              type="text"
              value={formData.client_phone}
              onChange={(e) => handleChange('client_phone', e.target.value)}
              className="input-dark w-full"
              placeholder="+62 xxx"
            />
          </div>
        </div>

        {/* PIC & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              PIC Internal
            </label>
            <select
              value={formData.pic_employee_id}
              onChange={(e) => {
                const emp = employees.find(emp => emp.employee_id === e.target.value);
                handleChange('pic_employee_id', e.target.value);
                handleChange('pic_excel_name', emp?.employee_name || '');
              }}
              className="input-dark w-full"
            >
              <option value="">Select PIC</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status_id}
              onChange={(e) => handleChange('status_id', e.target.value)}
              className="input-dark w-full"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-wit-muted mb-2">
            Project Description
          </label>
          <textarea
            value={formData.project_description}
            onChange={(e) => handleChange('project_description', e.target.value)}
            className="input-dark w-full"
            rows={3}
            placeholder="Project description..."
          />
        </div>

        {/* Value & Pricing */}
        <div className="border-t border-wit-border pt-6">
          <h3 className="text-lg font-bold text-wit-text mb-4">Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Base Value (Rp) *
              </label>
              <input
                type="number"
                required
                value={formData.unit_value}
                onChange={(e) => handleChange('unit_value', parseFloat(e.target.value) || 0)}
                className="input-dark w-full"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Tax (%)
              </label>
              <input
                type="number"
                value={formData.tax_percent}
                onChange={(e) => handleChange('tax_percent', parseFloat(e.target.value) || 0)}
                className="input-dark w-full"
                placeholder="11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={formData.discount_percent}
                onChange={(e) => handleChange('discount_percent', parseFloat(e.target.value) || 0)}
                className="input-dark w-full"
                placeholder="0"
              />
            </div>
          </div>

          {/* Totals Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-wit-darker rounded-lg">
            <div>
              <p className="text-sm text-wit-muted">Tax Amount</p>
              <p className="text-lg font-bold text-wit-text">
                Rp {(formData.tax_amount || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <p className="text-sm text-wit-muted">Discount Amount</p>
              <p className="text-lg font-bold text-wit-text">
                Rp {(formData.discount_amount || 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <p className="text-sm text-wit-muted">Grand Total</p>
              <p className="text-xl font-bold text-wit-red">
                Rp {(formData.grand_total || 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Quotation Date
            </label>
            <input
              type="date"
              value={formData.quotation_date}
              onChange={(e) => handleChange('quotation_date', e.target.value)}
              className="input-dark w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Valid Until
            </label>
            <input
              type="date"
              value={formData.valid_until || ''}
              onChange={(e) => handleChange('valid_until', e.target.value)}
              className="input-dark w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              value={formData.follow_up_date || ''}
              onChange={(e) => handleChange('follow_up_date', e.target.value)}
              className="input-dark w-full"
            />
          </div>
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-wit-muted mb-2">
            Internal Notes
          </label>
          <textarea
            value={formData.internal_notes}
            onChange={(e) => handleChange('internal_notes', e.target.value)}
            className="input-dark w-full"
            rows={2}
            placeholder="Internal notes..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-wit-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (lead ? 'Update' : 'Create')} Lead
          </button>
        </div>
      </form>
    </Modal>
  );
}
