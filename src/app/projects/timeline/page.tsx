'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// DUMMY DATA - Will be replaced with real API later
const DUMMY_PROJECTS = [
  {
    project_id: '1',
    project_name: 'Rental Management System',
    start_date: '2026-03-01',
    end_date: '2026-04-30',
    progress: 45,
    status: 'Active',
    category: 'Software Development',
  },
  {
    project_id: '2',
    project_name: 'Procurement GNSS Chipset',
    start_date: '2026-03-15',
    end_date: '2026-05-15',
    progress: 20,
    status: 'Active',
    category: 'Procurement',
  },
  {
    project_id: '3',
    project_name: 'Mobile Force App',
    start_date: '2026-04-01',
    end_date: '2026-06-30',
    progress: 0,
    status: 'Planning',
    category: 'Mobile Development',
  },
  {
    project_id: '4',
    project_name: 'BNI Rise x KNPI',
    start_date: '2026-03-10',
    end_date: '2026-04-15',
    progress: 60,
    status: 'Active',
    category: 'Integration',
  },
  {
    project_id: '5',
    project_name: 'ION Network - 10 Projects',
    start_date: '2026-02-15',
    end_date: '2026-05-30',
    progress: 75,
    status: 'Active',
    category: 'System Integration',
  },
  {
    project_id: '6',
    project_name: 'Website Redesign',
    start_date: '2026-03-20',
    end_date: '2026-04-10',
    progress: 30,
    status: 'Active',
    category: 'Web Development',
  },
  {
    project_id: '7',
    project_name: 'Database Migration',
    start_date: '2026-04-05',
    end_date: '2026-04-25',
    progress: 0,
    status: 'On Hold',
    category: 'Database',
  },
  {
    project_id: '8',
    project_name: 'Training Program Q2',
    start_date: '2026-05-01',
    end_date: '2026-05-31',
    progress: 0,
    status: 'Planning',
    category: 'Training',
  },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function ProjectTimelinePage() {
  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('week');
  const [currentMonth, setCurrentMonth] = useState(2); // March 2026
  const [currentYear, setCurrentYear] = useState(2026);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Planning': 'bg-blue-500',
      'Active': 'bg-green-500',
      'On Hold': 'bg-yellow-500',
      'Completed': 'bg-gray-500',
      'Cancelled': 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getPositionFromDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    
    // Calculate position from current month start
    const daysFromStart = (month - currentMonth) * 30 + day;
    return daysFromStart;
  };

  const getDurationInDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderTimelineGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const gridCells = [];

    for (let i = 0; i < daysInMonth; i++) {
      const isToday = i === new Date().getDate() && currentMonth === new Date().getMonth();
      const isWeekend = (i % 7 === 0 || i % 7 === 6);
      
      gridCells.push(
        <div
          key={i}
          className={`min-w-[40px] h-full border-r border-wit-border/30 ${
            isToday ? 'bg-wit-red/10' : isWeekend ? 'bg-wit-card/30' : ''
          }`}
        >
          <div className="text-xs text-wit-muted p-2 text-center">
            {i + 1}
          </div>
        </div>
      );
    }

    return gridCells;
  };

  const renderProjectBar = (project: any) => {
    const start = getPositionFromDate(project.start_date);
    const duration = getDurationInDays(project.start_date, project.end_date);
    const progress = project.progress;

    // Only show if within current month view
    if (start < -30 || start > 60) return null;

    const left = Math.max(0, start * 40);
    const width = Math.max(40, duration * 40);

    return (
      <div
        key={project.project_id}
        className="relative h-12 mb-2"
        style={{ minWidth: `${daysInMonth * 40}px` }}
      >
        <div
          className={`absolute h-8 rounded-lg ${getStatusColor(project.status)} bg-opacity-80 cursor-pointer hover:opacity-100 transition-opacity`}
          style={{
            left: `${left}px`,
            width: `${width}px`,
            top: '8px',
          }}
          title={`${project.project_name}\n${project.start_date} → ${project.end_date}\nProgress: ${progress}%`}
        >
          <div className="h-full flex items-center px-2 overflow-hidden">
            <span className="text-xs text-white font-medium truncate">
              {project.project_name}
            </span>
          </div>
          
          {/* Progress overlay */}
          <div
            className={`absolute top-0 left-0 h-full ${getProgressColor(progress)} rounded-lg opacity-50`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Project Timeline</h1>
            <p className="text-sm md:text-base text-wit-muted">Gantt chart view of all projects</p>
          </div>

          {/* Controls */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Month Navigation */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="p-2 hover:bg-wit-card rounded-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-wit-text" />
                </button>
                
                <div className="flex items-center space-x-2 px-4 py-2 bg-wit-card rounded-lg">
                  <Calendar className="w-5 h-5 text-wit-red" />
                  <span className="font-medium text-wit-text">
                    {MONTHS[currentMonth]} {currentYear}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="p-2 hover:bg-wit-card rounded-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-wit-text" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoom('day')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    zoom === 'day' ? 'bg-wit-red text-white' : 'text-wit-muted hover:bg-wit-card'
                  }`}
                >
                  <ZoomIn className="w-4 h-4 inline mr-1" />
                  Day
                </button>
                <button
                  onClick={() => setZoom('week')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    zoom === 'week' ? 'bg-wit-red text-white' : 'text-wit-muted hover:bg-wit-card'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setZoom('month')}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    zoom === 'month' ? 'bg-wit-red text-white' : 'text-wit-muted hover:bg-wit-card'
                  }`}
                >
                  <ZoomOut className="w-4 h-4 inline mr-1" />
                  Month
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="glass border border-wit-border rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-wit-text mb-3">Project Status</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { status: 'Planning', color: 'bg-blue-500' },
                { status: 'Active', color: 'bg-green-500' },
                { status: 'On Hold', color: 'bg-yellow-500' },
                { status: 'Completed', color: 'bg-gray-500' },
                { status: 'Cancelled', color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.status} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="text-sm text-wit-muted">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="glass border border-wit-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${daysInMonth * 40 + 300}px` }}>
                {/* Header */}
                <div className="flex border-b border-wit-border bg-wit-card/50 sticky top-0">
                  <div className="w-[280px] flex-shrink-0 p-4 border-r border-wit-border">
                    <span className="font-medium text-wit-text">Project Name</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex">
                      {Array.from({ length: daysInMonth }, (_, i) => (
                        <div
                          key={i}
                          className="min-w-[40px] text-center text-xs text-wit-muted py-2 border-r border-wit-border/30"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  {DUMMY_PROJECTS.map((project) => (
                    <div
                      key={project.project_id}
                      className="flex border-b border-wit-border/30 hover:bg-wit-red/5 transition-colors"
                    >
                      <div className="w-[280px] flex-shrink-0 p-4 border-r border-wit-border">
                        <div className="font-medium text-wit-text mb-1">{project.project_name}</div>
                        <div className="text-xs text-wit-muted">{project.category}</div>
                        <div className="text-xs text-wit-muted mt-1">
                          {project.start_date} → {project.end_date}
                        </div>
                      </div>
                      <div className="flex-1 py-2">
                        {renderProjectBar(project)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="glass border border-wit-border rounded-xl p-4">
              <div className="text-sm text-wit-muted mb-1">Total Projects</div>
              <div className="text-2xl font-bold text-wit-text">{DUMMY_PROJECTS.length}</div>
            </div>
            <div className="glass border border-green-500/30 rounded-xl p-4">
              <div className="text-sm text-green-500 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-500">
                {DUMMY_PROJECTS.filter(p => p.status === 'Active').length}
              </div>
            </div>
            <div className="glass border border-blue-500/30 rounded-xl p-4">
              <div className="text-sm text-blue-500 mb-1">Planning</div>
              <div className="text-2xl font-bold text-blue-500">
                {DUMMY_PROJECTS.filter(p => p.status === 'Planning').length}
              </div>
            </div>
            <div className="glass border border-yellow-500/30 rounded-xl p-4">
              <div className="text-sm text-yellow-500 mb-1">On Hold</div>
              <div className="text-2xl font-bold text-yellow-500">
                {DUMMY_PROJECTS.filter(p => p.status === 'On Hold').length}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
