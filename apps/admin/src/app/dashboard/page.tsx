'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bus, Calendar, MapPin, CreditCard, User, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
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
          window.location.href = '/api/auth/login?action=login'
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
        window.location.href = '/api/auth/login?action=login'
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-muted-foreground">Manage your bookings and travel preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Next trip in 2 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8,400</div>
              <p className="text-xs text-muted-foreground">
                +₹1,200 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest bus bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent bookings</p>
                <p className="text-sm text-muted-foreground">Booking system coming soon</p>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" disabled>
                  View All Bookings (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/bus-types">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Bus className="h-6 w-6" />
                    <span>Bus Types</span>
                  </Button>
                </Link>

                <Link href="/bookings">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span>My Bookings</span>
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <User className="h-6 w-6" />
                    <span>Profile</span>
                  </Button>
                </Link>

                <Link href="/settings">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </AdminLayout>
  )
}
