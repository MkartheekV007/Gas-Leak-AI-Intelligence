import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AnimatedBackground from './AnimatedBackground';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { settings } = useTheme();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(settings?.sidebarCollapse || false);
  const timeoutRef = useRef(null);

  // Resize logic
  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 1024 || settings?.sidebarCollapse);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings?.sidebarCollapse]);

  // Session Timeout logic
  useEffect(() => {
    const timeoutMins = parseInt(settings?.sessionTimeout || "30");
    if (timeoutMins === 0) return; // Never timeout

    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        logout();
      }, timeoutMins * 60 * 1000);
    };

    // Listeners for user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimeout));
    resetTimeout();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimeout));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [settings?.sessionTimeout, logout]);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden text-textPrimary selection:bg-primary/30">
      <AnimatedBackground />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className="py-6 px-8 border-t border-border flex justify-between items-center text-sm text-textSecondary">
          <p>© 2026 Gas Leak Safety Intelligence</p>
          <div className="flex gap-4">
            <span>Built with React, FastAPI, Gemini AI, Recharts</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
