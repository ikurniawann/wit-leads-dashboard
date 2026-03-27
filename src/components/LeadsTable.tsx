'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Lead } from '../lib/api/leads';

// Utility functions
const formatCurrency = (amount: number | null | undefined) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

const getStatusBadgeClass = (statusId: string) => {
  switch (statusId) {
    case 'NEW':
      return 'badge-new';
    case 'APPROVED':
      return 'badge-approved';
    case 'IN_PROGRESS':
      return 'badge-in-progress';
    case 'DONE':
      return 'badge-done';
    case 'CANCELLED':
      return 'badge-cancelled';
    default:
      return 'badge-new';
  }
};

const getStatusLabel = (statusId: string) => {
  const labels: Record<string, string> = {
    NEW: 'Baru',
    APPROVED: 'Disetujui',
    IN_PROGRESS: 'Dalam Proses',
    DONE: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return labels[statusId] || statusId;
};

interface LeadsTableProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  currentPage?: number;
  totalLeads?: number;
}

export default function LeadsTable({
  leads,
  onAdd,
  onEdit,
  onDelete,
  onView,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  totalLeads,
}: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'NEW', label: 'New' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    // Search filter
    const searchMatch =
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.pic_excel_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = statusFilter === 'all' || lead.status_id === statusFilter;

    // Date filter
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const leadDate = new Date(lead.created_at);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateFilter) {
        case 'today':
          dateMatch = leadDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateMatch = leadDate >= weekAgo;
          break;
        case 'month':
          dateMatch =
            leadDate.getMonth() === now.getMonth() &&
            leadDate.getFullYear() === now.getFullYear();
          break;
        case 'year':
          dateMatch = leadDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aValue: any = a[sortColumn as keyof Lead];
    let bValue: any = b[sortColumn as keyof Lead];

    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <span className="ml-1 text-wit-muted">⇅</span>;
    return sortDirection === 'asc' ? 
      <span className="ml-1 text-wit-red">↑</span> : 
      <span className="ml-1 text-wit-red">↓</span>;
  };

  // Pagination
  const total = totalLeads || filteredLeads.length;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const handleFirstPage = () => onPageChange && onPageChange(1);
  const handlePrevPage = () => onPageChange && onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange && onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange && onPageChange(totalPages);

  return (
    <div className="glass border border-wit-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-wit-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-wit-text mb-1">Daftar Leads</h2>
            <p className="text-wit-muted text-sm">
              Showing {startItem}-{endItem} of {total} leads
            </p>
          </div>
          <button
            onClick={onAdd}
            className="btn-primary flex items-center space-x-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lead</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-wit-border bg-wit-card/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
            <input
              type="text"
              placeholder="Cari leads, client, atau PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark w-full pl-10"
            />
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-dark w-full md:w-40"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === option.value
                    ? 'bg-wit-red text-white'
                    : 'bg-wit-card text-wit-muted hover:text-wit-text border border-wit-border'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-dark">
          <thead>
            <tr>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('company_name')}>
                Company <SortIcon column="company_name" />
              </th>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('project_name')}>
                Project <SortIcon column="project_name" />
              </th>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('client_name')}>
                Client <SortIcon column="client_name" />
              </th>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('pic_excel_name')}>
                PIC <SortIcon column="pic_excel_name" />
              </th>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('status_id')}>
                Status <SortIcon column="status_id" />
              </th>
              <th className="cursor-pointer hover:text-wit-red text-right" onClick={() => handleSort('grand_total')}>
                Value <SortIcon column="grand_total" />
              </th>
              <th className="cursor-pointer hover:text-wit-red" onClick={() => handleSort('created_at')}>
                Created <SortIcon column="created_at" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state py-12">
                    <svg className="mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>Belum ada leads</h3>
                    <p className="text-sm mt-2">Klik "Tambah Lead" untuk mulai menambahkan leads.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedLeads.map((lead) => (
                <tr key={lead.quotation_id} className="hover:bg-wit-red/5 transition-colors">
                  <td>
                    <div className="font-medium text-wit-text">{lead.company_name}</div>
                  </td>
                  <td>
                    <div className="text-wit-text">{lead.project_name}</div>
                    {lead.project_description && (
                      <div className="text-wit-muted text-xs mt-1 max-w-xs truncate">
                        {lead.project_description}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-wit-text">{lead.client_name || '-'}</div>
                  </td>
                  <td>
                    <div className="text-wit-text">{lead.pic_excel_name || '-'}</div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(lead.status_id)}`}>
                      {getStatusLabel(lead.status_id)}
                    </span>
                  </td>
                  <td>
                    <div className="text-wit-text font-medium">
                      {lead.grand_total ? formatCurrency(lead.grand_total) : '-'}
                    </div>
                  </td>
                  <td>
                    <div className="text-wit-muted text-sm">
                      {formatDate(lead.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(lead)}
                        className="p-2 text-wit-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-2 text-wit-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead)}
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

      {/* Pagination */}
      <div className="p-4 border-t border-wit-border bg-wit-card/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2 text-sm text-wit-muted">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 bg-wit-card border border-wit-border rounded-lg text-wit-text focus:outline-none focus:border-wit-red"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={9999}>All</option>
            </select>
            <span>per page</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="p-2 text-wit-muted hover:text-wit-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="First Page"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 text-wit-muted hover:text-wit-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 text-sm text-wit-text">
              Page <span className="font-semibold text-wit-red">{currentPage}</span> of{' '}
              <span className="font-semibold text-wit-red">{totalPages || 1}</span>
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-wit-muted hover:text-wit-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-wit-muted hover:text-wit-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Last Page"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
