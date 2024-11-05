"use client";

import { ToastProvider, Toasts } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <Toasts />
      </ToastProvider>
    </QueryClientProvider>
  );
}
