import { FleetManagement } from '@/components/admin/fleet-management'
import { AdminHeader } from '@/components/layout/admin-header'
import { AdminSidebar } from '@/components/layout/admin-sidebar'

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <FleetManagement />
        </main>
      </div>
    </div>
  )
}
