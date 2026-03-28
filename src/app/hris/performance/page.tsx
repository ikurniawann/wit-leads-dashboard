'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  TrendingUp, Star, Target, Users, Calendar, CheckCircle, 
  Clock, AlertCircle, FileText, Download, Search, Filter,
  ChevronDown, Award, BookOpen, Briefcase, Heart, Zap
} from 'lucide-react';

// DUMMY DATA
const DUMMY_EMPLOYEES = [
  { employee_id: '1', name: 'Muhamad Ilham Kurniawan', position: 'CEO', department: 'C-Level', manager_id: null },
  { employee_id: '2', name: 'Fahmi Muhammad Syaban', position: 'CTO', department: 'Technology', manager_id: '1' },
  { employee_id: '3', name: 'Siti Nurhaliza', position: 'Designer', department: 'Marketing', manager_id: '1' },
  { employee_id: '4', name: 'Ahmad Rizki', position: 'Developer', department: 'Technology', manager_id: '2' },
  { employee_id: '5', name: 'Budi Santoso', position: 'QA Engineer', department: 'Technology', manager_id: '2' },
  { employee_id: '6', name: 'Dewi Lestari', position: 'HR Manager', department: 'HR', manager_id: '1' },
  { employee_id: '7', name: 'Eko Prasetyo', position: 'Sales', department: 'Marketing', manager_id: '3' },
  { employee_id: '8', name: 'Fitri Handayani', position: 'Finance', department: 'Finance', manager_id: '1' },
];

const REVIEW_PERIODS = [
  { id: 'Q1_2026', name: 'Q1 2026', start: '2026-01-01', end: '2026-03-31' },
  { id: 'Q4_2025', name: 'Q4 2025', start: '2025-10-01', end: '2025-12-31' },
  { id: 'Q3_2025', name: 'Q3 2025', start: '2025-07-01', end: '2025-09-30' },
  { id: 'ANNUAL_2025', name: 'Annual 2025', start: '2025-01-01', end: '2025-12-31' },
];

const CORE_COMPETENCIES = [
  { id: 'quality', name: 'Quality of Work', weight: 10 },
  { id: 'productivity', name: 'Productivity', weight: 10 },
  { id: 'technical', name: 'Technical Skills', weight: 10 },
  { id: 'problem_solving', name: 'Problem Solving', weight: 10 },
];

const BEHAVIORAL_COMPETENCIES = [
  { id: 'teamwork', name: 'Teamwork & Collaboration', weight: 8 },
  { id: 'communication', name: 'Communication', weight: 8 },
  { id: 'initiative', name: 'Initiative', weight: 7 },
  { id: 'adaptability', name: 'Adaptability', weight: 7 },
];

const generatePerformanceReviews = () => {
  return DUMMY_EMPLOYEES.map(emp => {
    const coreScore = 3.5 + Math.random() * 1.5;
    const behavioralScore = 3.5 + Math.random() * 1.5;
    const goalScore = 3.0 + Math.random() * 2.0;
    const overall = (coreScore * 0.4 + behavioralScore * 0.3 + goalScore * 0.3);
    
    const status = Math.random() > 0.7 ? 'COMPLETED' : Math.random() > 0.4 ? 'IN_PROGRESS' : 'PENDING';
    
    return {
      review_id: `REV-${emp.employee_id.padStart(3, '0')}-Q126`,
      employee_id: emp.employee_id,
      employee_name: emp.name,
      position: emp.position,
      department: emp.department,
      period: 'Q1_2026',
      core_score: parseFloat(coreScore.toFixed(1)),
      behavioral_score: parseFloat(behavioralScore.toFixed(1)),
      goal_score: parseFloat(goalScore.toFixed(1)),
      overall_score: parseFloat(overall.toFixed(1)),
      status: status,
      self_assessment_submitted: status !== 'PENDING',
      manager_assessment_submitted: status === 'COMPLETED',
      review_date: status === 'COMPLETED' ? '2026-04-15' : null,
      next_review_date: '2026-07-15',
    };
  });
};

const DUMMY_REVIEWS = generatePerformanceReviews();

const RATING_LABELS: Record<string, string> = {
  '5': 'Outstanding',
  '4': 'Exceeds Expectations',
  '3': 'Meets Expectations',
  '2': 'Needs Improvement',
  '1': 'Unsatisfactory',
};

const RATING_COLORS: Record<string, string> = {
  '5': 'text-green-500 bg-green-500/10 border-green-500/30',
  '4': 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  '3': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  '2': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  '1': 'text-red-500 bg-red-500/10 border-red-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
  IN_PROGRESS: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  COMPLETED: 'text-green-500 bg-green-500/10 border-green-500/30',
};

