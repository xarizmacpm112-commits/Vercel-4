'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Bell,
  User,
  Search,
  Plus,
  X
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home')
  const [showAddObject, setShowAddObject] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <main className="app-container">
      {!loggedIn ? (
        <section className="login-screen">
          <div className="login-card glass">
            <div className="logo-wrap">
              <Building2 size={34} />
            </div>

            <h1 className="login-title">Nova CRM</h1>

            <p className="login-subtitle">
              CRM система для профессиональных риелторов
            </p>

            <div className="login-form">
              <input
                className="modern-input"
                placeholder="Имя агента"
              />

              <input
                className="modern-input"
                placeholder="Номер телефона"
              />

              <button
                className="primary-btn"
                onClick={() => setLoggedIn(true)}
              >
                ВОЙТИ В СИСТЕМУ
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="dashboard-screen">
          <header className="topbar glass">
            <h1 className="crm-title">NOVA CRM</h1>

            <div className="topbar-actions">
              <button className="icon-btn">
                <Bell size={18} />
              </button>

              <button className="icon-btn">
                <User size={18} />
              </button>
            </div>
          </header>

          {activeTab === 'home' && (
            <>
              <div className="section-title">
                СТАТИСТИКА АГЕНТА
              </div>

              <div className="stats-grid">
                <div className="stat-card glass">
                  <div>
                    <p>Всего покупателей</p>
                    <h2>24</h2>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div>
                    <p>Всего продавцов</p>
                    <h2>18</h2>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div>
                    <p>Совпадений</p>
                    <h2>112</h2>
                  </div>
                </div>
              </div>

              <div className="section-title mt">
                АНАЛИТИКА
              </div>

              <div className="analytics-card glass">
                <div>
                  <h2>78%</h2>
                  <p>Эффективность подбора</p>
                </div>

                <div className="chart-bars">
                  {[40, 70, 50, 90, 65, 85, 55].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="bar"
                    />
                  ))}
                </div>
              </div>

              <div className="section-title mt">
                ЛУЧШИЕ АГЕНТЫ
              </div>

              <div className="glass agents-card">
                <div className="agent-item">
                  <div className="agent-avatar"></div>

                  <div>
                    <h3>Alexander Wolf</h3>
                    <p>28 listings</p>
                  </div>
                </div>

                <div className="agent-item">
                  <div className="agent-avatar"></div>

                  <div>
                    <h3>Emma Carter</h3>
                    <p>24 listings</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'objects' && (
            <>
              <div className="objects-header">
                <div>
                  <h2 className="page-title">Объекты</h2>
                  <p className="page-subtitle">
                    Управление недвижимостью
                  </p>
                </div>

                <button
                  className="add-btn"
                  onClick={() => setShowAddObject(true)}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="search-box glass">
                <Search size={18} />
                <input placeholder="Поиск объекта" />
              </div>

              <div className="object-card glass">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"
                  className="object-image"
                />

                <div className="object-content">
                  <h3>Premium Apartment</h3>
                  <p>Berlin • 148м² • 4 комнаты</p>
                  <h2>€890,000</h2>
                </div>
              </div>
            </>
          )}

          {activeTab === 'clients' && (
            <>
              <h2 className="page-title">Клиенты</h2>

              <div className="glass client-card">
                <h3>Alexander Wolf</h3>
                <p>Покупатель</p>
                <span>+49 151 000 000</span>
              </div>

              <div className="glass client-card">
                <h3>Emma Carter</h3>
                <p>Продавец</p>
                <span>+49 151 111 111</span>
              </div>
            </>
          )}

          {activeTab === 'registry' && (
            <>
              <h2 className="page-title">Реестр</h2>

              <div className="glass registry-card">
                <h3>Последние сделки</h3>

                <div className="registry-item">
                  <span>Berlin Apartment</span>
                  <strong>Успешно</strong>
                </div>

                <div className="registry-item">
                  <span>Luxury House</span>
                  <strong>В процессе</strong>
                </div>
              </div>
            </>
          )}

          <nav className="bottom-nav glass">
            <button
              className={activeTab === 'home' ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab('home')}
            >
              <Home size={22} />
              <span>Главная</span>
            </button>

            <button
              className={activeTab === 'objects' ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab('objects')}
            >
              <Building2 size={22} />
              <span>Объекты</span>
            </button>

            <button
              className={activeTab === 'clients' ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab('clients')}
            >
              <Users size={22} />
              <span>Клиенты</span>
            </button>

            <button
              className={activeTab === 'registry' ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveTab('registry')}
            >
              <ClipboardList size={22} />
              <span>Реестр</span>
            </button>
          </nav>

          {showAddObject && (
            <div className="modal-overlay">
              <div className="modal-box glass">
                <div className="modal-top">
                  <h2>Добавить объект</h2>

                  <button
                    className="icon-btn"
                    onClick={() => setShowAddObject(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-form">
                  <input className="modern-input" placeholder="Название" />
                  <input className="modern-input" placeholder="Цена" />
                  <input className="modern-input" placeholder="Комнаты" />
                  <input className="modern-input" placeholder="Кв²" />
                  <input className="modern-input" placeholder="Адрес" />

                  <button className="primary-btn">
                    Сохранить объект
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
