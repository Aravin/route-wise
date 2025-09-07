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
  Check
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
  createdAt: string
  updatedAt: string
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
    amenities: [] as Amenity[]
  })

  useEffect(() => {
    fetchBusTypes()
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
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      amenities: busType.amenities
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
      amenities: []
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

                  <div className="space-y-2">
                    <Label htmlFor="seatingType">Seating Type *</Label>
                    <select
                      id="seatingType"
                      value={formData.seatingType}
                      onChange={(e) => setFormData(prev => ({ ...prev, seatingType: e.target.value as SeatingType }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value={SeatingType.SEATER}>Seater</option>
                      <option value={SeatingType.SLEEPER}>Sleeper</option>
                      <option value={SeatingType.SEATER_SLEEPER}>Seater + Sleeper</option>
                    </select>
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Enter passenger capacity"
                      className="pl-10"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
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
