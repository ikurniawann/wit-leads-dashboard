'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  User
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'status_change' | 'note' | 'email' | 'call' | 'meeting' | 'file' | 'system';
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  leadId: string;
}

export default function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch activities from API
    // For now, use mock data
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          type: 'system',
          title: 'Lead created',
          description: 'Lead was created in the system',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'System',
        },
        {
          id: '2',
          type: 'status_change',
          title: 'Status changed to Approved',
          description: 'Lead moved from New to Approved stage',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Admin',
        },
        {
          id: '3',
          type: 'note',
          title: 'Note added',
          description: 'Customer interested in Q2 implementation',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Sales Team',
        },
        {
          id: '4',
          type: 'email',
          title: 'Email sent',
          description: 'Quotation sent to customer',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Sales Team',
        },
        {
          id: '5',
          type: 'call',
          title: 'Call completed',
          description: 'Discussed pricing and implementation timeline',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user: 'Sales Team',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [leadId]);

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      status_change: CheckCircle,
      note: MessageSquare,
      email: Mail,
      call: Phone,
      meeting: Calendar,
      file: FileText,
      system: AlertCircle,
    };
    return icons[type] || Clock;
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      status_change: 'bg-green-500/10 text-green-500',
      note: 'bg-blue-500/10 text-blue-500',
      email: 'bg-purple-500/10 text-purple-500',
      call: 'bg-yellow-500/10 text-yellow-500',
      meeting: 'bg-pink-500/10 text-pink-500',
      file: 'bg-gray-500/10 text-gray-500',
      system: 'bg-wit-red/10 text-wit-red',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Loading activity timeline...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-wit-muted mx-auto mb-4" />
        <p className="text-wit-text font-medium mb-2">No activity yet</p>
        <p className="text-wit-muted text-sm">Activity will appear here as the lead progresses</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-wit-border" />

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div key={activity.id} className="relative flex items-start space-x-4">
                {/* Icon */}
                <div className={`relative z-10 p-3 rounded-lg ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-wit-text">{activity.title}</h4>
                    <span className="text-xs text-wit-muted">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                  
                  {activity.description && (
                    <p className="text-sm text-wit-muted mb-2">{activity.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-xs text-wit-muted">
                    {activity.user && (
                      <>
                        <User className="w-3 h-3" />
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>

                  {/* Metadata (if any) */}
                  {activity.metadata && (
                    <div className="mt-2 p-3 bg-wit-card rounded-lg border border-wit-border">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-wit-muted capitalize">{key}:</span>
                          <span className="text-wit-text font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Activity Button (Future) */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-wit-red/10 text-wit-red rounded-lg hover:bg-wit-red/20 transition-all text-sm font-medium">
          + Add Activity
        </button>
      </div>
    </div>
  );
}
