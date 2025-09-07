import React from 'react'
import { LoginForm, UserProfile } from '../components'
import { useAuth } from '../contexts/AuthContext'

export const Login: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <div className="fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-heading-1 mb-4">Already Signed In</h1>
                    <p className="text-body-large text-secondary-600">
                        You are already authenticated. Visit your profile or continue using the application.
                    </p>
                </div>
                <UserProfile />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="text-center mb-8">
                <h1 className="text-heading-1 mb-4">Sign In to Gecric</h1>
                <p className="text-body-large text-secondary-600">
                    Access your account to manage reports and collaborate with your team.
                </p>
            </div>
            <LoginForm />
        </div>
    );
}
