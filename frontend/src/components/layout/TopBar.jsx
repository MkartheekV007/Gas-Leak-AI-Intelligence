import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Shield, Moon, Sun, Settings, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, settings } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className="h-16 px-8 border-b border-border bg-surface backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
          <input 
            type="text" 
            placeholder="Search across platform..." 
            className="w-full bg-black/5 dark:bg-white/5 border border-border rounded-full py-2 pl-10 pr-4 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <button onClick={toggleTheme} className="p-2 text-textSecondary hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => { setNotificationsOpen(!notificationsOpen); setDropdownOpen(false); }}
            className="p-2 text-textSecondary hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
          </button>
          
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                  <span className="font-semibold text-textPrimary">Notifications</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    { title: "Critical gas leak detected", time: "2 min ago", type: "danger" },
                    { title: "AI assessment completed", time: "1 hour ago", type: "success" },
                    { title: "New beneficiary added", time: "3 hours ago", type: "primary" },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-${n.type}`} />
                      <div>
                        <p className="text-sm text-textPrimary">{n.title}</p>
                        <p className="text-xs text-textSecondary mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center border-t border-border mt-1">
                  <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs text-primary hover:underline">View all notifications</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-border mx-2"></div>
        
        <button 
          className="flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 p-1.5 pr-3 rounded-full transition-colors"
          onClick={() => { setDropdownOpen(!dropdownOpen); setNotificationsOpen(false); }}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center border-garnish shadow-[0_0_10px_rgba(139,92,246,0.15)] font-bold uppercase overflow-hidden">
            {settings?.profilePhoto ? (
              <img src={settings.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (settings?.fullName || user?.full_name)?.charAt(0) || <User size={16} />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-textPrimary leading-tight">{settings?.fullName || user?.full_name || 'User'}</div>
            <div className="text-xs text-textSecondary">{user?.role || 'Viewer'}</div>
          </div>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute top-12 right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-border mb-2">
                <p className="text-sm font-semibold text-textPrimary truncate">{settings?.fullName || user?.full_name}</p>
                <p className="text-xs text-textSecondary truncate mb-2">{settings?.email || user?.email}</p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">
                  <Shield size={10} /> {user?.role}
                </div>
              </div>
              <Link to="/profile" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary transition-colors flex items-center gap-2">
                <User size={16} /> Profile
              </Link>
              <Link to="/settings" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary transition-colors flex items-center gap-2">
                <Settings size={16} /> Settings
              </Link>
              {user?.role === 'Administrator' && (
                <Link to="/users" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-sm text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary transition-colors flex items-center gap-2">
                  <Users size={16} /> Manage Users
                </Link>
              )}
              <div className="my-1 border-t border-border"></div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors flex items-center gap-2 mt-1"
              >
                <LogOut size={16} /> Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
