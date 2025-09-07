'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Bus, Building2, MapPin, Phone, Mail } from 'lucide-react'
import { OnboardingData } from './onboarding-flow'

interface OnboardingCompleteProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: (data: Partial<OnboardingData>) => void
  onPrevious: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function OnboardingComplete({ data, onNext }: OnboardingCompleteProps) {
  const handleComplete = () => {
    onNext({ isComplete: true })
  }

  const organizationStats = [
    {
      label: 'Organization',
      value: data.organization.name || 'Not set',
      icon: Bus,
      color: 'text-blue-600',
      details: `Address: ${data.organization.address}`
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
        <p className="text-muted-foreground text-lg">
          Your RouteWise admin panel is ready to use
        </p>
      </div>

      {/* Business Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Your business information has been saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-lg">{data.organization.name}</h4>
              <p className="text-muted-foreground">{data.organization.address}</p>
              <p className="text-muted-foreground">{data.organization.email}</p>
              <p className="text-muted-foreground">{data.organization.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Registered Office</h4>
              <p className="text-muted-foreground">{data.organization.regOffice}</p>
              {data.organization.website && (
                <p className="text-muted-foreground">
                  <a href={data.organization.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {data.organization.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Configuration</CardTitle>
          <CardDescription>
            {data.business.busTypes.length > 0 || data.business.routes.length > 0 
              ? "Your bus fleet setup summary" 
              : "Fleet configuration was skipped - you can set this up later from the dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {organizationStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {stat.details && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-20 truncate" title={stat.details}>
                        {stat.details}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bus className="h-12 w-12 mx-auto mb-4" />
              <p className="mb-4">No fleet configuration completed yet.</p>
              <p className="text-sm">You can configure your bus types and routes later from the dashboard.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Details */}
      {data.organization.name && (
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>
              Your registered organization information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{data.organization.name}</p>
                  <p className="text-sm text-muted-foreground">Organization Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{data.organization.address}</p>
                  <p className="text-sm text-muted-foreground">Business Address</p>
                </div>
              </div>
              {data.organization.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{data.organization.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
              )}
              {data.organization.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{data.organization.email}</p>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>
            Here's what you can do with your RouteWise admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                View your business overview, bookings, and key metrics
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Fleet Management</h4>
              <p className="text-sm text-muted-foreground">
                Manage your bus fleet, maintenance, and operations
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Route Planning</h4>
              <p className="text-sm text-muted-foreground">
                Plan and manage your bus routes and stops
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Staff Management</h4>
              <p className="text-sm text-muted-foreground">
                Manage drivers, conductors, and other staff members
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="text-center pt-6">
        <Button size="lg" onClick={handleComplete} className="px-8">
          Go to Dashboard
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
