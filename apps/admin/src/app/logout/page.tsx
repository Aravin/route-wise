'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Call logout API to clear cookies and redirect to logout success
    fetch('/api/auth/logout')
      .then(() => {
        // Redirect to logout success page
        window.location.href = '/logout-success'
      })
      .catch((error) => {
        console.error('Logout error:', error)
        // Still redirect to logout success even if API fails
        window.location.href = '/logout-success'
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
