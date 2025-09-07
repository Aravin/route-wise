'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Bus, User, LogIn, LogOut, ChevronDown } from 'lucide-react'
// import { useUser } from '@auth0/nextjs-auth0/client'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  // For now, show as logged in since Auth0 integration is complex
  const user = { name: 'Admin User', email: 'admin@routewise.com' }
  const isLoading = false

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleDirectLogout = async () => {
    try {
      // Clear session and redirect to Auth0 logout
      window.location.href = '/api/auth/logout?action=logout'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/api/auth/login?action=login'
    }
  }

  const handleLogoutConfirm = async () => {
    try {
      // Close mobile menu if open
      setIsOpen(false)
      
      // Clear session and redirect to Auth0 logout
      window.location.href = '/api/auth/logout?action=logout'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/api/auth/login?action=login'
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const handleProfileClick = () => {
    setShowUserDropdown(false)
    router.push('/profile')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Bus className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">RouteWise</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/fleet"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Fleet
          </Link>
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Search Buses
          </Link>
          <Link
            href="/routes"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Routes
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUserClick}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {user.name || user.email || 'User'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleDirectLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-8">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/fleet"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Fleet
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Search Buses
              </Link>
              <Link
                href="/routes"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Routes
              </Link>
              
              <div className="border-t pt-4">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                ) : user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-sm border-b">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        router.push('/profile')
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                    <Button variant="outline" onClick={handleDirectLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to log out?</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleLogoutConfirm}
                className="flex-1"
                variant="destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Yes, Logout
              </Button>
              <Button
                onClick={handleLogoutCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
