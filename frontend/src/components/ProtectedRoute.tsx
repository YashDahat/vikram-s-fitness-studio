import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { ROUTES } from '@/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user?.roles) {
    const hasRequiredRole = allowedRoles.some(role => user.roles?.includes(role));
    if (!hasRequiredRole) {
      // Redirect to member dashboard if authenticated but not authorized for admin
      if (user.roles.includes('MEMBER')) {
        return <Navigate to={ROUTES.MEMBER_DASHBOARD} replace />;
      }
      // Otherwise, redirect to home for unprivileged authenticated users
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;