'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import VendorsTable from '../../components/vendors/VendorsTable';
import VendorFormModal from '../../components/vendors/VendorFormModal';
import { vendorsApi, Vendor } from '../../lib/api/vendors';
import { Plus } from 'lucide-react';

export default function VendorsPage() {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorsApi.getAll();
      setVendors(data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadVendors();
  };

  const handleDeleteVendor = async (vendor: Vendor) => {
    if (confirm(`Are you sure you want to delete vendor "${vendor.vendor_name}"?`)) {
      try {
        await vendorsApi.delete(vendor.vendor_id);
        loadVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
        alert('Failed to delete vendor. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (vendor: Vendor, isActive: boolean) => {
    try {
      await vendorsApi.toggleStatus(vendor.vendor_id, isActive);
      loadVendors();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update vendor status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-content flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading vendors...</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Vendors</h1>
              <p className="text-sm md:text-base text-wit-muted">Manage external vendors and partners</p>
            </div>
            
            <button
              onClick={handleAddVendor}
              className="btn-primary flex items-center space-x-2 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vendor</span>
            </button>
          </div>

          {/* Vendors Table */}
          <VendorsTable
            vendors={vendors}
            onEdit={handleEditVendor}
            onDelete={handleDeleteVendor}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      {/* Modal */}
      <VendorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vendor={selectedVendor}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
