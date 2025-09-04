import React from 'react';
import { Button, Card } from './';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
    className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <Card className={`max-w-md mx-auto ${className}`} padding="lg">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-semibold text-primary-700">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <h2 className="text-heading-2 text-secondary-900">{user.name}</h2>
                <p className="text-body text-secondary-600">{user.email}</p>
                {user.role && (
                    <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                        {user.role}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-secondary-600">User ID:</span>
                        <p className="font-mono text-xs text-secondary-800">{user.id}</p>
                    </div>
                    <div>
                        <span className="text-secondary-600">Last Login:</span>
                        <p className="text-secondary-800">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {user.preferences && (
                    <div>
                        <span className="text-secondary-600 text-sm">Preferences:</span>
                        <div className="mt-1 space-y-1">
                            {Object.entries(user.preferences).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-secondary-600 capitalize">{key}:</span>
                                    <span className="text-secondary-800">
                                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleLogout}
                    className="w-full"
                >
                    Sign Out
                </Button>
            </div>
        </Card>
    );
};

export default UserProfile;
