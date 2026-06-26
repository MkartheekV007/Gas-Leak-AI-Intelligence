import React from 'react';
import DataTable from './DataTable';

export default function ServiceCentersPage() {
  const columns = [
    { key: 'Centre_ID', label: 'Center ID' },
    { key: 'Centre_Name', label: 'Name' },
    { key: 'District', label: 'District' },
    { key: 'Address', label: 'Address' },
    { key: 'Contact_Number', label: 'Contact' },
    { key: 'Officer_Name', label: 'Officer' },
  ];

  return (
    <div className="animate-slide-in">
      <DataTable 
        endpoint="/api/service-centers" 
        columns={columns} 
        title="Service Centers" 
      />
    </div>
  );
}
