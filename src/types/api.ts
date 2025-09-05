// Account Types
export const ACCOUNT_TYPE = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    CUSTOMER: 'CUSTOMER',
} as const;

export type ACCOUNT_TYPE = typeof ACCOUNT_TYPE[keyof typeof ACCOUNT_TYPE];

// User data from API response
export interface ApiUserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phoneNumber?: string;
    type: ACCOUNT_TYPE;
    isEmailVerified: boolean;
    lastLoginAt: string;
}

// Login response payload
export interface LoginResponsePayload {
    accessToken: string;
    user: ApiUserData;
}

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

// Project Types
export interface ProjectType {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    reports?: any[]; // Array of reports associated with this project type
}

export interface CreateProjectTypeRequest {
    name: string;
    description: string;
}

export interface UpdateProjectTypeRequest {
    name: string;
    description: string;
}

export interface ProjectTypesResponse {
    projectTypes: ProjectType[];
    total: number;
    totalPages: number;
}
