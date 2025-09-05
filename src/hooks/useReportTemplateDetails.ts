import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { ReportTemplate, StructuredResponse } from '../types/api';

export const reportTemplateDetailsKeys = {
    all: ['reportTemplateDetails'] as const,
    detail: (id: string) => [...reportTemplateDetailsKeys.all, id] as const,
};

interface UseReportTemplateDetailsReturn {
    reportTemplate: ReportTemplate | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useReportTemplateDetails = (id: string): UseReportTemplateDetailsReturn => {
    const {
        data: reportTemplate,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: reportTemplateDetailsKeys.detail(id),
        queryFn: async (): Promise<ReportTemplate> => {
            const response: StructuredResponse = await apiService.get(`/report-templates/${id}`);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to fetch report template details');
            }
        },
        enabled: !!id, // Only run query if id is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    return {
        reportTemplate: reportTemplate || null,
        loading: isLoading,
        error: queryError?.message || null,
        refetch,
    };
};
