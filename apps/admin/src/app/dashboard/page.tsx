import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminLayout } from '@/components/layout/admin-layout'
import { AdminDashboard } from '@/components/admin/dashboard'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth0_session')
  const userIdCookie = cookieStore.get('user_id')

  // Check if user is authenticated
  if (sessionCookie?.value !== 'authenticated' || !userIdCookie?.value) {
    redirect('/api/auth/login?action=login')
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}
