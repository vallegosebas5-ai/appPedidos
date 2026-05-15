import Sidebar from './Sidebar'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <WhatsAppButton />
    </div>
  )
}
