'use client';

import { useState, useEffect } from 'react';
import { Lead } from '../../lib/api/leads';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Tag,
  Clock,
  FileText,
  Paperclip,
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/supabase';
import ActivityTimeline from './ActivityTimeline';
import NotesSection from './NotesSection';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStageChange: (lead: Lead, newStage: string) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStageChange,
}: LeadDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'notes'>('details');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const stageColors: Record<string, string> = {
    NEW: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    APPROVED: 'bg-green-500/10 text-green-500 border-green-500/30',
    IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    DONE: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/30',
  };

  const stageLabels: Record<string, string> = {
    NEW: 'New Lead',
    APPROVED: 'Approved',
    IN_PROGRESS: 'In Progress',
    DONE: 'Won',
    CANCELLED: 'Cancelled',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-wit-darker border border-wit-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-wit-border">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-wit-red/10 rounded-xl">
              <Building2 className="w-6 h-6 text-wit-red" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-wit-text">{lead.company_name}</h2>
              <p className="text-sm text-wit-muted">{lead.quotation_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${stageColors[lead.status] || stageColors.NEW}`}>
              {stageLabels[lead.status] || lead.status}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 p-4 border-b border-wit-border overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'details'
                ? 'bg-wit-red/10 text-wit-red'
                : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Details</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-wit-red/10 text-wit-red'
                : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Activity</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-wit-red/10 text-wit-red'
                : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notes</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Lead Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company & Contact Info */}
                <div className="glass border border-wit-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-wit-text mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-wit-red" />
                    Company Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Building2 className="w-5 h-5 text-wit-muted mt-0.5" />
                        <div>
                          <p className="text-xs text-wit-muted mb-1">Company Name</p>
                          <p className="text-sm text-wit-text font-medium">{lead.company_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-wit-muted mt-0.5" />
                        <div>
                          <p className="text-xs text-wit-muted mb-1">Contact Person</p>
                          <p className="text-sm text-wit-text font-medium">{lead.contact_name || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-wit-muted mt-0.5" />
                        <div>
                          <p className="text-xs text-wit-muted mb-1">Email</p>
                          <p className="text-sm text-wit-text font-medium">{lead.email || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-wit-muted mt-0.5" />
                        <div>
                          <p className="text-xs text-wit-muted mb-1">Phone</p>
                          <p className="text-sm text-wit-text font-medium">{lead.phone || '-'}</p>
                        </div>
                      </div>
                      {lead.industry && (
                        <div className="flex items-start space-x-3">
                          <Tag className="w-5 h-5 text-wit-muted mt-0.5" />
                          <div>
                            <p className="text-xs text-wit-muted mb-1">Industry</p>
                            <p className="text-sm text-wit-text font-medium">{lead.industry}</p>
                          </div>
                        </div>
                      )}
                      {lead.location && (
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-wit-muted mt-0.5" />
                          <div>
                            <p className="text-xs text-wit-muted mb-1">Location</p>
                            <p className="text-sm text-wit-text font-medium">{lead.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="glass border border-wit-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-wit-text mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-wit-red" />
                    Lead Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-wit-muted mb-1">Quotation Value</p>
                      <p className="text-xl font-bold text-wit-text">{formatCurrency(Number(lead.quotation_value) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-wit-muted mb-1">Created Date</p>
                      <p className="text-sm text-wit-text font-medium">{formatDate(lead.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-wit-muted mb-1">Last Updated</p>
                      <p className="text-sm text-wit-text font-medium">{formatDate(lead.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-wit-muted mb-1">PIC</p>
                      <p className="text-sm text-wit-text font-medium">{lead.pic_name || 'Unassigned'}</p>
                    </div>
                  </div>
                  {lead.description && (
                    <div className="mt-4 pt-4 border-t border-wit-border">
                      <p className="text-xs text-wit-muted mb-2">Description</p>
                      <p className="text-sm text-wit-text">{lead.description}</p>
                    </div>
                  )}
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-wit-border">
                      <p className="text-xs text-wit-muted mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {lead.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-wit-red/10 text-wit-red text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {lead.attachments && lead.attachments.length > 0 && (
                  <div className="glass border border-wit-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-wit-text mb-4 flex items-center">
                      <Paperclip className="w-5 h-5 mr-2 text-wit-red" />
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {lead.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-wit-card rounded-lg border border-wit-border"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-wit-muted" />
                            <div>
                              <p className="text-sm text-wit-text font-medium">{attachment.name}</p>
                              <p className="text-xs text-wit-muted">{attachment.size}</p>
                            </div>
                          </div>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-wit-red/10 text-wit-red text-sm rounded-lg hover:bg-wit-red/20 transition-all"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Actions & Quick Info */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="glass border border-wit-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-wit-text mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        onEdit(lead);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 btn-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Lead</span>
                    </button>
                    
                    {/* Stage Change Dropdown */}
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          onStageChange(lead, e.target.value);
                          onClose();
                        }}
                        className="w-full px-4 py-3 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red transition-all"
                      >
                        <option value="NEW">New Lead</option>
                        <option value="APPROVED">Approved</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Won</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <p className="text-xs text-wit-muted mt-2">Change Stage</p>
                    </div>

                    <button
                      onClick={() => {
                        onDelete(lead);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Lead</span>
                    </button>
                  </div>
                </div>

                {/* Timeline Preview */}
                <div className="glass border border-wit-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-wit-text mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-wit-red" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-wit-text">Lead created</p>
                        <p className="text-xs text-wit-muted">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>
                    {lead.updated_at !== lead.created_at && (
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-wit-text">Last updated</p>
                          <p className="text-xs text-wit-muted">{formatDate(lead.updated_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="w-full mt-4 px-4 py-2 text-sm text-wit-red hover:bg-wit-red/10 rounded-lg transition-all"
                  >
                    View All Activity →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <ActivityTimeline leadId={lead.quotation_id} />
          )}

          {activeTab === 'notes' && (
            <NotesSection leadId={lead.quotation_id} />
          )}
        </div>
      </div>
    </div>
  );
}
