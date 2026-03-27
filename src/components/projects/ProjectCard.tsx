'use client';

import { Project } from '../../lib/api/projects';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  User, 
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (project: Project, newStatus: string) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStageSelect, setShowStageSelect] = useState(false);

  const statusColors: Record<string, string> = {
    PLANNING: 'border-l-blue-500',
    ACTIVE: 'border-l-green-500',
    ON_HOLD: 'border-l-yellow-500',
    COMPLETED: 'border-l-purple-500',
    CANCELLED: 'border-l-red-500',
  };

  const statusLabels: Record<string, string> = {
    PLANNING: 'Planning',
    ACTIVE: 'Active',
    ON_HOLD: 'On Hold',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  const stages = [
    { id: 'PLANNING', label: 'Planning' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'ON_HOLD', label: 'On Hold' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className={`glass border border-wit-border rounded-lg p-4 hover:border-wit-red/30 transition-all group ${statusColors[project.status] || 'border-l-blue-500'} border-l-4`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-wit-text truncate mb-1">
            {project.project_name}
          </h4>
          <div className="flex items-center space-x-2 text-xs text-wit-muted">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{project.client_name || 'No client'}</span>
          </div>
        </div>
        
        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-48 glass border border-wit-border rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-wit-text hover:bg-wit-card transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Project</span>
                </button>
                
                {/* Change Status Submenu */}
                <div className="relative">
                  <button
                    onClick={() => setShowStageSelect(!showStageSelect)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-wit-text hover:bg-wit-card transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <ChevronDown className="w-4 h-4" />
                      <span>Change Status</span>
                    </div>
                  </button>
                  
                  {showStageSelect && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowStageSelect(false)}
                      />
                      <div className="absolute left-full top-0 ml-1 w-40 glass border border-wit-border rounded-xl shadow-xl overflow-hidden">
                        {stages.map((stage) => (
                          <button
                            key={stage.id}
                            onClick={() => {
                              onStatusChange(project, stage.id);
                              setShowStageSelect(false);
                              setShowMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-wit-card transition-all ${
                              project.status === stage.id ? 'text-wit-red' : 'text-wit-text'
                            }`}
                          >
                            {stage.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-wit-border" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-2 mb-3">
        {/* Budget */}
        {project.budget && (
          <div className="flex items-center space-x-2 text-xs">
            <DollarSign className="w-3 h-3 text-wit-red" />
            <span className="text-sm font-semibold text-wit-text">
              Rp {(project.budget / 1000000).toFixed(1)}M
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex-1 bg-wit-card rounded-full h-1.5">
            <div
              className="bg-wit-red h-1.5 rounded-full transition-all"
              style={{ width: `${project.completion_percent}%` }}
            />
          </div>
          <span className="text-wit-muted text-xs w-8 text-right">
            {project.completion_percent}%
          </span>
        </div>

        {/* Project Manager */}
        {project.project_manager_name && (
          <div className="flex items-center space-x-2 text-xs text-wit-muted">
            <User className="w-3 h-3" />
            <span className="truncate">{project.project_manager_name}</span>
          </div>
        )}

        {/* Category */}
        {project.category_name && (
          <div className="flex items-center space-x-2 text-xs text-wit-muted">
            <Calendar className="w-3 h-3" />
            <span className="truncate">{project.category_name}</span>
          </div>
        )}
      </div>

      {/* Priority Badge */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-wit-border">
        <span className={`text-xs font-medium ${
          project.priority === 'CRITICAL' ? 'text-red-500' :
          project.priority === 'HIGH' ? 'text-yellow-500' :
          project.priority === 'MEDIUM' ? 'text-blue-500' :
          'text-gray-500'
        }`}>
          {project.priority}
        </span>
        <span className="text-xs text-wit-muted">
          {statusLabels[project.status]}
        </span>
      </div>

      {/* Mobile: Quick Status Change */}
      <div className="md:hidden mt-3 pt-3 border-t border-wit-border">
        <select
          value={project.status}
          onChange={(e) => onStatusChange(project, e.target.value)}
          className="w-full px-3 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-xs focus:outline-none focus:border-wit-red transition-all"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
