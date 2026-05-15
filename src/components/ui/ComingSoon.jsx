import DashboardLayout from '../layout/DashboardLayout'
import { Construction } from 'lucide-react'

export default function ComingSoon({ title }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
          <Construction size={28} className="text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">Disponible en el próximo sprint</p>
      </div>
    </DashboardLayout>
  )
}
