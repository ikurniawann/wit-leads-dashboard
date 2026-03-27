'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import KanbanBoard from '../../components/leads/KanbanBoard';
import LeadsTable from '../../components/LeadsTable';
import LeadFormModal from '../../components/leads/LeadFormModal';
import LeadDetailModal from '../../components/leads/LeadDetailModal';
import DeleteConfirmModal from '../../components/shared/DeleteConfirmModal';
import LeadFilters, { AppliedFilters } from '../../components/filters/LeadFilters';
import { leadsApi, Lead } from '../../lib/api/leads';
import { Table, Kanban, Sliders } from 'lucide-react';

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<AppliedFilters | null>(null);
  
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
      console.log('Updating stage:', lead.quotation_id, 'from', lead.status_id, 'to', newStage);
      const updated = await leadsApi.update(lead.quotation_id, { status_id: newStage });
      console.log('Stage updated successfully:', updated);
      loadLeads();
    } catch (error: any) {
      console.error('Error updating stage:', error);
      const errorMessage = error?.message || 'Unknown error';
      alert(`Failed to update stage: ${errorMessage}\n\nPlease check:\n1. You're logged in\n2. You have permission to edit leads\n3. Supabase connection is working`);
    }
  };

  const handleApplyFilters = (filters: AppliedFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
    console.log('Filters applied:', filters);
    // TODO: Implement actual filtering logic with API
  };

  const handleResetFilters = () => {
    setActiveFilters(null);
    setCurrentPage(1);
    console.log('Filters reset');
  };

  const getActiveFiltersCount = () => {
    if (!activeFilters) return 0;
    let count = 0;
    if (activeFilters.stages?.length) count += activeFilters.stages.length;
    if (activeFilters.pics?.length) count += activeFilters.pics.length;
    if (activeFilters.industries?.length) count += activeFilters.industries.length;
    if (activeFilters.dateFrom || activeFilters.dateTo) count += 1;
    if (activeFilters.min_value !== undefined || activeFilters.max_value !== undefined) count += 1;
    return count;
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Leads Pipeline</h1>
              <p className="text-sm md:text-base text-wit-muted">Visualize and manage your sales pipeline</p>
            </div>
            
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
          </div>

          {/* View Content */}
          {viewMode === 'table' ? (
            <LeadsTable
              leads={leads}
              onAdd={handleAddLead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onView={handleViewLead}
              currentPage={currentPage}
              pageSize={pageSize}
              totalLeads={leads.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              onOpenFilters={() => setIsFiltersOpen(true)}
              activeFiltersCount={getActiveFiltersCount()}
            />
          ) : (
            <KanbanBoard
              leads={leads}
              onAddLead={handleAddLead}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
              onViewLead={handleViewLead}
              onStageChange={handleStageChange}
            />
          )}
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

      <LeadFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        currentFilters={activeFilters || undefined}
      />
    </div>
  );
}
