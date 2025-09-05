import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { ProjectType, StructuredResponse } from '../types/api';

// Query keys for React Query
export const projectTypeDetailsKeys = {
    all: ['projectTypeDetails'] as const,
    detail: (id: string) => [...projectTypeDetailsKeys.all, 'detail', id] as const,
};

interface UseProjectTypeDetailsReturn {
    projectType: ProjectType | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useProjectTypeDetails = (id: string): UseProjectTypeDetailsReturn => {
    const {
        data: projectType,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: projectTypeDetailsKeys.detail(id),
        queryFn: async (): Promise<ProjectType> => {
            const response: StructuredResponse = await apiService.get(`/project-types/${id}`);

            if (response.status && response.payload) {
                // The payload is directly the project type object
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to fetch project type details');
            }
        },
        enabled: !!id, // Only run query if id is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        projectType: projectType || null,
        loading: isLoading,
        error: queryError?.message || null,
        refetch
    };
};