const getRatingStars = (score: number) => {
  const fullStars = Math.floor(score);
  const hasHalf = score % 1 >= 0.5;
  return { fullStars, hasHalf };
};

const getRatingLabel = (score: number) => {
  if (score >= 4.5) return 'Outstanding';
  if (score >= 3.5) return 'Exceeds Expectations';
  if (score >= 2.5) return 'Meets Expectations';
  if (score >= 1.5) return 'Needs Improvement';
  return 'Unsatisfactory';
};

export default function PerformanceReviewPage() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MY_REVIEW' | 'TEAM_REVIEWS' | 'REPORTS'>('DASHBOARD');
  const [selectedPeriod, setSelectedPeriod] = useState('Q1_2026');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReviews = DUMMY_REVIEWS.filter(review => {
    const periodMatch = review.period === selectedPeriod;
    const statusMatch = statusFilter === 'ALL' || review.status === statusFilter;
    const searchMatch = review.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
    return periodMatch && statusMatch && searchMatch;
  });

  // Calculate stats
  const totalEmployees = DUMMY_EMPLOYEES.length;
  const completedReviews = DUMMY_REVIEWS.filter(r => r.status === 'COMPLETED').length;
  const inProgressReviews = DUMMY_REVIEWS.filter(r => r.status === 'IN_PROGRESS').length;
  const pendingReviews = DUMMY_REVIEWS.filter(r => r.status === 'PENDING').length;
  const averageRating = DUMMY_REVIEWS.reduce((sum, r) => sum + r.overall_score, 0) / DUMMY_REVIEWS.length;

  // Rating distribution
  const ratingDistribution = {
    outstanding: DUMMY_REVIEWS.filter(r => r.overall_score >= 4.5).length,
    exceeds: DUMMY_REVIEWS.filter(r => r.overall_score >= 3.5 && r.overall_score < 4.5).length,
    meets: DUMMY_REVIEWS.filter(r => r.overall_score >= 2.5 && r.overall_score < 3.5).length,
    needs_improvement: DUMMY_REVIEWS.filter(r => r.overall_score >= 1.5 && r.overall_score < 2.5).length,
    unsatisfactory: DUMMY_REVIEWS.filter(r => r.overall_score < 1.5).length,
  };

  // High performers
  const highPerformers = [...DUMMY_REVIEWS]
    .filter(r => r.overall_score >= 4.0)
    .sort((a, b) => b.overall_score - a.overall_score)
    .slice(0, 5);

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Performance Review</h1>
                <p className="text-sm md:text-base text-wit-muted">Employee performance tracking & development</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                >
                  {REVIEW_PERIODS.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Total</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{totalEmployees}</p>
            </div>

            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs text-green-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{completedReviews}</p>
            </div>

            <div className="glass border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-blue-500">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{inProgressReviews}</p>
            </div>

            <div className="glass border border-gray-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <span className="text-xs text-gray-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-gray-500">{pendingReviews}</p>
            </div>

            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-wit-muted" />
                <span className="text-xs text-wit-muted">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-wit-text">{averageRating.toFixed(1)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass border border-wit-border rounded-xl p-2 mb-6">
            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('MY_REVIEW')}
                className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'MY_REVIEW'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My Review</span>
              </button>
              <button
                onClick={() => setActiveTab('TEAM_REVIEWS')}
                className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'TEAM_REVIEWS'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('REPORTS')}
                className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'REPORTS'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text hover:bg-wit-card'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Reports</span>
              </button>
            </div>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* Rating Distribution */}
              <div className="glass border border-wit-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-wit-text mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Outstanding (4.5-5.0)', count: ratingDistribution.outstanding, color: 'bg-green-500', min: 4.5 },
                    { label: 'Exceeds Expectations (3.5-4.4)', count: ratingDistribution.exceeds, color: 'bg-blue-500', min: 3.5 },
                    { label: 'Meets Expectations (2.5-3.4)', count: ratingDistribution.meets, color: 'bg-yellow-500', min: 2.5 },
                    { label: 'Needs Improvement (1.5-2.4)', count: ratingDistribution.needs_improvement, color: 'bg-orange-500', min: 1.5 },
                    { label: 'Unsatisfactory (1.0-1.4)', count: ratingDistribution.unsatisfactory, color: 'bg-red-500', min: 1.0 },
                  ].map((rating) => (
                    <div key={rating.label} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${rating.color}`} />
                      <span className="text-sm text-wit-text w-48">{rating.label}</span>
                      <div className="flex-1 bg-wit-card rounded-full h-4">
                        <div
                          className={`${rating.color} h-4 rounded-full transition-all`}
                          style={{ width: `${(rating.count / totalEmployees) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-wit-text w-12 text-right">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* High Performers */}
              <div className="glass border border-wit-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-wit-text">Top Performers</h3>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                  {highPerformers.map((review, index) => (
                    <div key={review.review_id} className="flex items-center justify-between p-4 bg-wit-card/50 rounded-lg border border-wit-border/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-500/20 text-gray-500' :
                          index === 2 ? 'bg-orange-500/20 text-orange-500' :
                          'bg-wit-red/20 text-wit-red'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div>
                          <div className="font-medium text-wit-text">{review.employee_name}</div>
                          <div className="text-xs text-wit-muted">{review.position} • {review.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-wit-text">{review.overall_score}</div>
                          <div className="text-xs text-wit-muted">{getRatingLabel(review.overall_score)}</div>
                        </div>
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MY REVIEW TAB */}
          {activeTab === 'MY_REVIEW' && (
            <div className="space-y-6">
              {/* Current Review */}
              <div className="glass border border-wit-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-wit-text">Current Review - Q1 2026</h3>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full border border-blue-500/30">
                    IN PROGRESS
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[
                    { step: 'Self-Assessment', status: 'completed', icon: CheckCircle },
                    { step: 'Manager Review', status: 'pending', icon: Clock },
                    { step: 'HR Calibration', status: 'pending', icon: Clock },
                    { step: 'Review Meeting', status: 'pending', icon: Clock },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex items-center">
                        <div className={`flex items-center space-x-2 ${
                          item.status === 'completed' ? 'text-green-500' : 'text-wit-muted'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            item.status === 'completed' ? 'border-green-500 bg-green-500/10' : 'border-wit-muted'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs hidden md:block">{item.step}</span>
                        </div>
                        {index < 3 && (
                          <div className={`w-12 h-0.5 mx-2 ${
                            item.status === 'completed' ? 'bg-green-500' : 'bg-wit-card'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Competency Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-wit-card/50 rounded-lg p-4 border border-wit-border/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-wit-text">Core Competencies</span>
                    </div>
                    <div className="text-3xl font-bold text-wit-text mb-1">4.5</div>
                    <div className="text-xs text-wit-muted">Weight: 40%</div>
                    <div className="mt-2 bg-wit-card rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div className="bg-wit-card/50 rounded-lg p-4 border border-wit-border/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-medium text-wit-text">Behavioral</span>
                    </div>
                    <div className="text-3xl font-bold text-wit-text mb-1">4.0</div>
                    <div className="text-xs text-wit-muted">Weight: 30%</div>
                    <div className="mt-2 bg-wit-card rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>

                  <div className="bg-wit-card/50 rounded-lg p-4 border border-wit-border/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-wit-text">Goal Achievement</span>
                    </div>
                    <div className="text-3xl font-bold text-wit-text mb-1">4.0</div>
                    <div className="text-xs text-wit-muted">Weight: 30%</div>
                    <div className="mt-2 bg-wit-card rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="bg-gradient-to-r from-wit-red/10 to-wit-red/5 rounded-lg p-6 border border-wit-red/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-wit-muted mb-2">Overall Performance Score</div>
                      <div className="text-4xl font-bold text-wit-text mb-2">4.2 / 5.0</div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-500 text-sm font-medium rounded-full border border-blue-500/30">
                        <Star className="w-4 h-4 fill-blue-500" />
                        <span>Exceeds Expectations</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 ${
                            star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-wit-card'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 mt-6">
                  <button className="btn-primary flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>View Full Review</span>
                  </button>
                  <button className="px-6 py-3 text-sm font-medium text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all">
                    Set Q2 Goals
                  </button>
                </div>
              </div>

              {/* Past Reviews */}
              <div className="glass border border-wit-border rounded-xl p-6">
                <h3 className="text-lg font-bold text-wit-text mb-4">Past Reviews</h3>
                <div className="space-y-3">
                  {[
                    { period: 'Q4 2025', score: 4.0, label: 'Exceeds Expectations' },
                    { period: 'Q3 2025', score: 3.8, label: 'Meets Expectations' },
                    { period: 'Q2 2025', score: 3.5, label: 'Meets Expectations' },
                  ].map((review) => (
                    <div key={review.period} className="flex items-center justify-between p-4 bg-wit-card/50 rounded-lg border border-wit-border/50">
                      <div>
                        <div className="font-medium text-wit-text">{review.period}</div>
                        <div className="text-xs text-wit-muted">{review.label}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-wit-text">{review.score}</span>
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEAM REVIEWS TAB */}
          {activeTab === 'TEAM_REVIEWS' && (
            <div className="glass border border-wit-border rounded-xl overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b border-wit-border">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
                    <input
                      type="text"
                      placeholder="Search employee name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-dark w-full pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-wit-card border border-wit-border rounded-lg text-wit-text text-sm focus:outline-none focus:border-wit-red"
                  >
                    <option value="ALL">All Status</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PENDING">Pending</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-wit-red text-white rounded-lg text-sm hover:bg-wit-red/80 transition-all">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-dark">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Core (40%)</th>
                      <th>Behavioral (30%)</th>
                      <th>Goals (30%)</th>
                      <th>Overall</th>
                      <th>Rating</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map((review) => {
                      const { fullStars, hasHalf } = getRatingStars(review.overall_score);
                      return (
                        <tr key={review.review_id} className="hover:bg-wit-red/5 transition-colors">
                          <td>
                            <div className="font-medium text-wit-text">{review.employee_name}</div>
                          </td>
                          <td>
                            <div className="text-wit-text text-sm">{review.position}</div>
                          </td>
                          <td>
                            <span className="px-2 py-1 bg-wit-card text-wit-muted text-xs rounded">
                              {review.department}
                            </span>
                          </td>
                          <td>
                            <div className="text-wit-text font-medium">{review.core_score}</div>
                          </td>
                          <td>
                            <div className="text-wit-text font-medium">{review.behavioral_score}</div>
                          </td>
                          <td>
                            <div className="text-wit-text font-medium">{review.goal_score}</div>
                          </td>
                          <td>
                            <div className="text-lg font-bold text-wit-text">{review.overall_score}</div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= fullStars ? 'text-yellow-500 fill-yellow-500' : 'text-wit-card'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[review.status]}`}>
                              {review.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                              {review.status === 'IN_PROGRESS' && <Clock className="w-3 h-3" />}
                              {review.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                              <span>{review.status.replace('_', ' ')}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'REPORTS' && (
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-wit-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-wit-text mb-2">Performance Reports & Analytics</h3>
                <p className="text-wit-muted mb-4">Detailed analytics and insights</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
                  <button className="p-4 bg-wit-card rounded-lg border border-wit-border hover:border-wit-red transition-all">
                    <FileText className="w-8 h-8 text-wit-red mx-auto mb-2" />
                    <div className="font-medium text-wit-text">Performance Summary</div>
                    <div className="text-xs text-wit-muted">Company-wide overview</div>
                  </button>
                  <button className="p-4 bg-wit-card rounded-lg border border-wit-border hover:border-wit-red transition-all">
                    <TrendingUp className="w-8 h-8 text-wit-red mx-auto mb-2" />
                    <div className="font-medium text-wit-text">Rating Trends</div>
                    <div className="text-xs text-wit-muted">Historical analysis</div>
                  </button>
                  <button className="p-4 bg-wit-card rounded-lg border border-wit-border hover:border-wit-red transition-all">
                    <Users className="w-8 h-8 text-wit-red mx-auto mb-2" />
                    <div className="font-medium text-wit-text">Department Comparison</div>
                    <div className="text-xs text-wit-muted">Team performance</div>
                  </button>
                  <button className="p-4 bg-wit-card rounded-lg border border-wit-border hover:border-wit-red transition-all">
                    <BookOpen className="w-8 h-8 text-wit-red mx-auto mb-2" />
                    <div className="font-medium text-wit-text">Development Plans</div>
                    <div className="text-xs text-wit-muted">Growth tracking</div>
                  </button>
                </div>
                <p className="text-sm text-wit-muted mt-6">Coming soon in next update!</p>
              </div>
            </div>
          )}

          {/* Competency Framework Info */}
          <div className="glass border border-wit-border rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-wit-text mb-4">Performance Review Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <h4 className="font-bold text-wit-text">Core Competencies (40%)</h4>
                </div>
                <ul className="space-y-2 text-sm text-wit-muted">
                  {CORE_COMPETENCIES.map((c) => (
                    <li key={c.id} className="flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className="text-wit-text font-medium">{c.weight}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h4 className="font-bold text-wit-text">Behavioral (30%)</h4>
                </div>
                <ul className="space-y-2 text-sm text-wit-muted">
                  {BEHAVIORAL_COMPETENCIES.map((c) => (
                    <li key={c.id} className="flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className="text-wit-text font-medium">{c.weight}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <h4 className="font-bold text-wit-text">Goal Achievement (30%)</h4>
                </div>
                <ul className="space-y-2 text-sm text-wit-muted">
                  <li className="flex items-center justify-between">
                    <span>Quarterly OKRs</span>
                    <span className="text-wit-text font-medium">15%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Project Delivery</span>
                    <span className="text-wit-text font-medium">10%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="text-wit-text font-medium">5%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
