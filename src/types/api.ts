// Account Types
export const ACCOUNT_TYPE = {
  ADMIN: "ADMIN",
  AGENT: "AGENT",
  CUSTOMER: "CUSTOMER",
} as const;

export type ACCOUNT_TYPE = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

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
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

// Report Templates
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  createdAt: string;
  updatedAt: string;
  projectType: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ReportSection {
  id: string;
  name: string;
  fields: FormField[];
  order: number;
}

export interface FormField {
  id: string;
  type:
  | "text"
  | "number"
  | "textarea"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "date"
  | "datetime"
  | "daterange"
  | "time"
  | "color"
  | "boolean"
  | "checkbox"
  | "dropdown"
  | "file"
  | "image"
  | "select" // keeping for backward compatibility
  | "radio"; // keeping for backward compatibility
  label: string;
  required: boolean;
  options?: string[]; // For dropdown, select, radio
  placeholder?: string;
  order: number;
}

export interface CreateReportTemplateRequest {
  name: string;
  description: string;
  projectTypeId: string;
  sections: any[]; // Will be handled separately
}

export interface UpdateReportTemplateRequest {
  name: string;
  description: string;
}

export interface UpdateReportTemplateSectionsRequest {
  sections: ReportSection[];
}

export interface ReportTemplatesResponse {
  reportTemplates: ReportTemplate[];
  total: number;
  totalPages: number;
}

// Agents
export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  type: "AGENT";
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  lastLoginAt?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  assignedProjects?: number;
  performance?: {
    rating: number;
    completedTasks: number;
    totalTasks: number;
  };
}

export interface CreateAgentRequest {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
}

export interface AgentsResponse {
  agents: Agent[];
  total: number;
  totalPages: number;
}

// Customers
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  type: "CUSTOMER";
  passwordResetToken?: string | null;
  passwordResetExpires?: string | null;
  lastLoginAt?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  assignedProjects?: number;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  totalPages: number;
}

// Projects
export interface Project {
  id: string;
  name: string;
  description: string;
  assignedAgent?: Agent | null;
  customer?: Customer | null;
  projectType: ProjectType;
  createdAt: string;
  updatedAt: string;
  status?: "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED";
  dueDate?: string;
  reportProgress?: {
    totalReports: number;
    completedReports: number;
    inProgressReports: number;
    pendingReports: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  assignedAgentId?: string;
  customerId?: string;
  projectTypeId: string;
  dueDate?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  assignedAgentId?: string;
  customerId?: string;
  projectTypeId?: string;
  status?: "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED";
  dueDate?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  totalPages: number;
}
