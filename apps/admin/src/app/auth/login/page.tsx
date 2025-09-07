'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const handleLogin = () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login?action=login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Bus className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">RouteWise</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure authentication powered by Auth0
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Your account is managed securely by Auth0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={handleLogin}
                className="w-full"
                size="lg"
              >
                Sign in with Auth0
              </Button>

              {error === 'config' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Auth0 environment variables are missing. Please check your .env.local file.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-600">
                <p>Contact your administrator if you need access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
