'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bus, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Wrench,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export function FleetManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const buses = [
    {
      id: 'B001',
      registrationNumber: 'MH-01-AB-1234',
      name: 'RedBus Express',
      type: 'AC Sleeper',
      capacity: 35,
      status: 'active',
      lastService: '2024-01-15',
      nextService: '2024-02-15',
      currentRoute: 'Mumbai → Delhi',
      driver: 'Rajesh Kumar',
      conductor: 'Suresh Patel'
    },
    {
      id: 'B002',
      registrationNumber: 'KA-02-CD-5678',
      name: 'Orange Tours',
      type: 'Non-AC Seater',
      capacity: 42,
      status: 'maintenance',
      lastService: '2024-01-10',
      nextService: '2024-02-10',
      currentRoute: 'Bangalore → Chennai',
      driver: 'Amit Singh',
      conductor: 'Vikram Reddy'
    },
    {
      id: 'B003',
      registrationNumber: 'DL-03-EF-9012',
      name: 'Blue Line',
      type: 'AC Semi-Sleeper',
      capacity: 38,
      status: 'active',
      lastService: '2024-01-20',
      nextService: '2024-02-20',
      currentRoute: 'Delhi → Jaipur',
      driver: 'Suresh Kumar',
      conductor: 'Ravi Sharma'
    },
    {
      id: 'B004',
      registrationNumber: 'TN-04-GH-3456',
      name: 'Green Express',
      type: 'AC Sleeper',
      capacity: 40,
      status: 'inactive',
      lastService: '2024-01-05',
      nextService: '2024-02-05',
      currentRoute: 'Chennai → Bangalore',
      driver: 'Kumar Raj',
      conductor: 'Manoj Kumar'
    }
  ]

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || bus.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-600" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage your bus fleet, maintenance, and operations
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Bus</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Buses</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or registration number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <Label htmlFor="status">Filter by Status</Label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <Card key={bus.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bus className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{bus.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(bus.status)}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bus.status)}`}>
                    {bus.status}
                  </span>
                </div>
              </div>
              <CardDescription>
                {bus.registrationNumber} • {bus.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">{bus.capacity} seats</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Route</p>
                  <p className="font-medium">{bus.currentRoute}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Driver</p>
                  <p className="font-medium">{bus.driver}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conductor</p>
                  <p className="font-medium">{bus.conductor}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Service</p>
                    <p className="font-medium">{bus.lastService}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Service</p>
                    <p className="font-medium">{bus.nextService}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBuses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No buses found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first bus to the fleet'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Bus
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
