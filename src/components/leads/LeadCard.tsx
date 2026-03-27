'use client';

import { Lead } from '../../lib/api/leads';
import { 
  Building2, 
  DollarSign, 
  User, 
  Calendar, 
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatDate } from '../../lib/supabase';

interface LeadCardProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onStageChange: (lead: Lead, newStage: string) => void;
}

export default function LeadCard({
  lead,
  onEdit,
  onDelete,
  onView,
  onStageChange,
}: LeadCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStageSelect, setShowStageSelect] = useState(false);

  const stageColors: Record<string, string> = {
    NEW: 'border-l-blue-500',
    APPROVED: 'border-l-green-500',
    IN_PROGRESS: 'border-l-yellow-500',
    DONE: 'border-l-purple-500',
    CANCELLED: 'border-l-red-500',
  };

  const stageLabels: Record<string, string> = {
    NEW: 'New',
    APPROVED: 'Approved',
    IN_PROGRESS: 'In Progress',
    DONE: 'Won',
    CANCELLED: 'Cancelled',
  };

  const stages = [
    { id: 'NEW', label: 'New Lead' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'DONE', label: 'Won' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className={`glass border border-wit-border rounded-lg p-4 hover:border-wit-red/30 transition-all group ${stageColors[lead.status_id] || 'border-l-blue-500'} border-l-4`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-wit-text truncate mb-1">
            {lead.company_name}
          </h4>
          <p className="text-xs text-wit-muted truncate">{lead.project_name}</p>
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
              <div className="absolute right-0 mt-1 w-48 glass border border-wit-border rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onView();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-wit-text hover:bg-wit-card transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-wit-text hover:bg-wit-card transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                {/* Change Stage Submenu */}
                <div className="relative">
                  <button
                    onClick={() => setShowStageSelect(!showStageSelect)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-wit-text hover:bg-wit-card transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <ChevronDown className="w-4 h-4" />
                      <span>Change Stage</span>
                    </div>
                  </button>
                  
                  {showStageSelect && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowStageSelect(false)}
                      />
                      <div className="absolute left-full top-0 ml-1 w-40 glass border border-wit-border rounded-lg shadow-xl overflow-hidden">
                        {stages.map((stage) => (
                          <button
                            key={stage.id}
                            onClick={() => {
                              onStageChange(lead, stage.id);
                              setShowStageSelect(false);
                              setShowMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-wit-card transition-all ${
                              lead.status_id === stage.id ? 'text-wit-red' : 'text-wit-text'
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
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-2 mb-3">
        {/* Client */}
        {lead.client_name && (
          <div className="flex items-center space-x-2 text-xs text-wit-muted">
            <User className="w-3 h-3" />
            <span className="truncate">{lead.client_name}</span>
          </div>
        )}

        {/* Value */}
        {lead.grand_total && (
          <div className="flex items-center space-x-2 text-xs">
            <DollarSign className="w-3 h-3 text-wit-red" />
            <span className="text-sm font-semibold text-wit-text">
              {formatCurrency(lead.grand_total)}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center space-x-2 text-xs text-wit-muted">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(lead.created_at)}</span>
        </div>

        {/* PIC */}
        {lead.pic_excel_name && (
          <div className="flex items-center space-x-2 text-xs text-wit-muted">
            <Building2 className="w-3 h-3" />
            <span className="truncate">PIC: {lead.pic_excel_name}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-wit-border">
          {lead.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-wit-red/10 text-wit-red text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-wit-card text-wit-muted text-xs rounded-md">
              +{lead.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Mobile: Quick Stage Change */}
      <div className="md:hidden mt-3 pt-3 border-t border-wit-border">
        <select
          value={lead.status_id}
          onChange={(e) => onStageChange(lead, e.target.value)}
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
