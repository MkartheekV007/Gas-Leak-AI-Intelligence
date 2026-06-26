import React from 'react';
import DataTable from './DataTable';

export default function StakeholdersPage() {
  const columns = [
    { key: 'Stakeholder_ID', label: 'ID' },
    { key: 'Organization', label: 'Organization' },
    { key: 'Stakeholder_Type', label: 'Type' },
    { key: 'Role', label: 'Role' },
    { key: 'District', label: 'District' },
    { key: 'Contact', label: 'Contact' },
  ];

  return (
    <div className="animate-slide-in">
      <DataTable 
        endpoint="/api/stakeholders" 
        columns={columns} 
        title="Stakeholders" 
      />
    </div>
  );
}
