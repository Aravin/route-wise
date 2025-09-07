'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Loader2 } from 'lucide-react'

interface ProfileData {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  role: string
  department: string
  organizationId?: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    role: 'Administrator',
    department: 'Operations'
  })

  const [editProfile, setEditProfile] = useState<ProfileData>(profile)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
          setEditProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEdit = () => {
    setEditProfile(profile)
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editProfile.name,
          phone: editProfile.phone,
          location: editProfile.location,
        }),
      })

      if (response.ok) {
        setProfile(editProfile)
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted animate-pulse rounded-full mx-auto mb-4" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded mx-auto mb-2" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mx-auto mb-2" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-10 w-full bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{profile.name}</h3>
                  <p className="text-muted-foreground mb-2">{profile.role}</p>
                  <p className="text-sm text-muted-foreground">{profile.department}</p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined:</span>
                    <span>{profile.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span>{profile.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                          {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={editProfile.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.role}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Last changed 3 months ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </AdminLayout>
  )
}

