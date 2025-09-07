import type { StructuredResponse, RequestConfig } from '../types/api';
import EncryptedStorage from './encryptedStorage';

// Get BASE_URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = BASE_URL;
    }

    // Get bearer token from encrypted storage
    private getBearerToken(): string | null {
        const token = EncryptedStorage.getToken();
        return token?.accessToken || null;
    }

    // Build full URL
    private buildURL(endpoint: string): string {
        const cleanBaseURL = this.baseURL.replace(/\/$/, '');
        const cleanEndpoint = endpoint.replace(/^\//, '');
        return `${cleanBaseURL}/${cleanEndpoint}`;
    }

    // Build headers with bearer token
    private buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders,
        };

        // Add bearer token if available
        const token = this.getBearerToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Build query string for GET requests
    private buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        return searchParams.toString();
    }

    // Make HTTP request
    private async makeRequest(config: RequestConfig): Promise<StructuredResponse> {
        const { method, url, data, params, headers = {} } = config;

        const fullURL = this.buildURL(url);
        const requestHeaders = this.buildHeaders(headers);


        // Build final URL with query parameters for GET requests
        let finalURL = fullURL;
        if (params && Object.keys(params).length > 0) {
            const queryString = this.buildQueryString(params);
            finalURL = `${fullURL}?${queryString}`;
        }

        try {
            const requestInit: RequestInit = {
                method,
                headers: requestHeaders,
            };


            // Add body for non-GET requests
            if (data && method !== 'GET') {
                requestInit.body = JSON.stringify(data);
            }

            const response = await fetch(finalURL, requestInit);
            const responseData: StructuredResponse = await response.json();

            return responseData;
        } catch (error) {
            // Return error response in the same format
            return {
                status: false,
                statusCode: 500,
                message: error instanceof Error ? error.message : 'Network error',
                payload: null,
                total: 0,
                totalPages: 0,
            };
        }
    }

    // GET request
    async get(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<StructuredResponse> {
        return this.makeRequest({
            method: 'GET',
            url: endpoint,
            params,
            headers,
        });
    }

    // POST request
    async post(endpoint: string, data?: any, headers?: Record<string, string>): Promise<StructuredResponse> {
        return this.makeRequest({
            method: 'POST',
            url: endpoint,
            data,
            headers,
        });
    }

    // PUT request
    async put(endpoint: string, data?: any, headers?: Record<string, string>): Promise<StructuredResponse> {
        return this.makeRequest({
            method: 'PUT',
            url: endpoint,
            data,
            headers,
        });
    }

    // PATCH request
    async patch(endpoint: string, data?: any, headers?: Record<string, string>): Promise<StructuredResponse> {
        return this.makeRequest({
            method: 'PATCH',
            url: endpoint,
            data,
            headers,
        });
    }

    // DELETE request
    async delete(endpoint: string, headers?: Record<string, string>): Promise<StructuredResponse> {
        return this.makeRequest({
            method: 'DELETE',
            url: endpoint,
            headers,
        });
    }

    // Utility method to check if user is authenticated
    isAuthenticated(): boolean {
        return EncryptedStorage.isAuthenticated();
    }

    // Utility method to get current user
    getCurrentUser() {
        return EncryptedStorage.getUserData();
    }

    // Report Actions
    async approveReport(reportId: string, comments: string): Promise<StructuredResponse> {
        return this.patch(`/reports/${reportId}/approve`, { comments });
    }

    async rejectReport(reportId: string, comments: string): Promise<StructuredResponse> {
        return this.patch(`/reports/${reportId}/reject`, { comments });
    }

    async deleteReport(reportId: string): Promise<StructuredResponse> {
        return this.delete(`/reports/${reportId}`);
    }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for custom instances
export default ApiService;
