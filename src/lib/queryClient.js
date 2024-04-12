import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 12 * 60 * 60 * 1000, // 12 hours
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  }
});
