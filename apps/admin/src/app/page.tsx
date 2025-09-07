import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AdminHomePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth0_session')
  const userIdCookie = cookieStore.get('user_id')

  // Check if user is authenticated
  if (sessionCookie?.value !== 'authenticated' || !userIdCookie?.value) {
    redirect('/api/auth/login?action=login')
  }

  // Redirect authenticated users directly to dashboard
  redirect('/dashboard')
}