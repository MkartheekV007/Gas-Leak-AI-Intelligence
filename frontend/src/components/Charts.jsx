import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, Sector
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useTheme } from '../context/ThemeContext';

export default function Charts({ stats, animate = true }) {
  const { theme } = useTheme();
  if (!stats) return null;

  // Use CSS variables for neon/pastel colors based on theme
  const getThemeColor = (varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  };

  const riskColors = {
    'CRITICAL': 'var(--danger)',
    'HIGH': 'var(--warning)',
    'MEDIUM': '#eab308',
    'LOW': 'var(--success)'
  };
  
  const riskDistributionData = stats.incident_risk ? stats.incident_risk.map(item => ({
    ...item, color: riskColors[item.name] || 'var(--text-secondary)'
  })) : [];
  
  const districtData = stats.district_distribution ? stats.district_distribution.slice(0, 6) : [];

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: theme === 'dark' ? `drop-shadow(0 0 10px ${fill})` : 'none', outline: 'none' }}
      />
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass border border-border p-4 rounded-xl shadow-2xl">
          <p className="text-textPrimary font-bold text-sm mb-2">{label || payload[0].name || payload[0].payload.name}</p>
          {payload.map((p, i) => (
            <p key={i} className="font-semibold text-xs flex items-center gap-2 mt-1" style={{ color: p.color || p.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill, boxShadow: `0 0 8px ${p.color || p.fill}` }}></span>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      
      {/* Monthly Trends (Area) */}
      <Card hover className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Incident Resolution Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthly_trends} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 2 }} />
              <Area isAnimationActive={animate} type="monotone" dataKey="incidents" name="Incidents Reported" stroke="var(--danger)" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} filter="url(#glow)" />
              <Area isAnimationActive={animate} type="monotone" dataKey="resolved" name="Incidents Resolved" stroke="var(--success)" fillOpacity={1} fill="url(#colorRes)" strokeWidth={3} filter="url(#glow)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution (Donut) */}
      <Card hover>
        <CardHeader>
          <CardTitle>Active Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Pie
                isAnimationActive={animate}
                data={riskDistributionData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                activeShape={renderActiveShape}
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} filter={theme === 'dark' ? "url(#pieGlow)" : ""} style={{ outline: 'none' }} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Incidents by District (Bar) */}
      <Card hover>
        <CardHeader>
          <CardTitle>Incidents by District</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface)' }} />
              <Bar isAnimationActive={animate} dataKey="value" name="Incidents" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={36} filter={theme === 'dark' ? "url(#pieGlow)" : ""} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
