'use client';

import Sidebar from '../../components/Sidebar';
import { Settings, User, Database, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const settingsCategories = [
    {
      icon: User,
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      status: 'Coming Soon',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Backup, restore, and data export settings',
      status: 'Coming Soon',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Email alerts, follow-up reminders, and notifications',
      status: 'Coming Soon',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'API keys, access control, and audit logs',
      status: 'Coming Soon',
    },
    {
      icon: Palette,
      title: 'Customization',
      description: 'Branding, themes, and UI preferences',
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
            <h1 className="text-3xl font-bold text-wit-text mb-2">Settings</h1>
            <p className="text-wit-muted">Configure your dashboard settings</p>
          </div>

          {/* Current User Info */}
          <div className="glass border border-wit-border rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-wit-red rounded-full flex items-center justify-center overflow-hidden">
                <img src="/wit-logo.png" alt="WIT" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-wit-text">Ilham Kurniawan</h2>
                <p className="text-wit-muted">Administrator</p>
                <p className="text-wit-muted text-sm">ikurniawann@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingsCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="glass border border-wit-border rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-wit-red/10 rounded-lg">
                      <Icon className="w-6 h-6 text-wit-red" />
                    </div>
                    <span className="badge badge-cancelled">{category.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-wit-text mb-2">
                    {category.title}
                  </h3>
                  <p className="text-wit-muted text-sm mb-4">
                    {category.description}
                  </p>
                  <button className="btn-secondary w-full" disabled>
                    Coming Soon
                  </button>
                </div>
              );
            })}
          </div>

          {/* System Info */}
          <div className="glass border border-wit-border rounded-xl p-6 mt-6">
            <h2 className="text-xl font-bold text-wit-text mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-wit-muted text-sm mb-1">Version</p>
                <p className="text-wit-text font-medium">v1.0.0</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Last Updated</p>
                <p className="text-wit-text font-medium">March 27, 2026</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Backend</p>
                <p className="text-wit-text font-medium">Supabase</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Framework</p>
                <p className="text-wit-text font-medium">Next.js 14</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
