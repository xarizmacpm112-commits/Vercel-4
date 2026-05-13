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

      <section className="dashboard-layout">
        <aside className="sidebar hidden lg:flex">
          <div>
            <div className="logo-box mb-10">
              <Building2 size={28} />
            </div>

            <nav className="space-y-3">
              <button className="nav-btn active">
                <LayoutDashboard size={18} /> Главная
              </button>

              <button className="nav-btn">
                <Building2 size={18} /> Объекты
              </button>

              <button className="nav-btn">
                <Users size={18} /> Клиенты
              </button>

              <button className="nav-btn">
                <Wallet size={18} /> Сделки
              </button>
            </nav>
          </div>

          <button className="nav-btn">
            <Settings size={18} /> Настройки
          </button>
        </aside>

        <div className="flex-1">
          <header className="topbar glass">
            <div>
              <h2 className="text-4xl font-black tracking-tight">
                Dashboard
              </h2>

              <p className="text-slate-500 mt-1">
                Управление недвижимостью
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="search-box hidden md:flex">
                <Search size={18} />
                <input placeholder="Поиск" />
              </div>

              <button className="circle-btn">
                <Bell size={18} />
              </button>

              <div className="avatar"></div>
            </div>
          </header>

          <div className="stats-grid mt-8">
            {stats.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="glass stat-card"
                >
                  <div>
                    <p className="text-slate-500">{item.title}</p>
                    <h3 className="text-4xl font-black mt-2">
                      {item.value}
                    </h3>
                  </div>

                  <div className="icon-wrap">
                    <Icon size={22} />
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="grid xl:grid-cols-2 gap-6 mt-8">
            <div className="glass panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Аналитика</h3>
                  <p className="text-slate-500 mt-1">Статистика за месяц</p>
                </div>

                <div className="badge">+18%</div>
              </div>

              <div className="chart-wrap">
                {[45, 65, 35, 90, 70, 55, 95, 60].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="chart-bar"
                  ></div>
                ))}
              </div>
            </div>

            <div className="glass panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">AI Matching</h3>
                <TrendingUp />
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Skyline Residence</span>
                    <span>92%</span>
                  </div>

                  <div className="progress-line">
                    <div style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Modern Penthouse</span>
                    <span>81%</span>
                  </div>

                  <div className="progress-line">
                    <div style={{ width: '81%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10 mb-5">
            <div>
              <h3 className="text-3xl font-black">Объекты</h3>
              <p className="text-slate-500 mt-1">Управление недвижимостью</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} /> Добавить объект
            </button>
          </div>

          <div className="property-grid">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ y: -5 }}
                className="glass property-card"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-bold">
                      {property.title}
                    </h4>

                    <span className="badge">Premium</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 mt-2">
                    <MapPin size={16} /> {property.city}
                  </div>

                  <div className="flex gap-5 mt-5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} />
                      {property.rooms} комнат
                    </div>

                    <div className="flex items-center gap-2">
                      <Maximize size={16} />
                      {property.area} м²
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-3xl font-black">
                      {property.price}
                    </span>

                    <button className="secondary-btn">
                      Подробнее
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid xl:grid-cols-2 gap-6 mt-10">
            <div className="glass panel p-6">
              <h3 className="text-2xl font-bold mb-5">Клиенты</h3>

              <div className="space-y-4">
                {clients.map((client, index) => (
                  <div key={index} className="client-item">
                    <div className="avatar small"></div>

                    <div className="flex-1">
                      <h4 className="font-semibold">{client.name}</h4>
                      <div className="text-slate-500 text-sm mt-1">
                        {client.status}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="circle-btn small">
                        <Phone size={14} />
                      </button>

                      <button className="circle-btn small">
                        <Mail size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="glass modal-box"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black">Добавить объект</h3>

                <button
                  className="circle-btn"
                  onClick={() => setShowModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input className="modern-input" placeholder="Название" />
                <input className="modern-input" placeholder="Цена" />
                <input className="modern-input" placeholder="Город" />
                <input className="modern-input" placeholder="Адрес" />
                <input className="modern-input" placeholder="Комнаты" />
                <input className="modern-input" placeholder="Площадь м²" />
                <input className="modern-input" placeholder="Этаж" />
                <input className="modern-input" placeholder="Тип недвижимости" />
              </div>

              <textarea
                className="modern-input mt-4 min-h-[120px]"
                placeholder="Описание"
              ></textarea>

              <button className="primary-btn w-full mt-5">
                Сохранить объект
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
            }
