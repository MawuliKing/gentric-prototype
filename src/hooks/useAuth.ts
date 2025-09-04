import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import EncryptedStorage, { type UserData, type TokenData } from '../services/encryptedStorage';
import { ACCOUNT_TYPE, type ApiUserData, type LoginResponsePayload } from '../types/api';

// Query keys
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    token: () => [...authKeys.all, 'token'] as const,
    isAuthenticated: () => [...authKeys.all, 'isAuthenticated'] as const,
};

// Helper function to convert API user data to internal UserData format
const convertApiUserToUserData = (apiUser: ApiUserData): UserData => {
    return {
        id: apiUser.id,
        email: apiUser.email,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        otherName: apiUser.otherName,
        phoneNumber: apiUser.phoneNumber,
        type: apiUser.type,
        role: apiUser.type.toLowerCase(), // Map type to role for backward compatibility
        isEmailVerified: apiUser.isEmailVerified,
        lastLoginAt: apiUser.lastLoginAt,
        lastLogin: apiUser.lastLoginAt, // For backward compatibility
        preferences: {
            theme: 'light',
            language: 'en',
            notifications: true,
        },
    };
};

// Login mutation
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await apiService.post('/auth/login', { email, password });

            if (!response.status || !response.payload) {
                throw new Error(response.message || 'Login failed');
            }

            const payload = response.payload as LoginResponsePayload;
            const user = convertApiUserToUserData(payload.user);
            const token: TokenData = {
                accessToken: payload.accessToken,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
                tokenType: 'Bearer',
            };

            return { user, token };
        },
        onSuccess: ({ user, token }) => {
            // Save to encrypted storage
            EncryptedStorage.saveToken(token);
            EncryptedStorage.saveUserData(user);

            // Update React Query cache
            queryClient.setQueryData(authKeys.user(), user);
            queryClient.setQueryData(authKeys.token(), token);
            queryClient.setQueryData(authKeys.isAuthenticated(), true);
        },
        onError: (error) => {
            console.error('Login error:', error);
            // Clear any cached auth data on error
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.token(), null);
            queryClient.setQueryData(authKeys.isAuthenticated(), false);
        },
    });
};

// Logout mutation
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Clear encrypted storage
            EncryptedStorage.clearAll();
        },
        onSuccess: () => {
            // Clear React Query cache
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.token(), null);
            queryClient.setQueryData(authKeys.isAuthenticated(), false);

            // Invalidate all queries
            queryClient.invalidateQueries();
        },
    });
};

// Refresh token mutation
export const useRefreshToken = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (refreshToken: string) => {
            const response = await apiService.post('/auth/refresh', { refreshToken });

            if (!response.status || !response.payload) {
                throw new Error(response.message || 'Token refresh failed');
            }

            const payload = response.payload as { accessToken: string };
            const newToken: TokenData = {
                accessToken: payload.accessToken,
                refreshToken: refreshToken,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                tokenType: 'Bearer',
            };

            return newToken;
        },
        onSuccess: (newToken) => {
            // Save to encrypted storage
            EncryptedStorage.saveToken(newToken);

            // Update React Query cache
            queryClient.setQueryData(authKeys.token(), newToken);
        },
        onError: () => {
            // If refresh fails, logout user
            EncryptedStorage.clearAll();
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.token(), null);
            queryClient.setQueryData(authKeys.isAuthenticated(), false);
        },
    });
};

// Get current user query
export const useUser = () => {
    return useQuery({
        queryKey: authKeys.user(),
        queryFn: () => {
            const user = EncryptedStorage.getUserData();
            if (!user) {
                throw new Error('No user data found');
            }
            return user;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
};

// Get current token query
export const useToken = () => {
    return useQuery({
        queryKey: authKeys.token(),
        queryFn: () => {
            const token = EncryptedStorage.getToken();
            if (!token) {
                throw new Error('No token found');
            }
            return token;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
};

// Check authentication status query
export const useIsAuthenticated = () => {
    return useQuery({
        queryKey: authKeys.isAuthenticated(),
        queryFn: () => {
            return EncryptedStorage.isAuthenticated();
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: false,
    });
};

// Update user data mutation
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: Partial<UserData>) => {
            const currentUser = EncryptedStorage.getUserData();
            if (!currentUser) {
                throw new Error('No user data found');
            }

            const updatedUser = { ...currentUser, ...userData };
            const success = EncryptedStorage.saveUserData(updatedUser);

            if (!success) {
                throw new Error('Failed to update user data');
            }

            return updatedUser;
        },
        onSuccess: (updatedUser) => {
            // Update React Query cache
            queryClient.setQueryData(authKeys.user(), updatedUser);
        },
    });
};

// Helper hook to get user dashboard route
export const useUserDashboard = () => {
    const { data: user } = useUser();

    if (!user?.type) return '/';

    switch (user.type as ACCOUNT_TYPE) {
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
