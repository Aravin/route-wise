'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FleetManagement } from '@/components/admin/fleet-management'
import { AdminLayout } from '@/components/layout/admin-layout'

export default function FleetPage() {
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

        setIsAuthenticated(true)

        // Check onboarding status
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
        console.error('Error checking authentication or onboarding:', error)
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

  if (!isAuthenticated || !isOnboardingComplete) {
    return null // Will redirect
  }

  return (
    <AdminLayout>
      <FleetManagement />
    </AdminLayout>
  )
}
