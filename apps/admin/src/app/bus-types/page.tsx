'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/layout/admin-layout'
import { 
  Bus, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users, 
  DollarSign, 
  Snowflake,
  X,
  Check,
  User,
  UserCheck,
  Lock,
  Bed
} from 'lucide-react'
import { ACType, SeatingType, Amenity } from '@/lib/bus-types'

interface BusType {
  _id: string
  name: string
  acType: ACType
  seatingType: SeatingType
  capacity: number
  lowerSeaterPrice: number
  upperSeaterPrice: number
  lowerSleeperPrice: number
  upperSleeperPrice: number
  amenities: Amenity[]
  seatConfiguration: {
    lowerDeck: {
      singleSeats: number
      doubleSeats: number
      sleeperBerths: number
      doubleSleeperBerths: number
    }
    upperDeck: {
      singleSeats: number
      doubleSeats: number
      sleeperBerths: number
      doubleSleeperBerths: number
    }
  }
  createdAt: string
  updatedAt: string
}

// Professional Seat Configuration Component
function SeatConfiguration({ 
  configuration, 
  onUpdate, 
  lowerPrice, 
  upperPrice,
  formData,
  onSeatingTypeChange
}: { 
  configuration: any
  onUpdate: (config: any) => void
  lowerPrice: number
  upperPrice: number
  formData: any
  onSeatingTypeChange: (seatingType: SeatingType) => void
}) {
  const updateSeatConfig = (deck: 'lowerDeck' | 'upperDeck', type: 'singleSeats' | 'doubleSeats' | 'sleeperBerths' | 'doubleSleeperBerths', value: number) => {
    // Soft limits: max 15 seats per side for realistic bus capacity
    const maxSeats = 15
    const clampedValue = Math.max(0, Math.min(value, maxSeats))
    
    onUpdate({
      ...configuration,
      [deck]: {
        ...configuration[deck],
        [type]: clampedValue
      }
    })
  }

  const resetSeatConfigForSeatingType = (seatingType: SeatingType) => {
    let newConfig = { ...configuration }
    
    if (seatingType === SeatingType.SLEEPER) {
      // All sleepers - reset both decks to sleeper defaults
      newConfig = {
        lowerDeck: { singleSeats: 8, doubleSeats: 8, sleeperBerths: 0, doubleSleeperBerths: 0 },
        upperDeck: { singleSeats: 8, doubleSeats: 8, sleeperBerths: 0, doubleSleeperBerths: 0 }
      }
    } else if (seatingType === SeatingType.SEATER) {
      // Lower seater, upper sleeper
      newConfig = {
        lowerDeck: { singleSeats: 8, doubleSeats: 8, sleeperBerths: 0, doubleSleeperBerths: 0 },
        upperDeck: { singleSeats: 8, doubleSeats: 8, sleeperBerths: 0, doubleSleeperBerths: 0 }
      }
    } else if (seatingType === SeatingType.SEATER_SLEEPER) {
      // Mixed - lower can have all 4 types, upper is always sleeper
      newConfig = {
        lowerDeck: { singleSeats: 4, doubleSeats: 4, sleeperBerths: 4, doubleSleeperBerths: 4 },
        upperDeck: { singleSeats: 8, doubleSeats: 8, sleeperBerths: 0, doubleSleeperBerths: 0 }
      }
    }
    
    onUpdate(newConfig)
  }

  const getTotalSeats = (deck: 'lowerDeck' | 'upperDeck') => {
    const deckConfig = configuration[deck]
    return deckConfig.singleSeats + (deckConfig.doubleSeats * 2) + deckConfig.sleeperBerths + (deckConfig.doubleSleeperBerths * 2)
  }

  const getSeatType = (deck: 'lowerDeck' | 'upperDeck') => {
    const deckConfig = configuration[deck]
    const seatingType = formData.seatingType
    
    // Determine seat type based on seating type and deck
    if (seatingType === SeatingType.SLEEPER) {
      return 'sleeper' // All sleepers
    } else if (seatingType === SeatingType.SEATER) {
      return deck === 'lowerDeck' ? 'seater' : 'sleeper' // Lower seater, upper sleeper
    } else if (seatingType === SeatingType.SEATER_SLEEPER) {
      // Mixed configuration - upper deck is always sleeper, lower deck can have all 4 types
      if (deck === 'upperDeck') return 'sleeper'
      // Lower deck - check what's actually configured
      if (deckConfig.sleeperBerths > 0) return 'sleeper'
      if (deckConfig.doubleSeats > 0 || deckConfig.singleSeats > 0) return 'seater'
      return 'seater' // Default to seater
    }
    
    return 'seater' // Default fallback
  }

  const renderBusLayout = (deck: 'lowerDeck' | 'upperDeck', deckName: string) => {
    const deckConfig = configuration[deck]
    const totalSeats = getTotalSeats(deck)
    const price = deck === 'lowerDeck' ? lowerPrice : upperPrice
    const seatType = getSeatType(deck)
    
    // Calculate rows needed for realistic bus layout
    const leftSeats = deckConfig.singleSeats
    const rightSeats = deckConfig.doubleSeats
    const sleeperBerths = deckConfig.sleeperBerths
    const maxRows = Math.max(leftSeats, rightSeats, sleeperBerths)
    
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Deck Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bus className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deckName} Deck</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{totalSeats} seats available</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{price}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">per seat</div>
            </div>
          </div>
        </div>

        {/* Real Bus Layout */}
        <div className="p-6">
          {/* Driver Area - Same space for both decks */}
          <div className="flex justify-center mb-6 h-12">
            {deck === 'lowerDeck' ? (
              <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border border-gray-600 dark:border-gray-300 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver</span>
              </div>
            ) : (
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 flex items-center space-x-2 border border-blue-300 dark:border-blue-600">
                <div className="w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                  <Bus className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Upper Deck</span>
              </div>
            )}
          </div>

          {/* Bus Layout - Left and Right Sides with Walkway */}
          <div className="w-full">
            {/* Bus Structure */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-600">
              {/* Seat Layout based on type */}
              {seatType === 'sleeper' ? (
                /* Sleeper Berth Layout - Left and Right Sides */
                <div className="flex justify-center space-x-4">
                  {/* Left Side (Single Sleepers) */}
                  <div className="w-16 space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center mb-2">Left Side</div>
                    {Array.from({ length: leftSeats }).map((_, index) => (
                      <div key={`left-sleeper-${index}`} className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600 rounded flex items-center justify-center shadow-sm">
                        <Bed className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    ))}
                    {leftSeats === 0 && (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                      </div>
                    )}
                  </div>

                  {/* Walkway */}
                  <div className="w-8 flex items-center justify-center">
                    <div className="w-1 h-full bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                  </div>

                  {/* Right Side (Double Sleepers) */}
                  <div className="w-32 space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center mb-2">Right Side (1+1)</div>
                    {Array.from({ length: rightSeats }).map((_, index) => (
                      <div key={`right-sleeper-${index}`} className="flex space-x-1">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600 rounded flex items-center justify-center shadow-sm">
                          <Bed className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600 rounded flex items-center justify-center shadow-sm">
                          <Bed className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    ))}
                    {rightSeats === 0 && (
                      <div className="flex space-x-1">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Seater Layout (Single + Double) */
                <div className="flex justify-center space-x-4">
                  {/* Left Side Seats */}
                  <div className="w-16 space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center mb-2">Left Side</div>
                    {Array.from({ length: leftSeats }).map((_, index) => (
                      <div key={`left-${index}`} className="w-12 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center shadow-sm">
                        <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    ))}
                    {leftSeats === 0 && (
                      <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                      </div>
                    )}
                  </div>

                  {/* Walkway */}
                  <div className="w-8 flex items-center justify-center">
                    <div className="w-1 h-full bg-yellow-200 dark:bg-yellow-800 rounded"></div>
                  </div>

                  {/* Right Side (Double Seats) */}
                  <div className="w-32 space-y-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center mb-2">Right Side (1+1)</div>
                    {Array.from({ length: rightSeats }).map((_, index) => (
                      <div key={`right-${index}`} className="flex space-x-1">
                        <div className="w-12 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center shadow-sm">
                          <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="w-12 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center shadow-sm">
                          <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    ))}
                    {rightSeats === 0 && (
                      <div className="flex space-x-1">
                        <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                        </div>
                        <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seat Type Indicators */}
              <div className="mt-4 flex justify-center space-x-6">
                {seatType === 'sleeper' ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600 rounded flex items-center justify-center">
                        <Bed className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Single Sleeper</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600 rounded flex items-center justify-center">
                        <Bed className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Double Sleeper</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 rounded flex items-center justify-center">
                        <User className="h-2 w-2 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Single Seater</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 rounded flex items-center justify-center">
                        <User className="h-2 w-2 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Double Seater</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          {/* Validation Warning */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Maximum 15 seats per side for realistic bus capacity
              </span>
            </div>
          </div>
          
          {seatType === 'sleeper' ? (
            /* Sleeper Berth Controls - Left and Right */
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Left Side - Single Sleepers ({leftSeats})</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats - 1)}
                    disabled={deckConfig.singleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.singleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'singleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats + 1)}
                    disabled={deckConfig.singleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Right Side - Double Sleepers ({rightSeats})</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats - 1)}
                    disabled={deckConfig.doubleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.doubleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'doubleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats + 1)}
                    disabled={deckConfig.doubleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ) : formData.seatingType === SeatingType.SEATER_SLEEPER && deck === 'lowerDeck' ? (
            /* Mixed Configuration - All 4 Types for Lower Deck */
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Single Seater</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats - 1)}
                    disabled={deckConfig.singleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.singleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'singleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats + 1)}
                    disabled={deckConfig.singleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Single Sleeper</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'sleeperBerths', deckConfig.sleeperBerths - 1)}
                    disabled={deckConfig.sleeperBerths <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.sleeperBerths}
                    onChange={(e) => updateSeatConfig(deck, 'sleeperBerths', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'sleeperBerths', deckConfig.sleeperBerths + 1)}
                    disabled={deckConfig.sleeperBerths >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Double Seater</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats - 1)}
                    disabled={deckConfig.doubleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.doubleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'doubleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats + 1)}
                    disabled={deckConfig.doubleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Double Sleeper</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSleeperBerths', deckConfig.doubleSleeperBerths - 1)}
                    disabled={deckConfig.doubleSleeperBerths <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.doubleSleeperBerths}
                    onChange={(e) => updateSeatConfig(deck, 'doubleSleeperBerths', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSleeperBerths', deckConfig.doubleSleeperBerths + 1)}
                    disabled={deckConfig.doubleSleeperBerths >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Seater Controls */
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Left Side - Single Seats ({leftSeats})</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats - 1)}
                    disabled={deckConfig.singleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.singleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'singleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'singleSeats', deckConfig.singleSeats + 1)}
                    disabled={deckConfig.singleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Right Side - Double Seats ({rightSeats})</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats - 1)}
                    disabled={deckConfig.doubleSeats <= 0}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={deckConfig.doubleSeats}
                    onChange={(e) => updateSeatConfig(deck, 'doubleSeats', parseInt(e.target.value) || 0)}
                    className="w-16 text-center h-8"
                    min="0"
                    max="15"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateSeatConfig(deck, 'doubleSeats', deckConfig.doubleSeats + 1)}
                    disabled={deckConfig.doubleSeats >= 15}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bus Seat Configuration</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Design your bus layout with different seat types and pricing
        </p>
      </div>

      {/* Seating Type Selector */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Seating Type</h4>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              onSeatingTypeChange(SeatingType.SEATER)
              resetSeatConfigForSeatingType(SeatingType.SEATER)
            }}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              formData.seatingType === SeatingType.SEATER
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Seater</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Lower: Seater, Upper: Sleeper
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => {
              onSeatingTypeChange(SeatingType.SLEEPER)
              resetSeatConfigForSeatingType(SeatingType.SLEEPER)
            }}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              formData.seatingType === SeatingType.SLEEPER
                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-400 dark:bg-purple-900/20 dark:text-purple-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bed className="h-5 w-5" />
              <span>Sleeper</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All Sleepers
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => {
              onSeatingTypeChange(SeatingType.SEATER_SLEEPER)
              resetSeatConfigForSeatingType(SeatingType.SEATER_SLEEPER)
            }}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
              formData.seatingType === SeatingType.SEATER_SLEEPER
                ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bus className="h-4 w-4" />
              <span>Mixed</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Flexible Configuration
            </div>
          </button>
        </div>
      </div>
      
      <div className="flex justify-center gap-8">
        <div className="w-full max-w-md">
          {renderBusLayout('lowerDeck', 'Lower')}
        </div>
        <div className="w-full max-w-md">
          {renderBusLayout('upperDeck', 'Upper')}
        </div>
      </div>
      
      {/* Real Bus Layout Legend */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real Bus Layout</h4>
        <div className="space-y-4">
          {/* Bus Layout Diagram */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Typical Bus Layout</div>
            </div>
            <div className="flex justify-center space-x-4">
              {/* Left Side */}
              <div className="w-16 space-y-2">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">Left Side</div>
                <div className="w-12 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center mx-auto">
                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="w-12 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center mx-auto">
                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">Single Seater</div>
              </div>

              {/* Walkway */}
              <div className="w-8 flex items-center justify-center">
                <div className="w-1 h-16 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
              </div>

              {/* Right Side */}
              <div className="w-32 space-y-2">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">Right Side (1+1)</div>
                <div className="flex space-x-1">
                  <div className="w-12 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded flex items-center justify-center">
                    <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="w-12 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded flex items-center justify-center">
                    <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-12 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded flex items-center justify-center">
                    <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="w-12 h-8 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded flex items-center justify-center">
                    <User className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">Double Seater</div>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Left Side - Single Seater</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Individual seats on the left side</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded flex items-center justify-center">
                <div className="flex space-x-1">
                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Right Side - Double Seater</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Side-by-side seats (1+1) on the right</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BusTypesContent() {
  const [busTypes, setBusTypes] = useState<BusType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBusType, setEditingBusType] = useState<BusType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    acType: ACType.NON_AC,
    seatingType: SeatingType.SEATER,
    capacity: 0,
    lowerSeaterPrice: 0,
    upperSeaterPrice: 0,
    lowerSleeperPrice: 0,
    upperSleeperPrice: 0,
    amenities: [] as Amenity[],
    seatConfiguration: {
      lowerDeck: {
        singleSeats: 8,
        doubleSeats: 8,
        sleeperBerths: 0,
        doubleSleeperBerths: 0
      },
      upperDeck: {
        singleSeats: 8,
        doubleSeats: 8,
        sleeperBerths: 0,
        doubleSleeperBerths: 0
      }
    }
  })

  useEffect(() => {
    fetchBusTypes()
    
    // Check if we should open the form from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('openForm') === 'true') {
      setShowForm(true)
    }
  }, [])

  const fetchBusTypes = async () => {
    try {
      const response = await fetch('/api/bus-types')
      if (response.ok) {
        const data = await response.json()
        setBusTypes(data)
      }
    } catch (error) {
      console.error('Error fetching bus types:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingBusType ? `/api/bus-types/${editingBusType._id}` : '/api/bus-types'
      const method = editingBusType ? 'PUT' : 'POST'
      
      // Calculate total capacity
      const lowerTotal = formData.seatConfiguration.lowerDeck.singleSeats + 
                        (formData.seatConfiguration.lowerDeck.doubleSeats * 2) + 
                        formData.seatConfiguration.lowerDeck.sleeperBerths +
                        (formData.seatConfiguration.lowerDeck.doubleSleeperBerths * 2)
      const upperTotal = formData.seatConfiguration.upperDeck.singleSeats + 
                        (formData.seatConfiguration.upperDeck.doubleSeats * 2) + 
                        formData.seatConfiguration.upperDeck.sleeperBerths +
                        (formData.seatConfiguration.upperDeck.doubleSleeperBerths * 2)
      const totalCapacity = lowerTotal + upperTotal
      
      const submitData = {
        ...formData,
        capacity: totalCapacity
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchBusTypes()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving bus type:', error)
    }
  }

  const handleEdit = (busType: BusType) => {
    setEditingBusType(busType)
    setFormData({
      name: busType.name,
      acType: busType.acType,
      seatingType: busType.seatingType,
      capacity: busType.capacity,
      lowerSeaterPrice: busType.lowerSeaterPrice,
      upperSeaterPrice: busType.upperSeaterPrice,
      lowerSleeperPrice: busType.lowerSleeperPrice,
      upperSleeperPrice: busType.upperSleeperPrice,
      amenities: busType.amenities,
      seatConfiguration: {
        lowerDeck: {
          singleSeats: 8,
          doubleSeats: 8,
          sleeperBerths: 0,
          doubleSleeperBerths: 0
        },
        upperDeck: {
          singleSeats: 8,
          doubleSeats: 8,
          sleeperBerths: 0,
          doubleSleeperBerths: 0
        }
      }
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bus type?')) {
      try {
        const response = await fetch(`/api/bus-types/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchBusTypes()
        }
      } catch (error) {
        console.error('Error deleting bus type:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      acType: ACType.NON_AC,
      seatingType: SeatingType.SEATER,
      capacity: 0,
      lowerSeaterPrice: 0,
      upperSeaterPrice: 0,
      lowerSleeperPrice: 0,
      upperSleeperPrice: 0,
      amenities: [],
      seatConfiguration: {
        lowerDeck: {
          singleSeats: 8,
          doubleSeats: 8,
          sleeperBerths: 0,
          doubleSleeperBerths: 0
        },
        upperDeck: {
          singleSeats: 8,
          doubleSeats: 8,
          sleeperBerths: 0,
          doubleSleeperBerths: 0
        }
      }
    })
    setEditingBusType(null)
    setShowForm(false)
  }

  const toggleAmenity = (amenity: Amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const filteredBusTypes = busTypes.filter(busType =>
    busType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    busType.acType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    busType.seatingType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bus Types</h1>
          <p className="text-muted-foreground">Manage your bus fleet configurations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bus Type
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bus types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          {filteredBusTypes.length} bus type{filteredBusTypes.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingBusType ? 'Edit Bus Type' : 'Add New Bus Type'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Bus Type Name *</Label>
                    <div className="relative">
                      <Bus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter bus type name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acType">AC Type *</Label>
                    <select
                      id="acType"
                      value={formData.acType}
                      onChange={(e) => setFormData(prev => ({ ...prev, acType: e.target.value as ACType }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value={ACType.NON_AC}>Non-AC</option>
                      <option value={ACType.AC}>AC</option>
                    </select>
                  </div>

                </div>

                {/* Capacity - Auto-calculated */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Total Capacity</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Auto-calculated"
                      className="pl-10 bg-muted"
                      value={(() => {
                        const lowerTotal = formData.seatConfiguration.lowerDeck.singleSeats + 
                                         (formData.seatConfiguration.lowerDeck.doubleSeats * 2) + 
                                         formData.seatConfiguration.lowerDeck.sleeperBerths
                        const upperTotal = formData.seatConfiguration.upperDeck.singleSeats + 
                                         (formData.seatConfiguration.upperDeck.doubleSeats * 2) + 
                                         formData.seatConfiguration.upperDeck.sleeperBerths
                        return lowerTotal + upperTotal
                      })()}
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Capacity is automatically calculated based on seat configuration
                  </p>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lowerSeaterPrice">Lower Deck Seater Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lowerSeaterPrice"
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={formData.lowerSeaterPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, lowerSeaterPrice: parseInt(e.target.value) || 0 }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upperSeaterPrice">Upper Deck Seater Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="upperSeaterPrice"
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={formData.upperSeaterPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, upperSeaterPrice: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowerSleeperPrice">Lower Deck Sleeper Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lowerSleeperPrice"
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={formData.lowerSleeperPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, lowerSleeperPrice: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upperSleeperPrice">Upper Deck Sleeper Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="upperSleeperPrice"
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={formData.upperSleeperPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, upperSleeperPrice: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seat Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Seat Configuration</h3>
                  <SeatConfiguration
                    configuration={formData.seatConfiguration}
                    onUpdate={(config) => setFormData(prev => ({ ...prev, seatConfiguration: config }))}
                    lowerPrice={formData.lowerSeaterPrice}
                    upperPrice={formData.upperSeaterPrice}
                    formData={formData}
                    onSeatingTypeChange={(seatingType) => setFormData(prev => ({ ...prev, seatingType }))}
                  />
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.values(Amenity).map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center space-x-2 p-2 rounded-md border ${
                          formData.amenities.includes(amenity)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {formData.amenities.includes(amenity) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        <span className="text-sm">{amenity}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBusType ? 'Update Bus Type' : 'Add Bus Type'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bus Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusTypes.map((busType) => (
          <Card key={busType._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{busType.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1 space-x-2">
                    <Badge variant={busType.acType === ACType.AC ? 'default' : 'secondary'}>
                      {busType.acType}
                    </Badge>
                    <Badge variant="outline">
                      {busType.seatingType}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(busType)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(busType._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Capacity</p>
                    <p className="text-sm text-muted-foreground">{busType.capacity} passengers</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Pricing</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Lower Seater: ₹{busType.lowerSeaterPrice}</p>
                    {busType.upperSeaterPrice > 0 && <p>Upper Seater: ₹{busType.upperSeaterPrice}</p>}
                    {busType.lowerSleeperPrice > 0 && <p>Lower Sleeper: ₹{busType.lowerSleeperPrice}</p>}
                    {busType.upperSleeperPrice > 0 && <p>Upper Sleeper: ₹{busType.upperSleeperPrice}</p>}
                  </div>
                </div>

                {busType.amenities.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {busType.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusTypes.length === 0 && (
        <div className="text-center py-12">
          <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No bus types found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first bus type'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bus Type
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default function BusTypesPage() {
  return (
    <AdminLayout>
      <BusTypesContent />
    </AdminLayout>
  )
}
