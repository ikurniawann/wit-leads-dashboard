'use client';

import { useState, useEffect } from 'react';
import { Project } from '../../lib/api/projects';
import { projectsApi } from '../../lib/api/projects';
import { X, Save } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}: ProjectFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const [formData, setFormData] = useState<Partial<Project>>({
    project_name: '',
    description: '',
    category_id: '',
    status: 'PLANNING',
    start_date: '',
    end_date: '',
    budget: 0,
    client_id: '',
    project_manager: '',
    is_internal: false,
    priority: 'MEDIUM',
    completion_percent: 0,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadMasterData();
      
      if (project) {
        setFormData({
          project_name: project.project_name || '',
          description: project.description || '',
          category_id: project.category_id || '',
          status: project.status,
          start_date: project.start_date || '',
          end_date: project.end_date || '',
          budget: project.budget || 0,
          client_id: project.client_id || '',
          project_manager: project.project_manager || '',
          is_internal: project.is_internal,
          priority: project.priority,
          completion_percent: project.completion_percent || 0,
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
  }, [isOpen, project]);

  const loadMasterData = async () => {
    try {
      const { data: cats } = await import('../..//lib/supabase').then(m => m.supabase)
        .then(sb => sb.from('project_categories').select('*').eq('is_active', true));
      
      const { data: emps } = await import('../..//lib/supabase').then(m => m.supabase)
        .then(sb => sb.from('employees').select('*').eq('status', 'Active'));
      
      const { data: cli } = await import('../..//lib/supabase').then(m => m.supabase)
        .then(sb => sb.from('clients').select('*'));

      if (cats) setCategories(cats);
      if (emps) setEmployees(emps);
      if (cli) setClients(cli);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      description: '',
      category_id: '',
      status: 'PLANNING',
      start_date: '',
      end_date: '',
      budget: 0,
      client_id: '',
      project_manager: '',
      is_internal: false,
      priority: 'MEDIUM',
      completion_percent: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (project) {
        await projectsApi.update(project.project_id, formData);
      } else {
        await projectsApi.create(formData);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(`Failed to save project: ${error.message}`);
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
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <p className="text-sm text-wit-muted">
              {project ? 'Update project information' : 'Create a new project'}
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
            {/* Project Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-text mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder="Enter project name"
                className="input-dark w-full"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-wit-text mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
                className="input-dark w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="input-dark w-full"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="input-dark w-full"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Client
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="input-dark w-full"
              >
                <option value="">Select client</option>
                {clients.map(client => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* PIC Internal */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                PIC Internal
              </label>
              <select
                value={formData.project_manager}
                onChange={(e) => setFormData({ ...formData, project_manager: e.target.value })}
                className="input-dark w-full"
              >
                <option value="">Select PIC Internal</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="input-dark w-full"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Budget (Rp)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                placeholder="0"
                className="input-dark w-full"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input-dark w-full"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="input-dark w-full"
              />
            </div>

            {/* Completion % */}
            <div>
              <label className="block text-sm font-medium text-wit-text mb-2">
                Completion (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.completion_percent}
                onChange={(e) => setFormData({ ...formData, completion_percent: Number(e.target.value) })}
                className="input-dark w-full"
              />
            </div>

            {/* Is Internal */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_internal}
                  onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
                  className="w-4 h-4 rounded border-wit-border bg-wit-card text-wit-red focus:ring-wit-red"
                />
                <span className="text-sm text-wit-text">Internal Project (not client-facing)</span>
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
              disabled={loading || !formData.project_name}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
