'use client';

import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import { User, Database, Bell, Shield, Palette, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const settingsCategories = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and avatar',
      href: '/settings/profile',
      status: 'Available',
    },
    {
      icon: Palette,
      title: 'Application',
      description: 'Theme, notifications, and regional settings',
      href: '/settings/app',
      status: 'Available',
    },
    {
      icon: Database,
      title: 'Database',
      description: 'Supabase connection and data management',
      href: '/settings/database',
      status: 'Available',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Email alerts and follow-up reminders',
      href: '#',
      status: 'Coming Soon',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'API keys, access control, and audit logs',
      href: '#',
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-wit-text mb-2">Settings</h1>
            <p className="text-wit-muted">Configure your dashboard settings</p>
          </div>

          {/* Current User Info */}
          <div className="mac-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-wit-red rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/wit-logo.png" alt="WIT" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-wit-text">Ilham Kurniawan</h2>
                  <p className="text-wit-muted">Managing Director</p>
                  <p className="text-wit-muted text-sm">ikurniawann@gmail.com</p>
                </div>
              </div>
              <Link href="/settings/profile" className="mac-button" style={{ background: "linear-gradient(135deg, rgba(60, 60, 60, 0.9) 0%, rgba(60, 60, 60, 0.7) 100%)" }} flex items-center space-x-2">
                <span>Edit Profile</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingsCategories.map((category, index) => {
              const Icon = category.icon;
              const isAvailable = category.status === 'Available';
              
              return (
                <Link
                  key={index}
                  href={category.href}
                  className={`mac-card p-6 transition-all ${
                    isAvailable 
                      ? 'hover:border-wit-red hover:bg-wit-red/5 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-wit-red/10 rounded-lg">
                      <Icon className="w-6 h-6 text-wit-red" />
                    </div>
                    <span className={`badge ${isAvailable ? 'badge-done' : 'badge-cancelled'}`}>
                      {category.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-wit-text mb-2">
                    {category.title}
                  </h3>
                  <p className="text-wit-muted text-sm mb-4">
                    {category.description}
                  </p>
                  {isAvailable && (
                    <div className="flex items-center text-wit-red text-sm font-medium">
                      <span>Open</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* System Info */}
          <div className="mac-card p-6 mt-6">
            <h2 className="text-xl font-bold text-wit-text mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div>
                <p className="text-wit-muted text-sm mb-1">Database</p>
                <p className="text-wit-text font-medium">PostgreSQL</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Region</p>
                <p className="text-wit-text font-medium">Singapore</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Total Leads</p>
                <p className="text-wit-text font-medium">14</p>
              </div>
              <div>
                <p className="text-wit-muted text-sm mb-1">Total Clients</p>
                <p className="text-wit-text font-medium">4</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
