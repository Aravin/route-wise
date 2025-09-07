'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  Bus,
  Route,
  Search,
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Settings
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Fleet Management',
    href: '/fleet',
    icon: Bus,
  },
  {
    name: 'Search Buses',
    href: '/search',
    icon: Search,
  },
  {
    name: 'Routes',
    href: '/routes',
    icon: Route,
  },
  {
    name: 'Drivers',
    href: '/drivers',
    icon: Users,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true'
    }
    return false
  })
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = { name: 'Admin User', email: 'admin@routewise.com' }

  const handleLogout = async () => {
    try {
      window.location.href = '/api/auth/logout?action=logout'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/auth/login'
    }
  }

  const handleProfileClick = () => {
    setShowUserDropdown(false)
    router.push('/profile')
  }

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', newState.toString())
  }

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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <Bus className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold gradient-text">RouteWise</span>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                <User className="h-4 w-4" />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  router.push('/profile')
                }}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-muted rounded flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={cn(
          'bg-background border-r transition-all duration-300 hidden md:block',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}>
          <div className="flex flex-col h-screen">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <Bus className="h-6 w-6 text-primary" />
                {!sidebarCollapsed && (
                  <span className="text-xl font-bold gradient-text">RouteWise</span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg text-sm font-medium transition-colors group',
                      sidebarCollapsed 
                        ? 'justify-center px-2 py-2' 
                        : 'space-x-3 px-3 py-2',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t">
              {!sidebarCollapsed ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-muted-foreground text-xs">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-muted rounded flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full p-2 text-muted-foreground hover:bg-muted rounded flex justify-center"
                    title="Profile"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full p-2 text-red-600 hover:bg-muted rounded flex justify-center"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Desktop sidebar toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="hidden md:flex"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>

                <div>
                  <h1 className="text-lg font-semibold">
                    {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
                  </h1>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                
                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:block text-sm font-medium">
                      {user.name}
                    </span>
                  </Button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg border z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs">{user.email}</div>
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
