'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Calendar, MapPin, Users, Search, Clock, Wifi, Snowflake } from 'lucide-react'

export default function SearchPage() {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
  })

  const [searchResults] = useState([
    {
      id: 1,
      operator: 'RedBus Express',
      busType: 'AC Sleeper',
      departure: '22:30',
      arrival: '06:00',
      duration: '7h 30m',
      price: 1200,
      seats: 35,
      amenities: ['AC', 'WiFi', 'Charging', 'Blanket'],
      rating: 4.5,
    },
    {
      id: 2,
      operator: 'Orange Tours',
      busType: 'Non-AC Seater',
      departure: '23:00',
      arrival: '07:00',
      duration: '8h 00m',
      price: 800,
      seats: 42,
      amenities: ['Charging'],
      rating: 4.2,
    },
    {
      id: 3,
      operator: 'Blue Line',
      busType: 'AC Semi-Sleeper',
      departure: '21:00',
      arrival: '05:30',
      duration: '8h 30m',
      price: 1000,
      seats: 38,
      amenities: ['AC', 'WiFi', 'Charging'],
      rating: 4.3,
    },
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Buses</span>
            </CardTitle>
            <CardDescription>
              Find and book buses for your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="from"
                      placeholder="Departure city"
                      className="pl-10"
                      value={searchData.from}
                      onChange={(e) => handleInputChange('from', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="to"
                      placeholder="Destination city"
                      className="pl-10"
                      value={searchData.to}
                      onChange={(e) => handleInputChange('to', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Travel Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={searchData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="10"
                      className="pl-10"
                      value={searchData.passengers}
                      onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search Buses
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Available Buses</h2>
          
          {searchResults.map((bus) => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Bus Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{bus.operator}</h3>
                      <p className="text-muted-foreground">{bus.busType}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{bus.departure}</p>
                        <p className="text-sm text-muted-foreground">Departure</p>
                      </div>
                      <div className="flex-1 text-center">
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        <p className="text-sm text-muted-foreground">{bus.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{bus.arrival}</p>
                        <p className="text-sm text-muted-foreground">Arrival</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(bus.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {bus.rating} ({bus.seats} seats left)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-muted rounded-md text-sm"
                          >
                            {amenity === 'WiFi' && <Wifi className="h-3 w-3" />}
                            {amenity === 'AC' && <Snowflake className="h-3 w-3" />}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex flex-col justify-between">
                    <div className="text-right">
                      <p className="text-3xl font-bold">₹{bus.price}</p>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    <Button className="w-full">
                      Select Seats
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
