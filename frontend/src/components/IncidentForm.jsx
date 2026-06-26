import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';

export default function IncidentForm({ onAssess, loading }) {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim()) {
      onAssess(description, language);
    }
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertTriangle size={20} color="var(--risk-medium)" />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Report an Incident</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Describe what you smell, hear, or see (e.g. "I smell rotten eggs in the kitchen").
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Safety Guidance Language:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            disabled={loading}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', color: 'white' }}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
          </select>
        </div>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident here..."
          disabled={loading}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn" disabled={!description.trim() || loading}>
            {loading ? 'Analyzing Risk...' : (
              <>
                <Send size={18} /> Get Immediate Actions
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
