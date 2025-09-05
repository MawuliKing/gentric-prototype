import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type { Project, StructuredResponse } from "../types/api";

// Query keys for React Query
export const projectDetailsKeys = {
  all: ["projectDetails"] as const,
  detail: (projectId: string) =>
    [...projectDetailsKeys.all, "detail", projectId] as const,
};

interface UseProjectDetailsOptions {
  projectId: string;
}

interface UseProjectDetailsReturn {
  project: Project | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProjectDetails = (
  options: UseProjectDetailsOptions
): UseProjectDetailsReturn => {
  const { projectId } = options;

  // Query for fetching project details
  const {
    data: project,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: projectDetailsKeys.detail(projectId),
    queryFn: async (): Promise<Project> => {
      const response: StructuredResponse = await apiService.get(
        `/projects/${projectId}`
      );

      if (response.status && response.payload) {
        return response.payload;
      } else {
        throw new Error(response.message || "Failed to fetch project details");
      }
    },
    enabled: !!projectId, // Only run query if projectId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    project: project || null,
    loading: isLoading,
    error: queryError?.message || null,
    refetch,
  };
};
