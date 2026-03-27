'use client';

import { useState } from 'react';
import { Project } from '../../lib/api/projects';
import ProjectCard from './ProjectCard';
import { Plus, Search } from 'lucide-react';

interface ProjectsKanbanProps {
  projects: Project[];
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onStatusChange: (project: Project, newStatus: string) => void;
}

export default function ProjectsKanban({
  projects,
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectsKanbanProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const stages = [
    { id: 'PLANNING', label: 'Planning', color: 'blue' },
    { id: 'ACTIVE', label: 'Active', color: 'green' },
    { id: 'ON_HOLD', label: 'On Hold', color: 'yellow' },
    { id: 'COMPLETED', label: 'Completed', color: 'purple' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'red' },
  ];

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredProjects.filter(project => project.status === stage.id);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
          />
        </div>

        {/* Add Project Button */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 btn-primary w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 md:w-96"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`} />
                  <h3 className="text-sm font-semibold text-wit-text">{stage.label}</h3>
                  <span className="px-2 py-0.5 bg-wit-card border border-wit-border rounded-full text-xs text-wit-muted">
                    {projectsByStage[stage.id].length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-wit-darker/50 border border-wit-border/50">
                {projectsByStage[stage.id].length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-wit-muted text-sm">
                    No projects
                  </div>
                ) : (
                  projectsByStage[stage.id].map((project) => (
                    <ProjectCard
                      key={project.project_id}
                      project={project}
                      onEdit={() => onEdit(project)}
                      onDelete={() => onDelete(project)}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden text-center text-xs text-wit-muted px-4">
        💡 Tip: Tap on a project card to edit or change status
      </div>
    </div>
  );
}
