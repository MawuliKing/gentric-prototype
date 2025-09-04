import React, { useState } from 'react';
import { Button, Card, StatusBadge } from './';
import { apiService } from '../services/apiService';
import { StructuredResponse } from '../types/api';

export const ApiDemo: React.FC = () => {
    const [response, setResponse] = useState<StructuredResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApiCall = async (method: 'GET' | 'POST' | 'PUT' | 'PATCH', endpoint: string, data?: any) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            let result: StructuredResponse;

            switch (method) {
                case 'GET':
                    result = await apiService.get(endpoint);
                    break;
                case 'POST':
                    result = await apiService.post(endpoint, data);
                    break;
                case 'PUT':
                    result = await apiService.put(endpoint, data);
                    break;
                case 'PATCH':
                    result = await apiService.patch(endpoint, data);
                    break;
                default:
                    throw new Error('Unsupported method');
            }

            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const testData = {
        name: 'Test Item',
        description: 'This is a test item created via API',
        value: 42,
    };

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <h3 className="text-heading-3 mb-4">API Service Demo</h3>

                <div className="mb-4">
                    <p className="text-body text-secondary-600 mb-4">
                        Test the API service with different HTTP methods. The service automatically includes the bearer token from encrypted storage.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApiCall('GET', '/test')}
                            disabled={loading}
                        >
                            GET /test
                        </Button>

                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApiCall('POST', '/test', testData)}
                            disabled={loading}
                        >
                            POST /test
                        </Button>

                        <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleApiCall('PUT', '/test/1', testData)}
                            disabled={loading}
                        >
                            PUT /test/1
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleApiCall('PATCH', '/test/1', { name: 'Updated Name' })}
                            disabled={loading}
                        >
                            PATCH /test/1
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
                        <span className="ml-2 text-secondary-600">Making API call...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-error-50 border border-error-200 rounded-md p-4">
                        <div className="flex items-center">
                            <StatusBadge status="error" className="mr-3">Error</StatusBadge>
                            <p className="text-error-700">{error}</p>
                        </div>
                    </div>
                )}

                {response && (
                    <div className="bg-secondary-50 border border-secondary-200 rounded-md p-4">
                        <h4 className="text-heading-3 mb-3">API Response</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="text-sm text-secondary-600">Status:</span>
                                <StatusBadge status={response.status ? 'success' : 'error'} className="ml-2">
                                    {response.status ? 'Success' : 'Failed'}
                                </StatusBadge>
                            </div>
                            <div>
                                <span className="text-sm text-secondary-600">Status Code:</span>
                                <span className="ml-2 font-mono text-sm">{response.statusCode}</span>
                            </div>
                            <div>
                                <span className="text-sm text-secondary-600">Total:</span>
                                <span className="ml-2 font-mono text-sm">{response.total}</span>
                            </div>
                            <div>
                                <span className="text-sm text-secondary-600">Total Pages:</span>
                                <span className="ml-2 font-mono text-sm">{response.totalPages}</span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <span className="text-sm text-secondary-600">Message:</span>
                            <p className="text-sm text-secondary-800 mt-1">{response.message}</p>
                        </div>

                        <div>
                            <span className="text-sm text-secondary-600">Payload:</span>
                            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto mt-1">
                                {JSON.stringify(response.payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </Card>

            <Card padding="lg">
                <h3 className="text-heading-3 mb-4">Authentication Status</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">Is Authenticated:</span>
                        <StatusBadge status={apiService.isAuthenticated() ? 'success' : 'error'}>
                            {apiService.isAuthenticated() ? 'Yes' : 'No'}
                        </StatusBadge>
                    </div>
                    <div>
                        <span className="text-sm text-secondary-600">Current User:</span>
                        <p className="text-sm text-secondary-800 mt-1">
                            {apiService.getCurrentUser()?.name || 'Not logged in'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ApiDemo;
