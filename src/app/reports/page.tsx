'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { exportLeadsToExcel, exportClientsToExcel, exportEmployeesToExcel } from '../../lib/utils/export-excel';
import { exportLeadsToPDF, exportClientsToPDF, exportEmployeesToPDF } from '../../lib/utils/export-pdf';

export default function ReportsPage() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportExcel = async (type: 'leads' | 'clients' | 'employees') => {
    setExporting(`${type}-excel`);
    
    try {
      // Sample data (will be replaced with real Supabase data)
      let result;
      if (type === 'leads') {
        const sampleLeads = [
          { quotation_id: 'LEAD-202603-001', company_name: 'ION Network', project_name: 'IoT Platform', client_name: 'ION', pic_name: 'Ilham', status_id: 'IN_PROGRESS', value: 488400000, probability: 60 },
          { quotation_id: 'LEAD-202603-002', company_name: 'BNI Rise', project_name: 'KNPI Catalog', client_name: 'BNI', pic_name: 'Irfan', status_id: 'NEW', value: 450000000, probability: 40 },
        ];
        result = await exportLeadsToExcel(sampleLeads);
      } else if (type === 'clients') {
        const sampleClients = [
          { company_name: 'ION Network', contact_person: 'John Doe', email: 'john@ion.com', phone: '+62 812xxx', industry: 'Technology', status: 'active' },
          { company_name: 'BNI Rise', contact_person: 'Jane Smith', email: 'jane@bni.com', phone: '+62 813xxx', industry: 'Finance', status: 'active' },
        ];
        result = await exportClientsToExcel(sampleClients);
      } else {
        const sampleEmployees = [
          { employee_name: 'Banu Rusman', position: 'CIO', department: 'Technology', email: 'banu@wit.com', phone: '+62 811xxx', status: 'active' },
        ];
        result = await exportEmployeesToExcel(sampleEmployees);
      }
      
      if (result.success) {
        alert(`${type} exported to Excel successfully!`);
      } else {
        alert('Failed to export. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please install required dependencies.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async (type: 'leads' | 'clients' | 'employees') => {
    setExporting(`${type}-pdf`);
    
    try {
      // Sample data (will be replaced with real Supabase data)
      let result;
      if (type === 'leads') {
        const sampleLeads = [
          { quotation_id: 'LEAD-202603-001', company_name: 'ION Network', project_name: 'IoT Platform', client_name: 'ION', pic_name: 'Ilham', status_id: 'IN_PROGRESS', value: 488400000 },
          { quotation_id: 'LEAD-202603-002', company_name: 'BNI Rise', project_name: 'KNPI Catalog', client_name: 'BNI', pic_name: 'Irfan', status_id: 'NEW', value: 450000000 },
        ];
        result = await exportLeadsToPDF(sampleLeads);
      } else if (type === 'clients') {
        const sampleClients = [
          { company_name: 'ION Network', contact_person: 'John Doe', email: 'john@ion.com', phone: '+62 812xxx', industry: 'Technology', status: 'active' },
        ];
        result = await exportClientsToPDF(sampleClients);
      } else {
        const sampleEmployees = [
          { employee_name: 'Banu Rusman', position: 'CIO', department: 'Technology', email: 'banu@wit.com', phone: '+62 811xxx', status: 'active' },
        ];
        result = await exportEmployeesToPDF(sampleEmployees);
      }
      
      if (result.success) {
        alert(`${type} exported to PDF successfully!`);
      } else {
        alert('Failed to export. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please install required dependencies.');
    } finally {
      setExporting(null);
    }
  };

  const reports = [
    {
      title: 'Leads Report',
      description: 'Complete overview of all leads with status and values',
      icon: FileText,
      category: 'Sales',
    },
    {
      title: 'Clients Report',
      description: 'Active clients database with contact information',
      icon: Users,
      category: 'CRM',
    },
    {
      title: 'Employees Report',
      description: 'Employee directory with positions and departments',
      icon: Users,
      category: 'HR',
    },
    {
      title: 'Monthly Revenue Report',
      description: 'Revenue breakdown by month and PIC',
      icon: DollarSign,
      category: 'Finance',
    },
    {
      title: 'Pipeline Analysis',
      description: 'Detailed pipeline breakdown by status and conversion',
      icon: TrendingUp,
      category: 'Sales',
    },
    {
      title: 'Quarterly Performance',
      description: 'Q1 2026 performance summary and insights',
      icon: Calendar,
      category: 'Executive',
    },
  ];

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header - Mobile Responsive */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Reports</h1>
            <p className="text-sm md:text-base text-wit-muted">Generate and export reports</p>
          </div>

          {/* Quick Export Actions - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <FileText className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-wit-text mb-2">Leads Export</h3>
              <p className="text-wit-muted text-sm mb-4">
                Export all leads data
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => handleExportExcel('leads')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'leads-excel'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'leads-excel' ? 'Exporting...' : 'Export Excel'}</span>
                </button>
                <button 
                  onClick={() => handleExportPDF('leads')}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'leads-pdf'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'leads-pdf' ? 'Exporting...' : 'Export PDF'}</span>
                </button>
              </div>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Users className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-wit-text mb-2">Clients Export</h3>
              <p className="text-wit-muted text-sm mb-4">
                Export all clients data
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => handleExportExcel('clients')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'clients-excel'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'clients-excel' ? 'Exporting...' : 'Export Excel'}</span>
                </button>
                <button 
                  onClick={() => handleExportPDF('clients')}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'clients-pdf'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'clients-pdf' ? 'Exporting...' : 'Export PDF'}</span>
                </button>
              </div>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Users className="w-6 h-6 text-wit-red" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-wit-text mb-2">Employees Export</h3>
              <p className="text-wit-muted text-sm mb-4">
                Export all employees data
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => handleExportExcel('employees')}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'employees-excel'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'employees-excel' ? 'Exporting...' : 'Export Excel'}</span>
                </button>
                <button 
                  onClick={() => handleExportPDF('employees')}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                  disabled={exporting === 'employees-pdf'}
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting === 'employees-pdf' ? 'Exporting...' : 'Export PDF'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-wit-border">
              <h2 className="text-xl font-bold text-wit-text">Available Reports</h2>
            </div>
            <div className="divide-y divide-wit-border">
              {reports.map((report, index) => {
                const Icon = report.icon;
                return (
                  <div
                    key={index}
                    className="p-6 flex items-center justify-between hover:bg-wit-red/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-wit-card rounded-lg">
                        <Icon className="w-6 h-6 text-wit-red" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-wit-text">{report.title}</h3>
                        <p className="text-wit-muted text-sm">{report.description}</p>
                        <span className="text-wit-muted text-xs mt-1 inline-block px-2 py-1 bg-wit-red/10 rounded">
                          {report.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="badge badge-cancelled">Coming Soon</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
