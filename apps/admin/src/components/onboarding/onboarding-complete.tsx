'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Bus, Route } from 'lucide-react'
import { OnboardingData } from './onboarding-flow'
import { getAmenityLabel, getAmenityIcon } from '@/lib/bus-types'

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

  const stats = [
    {
      label: 'Bus Types',
      value: data.business.busTypes.length,
      icon: Bus,
      color: 'text-blue-600',
      details: data.business.busTypes.map(bt => `${bt.acType} ${bt.seatingType}`).join(', ')
    },
    {
      label: 'Routes',
      value: data.business.routes.length,
      icon: Route,
      color: 'text-green-600'
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
          {data.business.busTypes.length > 0 || data.business.routes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
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

      {/* Bus Types Details */}
      {data.business.busTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configured Bus Types</CardTitle>
            <CardDescription>
              Details of your bus type configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.business.busTypes.map((busType, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{busType.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {busType.acType} {busType.seatingType}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Capacity: {busType.capacity} seats
                    {busType.seatingType === 'SEATER' && (
                      <div className="mt-1 text-xs">
                        Lower: ₹{busType.pricing.lowerSeaterPrice} • Upper: ₹{busType.pricing.upperSeaterPrice}
                      </div>
                    )}
                    {busType.seatingType === 'SLEEPER' && (
                      <div className="mt-1 text-xs">
                        Lower: ₹{busType.pricing.lowerSleeperPrice} • Upper: ₹{busType.pricing.upperSleeperPrice}
                      </div>
                    )}
                    {busType.seatingType === 'SEATER_SLEEPER' && (
                      <div className="mt-1 text-xs">
                        <div>Lower Seater: ₹{busType.pricing.lowerSeaterPrice} • Upper Seater: ₹{busType.pricing.upperSeaterPrice}</div>
                        <div>Lower Sleeper: ₹{busType.pricing.lowerSleeperPrice} • Upper Sleeper: ₹{busType.pricing.upperSleeperPrice}</div>
                      </div>
                    )}
                  </div>
                  {busType.amenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {busType.amenities.map((amenity, amenityIndex) => (
                          <span
                            key={amenityIndex}
                            className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            <span>{getAmenityIcon(amenity)}</span>
                            <span>{getAmenityLabel(amenity)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
