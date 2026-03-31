'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import ProjectsTable from '../../components/projects/ProjectsTable';
import ProjectsKanban from '../../components/projects/ProjectsKanban';
import ProjectFormModal from '../../components/projects/ProjectFormModal';
import { leadsApi, Lead } from '../../lib/api/leads';
import { Table, Kanban, Plus } from 'lucide-react';

// Type for projects converted from approved leads
interface ProjectFromLead {
  project_id: string;
  quotation_id: string;
  project_name: string;
  company_name: string;
  client_name: string;
  pic_excel_name: string;
  grand_total: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
  is_internal: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  completion_percent: number;
}

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectFromLead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectFromLead | null>(null);

  useEffect(() => {
    loadApprovedLeadsAsProjects();
  }, []);

  const loadApprovedLeadsAsProjects = async () => {
    try {
      setLoading(true);
      // Fetch leads with APPROVED status only
      const allLeads = await leadsApi.getAll();
      const approvedLeads = allLeads.filter(lead => lead.status_id === 'APPROVED');
      
      // Convert leads to project format
      const projectsFromLeads: ProjectFromLead[] = approvedLeads.map(lead => ({
        project_id: lead.quotation_id, // Use quotation_id as project_id
        quotation_id: lead.quotation_id,
        project_name: lead.project_name || 'Untitled Project',
        company_name: lead.company_name || 'Unknown Company',
        client_name: lead.client_name || '-',
        pic_excel_name: lead.pic_excel_name || '-',
        grand_total: lead.grand_total || 0,
        status: 'PLANNING', // Default status for new projects
        start_date: lead.valid_until || new Date().toISOString(),
        end_date: lead.follow_up_date || new Date().toISOString(),
        progress: 0,
        created_at: lead.created_at,
        updated_at: lead.created_at,
        is_internal: false,
        priority: 'MEDIUM',
        completion_percent: 0,
      }));
      
      setProjects(projectsFromLeads);
    } catch (error) {
      console.error('Error loading approved leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsAddModalOpen(true);
  };

  const handleEditProject = (project: ProjectFromLead) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadApprovedLeadsAsProjects();
  };

  const handleDeleteProject = async (project: ProjectFromLead) => {
    if (confirm(`Are you sure you want to delete project "${project.project_name}"?`)) {
      try {
        // Note: This would need to be implemented based on your backend
        // For now, just reload the data
        loadApprovedLeadsAsProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleStatusChange = async (project: ProjectFromLead, newStatus: string) => {
    try {
      // Update the local state
      const updatedProjects = projects.map(p => 
        p.project_id === project.project_id 
          ? { ...p, status: newStatus as ProjectFromLead['status'] }
          : p
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update project status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-content flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Projects</h1>
              <p className="text-sm md:text-base text-wit-muted">
            Showing {projects.length} approved projects from leads
          </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-wit-card border border-wit-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-wit-red text-white'
                      : 'text-wit-muted hover:text-wit-text'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  <span className="hidden md:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'kanban'
                      ? 'bg-wit-red text-white'
                      : 'text-wit-muted hover:text-wit-text'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  <span className="hidden md:inline">Kanban</span>
                </button>
              </div>
              
              {/* Add Project Button */}
              <button
                onClick={handleAddProject}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">Add Project</span>
              </button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === 'table' ? (
            <ProjectsTable
              projects={projects}
              onAdd={handleAddProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <ProjectsKanban
              projects={projects}
              onAdd={handleAddProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        project={null}
        onSuccess={handleModalSuccess}
      />

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={selectedProject}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
