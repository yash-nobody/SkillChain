import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AccessDeniedPage } from './pages/auth/AccessDeniedPage';
import { DigitalSkillPassport } from './pages/passport/DigitalSkillPassport';
import { GlobalVerifierPage } from './pages/verifier/GlobalVerifierPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { CertificateManagement } from './pages/student/CertificateManagement';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { IssueCertificate } from './pages/company/IssueCertificate';
import { CandidateRequests } from './pages/company/CandidateRequests';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/passport" element={<DigitalSkillPassport />} />
      <Route path="/verify" element={<GlobalVerifierPage />} />
      <Route path="/unauthorized" element={<AccessDeniedPage />} />

      {/* Protected Dashboard Routes (Enforces authentication & role-based access control) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Student-Only Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificates"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CertificateManagement />
            </ProtectedRoute>
          }
        />

        {/* Company / Issuer-Only Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/issue"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <IssueCertificate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/requests"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CandidateRequests />
            </ProtectedRoute>
          }
        />

        {/* Recruiter-Only Routes */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Platform Admin-Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
