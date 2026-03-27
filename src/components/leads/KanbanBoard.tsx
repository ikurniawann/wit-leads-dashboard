'use client';

import { useState } from 'react';
import { Lead } from '../../lib/api/leads';
import LeadCard from './LeadCard';
import { Plus, Search, Filter } from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onViewLead: (lead: Lead) => void;
  onStageChange: (lead: Lead, newStage: string) => void;
}

export default function KanbanBoard({
  leads,
  onAddLead,
  onEditLead,
  onDeleteLead,
  onViewLead,
  onStageChange,
}: KanbanBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Pipeline stages
  const stages = [
    { id: 'NEW', label: 'New Lead', color: 'blue' },
    { id: 'APPROVED', label: 'Approved', color: 'green' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'yellow' },
    { id: 'DONE', label: 'Won', color: 'purple' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'red' },
  ];

  // Filter leads by search
  const filteredLeads = leads.filter(lead =>
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.pic_excel_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter(lead => lead.status_id === stage.id);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead && draggedLead.status_id !== stageId) {
      onStageChange(draggedLead, stageId);
    }
    setDraggedLead(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
  };

  // Mobile: Tap to change stage
  const handleMobileStageChange = (lead: Lead, newStage: string) => {
    onStageChange(lead, newStage);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
          />
        </div>

        {/* Add Lead Button */}
        <button
          onClick={onAddLead}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 btn-primary w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 md:w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`} />
                  <h3 className="text-sm font-semibold text-wit-text">{stage.label}</h3>
                  <span className="px-2 py-0.5 bg-wit-card border border-wit-border rounded-full text-xs text-wit-muted">
                    {leadsByStage[stage.id].length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-wit-darker/50 border border-wit-border/50">
                {leadsByStage[stage.id].length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-wit-muted text-sm">
                    No leads
                  </div>
                ) : (
                  leadsByStage[stage.id].map((lead) => (
                    <div
                      key={lead.quotation_id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={handleDragEnd}
                      className="cursor-move"
                    >
                      <LeadCard
                        lead={lead}
                        onEdit={() => onEditLead(lead)}
                        onDelete={() => onDeleteLead(lead)}
                        onView={() => onViewLead(lead)}
                        onStageChange={handleMobileStageChange}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="md:hidden text-center text-xs text-wit-muted px-4">
        💡 Tip: Tap on a lead card to change stage or view details
      </div>
    </div>
  );
}
