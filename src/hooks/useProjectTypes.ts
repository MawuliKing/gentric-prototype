import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type {
    ProjectType,
    CreateProjectTypeRequest,
    ProjectTypesResponse,
    StructuredResponse
} from '../types/api';

interface UseProjectTypesReturn {
    projectTypes: ProjectType[];
    loading: boolean;
    error: string | null;
    createProjectType: (data: CreateProjectTypeRequest) => Promise<ProjectType | null>;
    getProjectTypes: (page?: number, limit?: number) => Promise<void>;
    clearError: () => void;
}

export const useProjectTypes = (): UseProjectTypesReturn => {
    const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const createProjectType = useCallback(async (data: CreateProjectTypeRequest): Promise<ProjectType | null> => {
        setLoading(true);
        setError(null);

        try {
            const response: StructuredResponse = await apiService.post('/project-types', data);

            if (response.status && response.payload) {
                const newProjectType: ProjectType = response.payload;
                setProjectTypes(prev => [newProjectType, ...prev]);
                return newProjectType;
            } else {
                setError(response.message || 'Failed to create project type');
                return null;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getProjectTypes = useCallback(async (page: number = 1, limit: number = 10): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response: StructuredResponse = await apiService.get('/project-types', {
                page,
                limit
            });

            if (response.status && response.payload) {
                const projectTypesData: ProjectTypesResponse = response.payload;
                setProjectTypes(projectTypesData.projectTypes);
            } else {
                setError(response.message || 'Failed to fetch project types');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        projectTypes,
        loading,
        error,
        createProjectType,
        getProjectTypes,
        clearError
    };
};
