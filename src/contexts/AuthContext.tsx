import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useUser, useToken, useIsAuthenticated, useLogin, useLogout, useUpdateUser, useRefreshToken } from '../hooks/useAuth';
import EncryptedStorage from '../services/encryptedStorage';
import type { UserData, TokenData } from '../services/encryptedStorage';

// Auth context interface
interface AuthContextType {
    user: UserData | null;
    token: TokenData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserData }>;
    logout: () => void;
    updateUserData: (userData: Partial<UserData>) => Promise<boolean>;
    refreshToken: () => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
    children: ReactNode;
}


// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Use React Query hooks
    const { data: user, isLoading: userLoading } = useUser();
    const { data: token, isLoading: tokenLoading } = useToken();
    const { data: isAuthenticated, isLoading: authLoading } = useIsAuthenticated();

    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const updateUserMutation = useUpdateUser();
    const refreshTokenMutation = useRefreshToken();

    // Auto-refresh token when it's about to expire
    useEffect(() => {
        if (!token?.refreshToken) return;

        const checkTokenExpiry = () => {
            if (EncryptedStorage.needsTokenRefresh() && token.refreshToken) {
                refreshTokenMutation.mutate(token.refreshToken);
            }
        };

        // Check every minute
        const interval = setInterval(checkTokenExpiry, 60000);
        return () => clearInterval(interval);
    }, [token, refreshTokenMutation]);

    // Login function
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserData }> => {
        try {
            const result = await loginMutation.mutateAsync({ email, password });
            return { success: true, user: result.user };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    };

    // Logout function
    const logout = () => {
        logoutMutation.mutate();
    };

    // Update user data
    const updateUserData = async (userData: Partial<UserData>): Promise<boolean> => {
        try {
            await updateUserMutation.mutateAsync(userData);
            return true;
        } catch (error) {
            console.error('Update user data error:', error);
            return false;
        }
    };

    // Refresh token
    const refreshToken = async (): Promise<boolean> => {
        try {
            if (!token?.refreshToken) return false;
            await refreshTokenMutation.mutateAsync(token.refreshToken);
            return true;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    };

    const isLoading = userLoading || tokenLoading || authLoading || loginMutation.isPending;

    const value: AuthContextType = {
        user: user || null,
        token: token || null,
        isAuthenticated: isAuthenticated || false,
        isLoading,
        login,
        logout,
        updateUserData,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
