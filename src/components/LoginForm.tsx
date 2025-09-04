import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Card } from './';
import { useAuth } from '../contexts/AuthContext';
import { ACCOUNT_TYPE } from '../types/api';

interface LoginFormProps {
    onSuccess?: () => void;
    className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, className = '' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to get user dashboard based on account type
    const getUserDashboard = (userType: string): string => {
        switch (userType as ACCOUNT_TYPE) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);

            if (result.success && result.user) {
                onSuccess?.();

                // Determine redirect destination
                const intendedDestination = location.state?.from?.pathname;
                const userDashboard = getUserDashboard(result.user.type || '');
                const redirectTo = intendedDestination || userDashboard;

                console.log('Login successful, redirecting to:', redirectTo);
                console.log('User type:', result.user.type);
                console.log('Intended destination:', intendedDestination);

                // Navigate to the appropriate destination
                navigate(redirectTo, { replace: true });
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className={`max-w-md mx-auto ${className}`} padding="lg">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-heading-2 text-secondary-900">Welcome Back</h2>
                <p className="text-body text-secondary-600 mt-2">
                    Sign in to your Gentric account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-error-50 border border-error-200 rounded-md p-3">
                        <p className="text-error-700 text-sm">{error}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                        Email Address
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isSubmitting}
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled={isSubmitting}
                        className="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-secondary-600">
                    Demo credentials: <br />
                    <span className="font-mono text-xs bg-secondary-100 px-2 py-1 rounded">
                        demo@gentric.com / Password@123
                    </span>
                </p>
            </div>
        </Card>
    );
};

export default LoginForm;
