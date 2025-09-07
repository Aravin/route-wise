'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bus, 
  Route, 
  Plus, 
  X, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Snowflake,
  Wind
} from 'lucide-react'
import { OnboardingData } from './onboarding-flow'
import { ACType, SeatingType, Amenity, getACTypeLabel, getSeatingTypeLabel, getAmenityLabel, getAmenityIcon, ALL_AMENITIES } from '@/lib/bus-types'

interface BusinessSetupProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: (data: Partial<OnboardingData>) => void
  onPrevious: () => void
  onSkip: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function BusinessSetup({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious, 
  onSkip, 
  isLastStep 
}: BusinessSetupProps) {
  const [activeTab, setActiveTab] = useState<'busTypes' | 'routes'>('busTypes')
  const [formData, setFormData] = useState(data.business)

  const tabs = [
    { id: 'busTypes', label: 'Bus Types', icon: Bus, required: true },
    { id: 'routes', label: 'Routes', icon: Route, required: true }
  ]

  const handleNext = () => {
    onNext({ business: formData })
  }

  const handleSkip = () => {
    // Save current form data even when skipping
    onUpdate({ business: formData })
    onSkip()
  }

  const isStepComplete = () => {
    const requiredTabs = tabs.filter(tab => tab.required)
    return requiredTabs.every(tab => {
      const key = tab.id as keyof typeof formData
      const items = formData[key] as any[]
      
      if (!Array.isArray(items) || items.length === 0) {
        return false
      }
      
      // Validate each item based on type
      return items.every(item => {
        switch (key) {
          case 'busTypes':
            return item.name && 
                   item.name.trim() !== '' && 
                   item.capacity > 0 && 
                   (item.seatingType === 'SEATER' ? 
                     (item.pricing.lowerSeaterPrice > 0) : 
                     item.seatingType === 'SLEEPER' ? 
                     (item.pricing.lowerSleeperPrice > 0) : 
                     item.seatingType === 'SEATER_SLEEPER' ? 
                     (item.pricing.lowerSeaterPrice > 0 && item.pricing.upperSeaterPrice > 0 && 
                      item.pricing.lowerSleeperPrice > 0 && item.pricing.upperSleeperPrice > 0) : 
                     false)
          case 'routes':
            return item.name && 
                   item.name.trim() !== '' && 
                   item.from && 
                   item.from.trim() !== '' && 
                   item.to && 
                   item.to.trim() !== '' && 
                   item.distance > 0
          default:
            return true
        }
      })
    })
  }

  const renderBusTypes = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bus Types</h3>
        <Button size="sm" onClick={() => {
          const newBusType = {
            id: `bus-type-${Date.now()}`,
            name: '',
            acType: 'AC' as const,
            seatingType: 'SEATER' as const,
            capacity: 0,
            amenities: [] as Amenity[],
            pricing: {
              lowerSeaterPrice: 0,
              upperSeaterPrice: 0,
              lowerSleeperPrice: 0,
              upperSleeperPrice: 0
            }
          }
          setFormData(prev => ({
            ...prev,
            busTypes: [...prev.busTypes, newBusType]
          }))
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bus Type
        </Button>
      </div>

      {formData.busTypes.map((busType, index) => (
        <Card key={busType.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bus Type Name *</Label>
                <Input
                  placeholder="e.g., AC Sleeper, Non-AC Seater"
                  value={busType.name}
                  onChange={(e) => {
                    const updated = [...formData.busTypes]
                    updated[index] = { ...busType, name: e.target.value }
                    setFormData(prev => ({ ...prev, busTypes: updated }))
                  }}
                  className={!busType.name || busType.name.trim() === '' ? 'border-red-300' : ''}
                />
                {(!busType.name || busType.name.trim() === '') && (
                  <p className="text-xs text-red-500">Bus type name is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>AC Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={busType.acType === 'AC' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.busTypes]
                      updated[index] = { ...busType, acType: 'AC' }
                      setFormData(prev => ({ ...prev, busTypes: updated }))
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Snowflake className="h-4 w-4" />
                    <span>{getACTypeLabel(ACType.AC)}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={busType.acType === 'NON_AC' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.busTypes]
                      updated[index] = { ...busType, acType: 'NON_AC' }
                      setFormData(prev => ({ ...prev, busTypes: updated }))
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Wind className="h-4 w-4" />
                    <span>{getACTypeLabel(ACType.NON_AC)}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Seating Type</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={busType.seatingType === 'SEATER' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.busTypes]
                      updated[index] = { ...busType, seatingType: 'SEATER' }
                      setFormData(prev => ({ ...prev, busTypes: updated }))
                    }}
                  >
                    {getSeatingTypeLabel(SeatingType.SEATER)}
                  </Button>
                  <Button
                    type="button"
                    variant={busType.seatingType === 'SLEEPER' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.busTypes]
                      updated[index] = { ...busType, seatingType: 'SLEEPER' }
                      setFormData(prev => ({ ...prev, busTypes: updated }))
                    }}
                  >
                    {getSeatingTypeLabel(SeatingType.SLEEPER)}
                  </Button>
                  <Button
                    type="button"
                    variant={busType.seatingType === 'SEATER_SLEEPER' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const updated = [...formData.busTypes]
                      updated[index] = { ...busType, seatingType: 'SEATER_SLEEPER' }
                      setFormData(prev => ({ ...prev, busTypes: updated }))
                    }}
                  >
                    {getSeatingTypeLabel(SeatingType.SEATER_SLEEPER)}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Capacity *</Label>
                <Input
                  type="number"
                  placeholder="Number of seats"
                  value={busType.capacity}
                  onChange={(e) => {
                    const updated = [...formData.busTypes]
                    updated[index] = { ...busType, capacity: parseInt(e.target.value) || 0 }
                    setFormData(prev => ({ ...prev, busTypes: updated }))
                  }}
                  className={busType.capacity <= 0 ? 'border-red-300' : ''}
                />
                {busType.capacity <= 0 && (
                  <p className="text-xs text-red-500">Capacity must be greater than 0</p>
                )}
              </div>
              {/* Pricing based on seating type */}
              {busType.seatingType === 'SEATER' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Seater Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lower Deck (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Lower deck seater price"
                        value={busType.pricing.lowerSeaterPrice}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, lowerSeaterPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={busType.pricing.lowerSeaterPrice <= 0 ? 'border-red-300' : ''}
                      />
                      {busType.pricing.lowerSeaterPrice <= 0 && (
                        <p className="text-xs text-red-500">Lower deck price is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Upper Deck (₹)</Label>
                      <Input
                        type="number"
                        placeholder="Upper deck seater price"
                        value={busType.pricing.upperSeaterPrice}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, upperSeaterPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {busType.seatingType === 'SLEEPER' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Sleeper Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lower Deck (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Lower deck sleeper price"
                        value={busType.pricing.lowerSleeperPrice}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, lowerSleeperPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={busType.pricing.lowerSleeperPrice <= 0 ? 'border-red-300' : ''}
                      />
                      {busType.pricing.lowerSleeperPrice <= 0 && (
                        <p className="text-xs text-red-500">Lower deck price is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Upper Deck (₹)</Label>
                      <Input
                        type="number"
                        placeholder="Upper deck sleeper price"
                        value={busType.pricing.upperSleeperPrice}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, upperSleeperPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {busType.seatingType === 'SEATER_SLEEPER' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Pricing Structure</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lower Seater (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Lower seater price"
                        value={busType.pricing.lowerSeaterPrice || 0}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, lowerSeaterPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={(busType.pricing.lowerSeaterPrice || 0) <= 0 ? 'border-red-300' : ''}
                      />
                      {(busType.pricing.lowerSeaterPrice || 0) <= 0 && (
                        <p className="text-xs text-red-500">Lower seater price is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Upper Seater (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Upper seater price"
                        value={busType.pricing.upperSeaterPrice || 0}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, upperSeaterPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={(busType.pricing.upperSeaterPrice || 0) <= 0 ? 'border-red-300' : ''}
                      />
                      {(busType.pricing.upperSeaterPrice || 0) <= 0 && (
                        <p className="text-xs text-red-500">Upper seater price is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Lower Sleeper (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Lower sleeper price"
                        value={busType.pricing.lowerSleeperPrice || 0}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, lowerSleeperPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={(busType.pricing.lowerSleeperPrice || 0) <= 0 ? 'border-red-300' : ''}
                      />
                      {(busType.pricing.lowerSleeperPrice || 0) <= 0 && (
                        <p className="text-xs text-red-500">Lower sleeper price is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Upper Sleeper (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Upper sleeper price"
                        value={busType.pricing.upperSleeperPrice || 0}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          updated[index] = { 
                            ...busType, 
                            pricing: { ...busType.pricing, upperSleeperPrice: parseInt(e.target.value) || 0 }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className={(busType.pricing.upperSleeperPrice || 0) <= 0 ? 'border-red-300' : ''}
                      />
                      {(busType.pricing.upperSleeperPrice || 0) <= 0 && (
                        <p className="text-xs text-red-500">Upper sleeper price is required</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {ALL_AMENITIES.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={busType.amenities.includes(amenity)}
                        onChange={(e) => {
                          const updated = [...formData.busTypes]
                          if (e.target.checked) {
                            updated[index] = { 
                              ...busType, 
                              amenities: [...busType.amenities, amenity]
                            }
                          } else {
                            updated[index] = { 
                              ...busType, 
                              amenities: busType.amenities.filter(a => a !== amenity)
                            }
                          }
                          setFormData(prev => ({ ...prev, busTypes: updated }))
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{getAmenityIcon(amenity)} {getAmenityLabel(amenity)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                const updated = formData.busTypes.filter((_, i) => i !== index)
                setFormData(prev => ({ ...prev, busTypes: updated }))
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}

      {formData.busTypes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Bus className="h-12 w-12 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">No Bus Types Added</h4>
          <p className="mb-4">Define your bus types to get started with fleet management.</p>
          <div className="text-sm space-y-1 mb-4">
            <p>• Configure AC/Non-AC options</p>
            <p>• Set seating types (Seater/Sleeper/Seater+Sleeper)</p>
            <p>• Define pricing for different deck levels</p>
            <p>• Add amenities and capacity</p>
          </div>
          <Button onClick={() => {
            const newBusType = {
              id: `bus-type-${Date.now()}`,
              name: '',
              acType: 'AC' as const,
              seatingType: 'SEATER' as const,
              capacity: 0,
              amenities: [] as Amenity[],
              pricing: {
                lowerSeaterPrice: 0,
                upperSeaterPrice: 0,
                lowerSleeperPrice: 0,
                upperSleeperPrice: 0
              }
            }
            setFormData(prev => ({
              ...prev,
              busTypes: [...prev.busTypes, newBusType]
            }))
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Bus Type
          </Button>
        </div>
      )}
    </div>
  )

  const renderRoutes = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Routes</h3>
        <Button size="sm" onClick={() => {
          const newRoute = {
            id: `route-${Date.now()}`,
            name: '',
            from: '',
            to: '',
            distance: 0,
            duration: 0,
            stops: []
          }
          setFormData(prev => ({
            ...prev,
            routes: [...prev.routes, newRoute]
          }))
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {formData.routes.map((route, index) => (
        <Card key={route.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Route Name</Label>
                <Input
                  placeholder="e.g., Mumbai to Delhi"
                  value={route.name}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { ...route, name: e.target.value }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  placeholder="Starting city"
                  value={route.from}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { ...route, from: e.target.value }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  placeholder="Destination city"
                  value={route.to}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { ...route, to: e.target.value }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  placeholder="Distance in kilometers"
                  value={route.distance}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { ...route, distance: parseInt(e.target.value) || 0 }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Input
                  type="number"
                  placeholder="Duration in hours"
                  value={route.duration}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { ...route, duration: parseInt(e.target.value) || 0 }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Stops (comma-separated)</Label>
                <Input
                  placeholder="e.g., Pune, Nashik, Ahmedabad"
                  value={route.stops.join(', ')}
                  onChange={(e) => {
                    const updated = [...formData.routes]
                    updated[index] = { 
                      ...route, 
                      stops: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }
                    setFormData(prev => ({ ...prev, routes: updated }))
                  }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                const updated = formData.routes.filter((_, i) => i !== index)
                setFormData(prev => ({ ...prev, routes: updated }))
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}

      {formData.routes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Route className="h-12 w-12 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">No Routes Added</h4>
          <p className="mb-4">Create routes to define your bus service paths.</p>
          <div className="text-sm space-y-1 mb-4">
            <p>• Set origin and destination cities</p>
            <p>• Define distance and duration</p>
            <p>• Add intermediate stops</p>
            <p>• Plan your service network</p>
          </div>
          <Button onClick={() => {
            const newRoute = {
              id: `route-${Date.now()}`,
              name: '',
              from: '',
              to: '',
              distance: 0,
              duration: 0,
              stops: []
            }
            setFormData(prev => ({
              ...prev,
              routes: [...prev.routes, newRoute]
            }))
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Route
          </Button>
        </div>
      )}
    </div>
  )


  const renderContent = () => {
    switch (activeTab) {
      case 'busTypes':
        return renderBusTypes()
      case 'routes':
        return renderRoutes()
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Bus className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Fleet Configuration</h3>
        <p className="text-muted-foreground">
          Configure your bus fleet - bus types and routes
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
          const key = tab.id as keyof typeof formData
          const items = formData[key] as any[]
          
          // Check if this specific tab is complete
          const isComplete = Array.isArray(items) && items.length > 0 && items.every(item => {
            switch (key) {
              case 'busTypes':
                return item.name && 
                       item.name.trim() !== '' && 
                       item.capacity > 0 && 
                       (item.seatingType === 'SEATER' ? 
                         (item.pricing.lowerSeaterPrice > 0) : 
                         item.seatingType === 'SLEEPER' ? 
                         (item.pricing.lowerSleeperPrice > 0) : 
                         item.seatingType === 'SEATER_SLEEPER' ? 
                         (item.pricing.lowerSeaterPrice > 0 && item.pricing.upperSeaterPrice > 0 && 
                          item.pricing.lowerSleeperPrice > 0 && item.pricing.upperSleeperPrice > 0) : 
                         false)
              case 'routes':
                return item.name && 
                       item.name.trim() !== '' && 
                       item.from && 
                       item.from.trim() !== '' && 
                       item.to && 
                       item.to.trim() !== '' && 
                       item.distance > 0
              default:
                return true
            }
          })
          
          const Icon = tab.icon
          
          return (
            <Badge
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`cursor-pointer ${isComplete ? 'bg-green-100 text-green-800' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-3 w-3 mr-1" />
              {tab.label}
              {isComplete && <CheckCircle className="h-3 w-3 ml-1" />}
            </Badge>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* Skip Warning */}
      {!isStepComplete() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800">Fleet Configuration Required</h3>
              <p className="mt-1 text-sm text-amber-700">
                You need to add at least one bus type and one route to complete the setup. 
                You can skip this step and configure your fleet later from the dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Fleet Setup
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isStepComplete()}
          >
            {isLastStep ? 'Complete Setup' : 'Next Step'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
