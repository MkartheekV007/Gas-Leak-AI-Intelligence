import React from 'react';
import { sampleHistoryData } from '../sampleData';

export default function IncidentTable() {
  return (
    <div className="glass-panel" style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Incident History</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Date</th>
            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Location</th>
            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Risk Level</th>
            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Summary</th>
          </tr>
        </thead>
        <tbody>
          {sampleHistoryData.map((incident) => (
            <tr key={incident.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '1rem 0.5rem', whiteSpace: 'nowrap' }}>{incident.date}</td>
              <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{incident.location}</td>
              <td style={{ padding: '1rem 0.5rem' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  background: `var(--risk-${incident.risk_level.toLowerCase()})`,
                  color: '#fff'
                }}>
                  {incident.risk_level}
                </span>
              </td>
              <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{incident.incident_summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
