import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type {
  Project,
  ProjectsResponse,
  StructuredResponse,
} from "../types/api";

// Query keys for React Query
export const agentProjectsKeys = {
  all: ["agentProjects"] as const,
  lists: () => [...agentProjectsKeys.all, "list"] as const,
  list: (agentId: string, page: number, pageSize: number) =>
    [...agentProjectsKeys.lists(), { agentId, page, pageSize }] as const,
};

interface UseAgentProjectsOptions {
  agentId: string;
  page?: number;
  pageSize?: number;
}

interface UseAgentProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  refetch: () => void;
}

export const useAgentProjects = (
  options: UseAgentProjectsOptions
): UseAgentProjectsReturn => {
  const { agentId, page = 1, pageSize = 10 } = options;
  const queryClient = useQueryClient();

  // Query for fetching agent's projects
  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: agentProjectsKeys.list(agentId, page, pageSize),
    queryFn: async (): Promise<ProjectsResponse> => {
      const response: StructuredResponse = await apiService.get(
        `/projects/agent/${agentId}`,
        {
          page,
          pageSize,
        }
      );

      if (response.status && response.payload) {
        // The payload is directly an array of projects
        // We need to construct the ProjectsResponse object
        return {
          projects: response.payload,
          total: response.total,
          totalPages: response.totalPages,
        };
      } else {
        throw new Error(response.message || "Failed to fetch agent projects");
      }
    },
    enabled: !!agentId, // Only run query if agentId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    projects: queryData?.projects || [],
    loading: isLoading,
    error: queryError?.message || null,
    total: queryData?.total || 0,
    totalPages: queryData?.totalPages || 0,
    currentPage: page,
    pageSize,
    refetch,
  };
};
