import React from 'react'
import { LoginForm, UserProfile } from '../components'
import { useAuth } from '../contexts/AuthContext'

export const Profile: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-heading-1 mb-4">Authentication Required</h1>
                    <p className="text-body-large text-secondary-600">
                        Please sign in to view your profile.
                    </p>
                </div>
                <LoginForm />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="text-center mb-8">
                <h1 className="text-heading-1 mb-4">User Profile</h1>
                <p className="text-body-large text-secondary-600">
                    Manage your account settings and preferences.
                </p>
            </div>
            <UserProfile />
        </div>
    );
}
