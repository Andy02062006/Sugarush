"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useStore } from "../store"

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const fetchUserData = useStore(state => state.fetchUserData)

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, fetchUserData])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreHydrator>
        {children}
      </StoreHydrator>
    </SessionProvider>
  )
}
