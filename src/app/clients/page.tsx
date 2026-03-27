'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ClientFormModal from '@/components/clients/ClientFormModal';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { clientsApi, Client } from '@/lib/api/clients';
import { Plus, Search, Users, Building2, Mail, Phone } from 'lucide-react';

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsAddModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadClients();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    try {
      await clientsApi.delete(selectedClient.client_id);
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const filteredClients = clients.filter(client =>
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: clients.length,
    withProjects: clients.filter(c => c.tags?.length || 0 > 0).length,
    thisMonth: clients.filter(c => {
      const created = new Date(c.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wit-darker flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="ml-72 pt-16 pb-12">
        <div className="px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-wit-text mb-2">Clients</h1>
              <p className="text-wit-muted">Manage client database and contacts</p>
            </div>
            <button
              onClick={handleAddClient}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Total Clients</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.total}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">Active Clients</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.withProjects}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3 className="text-wit-muted text-sm mb-1">New This Month</h3>
              <p className="text-3xl font-bold text-wit-text">{stats.thisMonth}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-wit-muted" />
              <input
                type="text"
                placeholder="Search clients by company name, contact person, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark w-full pl-10"
              />
            </div>
          </div>

          {/* Clients Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">Industry</th>
                    <th className="text-left py-3 px-4">Contact Person</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="empty-state py-12">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-wit-text text-lg mb-2">No clients found</h3>
                          <p className="text-wit-muted text-sm">
                            {searchTerm ? 'Try adjusting your search' : 'Click "Add Client" to get started'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.client_id} className="border-t border-wit-border hover:bg-wit-red/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-wit-text">{client.company_name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted text-sm">{client.industry || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-text">{client.client_name || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted">{client.email || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted">{client.phone || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-wit-muted text-sm">
                            {new Date(client.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClient(client)}
                              className="p-2 text-wit-muted hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client)}
                              className="p-2 text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ClientFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        client={null}
        onSuccess={handleModalSuccess}
      />

      <ClientFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={selectedClient}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        description="Are you sure you want to delete this client?"
        itemName={selectedClient?.company_name || 'this client'}
      />
    </div>
  );
}
