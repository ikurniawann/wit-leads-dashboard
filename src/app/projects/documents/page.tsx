'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Download, Eye, Trash2, Search, Filter } from 'lucide-react';

// DUMMY DATA - Will be replaced with real API later
const DUMMY_PROJECTS = [
  { project_id: '1', project_name: 'Rental Management System' },
  { project_id: '2', project_name: 'Procurement GNSS Chipset' },
  { project_id: '3', project_name: 'Mobile Force App' },
  { project_id: '4', project_name: 'BNI Rise x KNPI' },
  { project_id: '5', project_name: 'ION Network - 10 Projects' },
];

const DOCUMENT_TYPES = [
  { id: 'nda', name: 'NDA', required: true, category: 'Legal' },
  { id: 'po', name: 'Purchase Order (PO)', required: true, category: 'Commercial' },
  { id: 'pks', name: 'Perjanjian Kerjasama (PKS)', required: true, category: 'Legal' },
  { id: 'mou', name: 'MoU', required: false, category: 'Legal' },
  { id: 'quotation', name: 'Quotation', required: true, category: 'Commercial' },
  { id: 'summary', name: 'Project Summary', required: true, category: 'General' },
  { id: 'invoice', name: 'Invoice', required: true, category: 'Finance' },
  { id: 'uat', name: 'User Acceptance Test (UAT)', required: true, category: 'Technical' },
  { id: 'bast', name: 'BAST (Berita Acara Serah Terima)', required: true, category: 'Legal' },
];

interface Document {
  doc_id: string;
  project_id: string;
  doc_type: string;
  file_name?: string;
  file_url?: string;
  file_size?: number;
  uploaded_at?: string;
  uploaded_by?: string;
  status: 'COMPLETE' | 'PENDING' | 'OPTIONAL';
}

// Generate dummy documents
const generateDummyDocuments = (): Document[] => {
  const docs: Document[] = [];
  
  DUMMY_PROJECTS.forEach(project => {
    DOCUMENT_TYPES.forEach(docType => {
      const hasDocument = Math.random() > 0.4; // 60% have documents
      docs.push({
        doc_id: `${project.project_id}-${docType.id}`,
        project_id: project.project_id,
        doc_type: docType.id,
        file_name: hasDocument ? `${project.project_name}_${docType.id}.pdf` : undefined,
        file_url: hasDocument ? '#' : undefined,
        file_size: hasDocument ? Math.floor(Math.random() * 500000) + 50000 : undefined,
        uploaded_at: hasDocument ? new Date().toISOString() : undefined,
        uploaded_by: hasDocument ? 'Admin' : undefined,
        status: hasDocument ? 'COMPLETE' : (docType.required ? 'PENDING' : 'OPTIONAL'),
      });
    });
  });
  
  return docs;
};

const DUMMY_DOCUMENTS = generateDummyDocuments();

