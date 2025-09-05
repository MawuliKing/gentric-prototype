import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type {
    ReportTemplate,
    CreateReportTemplateRequest,
    UpdateReportTemplateRequest,
    ReportTemplatesResponse,
    StructuredResponse
} from '../types/api';

// Query keys for React Query
export const reportTemplatesKeys = {
    all: ['reportTemplates'] as const,
    lists: () => [...reportTemplatesKeys.all, 'list'] as const,
    list: (projectTypeId: string, page: number, pageSize: number) => [...reportTemplatesKeys.lists(), { projectTypeId, page, pageSize }] as const,
    detail: (id: string) => [...reportTemplatesKeys.all, 'detail', id] as const,
};

interface UseReportTemplatesOptions {
    projectTypeId: string;
    page?: number;
    pageSize?: number;
}

interface UseReportTemplatesReturn {
    reportTemplates: ReportTemplate[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    createReportTemplate: (data: CreateReportTemplateRequest) => Promise<ReportTemplate | null>;
    updateReportTemplate: (id: string, data: UpdateReportTemplateRequest) => Promise<ReportTemplate | null>;
    deleteReportTemplate: (id: string) => Promise<boolean>;
    refetch: () => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const useReportTemplates = (options: UseReportTemplatesOptions): UseReportTemplatesReturn => {
    const { projectTypeId, page = 1, pageSize = 10 } = options;
    const queryClient = useQueryClient();

    // Query for fetching report templates
    const {
        data: queryData,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: reportTemplatesKeys.list(projectTypeId, page, pageSize),
        queryFn: async (): Promise<ReportTemplatesResponse> => {
            const response: StructuredResponse = await apiService.get('/report-templates', {
                projectTypeId,
                page,
                pageSize
            });

            if (response.status && response.payload) {
                // The payload is directly an array of report templates
                // We need to construct the ReportTemplatesResponse object
                return {
                    reportTemplates: response.payload,
                    total: response.total,
                    totalPages: response.totalPages
                };
            } else {
                throw new Error(response.message || 'Failed to fetch report templates');
            }
        },
        enabled: !!projectTypeId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Mutation for creating report templates
    const createMutation = useMutation({
        mutationFn: async (data: CreateReportTemplateRequest): Promise<ReportTemplate> => {
            const response: StructuredResponse = await apiService.post('/report-templates', data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to create report template');
            }
        },
        onSuccess: (newReportTemplate) => {
            // Invalidate and refetch report templates queries
            queryClient.invalidateQueries({ queryKey: reportTemplatesKeys.lists() });

            // Optimistically update the current page if it's page 1
            if (page === 1) {
                queryClient.setQueryData(
                    reportTemplatesKeys.list(projectTypeId, 1, pageSize),
                    (oldData: ReportTemplatesResponse | undefined) => {
                        if (oldData) {
                            return {
                                ...oldData,
                                reportTemplates: [newReportTemplate, ...oldData.reportTemplates],
                                total: oldData.total + 1
                            };
                        }
                        return oldData;
                    }
                );
            }
        },
        onError: (error) => {
            console.error('Failed to create report template:', error);
        }
    });

    // Mutation for updating report templates
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateReportTemplateRequest }): Promise<ReportTemplate> => {
            const response: StructuredResponse = await apiService.patch(`/report-templates/${id}`, data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to update report template');
            }
        },
        onSuccess: (updatedReportTemplate) => {
            // Invalidate and refetch report templates queries
            queryClient.invalidateQueries({ queryKey: reportTemplatesKeys.lists() });

            // Optimistically update the current page
            queryClient.setQueryData(
                reportTemplatesKeys.list(projectTypeId, page, pageSize),
                (oldData: ReportTemplatesResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            reportTemplates: oldData.reportTemplates.map(template =>
                                template.id === updatedReportTemplate.id ? updatedReportTemplate : template
                            )
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to update report template:', error);
        }
    });

    // Mutation for deleting report templates
    const deleteMutation = useMutation({
        mutationFn: async (id: string): Promise<void> => {
            const response: StructuredResponse = await apiService.delete(`/report-templates/${id}`);

            if (!response.status) {
                throw new Error(response.message || 'Failed to delete report template');
            }
        },
        onSuccess: (_, deletedId) => {
            // Invalidate and refetch report templates queries
            queryClient.invalidateQueries({ queryKey: reportTemplatesKeys.lists() });

            // Optimistically update the current page
            queryClient.setQueryData(
                reportTemplatesKeys.list(projectTypeId, page, pageSize),
                (oldData: ReportTemplatesResponse | undefined) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            reportTemplates: oldData.reportTemplates.filter(template => template.id !== deletedId),
                            total: oldData.total - 1
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to delete report template:', error);
        }
    });

    const createReportTemplate = async (data: CreateReportTemplateRequest): Promise<ReportTemplate | null> => {
        try {
            const result = await createMutation.mutateAsync(data);
            return result;
        } catch (error) {
            return null;
        }
    };

    const updateReportTemplate = async (id: string, data: UpdateReportTemplateRequest): Promise<ReportTemplate | null> => {
        try {
            const result = await updateMutation.mutateAsync({ id, data });
            return result;
        } catch (error) {
            return null;
        }
    };

    const deleteReportTemplate = async (id: string): Promise<boolean> => {
        try {
            await deleteMutation.mutateAsync(id);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        reportTemplates: queryData?.reportTemplates || [],
        loading: isLoading,
        error: queryError?.message || null,
        total: queryData?.total || 0,
        totalPages: queryData?.totalPages || 0,
        currentPage: page,
        pageSize,
        createReportTemplate,
        updateReportTemplate,
        deleteReportTemplate,
        refetch,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};
