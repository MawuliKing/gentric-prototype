import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type {
    ReportTemplate,
    UpdateReportTemplateSectionsRequest,
    StructuredResponse
} from '../types/api';
import { reportTemplatesKeys } from './useReportTemplates';
import { reportTemplateDetailsKeys } from './useReportTemplateDetails';

interface UseReportTemplateSectionsReturn {
    updateTemplateSections: (templateId: string, sections: any[]) => Promise<ReportTemplate | null>;
    isUpdating: boolean;
    error: string | null;
}

export const useReportTemplateSections = (): UseReportTemplateSectionsReturn => {
    const queryClient = useQueryClient();

    // Mutation for updating report template sections
    const updateMutation = useMutation({
        mutationFn: async ({ templateId, sections }: { templateId: string; sections: any[] }): Promise<ReportTemplate> => {
            const response: StructuredResponse = await apiService.patch(`/report-templates/${templateId}`, {
                sections
            });

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to update report template sections');
            }
        },
        onSuccess: (updatedReportTemplate, { templateId }) => {
            // Invalidate and refetch report template details
            queryClient.invalidateQueries({ queryKey: reportTemplateDetailsKeys.detail(templateId) });

            // Invalidate report templates lists
            queryClient.invalidateQueries({ queryKey: reportTemplatesKeys.all });

            // Update the specific template in cache
            queryClient.setQueryData(
                reportTemplateDetailsKeys.detail(templateId),
                updatedReportTemplate
            );
        },
        onError: (error) => {
            console.error('Failed to update report template sections:', error);
        }
    });

    const updateTemplateSections = async (templateId: string, sections: any[]): Promise<ReportTemplate | null> => {
        try {
            const result = await updateMutation.mutateAsync({ templateId, sections });
            return result;
        } catch (error) {
            return null;
        }
    };

    return {
        updateTemplateSections,
        isUpdating: updateMutation.isPending,
        error: updateMutation.error?.message || null
    };
};
