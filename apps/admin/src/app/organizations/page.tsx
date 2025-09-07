'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/layout/admin-layout'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  FileText,
  X
} from 'lucide-react'

interface Organization {
  _id: string
  name: string
  address: string
  regOffice?: string
  phone: string
  phone2?: string
  email: string
  website?: string
  gstNumber?: string
  panNumber?: string
  isPrimary?: boolean
  createdAt: string
  updatedAt: string
}

function OrganizationsContent() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    regOffice: '',
    phone: '',
    phone2: '',
    email: '',
    website: '',
    gstNumber: '',
    panNumber: '',
    isPrimary: false
  })

  useEffect(() => {
    fetchOrganizations()
    
    // Check if we should open the form from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('openForm') === 'true') {
      setShowForm(true)
    }
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // If setting as primary, ensure no other organization is primary
      if (formData.isPrimary) {
        // First, set all other organizations to not primary
        const updatePromises = organizations
          .filter(org => org._id !== editingOrg?._id)
          .map(org => 
            fetch(`/api/organizations/${org._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...org, isPrimary: false })
            })
          )
        await Promise.all(updatePromises)
      }

      const url = editingOrg ? `/api/organizations/${editingOrg._id}` : '/api/organizations'
      const method = editingOrg ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchOrganizations()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving organization:', error)
    }
  }

  const handleEdit = (org: Organization) => {
    setEditingOrg(org)
    setFormData({
      name: org.name,
      address: org.address,
      regOffice: org.regOffice || '',
      phone: org.phone,
      phone2: org.phone2 || '',
      email: org.email,
      website: org.website || '',
      gstNumber: org.gstNumber || '',
      panNumber: org.panNumber || '',
      isPrimary: org.isPrimary || false
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        const response = await fetch(`/api/organizations/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchOrganizations()
        }
      } catch (error) {
        console.error('Error deleting organization:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      regOffice: '',
      phone: '',
      phone2: '',
      email: '',
      website: '',
      gstNumber: '',
      panNumber: '',
      isPrimary: false
    })
    setEditingOrg(null)
    setShowForm(false)
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.phone.includes(searchTerm)
  )

  // Sort organizations - primary first, then by creation date
  const sortedOrganizations = [...filteredOrganizations].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (!a.isPrimary && b.isPrimary) return 1
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

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
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage your business organizations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">
          {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingOrg ? 'Edit Organization' : 'Add New Organization'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter organization name"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Primary Phone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="Enter primary phone"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone2">Secondary Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone2"
                        placeholder="Enter secondary phone"
                        className="pl-10"
                        value={formData.phone2}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone2: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://your-website.com"
                        className="pl-10"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      placeholder="Enter GST number"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="Enter PAN number"
                      value={formData.panNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Primary Organization Checkbox */}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <input
                    id="isPrimary"
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="isPrimary" className="text-sm font-medium">
                    Set as Primary Organization
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    (Only one organization can be primary)
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Enter business address"
                        className="pl-10"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regOffice">Registered Office</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regOffice"
                        placeholder="Enter registered office address"
                        className="pl-10"
                        value={formData.regOffice}
                        onChange={(e) => setFormData(prev => ({ ...prev, regOffice: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingOrg ? 'Update Organization' : 'Add Organization'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Organizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedOrganizations.map((org, index) => (
          <Card key={org._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Mail className="h-3 w-3 mr-1" />
                    {org.email}
                  </CardDescription>
                  {org.isPrimary && (
                    <Badge variant="secondary" className="mt-2 w-fit">
                      Primary Organization
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(org)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* Hide delete button for primary organization */}
                  {!org.isPrimary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(org._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{org.address}</p>
                  </div>
                </div>

                {org.regOffice && (
                  <div className="flex items-start space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Registered Office</p>
                      <p className="text-sm text-muted-foreground">{org.regOffice}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {org.phone}
                      {org.phone2 && `, ${org.phone2}`}
                    </p>
                  </div>
                </div>

                {org.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {org.website}
                      </a>
                    </div>
                  </div>
                )}

                {(org.gstNumber || org.panNumber) && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Legal Information</p>
                    {org.gstNumber && (
                      <p className="text-xs text-muted-foreground">GST: {org.gstNumber}</p>
                    )}
                    {org.panNumber && (
                      <p className="text-xs text-muted-foreground">PAN: {org.panNumber}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No organizations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first organization'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrganizationsPage() {
  return (
    <AdminLayout>
      <OrganizationsContent />
    </AdminLayout>
  )
}