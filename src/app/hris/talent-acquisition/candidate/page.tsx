'use client';

import { useState } from 'react';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import { Users, Search, Filter, Plus, Calendar, Mail, Phone, MapPin, Briefcase, Star, CheckCircle, XCircle, Clock, MoreVertical, ArrowRight } from 'lucide-react';

// DUMMY DATA
const PIPELINE_STAGES = [
  { id: 'applied', name: 'Applied', count: 12, color: 'text-gray-500 bg-gray-500/10 border-gray-500/30' },
  { id: 'screening', name: 'Screening', count: 8, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { id: 'phone', name: 'Phone Interview', count: 6, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  { id: 'technical', name: 'Technical Test', count: 5, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { id: 'user', name: 'User Interview', count: 4, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
  { id: 'culture', name: 'Culture Fit', count: 3, color: 'text-pink-500 bg-pink-500/10 border-pink-500/30' },
  { id: 'offer', name: 'Offer', count: 3, color: 'text-green-500 bg-green-500/10 border-green-500/30' },
  { id: 'hired', name: 'Hired', count: 4, color: 'text-teal-500 bg-teal-500/10 border-teal-500/30' },
];

const DUMMY_CANDIDATES = [
  { id: 'CAND-001', name: 'Andi Pratama', email: 'andi@email.com', phone: '+62-812-3456-7890', position: 'Senior Developer', stage: 'technical', source: 'LinkedIn', applied_date: '2026-03-15', experience: '5 years', skills: ['React', 'Node.js', 'PostgreSQL'], rating: 4.5, location: 'Jakarta' },
  { id: 'CAND-002', name: 'Sari Dewi', email: 'sari@email.com', phone: '+62-813-4567-8901', position: 'UX Designer', stage: 'user', source: 'JobStreet', applied_date: '2026-03-10', experience: '3 years', skills: ['Figma', 'User Research', 'Prototyping'], rating: 4.2, location: 'Bandung' },
  { id: 'CAND-003', name: 'Budi Hartono', email: 'budi@email.com', phone: '+62-814-5678-9012', position: 'Sales Manager', stage: 'offer', source: 'Referral', applied_date: '2026-03-01', experience: '8 years', skills: ['B2B Sales', 'Team Management', 'Negotiation'], rating: 4.8, location: 'Surabaya' },
  { id: 'CAND-004', name: 'Maya Sari', email: 'maya@email.com', phone: '+62-815-6789-0123', position: 'QA Engineer', stage: 'screening', source: 'Kalibrr', applied_date: '2026-03-20', experience: '2 years', skills: ['Manual Testing', 'Selenium', 'API Testing'], rating: 3.8, location: 'Jakarta' },
  { id: 'CAND-005', name: 'Rizky Ramadhan', email: 'rizky@email.com', phone: '+62-816-7890-1234', position: 'DevOps Engineer', stage: 'phone', source: 'LinkedIn', applied_date: '2026-03-18', experience: '4 years', skills: ['AWS', 'Docker', 'Kubernetes'], rating: 4.3, location: 'Remote' },
  { id: 'CAND-006', name: 'Fitri Handayani', email: 'fitri@email.com', phone: '+62-817-8901-2345', position: 'Finance Staff', stage: 'hired', source: 'JobStreet', applied_date: '2026-02-15', experience: '3 years', skills: ['Accounting', 'SAP', 'Financial Analysis'], rating: 4.0, location: 'Jakarta' },
];

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: 'text-blue-500 bg-blue-500/10',
  JobStreet: 'text-orange-500 bg-orange-500/10',
  Kalibrr: 'text-green-500 bg-green-500/10',
  Referral: 'text-purple-500 bg-purple-500/10',
  'Company Website': 'text-red-500 bg-red-500/10',
};

export default function CandidateApplicationPage() {
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCandidates = DUMMY_CANDIDATES.filter(candidate => {
    const searchMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const stageMatch = selectedStage === 'ALL' || candidate.stage === selectedStage;
    return searchMatch && stageMatch;
  });

  const getCandidatesByStage = (stageId: string) => {
    return filteredCandidates.filter(c => c.stage === stageId);
  };

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Candidate Application</h1>
                <p className="text-sm md:text-base text-wit-muted">Applicant tracking & recruitment pipeline</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-wit-card rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('KANBAN')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'KANBAN' ? 'bg-wit-red text-white' : 'text-wit-muted'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('TABLE')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'TABLE' ? 'bg-wit-red text-white' : 'text-wit-muted'
                    }`}
                  >
                    Table
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-wit-text">Recruitment Pipeline</h3>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-wit-muted" />
                <span className="text-sm text-wit-muted">{filteredCandidates.length} candidates</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(selectedStage === stage.id ? 'ALL' : stage.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStage === stage.id
                      ? stage.color
                      : 'bg-wit-card text-wit-muted hover:bg-wit-red/10'
                  }`}
                >
                  {stage.name}
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{stage.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
                <input
                  type="text"
                  placeholder="Search candidates by name or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-dark w-full pl-10"
                />
              </div>
              <select className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red">
                <option>All Sources</option>
                <option>LinkedIn</option>
                <option>JobStreet</option>
                <option>Kalibrr</option>
                <option>Referral</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-wit-red text-white rounded-lg text-sm hover:bg-wit-red/80 transition-all">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* KANBAN VIEW */}
          {viewMode === 'KANBAN' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {PIPELINE_STAGES.map((stage) => (
                  <div key={stage.id} className="w-80 flex-shrink-0">
                    <div className={`flex items-center justify-between p-3 rounded-lg border mb-3 ${stage.color}`}>
                      <span className="font-medium text-sm">{stage.name}</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                        {getCandidatesByStage(stage.id).length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {getCandidatesByStage(stage.id).map((candidate) => (
                        <div key={candidate.id} className="glass border border-wit-border rounded-xl p-4 hover:border-wit-red/50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-wit-text">{candidate.name}</h4>
                              <p className="text-sm text-wit-muted">{candidate.position}</p>
                            </div>
                            <button className="p-1 text-wit-muted hover:text-wit-text">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${SOURCE_COLORS[candidate.source] || 'bg-wit-card text-wit-muted'}`}>
                              {candidate.source}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-wit-muted">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(candidate.applied_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <Briefcase className="w-3 h-3 text-wit-muted" />
                            <span className="text-xs text-wit-muted">{candidate.experience}</span>
                            <MapPin className="w-3 h-3 text-wit-muted ml-2" />
                            <span className="text-xs text-wit-muted">{candidate.location}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {candidate.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-wit-border/30">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold text-wit-text">{candidate.rating}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-wit-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Email">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-wit-muted hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all" title="Phone">
                                <Phone className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-red/10 rounded-lg transition-all" title="Move">
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getCandidatesByStage(stage.id).length === 0 && (
                        <div className="text-center py-8 text-wit-muted text-sm border-2 border-dashed border-wit-border rounded-xl">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'TABLE' && (
            <div className="glass border border-wit-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Position</th>
                      <th>Stage</th>
                      <th>Source</th>
                      <th>Experience</th>
                      <th>Skills</th>
                      <th>Location</th>
                      <th>Rating</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => {
                      const stage = PIPELINE_STAGES.find(s => s.id === candidate.stage);
                      return (
                        <tr key={candidate.id} className="hover:bg-wit-red/5 transition-colors">
                          <td>
                            <div>
                              <div className="font-medium text-wit-text">{candidate.name}</div>
                              <div className="flex items-center space-x-2 text-xs text-wit-muted">
                                <Mail className="w-3 h-3" />
                                <span>{candidate.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-wit-text">{candidate.position}</div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stage?.color || 'bg-wit-card'}`}>
                              {stage?.name || candidate.stage}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${SOURCE_COLORS[candidate.source] || 'bg-wit-card text-wit-muted'}`}>
                              {candidate.source}
                            </span>
                          </td>
                          <td>
                            <div className="text-wit-text text-sm">{candidate.experience}</div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 2).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 2 && (
                                <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                                  +{candidate.skills.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-1 text-wit-muted text-sm">
                              <MapPin className="w-3 h-3" />
                              <span>{candidate.location}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold text-wit-text">{candidate.rating}</span>
                            </div>
                          </td>
                          <td>
                            <div className="text-wit-muted text-sm">
                              {new Date(candidate.applied_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-wit-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="View">
                                <Users className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-wit-muted hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all" title="Email">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-red/10 rounded-lg transition-all" title="More">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
