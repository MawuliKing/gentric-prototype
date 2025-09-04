// Simple API Response Format
export interface StructuredResponse {
    status: boolean;
    statusCode: number;
    message: string;
    payload: any;
    total: number;
    totalPages: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request Configuration
export interface RequestConfig {
    method: HttpMethod;
    url: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}
