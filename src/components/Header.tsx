'use client';

import { useState } from 'react';
import { Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import Notifications from './Notifications';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    alert('Logout clicked! (Demo only)');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 border-b z-[90] theme-header">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex-1">
          {title && (
            <h1 className="text-xl md:text-2xl font-bold text-wit-text">{title}</h1>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Notifications onNotificationsOpen={setIsNotificationsOpen} />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all"
            >
              <div className="w-8 h-8 bg-wit-red/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-wit-red" />
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-wit-darker border border-wit-border rounded-xl shadow-2xl overflow-hidden z-[100]">
                {/* Profile Info */}
                <div className="p-4 border-b border-wit-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-wit-red/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-wit-red" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-wit-text">Admin User</p>
                      <p className="text-xs text-wit-muted">admin@wit.id</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <a
                    href="/settings/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-wit-muted hover:text-wit-text hover:bg-wit-card rounded-lg transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-wit-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
