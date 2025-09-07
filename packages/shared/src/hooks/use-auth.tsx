'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginRequest, RegisterRequest } from '../types/user'

// Auth configuration options
interface AuthConfig {
  enableRegister?: boolean
  apiBaseUrl?: string
  redirectAfterLogin?: string
  redirectAfterLogout?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register?: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  config = {}
}: {
  children: React.ReactNode
  config?: AuthConfig
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const apiBaseUrl = config.apiBaseUrl || process.env.NEXT_PUBLIC_API_URL
  const redirectAfterLogin = config.redirectAfterLogin || '/dashboard'
  const redirectAfterLogout = config.redirectAfterLogout || '/'

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('accessToken')
    if (token) {
      // Verify token and get user data
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json() as { data: { user: User } }
        setUser(data.data.user)
      } else {
        // Token is invalid, try to refresh
        await refreshToken()
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json() as { data: { accessToken: string; refreshToken: string; user: User }; error?: { message: string } }

      if (response.ok) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        setUser(data.data.user)
        // Note: Router redirection should be handled by the consuming app
        // window.location.href = redirectAfterLogin
      } else {
        throw new Error(data.error?.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    if (!config.enableRegister) {
      throw new Error('Registration is not enabled for this application')
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json() as { data: { accessToken: string; refreshToken: string; user: User }; error?: { message: string } }

      if (response.ok) {
        localStorage.setItem('accessToken', result.data.accessToken)
        localStorage.setItem('refreshToken', result.data.refreshToken)
        setUser(result.data.user)
        // Note: Router redirection should be handled by the consuming app
        // window.location.href = redirectAfterLogin
      } else {
        throw new Error(result.error?.message || 'Registration failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (token) {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      // Note: Router redirection should be handled by the consuming app
      // window.location.href = redirectAfterLogout
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) {
        throw new Error('No refresh token')
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      })

      const data = await response.json() as { data: { accessToken: string; refreshToken: string } }

      if (response.ok) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        await fetchUserData()
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      throw error
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshToken,
  }

  // Only add register if enabled in config
  if (config.enableRegister) {
    contextValue.register = register
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { AuthConfig }