const formatFileSize = (bytes: number) => {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${bytes} B`;
};

export default function ProjectDocumentsPage() {
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const documents = DUMMY_DOCUMENTS.filter(doc => {
    const projectMatch = selectedProject === 'ALL' || doc.project_id === selectedProject;
    const statusMatch = filterStatus === 'ALL' || doc.status === filterStatus;
    const searchMatch = doc.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      DOCUMENT_TYPES.find(t => t.id === doc.doc_type)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return projectMatch && statusMatch && searchMatch;
  });

  const getDocTypeInfo = (docTypeId: string) => {
    return DOCUMENT_TYPES.find(t => t.id === docTypeId) || { name: docTypeId, required: true, category: 'General' };
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> = {
      COMPLETE: { color: 'text-green-500 bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'Complete' },
      PENDING: { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30', icon: Clock, label: 'Pending' },
      OPTIONAL: { color: 'text-gray-500 bg-gray-500/10 border-gray-500/30', icon: AlertCircle, label: 'Optional' },
    };
    const badge = badges[status] || badges.COMPLETE;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  const handleUpload = (docId: string) => {
    setUploadingDoc(docId);
    // Simulate upload
    setTimeout(() => {
      setUploadingDoc(null);
      alert('Document uploaded successfully! (Demo only)');
    }, 1500);
  };

  const handleDownload = (doc: Document) => {
    alert(`Downloading ${doc.file_name}... (Demo only)`);
  };

  const handleView = (doc: Document) => {
    alert(`Viewing ${doc.file_name}... (Demo only)`);
  };

  const handleDelete = (doc: Document) => {
    if (confirm(`Delete ${doc.file_name}?`)) {
      alert('Document deleted! (Demo only)');
    }
  };

  // Calculate stats
  const totalDocs = documents.length;
  const completeDocs = documents.filter(d => d.status === 'COMPLETE').length;
  const pendingDocs = documents.filter(d => d.status === 'PENDING').length;
  const optionalDocs = documents.filter(d => d.status === 'OPTIONAL').length;
  const completionRate = Math.round((completeDocs / totalDocs) * 100);

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Project Documents</h1>
            <p className="text-sm md:text-base text-wit-muted">Manage project documentation and compliance</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Total Docs</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{totalDocs}</p>
            </div>

            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500">Complete</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{completeDocs}</p>
            </div>

            <div className="glass border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-yellow-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{pendingDocs}</p>
            </div>

            <div className="glass border border-gray-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <p className="text-2xl font-bold text-gray-500">{optionalDocs}</p>
            </div>

            <div className={`glass border rounded-xl p-4 ${
              completionRate >= 80 ? 'border-green-500/30' : 
              completionRate >= 50 ? 'border-yellow-500/30' : 'border-red-500/30'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Completion</span>
              </div>
              <p className={`text-2xl font-bold ${
                completionRate >= 80 ? 'text-green-500' : 
                completionRate >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {completionRate}%
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-dark w-full pl-10"
                />
              </div>

              {/* Project Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-wit-muted" />
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                >
                  <option value="ALL">All Projects</option>
                  {DUMMY_PROJECTS.map(project => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETE">Complete</option>
                <option value="PENDING">Pending</option>
                <option value="OPTIONAL">Optional</option>
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-dark">
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Category</th>
                    <th>Project</th>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const docType = getDocTypeInfo(doc.doc_type);
                    return (
                      <tr key={doc.doc_id} className="hover:bg-wit-red/5 transition-colors">
                        <td>
                          <div className="font-medium text-wit-text">{docType.name}</div>
                          <div className="text-xs text-wit-muted">
                            {docType.required ? 'Required' : 'Optional'}
                          </div>
                        </td>
                        <td>
                          <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                            {docType.category}
                          </span>
                        </td>
                        <td>
                          <div className="text-wit-text text-sm max-w-xs truncate">
                            {DUMMY_PROJECTS.find(p => p.project_id === doc.project_id)?.project_name || '-'}
                          </div>
                        </td>
                        <td>
                          {doc.file_name ? (
                            <div className="flex items-center space-x-2 text-wit-muted text-sm">
                              <FileText className="w-4 h-4" />
                              <span>{doc.file_name}</span>
                            </div>
                          ) : (
                            <span className="text-wit-muted">-</span>
                          )}
                        </td>
                        <td>
                          <div className="text-wit-muted text-sm">
                            {doc.file_size ? formatFileSize(doc.file_size) : '-'}
                          </div>
                        </td>
                        <td>
                          <div className="text-wit-muted text-sm">
                            {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('id-ID') : '-'}
                          </div>
                          {doc.uploaded_by && (
                            <div className="text-xs text-wit-muted">{doc.uploaded_by}</div>
                          )}
                        </td>
                        <td>
                          {getStatusBadge(doc.status)}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            {doc.status === 'COMPLETE' ? (
                              <>
                                <button
                                  onClick={() => handleView(doc)}
                                  className="p-2 text-wit-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="p-2 text-wit-muted hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(doc)}
                                  className="p-2 text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleUpload(doc.doc_id)}
                                disabled={uploadingDoc === doc.doc_id}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-wit-red text-white rounded-lg text-sm hover:bg-wit-red/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Upload className="w-4 h-4" />
                                <span>{uploadingDoc === doc.doc_id ? 'Uploading...' : 'Upload'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Checklist Info */}
          <div className="glass border border-wit-border rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-wit-text mb-4">Document Checklist</h3>
            <p className="text-sm text-wit-muted mb-4">
              Each project requires the following documents for compliance:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOCUMENT_TYPES.map((docType) => (
                <div
                  key={docType.id}
                  className={`p-4 rounded-lg border ${
                    docType.required
                      ? 'border-wit-red/30 bg-wit-red/5'
                      : 'border-wit-border bg-wit-card/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-wit-text">{docType.name}</span>
                    {docType.required ? (
                      <span className="text-xs text-wit-red font-medium">Required</span>
                    ) : (
                      <span className="text-xs text-wit-muted font-medium">Optional</span>
                    )}
                  </div>
                  <div className="text-xs text-wit-muted">{docType.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
