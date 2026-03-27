'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, Users, FileText, Calendar, Mail, 
  MessageSquare, Kanban, Notebook, Type, Languages, Lock, 
  CreditCard, Table, Boxes, MapPin, TrendingUp, Book, ShoppingCart,
  Settings, Bell, Search, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const mainNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/email', label: 'Email', icon: Mail },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/kanban', label: 'Kanban', icon: Kanban },
    { href: '/notes', label: 'Notes', icon: Notebook },
  ];

  const uiItems = [
    { label: 'Icons', icon: Boxes, href: '/icons' },
    { label: 'Typography', icon: Type, href: '/typography' },
    { label: 'Languages & RTL', icon: Languages, href: '/languages' },
  ];

  const dropdownItems = [
    { 
      label: 'Authentication', 
      icon: Lock, 
      items: ['Login', 'Register', 'Forgot Password'] 
    },
    { 
      label: 'Cards', 
      icon: CreditCard, 
      items: ['Basic Cards', 'Advanced Cards'] 
    },
    { 
      label: 'Tables', 
      icon: Table, 
      items: ['Basic Tables', 'Data Tables'] 
    },
    { 
      label: 'Components', 
      icon: Boxes, 
      items: ['Buttons', 'Forms', 'Modals'],
      badge: 76
    },
    { 
      label: 'Maps', 
      icon: MapPin, 
      items: ['Google Maps', 'Vector Maps'] 
    },
    { 
      label: 'Charts', 
      icon: TrendingUp, 
      items: ['Line Charts', 'Bar Charts', 'Area Charts'] 
    },
  ];

  const bottomItems = [
    { href: '/documentation', label: 'Documentation', icon: Book },
    { href: '/buy', label: 'Buy now', icon: ShoppingCart },
  ];

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-wit-darker border-r border-wit-border z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-wit-border">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-wit-red/10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/wit-logo.png" alt="WIT" className="w-10 h-10 object-contain" />
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

          {/* UI Items */}
          {!collapsed && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-wit-muted uppercase tracking-wider">UI Elements</p>
            </div>
          )}
          {uiItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-wit-muted hover:text-wit-text hover:bg-wit-card transition-all"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}

          {/* Dropdown Items */}
          {!collapsed && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-wit-muted uppercase tracking-wider">Components</p>
            </div>
          )}
          {dropdownItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openMenus[item.label];
            
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleMenu(item.label)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-wit-muted hover:text-wit-text hover:bg-wit-card transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-wit-card text-xs rounded-full">{item.badge}</span>
                      )}
                      <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem}
                        href="#"
                        className="block px-3 py-1.5 text-sm text-wit-muted hover:text-wit-text transition-colors"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-wit-border p-3 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-wit-muted hover:text-wit-text hover:bg-wit-card transition-all"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Top Bar */}
      <header className={`fixed top-0 right-0 h-20 border-b border-wit-border glass z-40 transition-all duration-300 ${collapsed ? 'left-20' : 'left-72'}`}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-wit-muted hover:text-wit-text">Home</Link>
            <span className="text-wit-muted">/</span>
            <span className="text-wit-text">Dashboard</span>
            <span className="text-wit-muted">/</span>
            <span className="text-green-400">Analytics</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-wit-muted" />
              <input
                type="text"
                placeholder="Search... ⌘ K"
                className="input-dark pl-10 w-64"
              />
            </div>

            {/* Theme toggle, fullscreen, etc */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button className="p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-wit-border">
              <div className="w-10 h-10 bg-wit-red rounded-full flex items-center justify-center overflow-hidden">
                <img src="/wit-logo.png" alt="WIT" className="w-8 h-8 object-contain" />
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
