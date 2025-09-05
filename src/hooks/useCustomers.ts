import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type {
    Customer,
    CreateCustomerRequest,
    CustomersResponse,
    StructuredResponse
} from '../types/api';

export const customersKeys = {
    all: ['customers'] as const,
    lists: () => [...customersKeys.all, 'list'] as const,
    list: (page: number, pageSize: number) => [...customersKeys.lists(), { page, pageSize }] as const,
    detail: (id: string) => [...customersKeys.all, id] as const,
};

interface UseCustomersOptions {
    page?: number;
    pageSize?: number;
}

interface UseCustomersReturn {
    customers: Customer[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    createCustomer: (data: CreateCustomerRequest) => Promise<Customer | null>;
    refetch: () => void;
    isCreating: boolean;
    createError: string | null;
}

export const useCustomers = (options: UseCustomersOptions = {}): UseCustomersReturn => {
    const { page = 1, pageSize = 10 } = options;
    const queryClient = useQueryClient();

    // Query for fetching customers
    const {
        data: queryData,
        isLoading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: customersKeys.list(page, pageSize),
        queryFn: async (): Promise<CustomersResponse> => {
            const response: StructuredResponse = await apiService.get('/customers', {
                page,
                pageSize
            });

            if (response.status && response.payload) {
                // The payload is directly an array of customers
                // We need to construct the CustomersResponse object
                return {
                    customers: response.payload,
                    total: response.total,
                    totalPages: response.totalPages
                };
            } else {
                throw new Error(response.message || 'Failed to fetch customers');
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Mutation for creating customers
    const createMutation = useMutation({
        mutationFn: async (data: CreateCustomerRequest): Promise<Customer> => {
            const response: StructuredResponse = await apiService.post('/customers', data);

            if (response.status && response.payload) {
                return response.payload;
            } else {
                throw new Error(response.message || 'Failed to create customer');
            }
        },
        onSuccess: (newCustomer) => {
            // Invalidate and refetch customers queries
            queryClient.invalidateQueries({ queryKey: customersKeys.lists() });

            // Optimistically update the current page if it's page 1
            queryClient.setQueryData(
                customersKeys.list(1, pageSize), // Default page and pageSize
                (oldData: any) => {
                    if (oldData) {
                        return {
                            ...oldData,
                            customers: [newCustomer, ...oldData.customers],
                            total: oldData.total + 1
                        };
                    }
                    return oldData;
                }
            );
        },
        onError: (error) => {
            console.error('Failed to create customer:', error);
        }
    });

    const createCustomer = async (data: CreateCustomerRequest): Promise<Customer | null> => {
        try {
            const result = await createMutation.mutateAsync(data);
            return result;
        } catch (error) {
            return null;
        }
    };

    return {
        customers: queryData?.customers || [],
        loading: isLoading,
        error: queryError?.message || null,
        total: queryData?.total || 0,
        totalPages: queryData?.totalPages || 0,
        currentPage: page,
        pageSize,
        createCustomer,
        refetch,
        isCreating: createMutation.isPending,
        createError: createMutation.error?.message || null
    };
};
