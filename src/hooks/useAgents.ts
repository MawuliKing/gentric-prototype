import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type {
    Agent,
    CreateAgentRequest,
    AgentsResponse,
    StructuredResponse
} from '../types/api';

export const agentsKeys = {
    all: ['agents'] as const,
    lists: () => [...agentsKeys.all, 'list'] as const,
    list: (page: number, pageSize: number) => [...agentsKeys.lists(), { page, pageSize }] as const,
    detail: (id: string) => [...agentsKeys.all, id] as const,
};

interface UseAgentsOptions {
    page?: number;
    pageSize?: number;
}

interface UseAgentsReturn {
    agents: Agent[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    createAgent: (data: CreateAgentRequest) => Promise<Agent | null>;
    refetch: () => void;
    isCreating: boolean;
    createError: string | null;
}

export const useAgents = (options: UseAgentsOptions = {}): UseAgentsReturn => {
    const { page = 1, pageSize = 10 } = options;
    const queryClient = useQueryClient();

    // Query for fetching agents
    const {
        data: queryData,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: agentsKeys.list(page, pageSize),
        queryFn: async (): Promise<AgentsResponse> => {
            const response: StructuredResponse = await apiService.get('/agents', {
                page,
                pageSize
            });

            if (response.status && response.payload) {
                // The payload is directly an array of agents
                // We need to construct the AgentsResponse object
                return {
                    agents: response.payload,
                    total: response.total,
                    totalPages: response.totalPages
                };
            } else {
                throw new Error(response.message || 'Failed to fetch agents');
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Mutation for creating agents
    const createMutation = useMutation({
        mutationFn: async (data: CreateAgentRequest): Promise<Agent> => {
            const response: StructuredResponse = await apiService.post('/agents', data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to create agent');
            }
        },
        onSuccess: (newAgent) => {
            // Invalidate and refetch agents queries
            queryClient.invalidateQueries({ queryKey: agentsKeys.lists() });

            // Optimistically update the current page if it's page 1
            queryClient.setQueryData(
                agentsKeys.list(1, 10), // Default page and pageSize
                (oldData: any) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            agents: [newAgent, ...oldData.agents],
                            total: oldData.total + 1
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to create agent:', error);
        }
    });

    const createAgent = async (data: CreateAgentRequest): Promise<Agent | null> => {
        try {
            const result = await createMutation.mutateAsync(data);
            return result;
        } catch (error) {
            return null;
        }
    };

    return {
        agents: queryData?.agents || [],
        loading: isLoading,
        error: queryError?.message || null,
        total: queryData?.total || 0,
        totalPages: queryData?.totalPages || 0,
        currentPage: page,
        pageSize,
        createAgent,
        refetch,
        isCreating: createMutation.isPending,
        createError: createMutation.error?.message || null
    };
};
