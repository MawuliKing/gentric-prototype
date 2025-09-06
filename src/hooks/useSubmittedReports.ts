import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type { StructuredResponse } from "../types/api";

export interface SubmittedReportField {
  id: string;
  name: string;
  type: string;
  value: any;
}

export interface SubmittedReportData {
  id: string;
  name: string;
  description: string;
  data: SubmittedReportField[];
}

export interface SubmittedReport {
  id: string;
  updatedAt: string;
  createdAt: string;
  reportData: SubmittedReportData[];
  status: string;
  project: {
    id: string;
    updatedAt: string;
    createdAt: string;
    name: string;
    description: string;
  };
  approvalComments: string | null;
  rejectionComments: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
}

export const submittedReportsKeys = {
  all: ["submittedReports"] as const,
  byProject: (projectId: string, page: number, pageSize: number) =>
    [
      ...submittedReportsKeys.all,
      "byProject",
      projectId,
      page,
      pageSize,
    ] as const,
};

interface UseSubmittedReportsOptions {
  projectId: string;
  page?: number;
  pageSize?: number;
}

interface UseSubmittedReportsReturn {
  reports: SubmittedReport[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  total: number;
  totalPages: number;
}

export const useSubmittedReports = (
  options: UseSubmittedReportsOptions
): UseSubmittedReportsReturn => {
  const { projectId, page = 1, pageSize = 10 } = options;

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: submittedReportsKeys.byProject(projectId, page, pageSize),
    queryFn: async (): Promise<{
      reports: SubmittedReport[];
      total: number;
      totalPages: number;
    }> => {
      const response: StructuredResponse = await apiService.get(
        `/reports/project/${projectId}`,
        { page, pageSize }
      );

      if (response.status && response.payload) {
        return {
          reports: response.payload,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        };
      } else {
        throw new Error(
          response.message || "Failed to fetch submitted reports"
        );
      }
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    reports: queryData?.reports || [],
    loading: isLoading,
    error: queryError?.message || null,
    refetch,
    total: queryData?.total || 0,
    totalPages: queryData?.totalPages || 0,
  };
};
