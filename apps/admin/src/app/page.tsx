import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { mongoDBService } from '@/lib/mongodb-service'

export default async function AdminHomePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth0_session')
  const userIdCookie = cookieStore.get('user_id')

  // Check if user is authenticated
  if (sessionCookie?.value !== 'authenticated' || !userIdCookie?.value) {
    redirect('/api/auth/login?action=login')
  }

  try {
    // Check onboarding status from user document
    const user = await mongoDBService.getUserByUserId(userIdCookie.value)

    if (user?.onboardingComplete) {
      redirect('/dashboard')
    } else {
      redirect('/onboarding')
    }
  } catch (error: any) {
    // Only log actual errors, not NEXT_REDIRECT errors
    if (error?.digest !== 'NEXT_REDIRECT') {
      console.error('Error checking onboarding status:', error)
    }

    // If there's an error, redirect to onboarding as fallback
    redirect('/onboarding')
  }
}