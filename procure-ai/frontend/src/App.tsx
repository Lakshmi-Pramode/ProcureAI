import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TenderManagement from './pages/TenderManagement';
import CreateTender from './pages/CreateTender';
import TenderDetails from './pages/TenderDetails';
import BidderManagement from './pages/BidderManagement';
import BidderDetails from './pages/BidderDetails';
import DocumentUpload from './pages/DocumentUpload';
import AIVerification from './pages/AIVerification';
import ComplianceAnalysis from './pages/ComplianceAnalysis';
import RiskCenter from './pages/RiskCenter';
import Reports from './pages/Reports';
import AuditTrail from './pages/AuditTrail';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tenders" element={<TenderManagement />} />
              <Route path="/tenders/new" element={<CreateTender />} />
              <Route path="/tenders/:id" element={<TenderDetails />} />
              <Route path="/bidders" element={<BidderManagement />} />
              <Route path="/bidders/:id" element={<BidderDetails />} />
              <Route path="/documents" element={<DocumentUpload />} />
              <Route path="/verification" element={<AIVerification />} />
              <Route path="/compliance" element={<ComplianceAnalysis />} />
              <Route path="/risk-center" element={<RiskCenter />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/audit-trail" element={<AuditTrail />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
