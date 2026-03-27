'use client';

import Sidebar from '@/components/Sidebar';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Monthly Leads Summary',
      description: 'Complete overview of all leads for the current month',
      icon: FileText,
      status: 'Available',
    },
    {
      title: 'Pipeline Analysis',
      description: 'Detailed pipeline breakdown by status and value',
      icon: TrendingUp,
      status: 'Available',
    },
    {
      title: 'Client Performance Report',
      description: 'Revenue and projects per client',
      icon: Calendar,
      status: 'Coming Soon',
    },
    {
      title: 'PIC Performance Report',
      description: 'Individual performance metrics for each PIC',
      icon: TrendingUp,
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="ml-72 pt-16 pb-12">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-wit-text mb-2">Reports</h1>
            <p className="text-wit-muted">Generate and export reports</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Download className="w-6 h-6 text-wit-red" />
                </div>
                <span className="badge badge-approved">Available</span>
              </div>
              <h3 className="text-lg font-bold text-wit-text mb-2">Export to Excel</h3>
              <p className="text-wit-muted text-sm mb-4">
                Download all leads data in Excel format
              </p>
              <button className="btn-primary w-full">
                Download Excel
              </button>
            </div>

            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <FileText className="w-6 h-6 text-wit-red" />
                </div>
                <span className="badge badge-approved">Available</span>
              </div>
              <h3 className="text-lg font-bold text-wit-text mb-2">Export to PDF</h3>
              <p className="text-wit-muted text-sm mb-4">
                Generate PDF report with charts and summaries
              </p>
              <button className="btn-primary w-full">
                Download PDF
              </button>
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
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`badge ${report.status === 'Available' ? 'badge-done' : 'badge-cancelled'}`}>
                        {report.status}
                      </span>
                      {report.status === 'Available' ? (
                        <button className="btn-secondary flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      ) : (
                        <button className="btn-secondary flex items-center space-x-2" disabled>
                          <span>Coming Soon</span>
                        </button>
                      )}
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
