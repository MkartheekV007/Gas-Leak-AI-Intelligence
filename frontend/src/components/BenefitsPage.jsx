import React from 'react';
import DataTable from './DataTable';

export default function BenefitsPage() {
  const columns = [
    { key: 'Benefit_ID', label: 'Benefit ID' },
    { key: 'Beneficiary_ID', label: 'Beneficiary ID' },
    { key: 'Benefit_Type', label: 'Type' },
    { key: 'Date_Provided', label: 'Date Provided' },
    { key: 'Status', label: 'Status' },
    { key: 'Remarks', label: 'Remarks' },
  ];

  return (
    <div className="animate-slide-in">
      <DataTable 
        endpoint="/api/benefits" 
        columns={columns} 
        title="Benefits Log" 
      />
    </div>
  );
}
