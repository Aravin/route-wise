'use client'

import { useEffect, useState } from 'react'

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Check authentication
          const response = await fetch('/api/auth/me')
          if (!response.ok) {
            window.location.href = '/api/auth/login?action=login'
            return
          }

          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error checking authentication:', error)
          window.location.href = '/api/auth/login?action=login'
        } finally {
          setIsLoading(false)
        }
      }

      checkAuth()
    }, [])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // Will redirect
    }

    return <WrappedComponent {...props} />
  }
}
