'use client';

import { useState } from 'react';
import { Vendor } from '../../lib/api/vendors';
import { Search, Edit2, Trash2, ToggleLeft, ToggleRight, Tag, Mail, Phone, MapPin } from 'lucide-react';

interface VendorsTableProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onToggleStatus: (vendor: Vendor, isActive: boolean) => void;
}

export default function VendorsTable({
  vendors,
  onEdit,
  onDelete,
  onToggleStatus,
}: VendorsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredVendors = vendors.filter(vendor => {
    const searchMatch =
      vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialization?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusMatch = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && vendor.is_active) ||
      (statusFilter === 'INACTIVE' && !vendor.is_active);

    return searchMatch && statusMatch;
  });

  const statusFilterOptions = [
    { value: 'ALL', label: 'All Vendors' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <div className="glass border border-wit-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-wit-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-wit-text">All Vendors</h2>
            <p className="text-wit-muted text-sm">{filteredVendors.length} vendors found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
            <input
              type="text"
              placeholder="Search vendors, contacts, specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-dark w-full md:w-40"
          >
            {statusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-dark">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specializations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state py-12">
                    <svg className="mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h2M9 21v-3a2 2 0 012-2h2a2 2 0 012 2v3" />
                    </svg>
                    <h3>No vendors found</h3>
                    <p className="text-sm mt-2">Click "Add Vendor" to create your first vendor.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.vendor_id} className="hover:bg-wit-red/5 transition-colors">
                  <td>
                    <div className="font-medium text-wit-text">{vendor.vendor_name}</div>
                    {vendor.address && (
                      <div className="flex items-center space-x-1 text-wit-muted text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-xs">{vendor.address}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-wit-text text-sm">{vendor.contact_person || '-'}</div>
                  </td>
                  <td>
                    {vendor.email ? (
                      <div className="flex items-center space-x-1 text-wit-muted text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{vendor.email}</span>
                      </div>
                    ) : (
                      <span className="text-wit-muted">-</span>
                    )}
                  </td>
                  <td>
                    {vendor.phone ? (
                      <div className="flex items-center space-x-1 text-wit-muted text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{vendor.phone}</span>
                      </div>
                    ) : (
                      <span className="text-wit-muted">-</span>
                    )}
                  </td>
                  <td>
                    {vendor.specialization && vendor.specialization.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {vendor.specialization.slice(0, 3).map((spec, index) => (
                          <span
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-wit-red/10 text-wit-red text-xs rounded-md"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{spec}</span>
                          </span>
                        ))}
                        {vendor.specialization.length > 3 && (
                          <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded-md">
                            +{vendor.specialization.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-wit-muted">-</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => onToggleStatus(vendor, !vendor.is_active)}
                      className="flex items-center space-x-2"
                    >
                      {vendor.is_active ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-green-500" />
                          <span className="text-sm text-green-500 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-gray-500" />
                          <span className="text-sm text-gray-500 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(vendor)}
                        className="p-2 text-wit-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(vendor)}
                        className="p-2 text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
