import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, HeartPulse, Hospital, UsersRound, 
  AlertTriangle, ShieldAlert, Settings, ChevronLeft, ChevronRight, 
  BarChart3, FileText, Bell, UserCog, HelpCircle, Activity 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  
  const navGroups = [
    {
      title: "Main",
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'AI Assessment', path: '/ai-assistant', icon: ShieldAlert, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst'] },
        { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['Administrator', 'Analyst', 'Supervisor'] },
      ]
    },
    {
      title: "Data Management",
      items: [
        { name: 'Beneficiaries', path: '/beneficiaries', icon: Users, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Benefits', path: '/benefits', icon: HeartPulse, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Service Centers', path: '/service-centers', icon: Hospital, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Stakeholders', path: '/stakeholders', icon: UsersRound, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Incidents', path: '/incidents', icon: AlertTriangle, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Reports', path: '/reports', icon: FileText, roles: ['Administrator', 'Analyst', 'Supervisor', 'Operator'] },
      ]
    },
    {
      title: "System",
      items: [
        { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'User Management', path: '/users', icon: UserCog, roles: ['Administrator'] },
        { name: 'Audit Logs', path: '/audit-logs', icon: Activity, roles: ['Administrator'] },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
        { name: 'Help Center', path: '/help-center', icon: HelpCircle, roles: ['Administrator', 'Operator', 'Supervisor', 'Analyst', 'Viewer', 'Guest'] },
      ]
    }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen sticky top-0 border-r border-border bg-surface backdrop-blur-md flex flex-col z-20 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8c-2 2-2 5-2 5s2-2 4-2 2 4 2 4c2-4 0-6-2-8-1-1-2 1-2 1z" fill="currentColor" className="text-success" stroke="none"></path></svg>
            <span className="font-bold text-textPrimary tracking-[0.25em] uppercase text-sm whitespace-nowrap mt-1">SAFEGAS</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8c-2 2-2 5-2 5s2-2 4-2 2 4 2 4c2-4 0-6-2-8-1-1-2 1-2 1z" fill="currentColor" className="text-success" stroke="none"></path></svg>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {navGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={idx}>
              {!collapsed && <div className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mb-2 px-3">{group.title}</div>}
              <nav className="flex flex-col gap-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium border-garnish shadow-[0_0_15px_rgba(139,92,246,0.15)]" 
                        : "text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon size={20} className={cn("shrink-0", collapsed && "mx-auto")} />
                    {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto shrink-0 flex flex-col gap-2">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 rounded-lg text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary transition-all w-full"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}
