import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type {
    ProjectType,
    CreateProjectTypeRequest,
    UpdateProjectTypeRequest,
    ProjectTypesResponse,
    StructuredResponse
} from '../types/api';

// Query keys for React Query
export const projectTypesKeys = {
    all: ['projectTypes'] as const,
    lists: () => [...projectTypesKeys.all, 'list'] as const,
    list: (page: number, pageSize: number) => [...projectTypesKeys.lists(), { page, pageSize }] as const,
};

interface UseProjectTypesOptions {
    page?: number;
    pageSize?: number;
}

interface UseProjectTypesReturn {
    projectTypes: ProjectType[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    createProjectType: (data: CreateProjectTypeRequest) => Promise<ProjectType | null>;
    updateProjectType: (id: string, data: UpdateProjectTypeRequest) => Promise<ProjectType | null>;
    deleteProjectType: (id: string) => Promise<boolean>;
    refetch: () => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const useProjectTypes = (options: UseProjectTypesOptions = {}): UseProjectTypesReturn => {
    const { page = 1, pageSize = 10 } = options;
    const queryClient = useQueryClient();

    // Query for fetching project types
    const {
        data: queryData,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: projectTypesKeys.list(page, pageSize),
        queryFn: async (): Promise<ProjectTypesResponse> => {
            const response: StructuredResponse = await apiService.get('/project-types', {
                page,
                pageSize
            });

            if (response.status && response.payload) {
                // The payload is directly an array of project types
                // We need to construct the ProjectTypesResponse object
                return {
                    projectTypes: response.payload,
                    total: response.total,
                    totalPages: response.totalPages
                };
            } else {
                throw new Error(response.message || 'Failed to fetch project types');
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Mutation for creating project types
    const createMutation = useMutation({
        mutationFn: async (data: CreateProjectTypeRequest): Promise<ProjectType> => {
            const response: StructuredResponse = await apiService.post('/project-types', data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to create project type');
            }
        },
        onSuccess: (newProjectType) => {
            // Invalidate and refetch project types queries
            queryClient.invalidateQueries({ queryKey: projectTypesKeys.lists() });

            // Optimistically update the current page if it's page 1
            if (page === 1) {
                queryClient.setQueryData(
                    projectTypesKeys.list(1, pageSize),
                    (oldData: ProjectTypesResponse | undefined) => {
                        if (oldData) {
                            return {
                                ...oldData,
                                projectTypes: [newProjectType, ...oldData.projectTypes],
                                total: oldData.total + 1
                            };
                        }
                        return oldData;
                    }
                );
            }
        },
        onError: (error) => {
            console.error('Failed to create project type:', error);
        }
    });

    // Mutation for updating project types
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateProjectTypeRequest }): Promise<ProjectType> => {
            const response: StructuredResponse = await apiService.patch(`/project-types/${id}`, data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to update project type');
            }
        },
        onSuccess: (updatedProjectType) => {
            // Invalidate and refetch project types queries
            queryClient.invalidateQueries({ queryKey: projectTypesKeys.lists() });

            // Optimistically update the current page
            queryClient.setQueryData(
                projectTypesKeys.list(page, pageSize),
                (oldData: ProjectTypesResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            projectTypes: oldData.projectTypes.map(pt =>
                                pt.id === updatedProjectType.id ? updatedProjectType : pt
                            )
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to update project type:', error);
        }
    });

    // Mutation for deleting project types
    const deleteMutation = useMutation({
        mutationFn: async (id: string): Promise<void> => {
            const response: StructuredResponse = await apiService.delete(`/project-types/${id}`);

            if (!response.status) {
                throw new Error(response.message || 'Failed to delete project type');
            }
        },
        onSuccess: (_, deletedId) => {
            // Invalidate and refetch project types queries
            queryClient.invalidateQueries({ queryKey: projectTypesKeys.lists() });

            // Optimistically update the current page
            queryClient.setQueryData(
                projectTypesKeys.list(page, pageSize),
                (oldData: ProjectTypesResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            projectTypes: oldData.projectTypes.filter(pt => pt.id !== deletedId),
                            total: oldData.total - 1
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to delete project type:', error);
        }
    });

    const createProjectType = async (data: CreateProjectTypeRequest): Promise<ProjectType | null> => {
        try {
            const result = await createMutation.mutateAsync(data);
            return result;
        } catch (error) {
            return null;
        }
    };

    const updateProjectType = async (id: string, data: UpdateProjectTypeRequest): Promise<ProjectType | null> => {
        try {
            const result = await updateMutation.mutateAsync({ id, data });
            return result;
        } catch (error) {
            return null;
        }
    };

    const deleteProjectType = async (id: string): Promise<boolean> => {
        try {
            await deleteMutation.mutateAsync(id);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        projectTypes: queryData?.projectTypes || [],
        loading: isLoading,
        error: queryError?.message || null,
        total: queryData?.total || 0,
        totalPages: queryData?.totalPages || 0,
        currentPage: page,
        pageSize,
        createProjectType,
        updateProjectType,
        deleteProjectType,
        refetch,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};
