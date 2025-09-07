'use client'

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
  AlertCircle
} from 'lucide-react'

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Buses',
      value: '24',
      change: '+2 this month',
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Routes',
      value: '12',
      change: '+1 this week',
      icon: Route,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Today\'s Trips',
      value: '18',
      change: '3 completed',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Bookings',
      value: '1,247',
      change: '+15% from last month',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Revenue',
      value: '₹2,45,600',
      change: '+8% from last month',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5% from last week',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  const recentBookings = [
    {
      id: 'RW001234',
      customer: 'John Doe',
      route: 'Mumbai → Delhi',
      bus: 'RedBus Express',
      amount: '₹1,200',
      status: 'confirmed',
      time: '2 hours ago'
    },
    {
      id: 'RW001235',
      customer: 'Jane Smith',
      route: 'Bangalore → Chennai',
      bus: 'Orange Tours',
      amount: '₹800',
      status: 'pending',
      time: '3 hours ago'
    },
    {
      id: 'RW001236',
      customer: 'Mike Johnson',
      route: 'Delhi → Jaipur',
      bus: 'Blue Line',
      amount: '₹600',
      status: 'confirmed',
      time: '4 hours ago'
    }
  ]

  const upcomingTrips = [
    {
      id: 'T001',
      route: 'Mumbai → Delhi',
      bus: 'RedBus Express (MH-01-AB-1234)',
      departure: '22:30',
      driver: 'Rajesh Kumar',
      status: 'scheduled'
    },
    {
      id: 'T002',
      route: 'Bangalore → Chennai',
      bus: 'Orange Tours (KA-02-CD-5678)',
      departure: '23:00',
      driver: 'Suresh Patel',
      status: 'boarding'
    },
    {
      id: 'T003',
      route: 'Delhi → Jaipur',
      bus: 'Blue Line (DL-03-EF-9012)',
      departure: '06:00',
      driver: 'Amit Singh',
      status: 'scheduled'
    }
  ]

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
        {stats.map((stat, index) => {
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
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Bookings
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
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Trips
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
