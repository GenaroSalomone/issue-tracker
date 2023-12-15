'use client';
import React, { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';

//Cache for storing data obtained from backend
const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryClientProvider client={queryClient}>
      { children }
    </ReactQueryClientProvider>
  )
}

export default QueryClientProvider