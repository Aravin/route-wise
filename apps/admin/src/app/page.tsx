import { AdminDashboard } from '@/components/admin/dashboard'
import { AdminHeader } from '@/components/layout/admin-header'
import { AdminSidebar } from '@/components/layout/admin-sidebar'

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <AdminDashboard />
        </main>
      </div>
    </div>
  )
}