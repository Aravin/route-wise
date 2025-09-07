'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Call logout API
    fetch('/api/auth/logout')
      .then(() => {
        // Redirect to login after logout
        router.push('/auth/login')
      })
      .catch((error) => {
        console.error('Logout error:', error)
        // Still redirect to login even if API fails
        router.push('/auth/login')
      })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we log you out.</p>
      </div>
    </div>
  )
}
