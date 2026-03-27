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
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-wit-darker border-r border-wit-border z-50 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-wit-border">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-wit-red/10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/wit-logo.png" alt="WIT" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">WIT.ID</h1>
                <p className="text-xs text-wit-muted">Leads Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-wit-muted hover:text-wit-red hover:bg-wit-card rounded-lg transition-all"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Main Items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-wit-red/10 text-wit-red'
                    : 'text-wit-muted hover:text-wit-red hover:bg-wit-card'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
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
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-wit-muted hover:text-wit-red hover:bg-wit-card transition-all"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Top Bar */}
      <header
        className={`fixed top-0 right-0 h-16 border-b border-wit-border glass z-40 transition-all duration-300 ${
          collapsed ? 'left-20' : 'left-72'
        }`}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-wit-muted hover:text-wit-text">
              Home
            </Link>
            <span className="text-wit-muted">/</span>
            <span className="text-wit-text capitalize">
              {pathname === '/' ? 'Dashboard' : pathname.split('/')[1]}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* User profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-wit-border">
              <div className="w-8 h-8 bg-wit-red rounded-full flex items-center justify-center overflow-hidden">
                <img src="/wit-logo.png" alt="WIT" className="w-6 h-6 object-contain" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-wit-text">Ilham Kurniawan</p>
                <p className="text-xs text-wit-muted">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
