import React from 'react';
import { PhoneCall } from 'lucide-react';

export default function EmergencyContacts() {
  return (
    <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <PhoneCall size={20} color="var(--risk-critical)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--risk-critical)' }}>Emergency Contacts</h2>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <div>
            <strong style={{ display: 'block' }}>Emergency Services</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fire / Police / Medical</span>
          </div>
          <a href="tel:911" className="btn" style={{ background: 'var(--risk-critical)', padding: '0.5rem 1rem' }}>911</a>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          <div>
            <strong style={{ display: 'block' }}>National Gas Leak Hotline</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Report Outages & Leaks</span>
          </div>
          <a href="tel:800-427-2200" className="btn" style={{ background: 'var(--risk-high)', padding: '0.5rem 1rem' }}>Call</a>
        </li>
      </ul>
    </div>
  );
}
