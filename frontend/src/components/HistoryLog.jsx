import React from 'react';
import { Clock } from 'lucide-react';

export default function HistoryLog({ history, onSelect }) {
  if (history.length === 0) return null;

  return (
    <div className="glass-panel animate-slide-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Clock size={20} color="var(--text-secondary)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Assessments</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
        {history.map(item => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item.result)}
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '1rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--panel-border)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.date}</span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                padding: '2px 8px', 
                borderRadius: '12px',
                background: `var(--risk-${item.result.risk_level.toLowerCase()})`,
                color: '#fff'
              }}>
                {item.result.risk_level}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              "{item.description}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
