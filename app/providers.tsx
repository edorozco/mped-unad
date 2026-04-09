"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/app/contexts/AuthContext"
import { UserProvider } from "@/app/contexts/UserContext"
import { JobsProvider } from "@/app/contexts/JobsContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <JobsProvider>{children}</JobsProvider>
      </UserProvider>
    </AuthProvider>
  )
}
