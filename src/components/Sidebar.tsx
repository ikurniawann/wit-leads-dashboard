'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Main navigation
  const mainNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Leads', icon: Briefcase },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/employees', label: 'Employees', icon: UserCheck },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  // Settings (bottom)
  const settingsItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 p-3 bg-wit-red text-white rounded-lg shadow-lg z-[100]"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[90] md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-wit-darker border-r border-wit-border z-[95] transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block w-[280px] md:w-72`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-wit-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-wit-red/10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/wit-logo.png" alt="WIT" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">WIT.ID</h1>
              <p className="text-xs text-wit-muted">Leads Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-card rounded-lg transition-all md:block hidden"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-wit-red/10 text-wit-red'
                    : 'text-wit-muted hover:text-wit-red hover:bg-wit-card'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Items (Settings) */}
        <div className="border-t border-wit-border p-3 space-y-1">
          {settingsItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-wit-muted hover:text-wit-red hover:bg-wit-card transition-all"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
