export const sampleHistoryData = [
  {
    id: 1,
    date: '2023-10-01',
    location: 'Kitchen - Stove',
    risk_level: 'CRITICAL',
    incident_summary: 'Strong LPG smell and hissing sound reported near stove. Immediate evacuation advised.'
  },
  {
    id: 2,
    date: '2023-10-05',
    location: 'Basement Furnace',
    risk_level: 'MEDIUM',
    incident_summary: 'Faint sulfur smell near the basement furnace when turned on.'
  },
  {
    id: 3,
    date: '2023-10-12',
    location: 'Outdoor Meter',
    risk_level: 'HIGH',
    incident_summary: 'Strong gas odor detected right next to the outdoor gas meter.'
  },
  {
    id: 4,
    date: '2023-11-02',
    location: 'Garage',
    risk_level: 'LOW',
    incident_summary: 'User asking general safety questions about storing propane tanks.'
  },
  {
    id: 5,
    date: '2023-11-15',
    location: 'Main Floor Hallway',
    risk_level: 'CRITICAL',
    incident_summary: 'Resident reports dizziness and a strong rotten egg smell indoors.'
  },
  {
    id: 6,
    date: '2023-12-05',
    location: 'Kitchen - Oven',
    risk_level: 'MEDIUM',
    incident_summary: 'Smell of gas only when oven is ignited, dissipates quickly.'
  },
  {
    id: 7,
    date: '2023-12-20',
    location: 'Laundry Room',
    risk_level: 'HIGH',
    incident_summary: 'Hissing sound and faint smell near the gas dryer connection.'
  }
];

export const monthlyTrendsData = [
  { name: 'Jul', incidents: 2, critical: 0 },
  { name: 'Aug', incidents: 3, critical: 1 },
  { name: 'Sep', incidents: 4, critical: 0 },
  { name: 'Oct', incidents: 8, critical: 2 },
  { name: 'Nov', incidents: 6, critical: 1 },
  { name: 'Dec', incidents: 10, critical: 3 },
];

export const riskDistributionData = [
  { name: 'CRITICAL', value: 4, color: '#ef4444' },
  { name: 'HIGH', value: 7, color: '#f97316' },
  { name: 'MEDIUM', value: 12, color: '#eab308' },
  { name: 'LOW', value: 5, color: '#22c55e' },
];
