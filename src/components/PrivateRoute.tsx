import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useUser } from '../hooks/useAuth';
import { ACCOUNT_TYPE } from '../types/api';

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: ACCOUNT_TYPE[];
    redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
    children,
    allowedRoles = [],
    redirectTo = '/login'
}) => {
    const { data: isAuthenticated, isLoading: authLoading } = useIsAuthenticated();
    const { data: user, isLoading: userLoading } = useUser();
    const location = useLocation();

    const isLoading = authLoading || userLoading;

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0) {
        const userType = user.type as ACCOUNT_TYPE;
        if (!allowedRoles.includes(userType)) {
            // Redirect to appropriate dashboard based on user type
            const userDashboard = getUserDashboard(userType);
            return <Navigate to={userDashboard} replace />;
        }
    }

    return <>{children}</>;
};

// Helper function to get dashboard route based on account type
const getUserDashboard = (accountType: ACCOUNT_TYPE): string => {
    switch (accountType) {
        case ACCOUNT_TYPE.ADMIN:
            return '/admin';
        case ACCOUNT_TYPE.USER:
            return '/agent';
        case ACCOUNT_TYPE.CUSTOMER:
            return '/customer';
        default:
            return '/';
    }
};

export default PrivateRoute;
