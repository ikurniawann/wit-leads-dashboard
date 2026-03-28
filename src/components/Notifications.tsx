'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, FileText, Megaphone, X, CheckCheck, AlertCircle, Info, User, Calendar, Plus, Trash2, Edit } from 'lucide-react';

// DUMMY DATA - CRUD Action Logs with PIC
const DUMMY_ACTIVITY_LOGS = [
  {
    id: '1',
    type: 'CREATE',
    entity: 'Lead',
    description: 'Created new lead: PT Maju Jaya',
    user: 'Muhamad Ilham Kurniawan',
    user_avatar: 'MK',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    type: 'UPDATE',
    entity: 'Project',
    description: 'Updated project status: Rental Management System → Active',
    user: 'Fahmi Muhammad Syaban',
    user_avatar: 'FS',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    type: 'DELETE',
    entity: 'Vendor',
    description: 'Deleted vendor: CV Test',
    user: 'Admin',
    user_avatar: 'AD',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '4',
    type: 'CREATE',
    entity: 'Employee',
    description: 'Added new employee: Siti Nurhaliza (Designer)',
    user: 'Dewi Lestari',
    user_avatar: 'DL',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '5',
    type: 'UPDATE',
    entity: 'Budget',
    description: 'Updated budget: GNSS Chipset project',
    user: 'Fitri Handayani',
    user_avatar: 'FH',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

const DUMMY_ANNOUNCEMENTS = [
  {
    id: '1',
    type: 'COMPANY',
    title: 'Office Closure - Public Holiday',
    description: 'Office will be closed on Monday, April 1st, 2026',
    from: 'Management',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    priority: 'HIGH',
    read: false,
  },
  {
    id: '2',
    type: 'HRD',
    title: 'Team Building Event Q2 2026',
    description: 'Join us for team building on April 15th at Puncak',
    from: 'HRD Department',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    priority: 'MEDIUM',
    read: false,
  },
];

const ACTIVITY_COLORS: Record<string, string> = {
  CREATE: 'text-green-500 bg-green-500/10',
  UPDATE: 'text-blue-500 bg-blue-500/10',
  DELETE: 'text-red-500 bg-red-500/10',
};

const ACTIVITY_ICONS: Record<string, any> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
};

const ANNOUNCEMENT_COLORS: Record<string, string> = {
  HIGH: 'text-red-500 bg-red-500/10 border-red-500/30',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  LOW: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
};

const timeAgo = (timestamp: string) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

interface NotificationsProps {
  onNotificationsOpen?: (isOpen: boolean) => void;
}

export default function Notifications({ onNotificationsOpen }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVITY' | 'ANNOUNCEMENTS'>('ALL');
  const [unreadCount, setUnreadCount] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onNotificationsOpen?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onNotificationsOpen]);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const filteredLogs = activeTab === 'ALL' || activeTab === 'ACTIVITY' 
    ? DUMMY_ACTIVITY_LOGS 
    : [];
  
  const filteredAnnouncements = activeTab === 'ALL' || activeTab === 'ANNOUNCEMENTS'
    ? DUMMY_ANNOUNCEMENTS 
    : [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          onNotificationsOpen?.(!isOpen);
        }}
        className="relative p-2 text-wit-muted hover:text-wit-red hover:bg-wit-card rounded-lg transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-wit-darker">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-wit-darker border border-wit-border rounded-xl shadow-2xl overflow-hidden z-[100]">
          {/* Header */}
          <div className="p-4 border-b border-wit-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-wit-text">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-1 text-xs text-wit-muted hover:text-wit-red transition-all"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-wit-muted hover:text-wit-text transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-wit-card rounded-lg p-1">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'ALL'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('ACTIVITY')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'ACTIVITY'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('ANNOUNCEMENTS')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'ANNOUNCEMENTS'
                    ? 'bg-wit-red text-white'
                    : 'text-wit-muted hover:text-wit-text'
                }`}
              >
                Announcements
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[400px]">
            {/* Activity Logs */}
            {(activeTab === 'ALL' || activeTab === 'ACTIVITY') && (
              <div>
                <div className="px-4 py-2 bg-wit-card/30">
                  <span className="text-xs font-medium text-wit-muted">ACTIVITY LOG</span>
                </div>
                {filteredLogs.length === 0 ? (
                  <div className="p-4 text-center text-wit-muted text-sm">No activity logs</div>
                ) : (
                  filteredLogs.map((log) => {
                    const Icon = ACTIVITY_ICONS[log.type];
                    return (
                      <div
                        key={log.id}
                        className="p-4 border-b border-wit-border/30 hover:bg-wit-card/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          {/* User Avatar */}
                          <div className="w-10 h-10 rounded-full bg-wit-red/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-wit-red">{log.user_avatar}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`p-1 rounded ${ACTIVITY_COLORS[log.type]}`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-medium text-wit-muted">{log.type}</span>
                            </div>
                            <p className="text-sm text-wit-text mb-1">{log.description}</p>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="font-medium text-wit-red">{log.user}</span>
                              <span className="text-wit-muted">•</span>
                              <span className="text-wit-muted">{timeAgo(log.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Announcements */}
            {(activeTab === 'ALL' || activeTab === 'ANNOUNCEMENTS') && (
              <div>
                <div className="px-4 py-2 bg-wit-card/30">
                  <span className="text-xs font-medium text-wit-muted">ANNOUNCEMENTS</span>
                </div>
                {filteredAnnouncements.length === 0 ? (
                  <div className="p-4 text-center text-wit-muted text-sm">No announcements</div>
                ) : (
                  filteredAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-4 border-b border-wit-border/30 hover:bg-wit-card/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-wit-card">
                          {announcement.type === 'COMPANY' ? (
                            <Megaphone className="w-4 h-4 text-wit-muted" />
                          ) : (
                            <User className="w-4 h-4 text-wit-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-wit-text">{announcement.title}</h4>
                            {!announcement.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-wit-muted line-clamp-2">{announcement.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-0.5 text-xs rounded border ${ANNOUNCEMENT_COLORS[announcement.priority]}`}>
                              {announcement.priority}
                            </span>
                            <span className="text-xs text-wit-muted">{announcement.from}</span>
                            <span className="text-xs text-wit-muted">•</span>
                            <span className="text-xs text-wit-muted">{timeAgo(announcement.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-wit-border bg-wit-card/30">
            <button className="w-full text-center text-xs text-wit-muted hover:text-wit-red transition-all">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
