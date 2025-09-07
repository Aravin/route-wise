'use client'

// import { useAuth } from '@route-wise/shared'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bus, Calendar, MapPin, CreditCard, User, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // const { user, loading } = useAuth()
  const user = null // Temporary fix
  const loading = false // Temporary fix

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.profile.firstName}!</h1>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mumbai to Delhi</p>
                      <p className="text-sm text-muted-foreground">RedBus Express • AC Sleeper</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹1,200</p>
                    <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Bangalore to Chennai</p>
                      <p className="text-sm text-muted-foreground">Orange Tours • Non-AC Seater</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹800</p>
                    <p className="text-sm text-muted-foreground">Dec 10, 2024</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link href="/bookings">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
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
                <Link href="/search">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                    <Bus className="h-6 w-6" />
                    <span>Book Bus</span>
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
      </main>

      <Footer />
    </div>
  )
}
