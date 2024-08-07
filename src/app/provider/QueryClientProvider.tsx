"use client";
import { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryClientProviderProps {
  children: ReactNode;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => {
  const queryClient = new QueryClient();

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryClientProvider>
  );
};

export default QueryClientProvider;
