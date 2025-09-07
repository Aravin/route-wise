'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bus, 
  Route, 
  Calendar,
  Users,
  Building2,
  CheckCircle,
  Circle
} from 'lucide-react'

interface DashboardStats {
  totalBuses: number
  activeRoutes: number
  totalOrganizations: number
}

interface OnboardingProgress {
  organizationCreated: boolean
  busTypeCreated: boolean
  routeCreated: boolean
  isComplete: boolean
  completedSteps: number
  totalSteps: number
}



export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/onboarding/progress')
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json()
          setOnboardingProgress(progressData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsConfig = stats ? [
    {
      title: 'Total Bus Types',
      value: stats.totalBuses.toString(),
      change: 'Configured',
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Routes',
      value: stats.activeRoutes.toString(),
      change: 'Configured',
      icon: Route,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Organizations',
      value: stats.totalOrganizations.toString(),
      change: 'Active',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ] : []

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your bus operations.
        </p>
      </div>

      {/* Onboarding Progress */}
      {onboardingProgress && !onboardingProgress.isComplete && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-900 dark:text-blue-100">Complete Your Setup</span>
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Finish setting up your account to unlock all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(onboardingProgress.completedSteps / onboardingProgress.totalSteps) * 100}%` }}
                />
              </div>
              
              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {onboardingProgress.organizationCreated ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${onboardingProgress.organizationCreated ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Create your organization
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Set up your company details and contact information
                    </p>
                  </div>
                  {!onboardingProgress.organizationCreated && (
                    <Button size="sm" variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50">
                      <a href="/organizations?openForm=true">Complete</a>
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {onboardingProgress.busTypeCreated ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${onboardingProgress.busTypeCreated ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Add at least one bus type
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Configure your bus types with seating and pricing
                    </p>
                  </div>
                  {!onboardingProgress.busTypeCreated && (
                    <Button size="sm" variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50">
                      <a href="/bus-types?openForm=true">Complete</a>
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {onboardingProgress.routeCreated ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${onboardingProgress.routeCreated ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Create at least one route
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Set up your travel routes and destinations
                    </p>
                  </div>
                  {!onboardingProgress.routeCreated && (
                    <Button size="sm" variant="outline" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50">
                      <a href="/routes?openForm=true">Complete</a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {onboardingProgress.completedSteps} of {onboardingProgress.totalSteps} steps completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for managing your operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Bus className="h-6 w-6" />
              <span>Add Bus</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Route className="h-6 w-6" />
              <span>Create Route</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Trip</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Add Driver</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
