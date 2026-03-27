'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Database, Server, Key, RefreshCw, Download, Upload, AlertTriangle } from 'lucide-react';

export default function DatabaseSettingsPage() {
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(true);

  const supabaseConfig = {
    url: 'https://nmcegwmrzewwgqxgbspi.supabase.co',
    projectRef: 'nmcegwmrzewwgqxgbspi',
    region: 'ap-southeast-1',
    status: 'active',
  };

  const handleTestConnection = async () => {
    setTesting(true);
    // TODO: Test actual Supabase connection
    setTimeout(() => {
      setTesting(false);
      setConnected(true);
      alert('Connection successful!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div>
          {/* Page Header - Mobile Responsive */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-wit-muted mb-2">
              <span>Settings</span>
              <span>/</span>
              <span className="text-wit-text">Database</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-wit-text mb-1 md:mb-2">Database Settings</h1>
            <p className="text-sm md:text-base text-wit-muted">Manage Supabase connection and data</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Connection Status */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${connected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <Server className={`w-6 h-6 ${connected ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-wit-text">Connection Status</h3>
                    <p className="text-wit-muted text-sm">Supabase PostgreSQL</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${connected ? 'badge-done' : 'badge-cancelled'}`}>
                    {connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-wit-card rounded-lg">
                  <p className="text-wit-muted text-xs mb-1">Project URL</p>
                  <p className="text-wit-text text-sm font-mono truncate">{supabaseConfig.url}</p>
                </div>
                <div className="p-4 bg-wit-card rounded-lg">
                  <p className="text-wit-muted text-xs mb-1">Project Ref</p>
                  <p className="text-wit-text text-sm font-mono">{supabaseConfig.projectRef}</p>
                </div>
                <div className="p-4 bg-wit-card rounded-lg">
                  <p className="text-wit-muted text-xs mb-1">Region</p>
                  <p className="text-wit-text text-sm">Singapore (ap-southeast-1)</p>
                </div>
              </div>

              <button
                onClick={handleTestConnection}
                className="btn-primary flex items-center space-x-2"
                disabled={testing}
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {/* Database Tables */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-wit-text mb-6">Database Tables</h3>

              <div className="overflow-x-auto">
                <table className="table-dark w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">Table Name</th>
                      <th className="text-left py-3 px-4">Rows</th>
                      <th className="text-left py-3 px-4">Size</th>
                      <th className="text-left py-3 px-4">Last Updated</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-wit-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-wit-red" />
                          <span className="font-medium text-wit-text">quotations</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-wit-muted">14</td>
                      <td className="py-3 px-4 text-wit-muted">24 KB</td>
                      <td className="py-3 px-4 text-wit-muted">Mar 27, 2026</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-done">Active</span>
                      </td>
                    </tr>
                    <tr className="border-t border-wit-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-wit-red" />
                          <span className="font-medium text-wit-text">clients</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-wit-muted">4</td>
                      <td className="py-3 px-4 text-wit-muted">12 KB</td>
                      <td className="py-3 px-4 text-wit-muted">Mar 27, 2026</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-done">Active</span>
                      </td>
                    </tr>
                    <tr className="border-t border-wit-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-wit-red" />
                          <span className="font-medium text-wit-text">employees</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-wit-muted">0</td>
                      <td className="py-3 px-4 text-wit-muted">8 KB</td>
                      <td className="py-3 px-4 text-wit-muted">Mar 27, 2026</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-done">Active</span>
                      </td>
                    </tr>
                    <tr className="border-t border-wit-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-wit-red" />
                          <span className="font-medium text-wit-text">followup_logs</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-wit-muted">0</td>
                      <td className="py-3 px-4 text-wit-muted">8 KB</td>
                      <td className="py-3 px-4 text-wit-muted">Mar 26, 2026</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-done">Active</span>
                      </td>
                    </tr>
                    <tr className="border-t border-wit-border">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-wit-red" />
                          <span className="font-medium text-wit-text">lead_status</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-wit-muted">5</td>
                      <td className="py-3 px-4 text-wit-muted">8 KB</td>
                      <td className="py-3 px-4 text-wit-muted">Mar 26, 2026</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-done">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Keys */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <Key className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">API Keys</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Supabase URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={supabaseConfig.url}
                      readOnly
                      className="input-dark w-full font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-wit-muted mb-2">
                    Supabase Anon Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      readOnly
                      className="input-dark w-full font-mono text-sm"
                    />
                  </div>
                  <p className="text-wit-muted text-xs mt-2">
                    ⚠️ Never share your API keys publicly
                  </p>
                </div>
              </div>
            </div>

            {/* Data Operations */}
            <div className="glass border border-wit-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-wit-red/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-wit-red" />
                </div>
                <h3 className="text-xl font-bold text-wit-text">Data Operations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export All Data</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Import Data</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Tables</span>
                </button>
                <button className="btn-danger flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Delete All Data</span>
                </button>
              </div>

              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">
                  ⚠️ <strong>Warning:</strong> Deleting all data is irreversible. Make sure you have a backup before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
