import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hospital-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Mandatory checks as per requirements
    if (user.ispasswordchanged === false && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }

    if (user.isTenantSubscribed === false && location.pathname !== '/subscription') {
        return <Navigate to="/subscription" replace />;
    }

    // Role verification
    if (allowedRoles && !allowedRoles.some(role => user.rolelist.includes(role))) {
        // Redirect to their respective dashboard if they try to access unauthorized route
        let defaultPath = '/doctor';
        if (user.rolelist.includes('superadmin')) defaultPath = '/superadmin';
        else if (user.rolelist.includes('hr') || user.rolelist.includes('tenant')) defaultPath = '/admin';

        return <Navigate to={defaultPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
