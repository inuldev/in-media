"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 detik
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
