import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AdminHomePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth0_session')

  // Check if user is authenticated
  if (sessionCookie?.value === 'authenticated') {
    // Check onboarding status
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3020'}/api/onboarding/status`, {
        headers: {
          'Cookie': `auth0_session=${sessionCookie.value}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.isComplete) {
          redirect('/dashboard')
        } else {
          redirect('/onboarding')
        }
      } else {
        redirect('/onboarding')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      redirect('/onboarding')
    }
  } else {
    redirect('/auth/login')
  }
}