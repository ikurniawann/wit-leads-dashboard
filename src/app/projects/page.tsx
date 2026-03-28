'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../components/Sidebar';
import ProjectsTable from '../../components/projects/ProjectsTable';
import ProjectsKanban from '../../components/projects/ProjectsKanban';
import ProjectFormModal from '../../components/projects/ProjectFormModal';
import { projectsApi, Project } from '../../lib/api/projects';
import { Table, Kanban, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsAddModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadProjects();
  };

  const handleDeleteProject = async (project: Project) => {
    if (confirm(`Are you sure you want to delete project "${project.project_name}"?`)) {
      try {
        await projectsApi.delete(project.project_id);
        loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleStatusChange = async (project: Project, newStatus: string) => {
    try {
      await projectsApi.update(project.project_id, { status: newStatus as any });
      loadProjects();
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
              <p className="text-sm md:text-base text-wit-muted">Manage and track all projects</p>
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
