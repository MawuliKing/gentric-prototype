import React, { useState, useEffect } from 'react';
import { Button, Card, StatusBadge } from './';
import { useAuth } from '../contexts/AuthContext';
import EncryptedStorage from '../services/encryptedStorage';

export const StorageDemo: React.FC = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [storageInfo, setStorageInfo] = useState<any>(null);
    const [testData, setTestData] = useState('');

    useEffect(() => {
        updateStorageInfo();
    }, [user, token, isAuthenticated]);

    const updateStorageInfo = () => {
        const info = EncryptedStorage.getStorageInfo();
        setStorageInfo(info);
    };

    const testEncryption = () => {
        const testString = 'This is a test string for encryption';
        const encrypted = EncryptedStorage['encrypt'](testString);
        const decrypted = EncryptedStorage['decrypt'](encrypted);
        setTestData(`Original: ${testString}\nEncrypted: ${encrypted}\nDecrypted: ${decrypted}`);
    };

    const clearStorage = () => {
        EncryptedStorage.clearAll();
        updateStorageInfo();
    };

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <h3 className="text-heading-3 mb-4">Encrypted Storage Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600">Has Token:</span>
                            <StatusBadge status={storageInfo?.hasToken ? 'success' : 'error'}>
                                {storageInfo?.hasToken ? 'Yes' : 'No'}
                            </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600">Has User Data:</span>
                            <StatusBadge status={storageInfo?.hasUserData ? 'success' : 'error'}>
                                {storageInfo?.hasUserData ? 'Yes' : 'No'}
                            </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-secondary-600">Is Authenticated:</span>
                            <StatusBadge status={storageInfo?.isAuthenticated ? 'success' : 'error'}>
                                {storageInfo?.isAuthenticated ? 'Yes' : 'No'}
                            </StatusBadge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <span className="text-sm text-secondary-600">Token Expires:</span>
                            <p className="text-sm text-secondary-800">
                                {storageInfo?.tokenExpiresAt
                                    ? new Date(storageInfo.tokenExpiresAt).toLocaleString()
                                    : 'N/A'
                                }
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Needs Refresh:</span>
                            <StatusBadge status={EncryptedStorage.needsTokenRefresh() ? 'warning' : 'success'}>
                                {EncryptedStorage.needsTokenRefresh() ? 'Yes' : 'No'}
                            </StatusBadge>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={updateStorageInfo}>
                        Refresh Info
                    </Button>
                    <Button variant="secondary" size="sm" onClick={testEncryption}>
                        Test Encryption
                    </Button>
                    <Button variant="error" size="sm" onClick={clearStorage}>
                        Clear Storage
                    </Button>
                </div>
            </Card>

            {testData && (
                <Card padding="lg">
                    <h3 className="text-heading-3 mb-4">Encryption Test Results</h3>
                    <pre className="bg-secondary-50 p-4 rounded-md text-sm overflow-x-auto">
                        {testData}
                    </pre>
                </Card>
            )}

            {isAuthenticated && user && (
                <Card padding="lg">
                    <h3 className="text-heading-3 mb-4">Current User Data</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="text-sm text-secondary-600">ID:</span>
                            <p className="text-sm text-secondary-800 font-mono">{user.id}</p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Name:</span>
                            <p className="text-sm text-secondary-800">{user.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Email:</span>
                            <p className="text-sm text-secondary-800">{user.email}</p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Role:</span>
                            <p className="text-sm text-secondary-800">{user.role || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Last Login:</span>
                            <p className="text-sm text-secondary-800">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {isAuthenticated && token && (
                <Card padding="lg">
                    <h3 className="text-heading-3 mb-4">Current Token Data</h3>
                    <div className="space-y-2">
                        <div>
                            <span className="text-sm text-secondary-600">Access Token:</span>
                            <p className="text-sm text-secondary-800 font-mono break-all">
                                {token.accessToken.substring(0, 50)}...
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Token Type:</span>
                            <p className="text-sm text-secondary-800">{token.tokenType || 'N/A'}</p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Expires At:</span>
                            <p className="text-sm text-secondary-800">
                                {new Date(token.expiresAt).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-secondary-600">Has Refresh Token:</span>
                            <StatusBadge status={token.refreshToken ? 'success' : 'error'}>
                                {token.refreshToken ? 'Yes' : 'No'}
                            </StatusBadge>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default StorageDemo;
