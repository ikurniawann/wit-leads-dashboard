'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import KanbanBoard from '../../components/leads/KanbanBoard';
import LeadFormModal from '../../components/leads/LeadFormModal';
import LeadDetailModal from '../../components/leads/LeadDetailModal';
import DeleteConfirmModal from '../../components/shared/DeleteConfirmModal';
import { leadsApi, Lead } from '../../lib/api/leads';

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.getAll();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsAddModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadLeads();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLead) return;
    
    try {
      await leadsApi.delete(selectedLead.quotation_id);
      loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  const handleStageChange = async (lead: Lead, newStage: string) => {
    try {
      await leadsApi.update(lead.quotation_id, { status_id: newStage });
      loadLeads();
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to update stage. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wit-darker flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header - Mobile Responsive */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Leads Pipeline</h1>
            <p className="text-sm md:text-base text-wit-muted">Visualize and manage your sales pipeline</p>
          </div>

          {/* Kanban Board */}
          <KanbanBoard
            leads={leads}
            onAddLead={handleAddLead}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
            onViewLead={handleViewLead}
            onStageChange={handleStageChange}
          />
        </div>
      </main>

      {/* Modals */}
      <LeadFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        lead={null}
        onSuccess={handleModalSuccess}
      />

      <LeadFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={selectedLead}
        onSuccess={handleModalSuccess}
      />

      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={selectedLead}
        onEdit={(lead) => {
          setSelectedLead(lead);
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={(lead) => {
          setSelectedLead(lead);
          setIsDetailModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        onStageChange={handleStageChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        description="Are you sure you want to delete this lead?"
        itemName={selectedLead?.project_name || 'this lead'}
      />
    </div>
  );
}
