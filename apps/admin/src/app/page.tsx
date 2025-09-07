import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function AdminHomePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth0_session')

  // Check if user is authenticated
  if (sessionCookie?.value === 'authenticated') {
    redirect('/dashboard')
  } else {
    redirect('/auth/login')
  }
}