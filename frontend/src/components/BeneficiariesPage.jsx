import React from 'react';
import DataTable from './DataTable';

export default function BeneficiariesPage() {
  const columns = [
    { key: 'Beneficiary_ID', label: 'ID' },
    { key: 'Name', label: 'Name' },
    { key: 'Age', label: 'Age' },
    { key: 'Gender', label: 'Gender' },
    { key: 'Occupation', label: 'Occupation' },
    { key: 'District', label: 'District' },
    { key: 'Village', label: 'Village' },
    { key: 'Mobile', label: 'Mobile' },
    { key: 'Household_Size', label: 'Household Size' },
  ];

  return (
    <div className="animate-slide-in">
      <DataTable 
        endpoint="/api/beneficiaries" 
        columns={columns} 
        title="Beneficiaries Directory" 
      />
    </div>
  );
}
