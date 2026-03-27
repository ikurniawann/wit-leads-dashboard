'use client';

import { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { Palette, Bell, Globe, Shield, Database, Download, Upload, Trash2, Save } from 'lucide-react';

export default function AppSettingsPage() {
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    // Appearance
    theme: 'dark',
    primaryColor: '#c00000',
    sidebarCollapsed: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    followupReminders: true,
    
    // Regional
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: 'IDR',
    
    // Data
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to Supabase
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="ml-72 pt-16 pb-12">
        <div className="px-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-wit-muted mb-2">
              <span>Settings</span>
              <span>/</span>
              <span className="text-wit-text">Application</span>
            </div>
            <h1 className="text-3xl font-bold text-wit-text mb-2">Application Settings</h1>
            <p className="text-wit-muted">Configure your dashboard preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appearance */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Palette className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">Appearance</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="input-dark flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-wit-muted">Collapsed Sidebar</label>
                  <button
                    onClick={() => setSettings({ ...settings, sidebarCollapsed: !settings.sidebarCollapsed })}
                    className={`toggle ${settings.sidebarCollapsed ? 'toggle-on' : 'toggle-off'}`}
                  >
                    <div className={`toggle-dot ${settings.sidebarCollapsed ? 'toggle-dot-on' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Bell className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">Notifications</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wit-text text-sm font-medium">Email Notifications</p>
                    <p className="text-wit-muted text-xs">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    className={`toggle ${settings.emailNotifications ? 'toggle-on' : 'toggle-off'}`}
                  >
                    <div className={`toggle-dot ${settings.emailNotifications ? 'toggle-dot-on' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wit-text text-sm font-medium">Push Notifications</p>
                    <p className="text-wit-muted text-xs">Browser push notifications</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                    className={`toggle ${settings.pushNotifications ? 'toggle-on' : 'toggle-off'}`}
                  >
                    <div className={`toggle-dot ${settings.pushNotifications ? 'toggle-dot-on' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wit-text text-sm font-medium">Follow-up Reminders</p>
                    <p className="text-wit-muted text-xs">Reminders for pending follow-ups</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, followupReminders: !settings.followupReminders })}
                    className={`toggle ${settings.followupReminders ? 'toggle-on' : 'toggle-off'}`}
                  >
                    <div className={`toggle-dot ${settings.followupReminders ? 'toggle-dot-on' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Regional */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Globe className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">Regional & Language</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Currency Format
                  </label>
                  <select
                    value={settings.currencyFormat}
                    onChange={(e) => setSettings({ ...settings, currencyFormat: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="IDR">IDR (Rp)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Database className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">Data Management</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-wit-text text-sm font-medium">Auto Backup</p>
                    <p className="text-wit-muted text-xs">Automatically backup data</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
                    className={`toggle ${settings.autoBackup ? 'toggle-on' : 'toggle-off'}`}
                  >
                    <div className={`toggle-dot ${settings.autoBackup ? 'toggle-dot-on' : ''}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                    className="input-dark w-full"
                    disabled={!settings.autoBackup}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="pt-4 space-y-2">
                  <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Backup</span>
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Restore Backup</span>
                  </button>
                  <button className="btn-danger w-full flex items-center justify-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end mt-6">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
