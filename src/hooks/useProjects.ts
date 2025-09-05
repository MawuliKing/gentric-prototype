import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  StructuredResponse,
} from "../types/api";

// Query keys for React Query
export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...projectsKeys.lists(), { page, pageSize }] as const,
  details: () => [...projectsKeys.all, "detail"] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

interface UseProjectsOptions {
  page?: number;
  pageSize?: number;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  createProject: (data: CreateProjectRequest) => Promise<Project | null>;
  updateProject: (
    id: string,
    data: UpdateProjectRequest
  ) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  refetch: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const useProjects = (
  options: UseProjectsOptions = {}
): UseProjectsReturn => {
  const { page = 1, pageSize = 10 } = options;
  const queryClient = useQueryClient();

  // Query for fetching projects
  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: projectsKeys.list(page, pageSize),
    queryFn: async (): Promise<ProjectsResponse> => {
      const response: StructuredResponse = await apiService.get("/projects", {
        page,
        pageSize,
      });

      if (response.status && response.payload) {
        // The payload is directly an array of projects
        // We need to construct the ProjectsResponse object
        return {
          projects: response.payload,
          total: response.total,
          totalPages: response.totalPages,
        };
      } else {
        throw new Error(response.message || "Failed to fetch projects");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating projects
  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectRequest): Promise<Project> => {
      const response: StructuredResponse = await apiService.post(
        "/projects",
        data
      );

      if (response.status && response.payload) {
        return response.payload;
      } else {
        throw new Error(response.message || "Failed to create project");
      }
    },
    onSuccess: (newProject) => {
      // Invalidate and refetch projects queries
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });

      // Optimistically update the current page if it's page 1
      if (page === 1) {
        queryClient.setQueryData(
          projectsKeys.list(1, pageSize),
          (oldData: ProjectsResponse | undefined) => {
            if (oldData) {
              return {
                ...oldData,
                projects: [newProject, ...oldData.projects],
                total: oldData.total + 1,
              };
            }
            return oldData;
          }
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });

  // Mutation for updating projects
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectRequest;
    }): Promise<Project> => {
      const response: StructuredResponse = await apiService.patch(
        `/projects/${id}`,
        data
      );

      if (response.status && response.payload) {
        return response.payload;
      } else {
        throw new Error(response.message || "Failed to update project");
      }
    },
    onSuccess: (updatedProject) => {
      // Invalidate and refetch projects queries
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });

      // Optimistically update the current page
      queryClient.setQueryData(
        projectsKeys.list(page, pageSize),
        (oldData: ProjectsResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              projects: oldData.projects.map((project) =>
                project.id === updatedProject.id ? updatedProject : project
              ),
            };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });

  // Mutation for deleting projects
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response: StructuredResponse = await apiService.delete(
        `/projects/${id}`
      );

      if (!response.status) {
        throw new Error(response.message || "Failed to delete project");
      }
    },
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch projects queries
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });

      // Optimistically update the current page
      queryClient.setQueryData(
        projectsKeys.list(page, pageSize),
        (oldData: ProjectsResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              projects: oldData.projects.filter(
                (project) => project.id !== deletedId
              ),
              total: oldData.total - 1,
            };
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });

  const createProject = async (
    data: CreateProjectRequest
  ): Promise<Project | null> => {
    try {
      const result = await createMutation.mutateAsync(data);
      return result;
    } catch (error) {
      return null;
    }
  };

  const updateProject = async (
    id: string,
    data: UpdateProjectRequest
  ): Promise<Project | null> => {
    try {
      const result = await updateMutation.mutateAsync({ id, data });
      return result;
    } catch (error) {
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    projects: queryData?.projects || [],
    loading: isLoading,
    error: queryError?.message || null,
    total: queryData?.total || 0,
    totalPages: queryData?.totalPages || 0,
    currentPage: page,
    pageSize,
    createProject,
    updateProject,
    deleteProject,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
