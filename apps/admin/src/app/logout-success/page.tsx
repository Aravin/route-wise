'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, CheckCircle } from 'lucide-react'

export default function LogoutSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Bus className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">RouteWise</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Successfully Logged Out</h2>
          <p className="mt-2 text-sm text-gray-600">
            You have been securely logged out of your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Logout Complete</CardTitle>
            <CardDescription className="text-center">
              Your session has been cleared and you are now logged out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p>You will be automatically redirected to the login page in a few seconds.</p>
              </div>
              
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
                size="lg"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
