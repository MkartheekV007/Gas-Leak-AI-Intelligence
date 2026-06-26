import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { 
  Users, HeartPulse, AlertTriangle, Hospital, ShieldAlert, 
  Clock, Activity, Flame, CloudRain, Sun, Calendar
} from 'lucide-react';
import Charts from './Charts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { settings } = useTheme();
  const [stats, setStats] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = () => {
      fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Error fetching stats:", err));
    };

    fetchStats();

    // Auto-refresh interval from settings (if liveStats is enabled)
    let intervalId = null;
    if (settings?.liveStats !== false) {
      const intervalSeconds = parseInt(settings?.refreshInterval || "60");
      intervalId = setInterval(fetchStats, intervalSeconds * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [settings?.refreshInterval, settings?.liveStats]);

  if (!stats) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-textSecondary font-medium">Initializing 3D Engine...</span>
      </div>
    </div>
  );

  const getCriticalCount = () => {
    if (!stats.incident_risk) return 0;
    const crit = stats.incident_risk.find(r => r.name === 'CRITICAL');
    return crit ? crit.value : 0;
  };

  const getActiveBenefits = () => {
    if (!stats.benefit_status) return stats.total_benefits;
    const prog = stats.benefit_status.find(r => r.name === 'In Progress');
    const pend = stats.benefit_status.find(r => r.name === 'Pending');
    return (prog?.value || 0) + (pend?.value || 0);
  };

  const kpis = [
    { title: "Total Beneficiaries", value: stats.total_beneficiaries, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Active Benefits", value: getActiveBenefits(), icon: HeartPulse, color: "text-success", bg: "bg-success/10" },
    { title: "Open Incidents", value: stats.total_incidents, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { title: "Critical Alerts", value: getCriticalCount(), icon: Flame, color: "text-danger", bg: "bg-danger/10" },
    { title: "AI Assessments", value: stats.ai_assessments_today, icon: ShieldAlert, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { title: "Service Centers", value: stats.total_service_centers, icon: Hospital, color: "text-[#06b6d4]", bg: "bg-[#06b6d4]/10" },
    { title: "Avg Response", value: `${stats.avg_response_time_mins}m`, icon: Clock, color: "text-[#ec4899]", bg: "bg-[#ec4899]/10" },
    { title: "System Health", value: stats.system_health, icon: Activity, color: "text-success", bg: "bg-success/10" }
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const isCompact = settings?.density === 'compact';
  const showCharts = settings?.widgetVis !== false;

  return (
    <div className={`space-y-${isCompact ? '4' : '8'} pb-10`}>
      
      {/* 3D Dashboard Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl glass border border-primary/20 shadow-[0_0_40px_rgba(0,240,255,0.1)] p-${isCompact ? '6' : '8'} md:p-${isCompact ? '8' : '12'}`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-[#8b5cf6]/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-sm font-medium text-textSecondary shadow-sm">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live Telemetry Active
            </div>
            
            <h1 className={`${isCompact ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-serif text-textPrimary leading-tight`}>
              Welcome back, <br/>{(settings?.fullName || user?.full_name)?.split(' ')[0] || 'Commander'}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-textSecondary">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
                <Calendar size={16} className="text-primary" /> {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
                <Sun size={16} className="text-warning" /> 72°F Clear
              </div>
            </div>
          </div>

          {/* 3D Floating AI Robot Illustration */}
          <div className={`relative ${isCompact ? 'w-48 h-48' : 'w-64 h-64'} shrink-0 perspective-1000`}>
            <motion.div 
              animate={{ y: [-10, 10, -10], rotateX: [5, -5, 5], rotateY: [-5, 5, -5] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-full relative transform-style-3d flex items-center justify-center"
            >
              {/* Floating Shield (Background) */}
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className={`absolute ${isCompact ? 'w-32 h-32' : 'w-48 h-48'} rounded-full border border-dashed border-primary/50 z-0`} 
              />
              {/* Robot Head (Foreground) */}
              <div className={`absolute ${isCompact ? 'w-24 h-24' : 'w-32 h-32'} rounded-3xl bg-surface border-garnish shadow-[0_0_30px_rgba(139,92,246,0.4)] backdrop-blur-xl flex items-center justify-center z-10`}>
                <div className="flex items-center gap-4">
                  <motion.div animate={{ scaleY: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }} className={`${isCompact ? 'w-4 h-6' : 'w-6 h-8'} rounded-full bg-primary shadow-[0_0_15px_rgba(0,240,255,0.8)]`} />
                  <motion.div animate={{ scaleY: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 4, repeatDelay: 1.2 }} className={`${isCompact ? 'w-4 h-6' : 'w-6 h-8'} rounded-full bg-primary shadow-[0_0_15px_rgba(0,240,255,0.8)]`} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className={`grid grid-cols-2 md:grid-cols-4 gap-${isCompact ? '3' : '4'} lg:gap-${isCompact ? '4' : '6'}`}>
        {kpis.map((kpi, index) => (
          <motion.div key={index} variants={itemAnim}>
            <Card hover className="h-full cursor-pointer group">
              <CardContent className={`p-${isCompact ? '4' : '6'} flex flex-col gap-${isCompact ? '3' : '4'} relative overflow-hidden`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform-gpu translate-z-0" />
                <div className="flex justify-between items-start">
                  <div className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color} shadow-inner`}>
                    <kpi.icon size={isCompact ? 20 : 24} />
                  </div>
                </div>
                <div>
                  <div className={`${isCompact ? 'text-3xl' : 'text-4xl'} font-extrabold text-textPrimary tracking-tight`}>
                    {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                  </div>
                  <div className="text-[13px] font-bold text-textSecondary mt-1 uppercase tracking-wider">{kpi.title}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      {showCharts && (
        <div className={`pt-${isCompact ? '2' : '4'}`}>
          <Charts stats={stats} animate={settings?.chartAnim !== false} />
        </div>
      )}
    </div>
  );
}
