'use client';

import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, Calendar, DollarSign, User } from 'lucide-react';
import { Project } from '../../lib/api/projects';

interface ProjectsTableProps {
  projects: Project[];
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onStatusChange: (project: Project, newStatus: string) => void;
}

export default function ProjectsTable({
  projects,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PLANNING', label: 'Planning' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'Product', label: 'Product' },
    { value: 'Software Development', label: 'Software Dev' },
    { value: 'MAAS', label: 'MAAS' },
    { value: 'Procurement', label: 'Procurement' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Support & Maintenance', label: 'Support' },
  ];

  const filteredProjects = projects.filter(project => {
    const searchMatch =
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === 'ALL' || project.status === statusFilter;
    const categoryMatch = categoryFilter === 'ALL' || project.category_name === categoryFilter;

    return searchMatch && statusMatch && categoryMatch;
  });

  const getStatusBadgeClass = (status: string) => {
    const badges: Record<string, string> = {
      PLANNING: 'badge-new',
      ACTIVE: 'badge-approved',
      ON_HOLD: 'badge-in_progress',
      COMPLETED: 'badge-done',
      CANCELLED: 'badge-cancelled',
    };
    return badges[status] || 'badge-new';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PLANNING: 'Planning',
      ACTIVE: 'Active',
      ON_HOLD: 'On Hold',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'text-gray-500',
      MEDIUM: 'text-blue-500',
      HIGH: 'text-yellow-500',
      CRITICAL: 'text-red-500',
    };
    return colors[priority] || 'text-gray-500';
  };

  return (
    <div className="glass border border-wit-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-wit-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-wit-text">All Projects</h2>
            <p className="text-wit-muted text-sm">{filteredProjects.length} projects found</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
            <input
              type="text"
              placeholder="Search projects, clients..."
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
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-dark w-full md:w-48"
          >
            {categoryOptions.map((option) => (
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
              <th>Project Name</th>
              <th>Client</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Budget</th>
              <th>Progress</th>
              <th>PM</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state py-12">
                    <svg className="mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No projects found</h3>
                    <p className="text-sm mt-2">Click "Add Project" to create your first project.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.project_id} className="hover:bg-wit-red/5 transition-colors">
                  <td>
                    <div className="font-medium text-wit-text">{project.project_name}</div>
                    {project.description && (
                      <div className="text-wit-muted text-xs mt-1 max-w-xs truncate">
                        {project.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-wit-text">{project.client_name || '-'}</div>
                  </td>
                  <td>
                    <span className="text-wit-text text-sm">{project.category_name || '-'}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td>
                    <div className="text-wit-text font-medium">
                      {project.budget ? `Rp ${(project.budget / 1000000).toFixed(1)}M` : '-'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-wit-card rounded-full h-2">
                        <div
                          className="bg-wit-red h-2 rounded-full transition-all"
                          style={{ width: `${project.completion_percent}%` }}
                        />
                      </div>
                      <span className="text-wit-muted text-xs w-8">
                        {project.completion_percent}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="text-wit-text text-sm">{project.project_manager_name || project.project_manager || '-'}</div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-wit-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(project)}
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
