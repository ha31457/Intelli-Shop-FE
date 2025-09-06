// components/ProtectedRoute.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[] // roles that can access this page
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const role = sessionStorage.getItem("role")

    if (!role) {
      // Not logged in → redirect to login
      router.replace("/login")
      return
    }

    if (!allowedRoles.includes(role)) {
      // Logged in but wrong role → redirect (say, to dashboard)
      router.replace("/unauthorized")
      return
    }

    // ✅ Allowed
    setIsAuthorized(true)
  }, [router, allowedRoles])

  if (!isAuthorized) {
    return null // or a loading spinner
  }

  return <>{children}</>
}
