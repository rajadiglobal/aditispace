"use client"

/**
 * Client-side providers wrapper.
 *
 * Wraps the app with:
 *  - SessionProvider (Rimesh's auth) — makes useSession() available everywhere
 *  - QueryClientProvider (Pratibha's data fetching) — React Query global client
 *
 * This must be a Client Component because both providers use React context.
 * It is used in the Server Component layout.tsx.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside component to avoid sharing state between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute default stale time
            retry: 1,
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  )
}
