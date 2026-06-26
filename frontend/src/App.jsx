import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import BeneficiariesPage from './components/BeneficiariesPage';
import BenefitsPage from './components/BenefitsPage';
import ServiceCentersPage from './components/ServiceCentersPage';
import StakeholdersPage from './components/StakeholdersPage';
import IncidentsPage from './components/IncidentsPage';
import AdminPage from './components/AdminPage'; // AI Assistant

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import UsersAdmin from './components/UsersAdmin';

// New Pages
import Settings from './components/Settings';
import Profile from './components/Profile';
import Reports from './components/Reports';
import HelpCenter from './components/HelpCenter';
import NotificationsPage from './components/NotificationsPage';
import AuditLogs from './components/AuditLogs';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* General Access Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/beneficiaries" element={<BeneficiariesPage />} />
              <Route path="/benefits" element={<BenefitsPage />} />
              <Route path="/service-centers" element={<ServiceCentersPage />} />
              <Route path="/stakeholders" element={<StakeholdersPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* AI / Operator / Analyst Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Operator', 'Supervisor', 'Analyst']} />}>
            <Route element={<Layout />}>
              <Route path="/ai-assistant" element={<AdminPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>

          {/* Administrator Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route element={<Layout />}>
              <Route path="/users" element={<UsersAdmin />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
