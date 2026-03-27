'use client';

import { useState, useEffect } from 'react';
import { Vendor } from '../../lib/api/vendors';
import { vendorsApi } from '../../lib/api/vendors';
import { X, Save } from 'lucide-react';

interface VendorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSuccess: () => void;
}

const SPECIALIZATION_OPTIONS = [
  'Software Development',
  'System Integration',
  'Mobile Development',
  'Web Development',
  'Database',
  'Cloud Infrastructure',
  'DevOps',
  'QA/Testing',
  'UI/UX Design',
  'Business Analysis',
  'Project Management',
  'Technical Support',
  'MAAS (Manpower)',
  'Procurement',
  'Consulting',
  'Training',
];

export default function VendorFormModal({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}: VendorFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Vendor>>({
    vendor_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    specialization: [],
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      if (vendor) {
        setFormData({
          vendor_name: vendor.vendor_name || '',
          contact_person: vendor.contact_person || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          address: vendor.address || '',
          specialization: vendor.specialization || [],
          is_active: vendor.is_active,
        });
      } else {
        resetForm();
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, vendor]);

  const resetForm = () => {
    setFormData({
      vendor_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      specialization: [],
      is_active: true,
    });
  };

  const toggleSpecialization = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization?.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...(prev.specialization || []), spec],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (vendor) {
        await vendorsApi.update(vendor.vendor_id, formData);
      } else {
        await vendorsApi.create(formData);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving vendor:', error);
      alert(`Failed to save vendor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-wit-darker border border-wit-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-wit-border">
          <div>
            <h2 className="text-xl font-bold text-wit-text">
              {vendor ? 'Edit Vendor' : 'Add New Vendor'}
            </h2>
            <p className="text-sm text-wit-muted">
              {vendor ? 'Update vendor information' : 'Create a new vendor/partner'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-text mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                placeholder="e.g., PT Solusi Teknologi Mitra"
                className="input-dark w-full"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="e.g., John Tan"
                className="input-dark w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., john@vendor.com"
                className="input-dark w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., +62-21-5551234"
                className="input-dark w-full"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-text mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., Jl. Sudirman No. 123, Jakarta"
                rows={2}
                className="input-dark w-full"
              />
            </div>

            {/* Specializations */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-text mb-3">
                Specializations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-wit-card rounded-lg border border-wit-border">
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <label
                    key={spec}
                    className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-wit-darker rounded transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialization?.includes(spec)}
                      onChange={() => toggleSpecialization(spec)}
                      className="w-4 h-4 rounded border-wit-border bg-wit-darker text-wit-red focus:ring-wit-red"
                    />
                    <span className="text-sm text-wit-text">{spec}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-wit-muted mt-2">
                Selected: {formData.specialization?.length || 0} specializations
              </p>
            </div>

            {/* Is Active */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-wit-border bg-wit-card text-wit-red focus:ring-wit-red"
                />
                <span className="text-sm text-wit-text">Active Vendor (can be assigned to projects)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-wit-border bg-wit-card/50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-wit-muted hover:text-wit-text transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.vendor_name}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : vendor ? 'Update Vendor' : 'Create Vendor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
