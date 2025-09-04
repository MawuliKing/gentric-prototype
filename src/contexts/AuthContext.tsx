import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import EncryptedStorage, { UserData, TokenData } from '../services/encryptedStorage';

// Auth context interface
interface AuthContextType {
    user: UserData | null;
    token: TokenData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

// Mock API functions (replace with your actual API calls)
const mockLoginAPI = async (email: string, password: string): Promise<{
    success: boolean;
    data?: { user: UserData; token: TokenData };
    error?: string;
}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (email === 'demo@gentric.com' && password === 'password') {
        const user: UserData = {
            id: '1',
            email: 'demo@gentric.com',
            name: 'Demo User',
            role: 'admin',
            avatar: 'https://via.placeholder.com/150',
            preferences: {
                theme: 'light',
                language: 'en',
                notifications: true,
            },
            lastLogin: new Date().toISOString(),
        };

        const token: TokenData = {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            tokenType: 'Bearer',
        };

        return { success: true, data: { user, token } };
    }

    return { success: false, error: 'Invalid email or password' };
};

const mockRefreshTokenAPI = async (refreshToken: string): Promise<{
    success: boolean;
    data?: TokenData;
    error?: string;
}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock refresh token validation
    if (refreshToken.startsWith('mock_refresh_token_')) {
        const newToken: TokenData = {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            tokenType: 'Bearer',
        };

        return { success: true, data: newToken };
    }

    return { success: false, error: 'Invalid refresh token' };
};

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<TokenData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from storage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = EncryptedStorage.getUserData();
                const storedToken = EncryptedStorage.getToken();

                if (storedUser && storedToken && EncryptedStorage.isAuthenticated()) {
                    setUser(storedUser);
                    setToken(storedToken);
                } else {
                    // Clear invalid data
                    EncryptedStorage.clearAll();
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                EncryptedStorage.clearAll();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Auto-refresh token when it's about to expire
    useEffect(() => {
        if (!token) return;

        const checkTokenExpiry = () => {
            if (EncryptedStorage.needsTokenRefresh()) {
                refreshToken();
            }
        };

        // Check every minute
        const interval = setInterval(checkTokenExpiry, 60000);
        return () => clearInterval(interval);
    }, [token]);

    // Login function
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);

            const response = await mockLoginAPI(email, password);

            if (response.success && response.data) {
                const { user: userData, token: tokenData } = response.data;

                // Save to encrypted storage
                const tokenSaved = EncryptedStorage.saveToken(tokenData);
                const userSaved = EncryptedStorage.saveUserData(userData);

                if (tokenSaved && userSaved) {
                    setUser(userData);
                    setToken(tokenData);
                    return { success: true };
                } else {
                    return { success: false, error: 'Failed to save authentication data' };
                }
            } else {
                return { success: false, error: response.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        try {
            EncryptedStorage.clearAll();
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Update user data
    const updateUserData = async (userData: Partial<UserData>): Promise<boolean> => {
        try {
            if (!user) return false;

            const updatedUser = { ...user, ...userData };
            const success = EncryptedStorage.saveUserData(updatedUser);

            if (success) {
                setUser(updatedUser);
            }

            return success;
        } catch (error) {
            console.error('Update user data error:', error);
            return false;
        }
    };

    // Refresh token
    const refreshToken = async (): Promise<boolean> => {
        try {
            if (!token?.refreshToken) return false;

            const response = await mockRefreshTokenAPI(token.refreshToken);

            if (response.success && response.data) {
                const success = EncryptedStorage.saveToken(response.data);
                if (success) {
                    setToken(response.data);
                    return true;
                }
            }

            // If refresh fails, logout user
            logout();
            return false;
        } catch (error) {
            console.error('Refresh token error:', error);
            logout();
            return false;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token && EncryptedStorage.isAuthenticated(),
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
