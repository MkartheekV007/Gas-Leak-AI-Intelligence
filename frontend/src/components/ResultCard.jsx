import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Info, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function ResultCard({ result }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Ensure smooth scroll into view on mobile
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  if (!result) return null;

  const getRiskStyles = (level) => {
    switch(level) {
      case 'CRITICAL': return { color: 'var(--risk-critical)', icon: <AlertOctagon size={28} />, animation: 'pulse-critical 2s infinite' };
      case 'HIGH': return { color: 'var(--risk-high)', icon: <ShieldAlert size={28} /> };
      case 'MEDIUM': return { color: 'var(--risk-medium)', icon: <AlertTriangle size={28} /> };
      case 'LOW': return { color: 'var(--risk-low)', icon: <CheckCircle2 size={28} /> };
      default: return { color: 'var(--text-primary)', icon: <Info size={28} /> };
    }
  };

  const style = getRiskStyles(result.risk_level);

  return (
    <div 
      ref={cardRef}
      className="glass-panel animate-slide-in" 
      style={{ 
        borderColor: style.color,
        borderWidth: '2px',
        animation: style.animation || 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: `1px solid var(--panel-border)`, paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: style.color }}>{style.icon}</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: style.color }}>{result.risk_level} RISK</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>AI Assessment Complete</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Analysis Reason</h3>
        <p style={{ margin: 0, lineHeight: 1.6 }}>{result.reason}</p>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: style.color }}>Immediate Actions Required</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {result.immediate_actions.map((action, i) => (
            <li key={i} style={{ lineHeight: 1.5 }}><strong>{action}</strong></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Incident Summary (For Dispatch)</h3>
        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{result.incident_summary}"</p>
      </div>
    </div>
  );
}
