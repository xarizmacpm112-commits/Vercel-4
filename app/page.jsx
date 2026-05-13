'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  Building2,
  Users,
  Wallet,
  TrendingUp,
  Settings,
  LayoutDashboard,
  Plus,
  MapPin,
  BedDouble,
  Maximize,
  X,
  Phone,
  Mail
} from 'lucide-react'

const stats = [
  { title: 'Покупатели', value: '842', icon: Users },
  { title: 'Объекты', value: '154', icon: Building2 },
  { title: 'Сделки', value: '92', icon: Wallet },
  { title: 'Рост', value: '+24%', icon: TrendingUp }
]

const properties = [
  {
    id: 1,
    title: 'Skyline Residence',
    city: 'Berlin',
    price: '€890,000',
    rooms: 4,
    area: 148,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Modern Penthouse',
    city: 'Frankfurt',
    price: '€1,250,000',
    rooms: 5,
    area: 220,
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'
  }
]

const clients = [
  {
    name: 'Alexander Wolf',
    phone: '+49 151 000 000',
    status: 'Покупатель'
  },
  {
    name: 'Emma Carter',
    phone: '+49 151 111 111',
    status: 'Продавец'
  }
]

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <main className="min-h-screen bg-main text-slate-900 overflow-hidden">
      <div className="bg-blur one"></div>
      <div className="bg-blur two"></div>

      <section className="min-h-screen flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass login-card"
        >
          <div className="text-center mb-8">
            <div className="logo-box mx-auto mb-5">
              <Building2 size={32} />
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              NovaCRM
            </h1>

            <p className="text-slate-500 mt-3">
              CRM система нового поколения
            </p>
          </div>

          <div className="space-y-4">
            <input className="modern-input" placeholder="Имя" />
            <input className="modern-input" placeholder="Телефон" />
            <input className="modern-input" placeholder="Email" />
            <input className="modern-input" placeholder="Пароль" />

            <button className="primary-btn w-full">
              Войти в систему
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
