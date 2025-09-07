'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bus, 
  Route, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react'

interface DashboardStats {
  totalBuses: number
  activeRoutes: number
  todaysTrips: number
  totalBookings: number
  revenue: number
  occupancyRate: number
  totalOrganizations: number
}

interface RecentBooking {
  id: string
  customer: string
  route: string
  bus: string
  amount: string
  status: string
  time: string
}

interface UpcomingTrip {
  id: string
  route: string
  bus: string
  departure: string
  driver: string
  status: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [upcomingTrips, setUpcomingTrips] = useState<UpcomingTrip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, bookingsRes, tripsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-bookings'),
          fetch('/api/dashboard/upcoming-trips')
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setRecentBookings(bookingsData)
        }

        if (tripsRes.ok) {
          const tripsData = await tripsRes.json()
          setUpcomingTrips(tripsData)
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
    },
    {
      title: 'Today\'s Trips',
      value: stats.todaysTrips.toString(),
      change: 'Coming soon',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      change: 'Coming soon',
      icon: BookOpen,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      change: 'Coming soon',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
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
          {[...Array(6)].map((_, index) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Recent Bookings</span>
            </CardTitle>
            <CardDescription>
              Latest customer bookings and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{booking.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.customer}</p>
                      <p className="text-sm">{booking.route} • {booking.bus}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{booking.amount}</p>
                      <p className="text-xs text-muted-foreground">{booking.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings yet</p>
                <p className="text-sm text-muted-foreground">Booking system coming soon</p>
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" disabled>
                View All Bookings (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Trips</span>
            </CardTitle>
            <CardDescription>
              Today's scheduled trips and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTrips.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{trip.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trip.status === 'boarding' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{trip.route}</p>
                      <p className="text-sm text-muted-foreground">{trip.bus}</p>
                      <p className="text-sm text-muted-foreground">Driver: {trip.driver}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{trip.departure}</p>
                      <p className="text-xs text-muted-foreground">Departure</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No trips scheduled</p>
                <p className="text-sm text-muted-foreground">Trip management coming soon</p>
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" disabled>
                View All Trips (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
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
