'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import PipelineChart from '../components/dashboard/PipelineChart';
import WinRateChart from '../components/dashboard/WinRateChart';
import LeadsTable from '../components/LeadsTable';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';
import { leadsApi, Lead, LeadStats } from '../lib/api/leads';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    new: 0,
    approved: 0,
    inProgress: 0,
    done: 0,
    cancelled: 0,
    totalValue: 0,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsData, statsData] = await Promise.all([
        leadsApi.getAll(),
        leadsApi.getStats(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLead) return;
    
    try {
      await leadsApi.delete(selectedLead.quotation_id);
      loadData();
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wit-darker flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading dashboard...</p>
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
              <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Dashboard</h1>
              <p className="text-sm md:text-base text-wit-muted">Monitor dan kelola pipeline leads WIT</p>
            </div>
            <button
              onClick={handleAddLead}
              className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Lead</span>
            </button>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PipelineChart />
            <WinRateChart />
          </div>

          {/* Recent Leads */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-wit-text">Recent Leads</h2>
              <a href="/leads" className="text-wit-red hover:text-red-400 text-sm font-medium">
                View All →
              </a>
            </div>
            <LeadsTable
              leads={leads.slice(0, 10)}
              onAdd={handleAddLead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onView={handleViewLead}
            />
          </div>
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
        onStageChange={(lead, newStage) => {
          // TODO: Implement stage change API call
          console.log('Change stage:', lead.quotation_id, newStage);
          loadData();
        }}
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
