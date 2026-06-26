import React from 'react';
import DataTable from './DataTable';

export default function IncidentsPage() {
  const columns = [
    { key: 'Incident_ID', label: 'ID' },
    { key: 'Date', label: 'Date' },
    { key: 'Location', label: 'Location' },
    { key: 'Risk_Level', label: 'Risk Level' },
    { key: 'Incident_Summary', label: 'Summary' },
  ];

  return (
    <div className="animate-slide-in">
      <DataTable 
        endpoint="/api/incidents" 
        columns={columns} 
        title="Incident History" 
      />
    </div>
  );
}
