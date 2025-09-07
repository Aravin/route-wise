'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mongoDBService } from '@/lib/mongodb-service'

interface WithAuthOptions {
  requireOnboarding?: boolean
}

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = { requireOnboarding: true }
) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const checkAuthAndOnboarding = async () => {
        try {
          // Check authentication
          const response = await fetch('/api/auth/me')
          if (!response.ok) {
            router.push('/auth/login')
            return
          }

          const userData = await response.json()
          setIsAuthenticated(true)

          // Check onboarding status if required
          if (options.requireOnboarding) {
            try {
              const onboardingResponse = await fetch('/api/onboarding/status')
              if (onboardingResponse.ok) {
                const onboardingData = await onboardingResponse.json()
                if (onboardingData?.isComplete) {
                  setIsOnboardingComplete(true)
                } else {
                  router.push('/onboarding')
                  return
                }
              } else {
                // If we can't check onboarding status, redirect to onboarding
                router.push('/onboarding')
                return
              }
            } catch (error) {
              console.error('Error checking onboarding status:', error)
              router.push('/onboarding')
              return
            }
          } else {
            setIsOnboardingComplete(true)
          }
        } catch (error) {
          console.error('Error checking authentication:', error)
          router.push('/auth/login')
        } finally {
          setIsLoading(false)
        }
      }

      checkAuthAndOnboarding()
    }, [router])

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

    if (!isAuthenticated || (options.requireOnboarding && !isOnboardingComplete)) {
      return null // Will redirect
    }

    return <WrappedComponent {...props} />
  }
}
