'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Client } from '@/lib/api/clients';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSuccess: () => void;
}

export default function ClientFormModal({ isOpen, onClose, client, onSuccess }: ClientFormModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Client>>({
    company_name: '',
    industry: '',
    client_name: '',
    client_position: '',
    email: '',
    phone: '',
    company_address: '',
    company_website: '',
    tags: [],
    notes: '',
  });

  // Populate form when editing
  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
      });
    } else {
      // Reset form for new client
      setFormData({
        company_name: '',
        industry: '',
        client_name: '',
        client_position: '',
        email: '',
        phone: '',
        company_address: '',
        company_website: '',
        tags: [],
        notes: '',
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { clientsApi } = await import('@/lib/api/clients');

      if (client && client.client_id) {
        // Update existing client
        await clientsApi.update(client.client_id, formData);
      } else {
        // Create new client
        await clientsApi.create(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Gagal menyimpan client. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Client, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit Client' : 'Tambah Client Baru'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-bold text-wit-text mb-4">Company Information</h3>
          
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
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="input-dark w-full"
                placeholder="e.g., Technology, Finance, Healthcare"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.company_website}
                onChange={(e) => handleChange('company_website', e.target.value)}
                className="input-dark w-full"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Company Address
              </label>
              <input
                type="text"
                value={formData.company_address}
                onChange={(e) => handleChange('company_address', e.target.value)}
                className="input-dark w-full"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div className="border-t border-wit-border pt-6">
          <h3 className="text-lg font-bold text-wit-text mb-4">Contact Person</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => handleChange('client_name', e.target.value)}
                className="input-dark w-full"
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wit-muted mb-2">
                Position
              </label>
              <input
                type="text"
                value={formData.client_position}
                onChange={(e) => handleChange('client_position', e.target.value)}
                className="input-dark w-full"
                placeholder="e.g., CEO, Manager, Director"
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
                className="input-dark w-full"
                placeholder="email@company.com"
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
                className="input-dark w-full"
                placeholder="+62 xxx"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-wit-border pt-6">
          <h3 className="text-lg font-bold text-wit-text mb-4">Additional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="input-dark w-full"
              rows={3}
              placeholder="Additional notes about the client..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-wit-muted mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags?.join(', ')}
              onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
              className="input-dark w-full"
              placeholder="e.g., Priority, Enterprise, Strategic"
            />
          </div>
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
            {loading ? 'Saving...' : (client ? 'Update' : 'Create')} Client
          </button>
        </div>
      </form>
    </Modal>
  );
}
