import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type { ReportTemplate, StructuredResponse } from "../types/api";

// Query keys for React Query
export const reportTemplateDetailsKeys = {
  all: ["reportTemplateDetails"] as const,
  detail: (templateId: string) =>
    [...reportTemplateDetailsKeys.all, "detail", templateId] as const,
};

interface UseReportTemplateDetailsOptions {
  templateId: string;
}

interface UseReportTemplateDetailsReturn {
  template: ReportTemplate | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useReportTemplateDetails = (
  options: UseReportTemplateDetailsOptions
): UseReportTemplateDetailsReturn => {
  const { templateId } = options;

  // Query for fetching report template details
  const {
    data: template,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: reportTemplateDetailsKeys.detail(templateId),
    queryFn: async (): Promise<ReportTemplate> => {
      const response: StructuredResponse = await apiService.get(
        `/report-templates/${templateId}`
      );

      if (response.status && response.payload) {
        return response.payload;
      } else {
        throw new Error(
          response.message || "Failed to fetch report template details"
        );
      }
    },
    enabled: !!templateId, // Only run query if templateId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    template: template || null,
    loading: isLoading,
    error: queryError?.message || null,
    refetch,
  };
};
