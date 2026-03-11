"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useStore } from "../store"

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const fetchUserData = useStore(state => state.fetchUserData)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData()
    } else if (status === "unauthenticated") {
      // Protect all routes except splash and login
      if (pathname !== '/' && pathname !== '/login') {
        router.push('/login')
      }
    }
  }, [status, fetchUserData, pathname, router])

  // Show nothing if loading to prevent flicker flashes
  if (status === "loading") {
    return <div className="min-h-screen bg-bg flex items-center justify-center"></div>
  }

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
