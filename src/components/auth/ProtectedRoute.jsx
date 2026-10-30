import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSkillChain } from '../../context/SkillChainContext';
import { AccessDeniedPage } from '../../pages/auth/AccessDeniedPage';

/**
 * Route guard component that:
 * 1. Verifies the user is authenticated (redirects to /login if not)
 * 2. Verifies the user has one of the allowedRoles (displays AccessDeniedPage if not)
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, currentRole } = useSkillChain();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login, preserving attempted destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Display Access Denied (403) page for unauthorized role attempts
    return <AccessDeniedPage attemptedPath={location.pathname} allowedRoles={allowedRoles} />;
  }

  return children ? children : <Outlet />;
};

