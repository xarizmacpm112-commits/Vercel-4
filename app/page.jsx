'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Plus,
  Search,
  Trophy
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [objects, setObjects] = useState([
    {
      id: 1,
      district: 'Frankfurt Center',
      price: '450000',
      area: '85',
      rooms: '3',
      type: 'Apartment',
      agent: 'Alexander'
    }
  ])

  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Michael',
      budget: '500000',
      district: 'Frankfurt Center',
      type: 'Покупатель',
      agent: 'Alexander'
    }
  ])

  const [showAddObject, setShowAddObject] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)

  const [newObject, setNewObject] = useState({
    district: '',
    price: '',
    area: '',
    rooms: '',
    type: ''
  })

  const [newClient, setNewClient] = useState({
    name: '',
    budget: '',
    district: '',
    type: 'Покупатель'
  })

  const addObject = () => {
    if (!newObject.district || !newObject.price) return

    setObjects([
      ...objects,
      {
        id: Date.now(),
        ...newObject,
        agent: agentName
      }
    ])

    setShowAddObject(false)

    setNewObject({
      district: '',
      price: '',
      area: '',
      rooms: '',
      type: ''
    })
  }

  const addClient = () => {
    if (!newClient.name || !newClient.budget) return

    setClients([
      ...clients,
      {
        id: Date.now(),
        ...newClient,
        agent: agentName
      }
    ])

    setShowAddClient(false)

    setNewClient({
      name: '',
      budget: '',
      district: '',
      type: 'Покупатель'
    })
  }

  const matches = clients.filter(client =>
    objects.some(
      object =>
        object.district === client.district &&
        Number(object.price) <= Number(client.budget)
    )
  )

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>

          <p>CRM система для риелторов</p>

          <input
            placeholder="Имя агента"
            value={agentName}
            onChange={e => setAgentName(e.target.value)}
          />

          <input
            placeholder="Номер телефона"
            value={agentPhone}
            onChange={e => setAgentPhone(e.target.value)}
          />

          <button
            onClick={() => {
              if (agentName && agentPhone) {
                setLoggedIn(true)
              }
            }}
          >
            ВОЙТИ
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="crm-container">
      <header className="topbar">
        <div>
          <h1>B2B GARANT</h1>
          <p>{agentName}</p>
        </div>
      </header>

      <section className="content">
        {activeTab === 'home' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h2>{clients.filter(c => c.type === 'Продавец').length}</h2>
                <p>Продавцы агента</p>
              </div>

              <div className="stat-card">
                <h2>{clients.filter(c => c.type === 'Покупатель').length}</h2>
                <p>Покупатели агента</p>
              </div>

              <div className="stat-card">
                <h2>{matches.length}</h2>
                <p>Матчи агента</p>
              </div>

              <div className="stat-card">
                <h2>{objects.length}</h2>
                <p>Объекты компании</p>
              </div>
            </div>

            <div className="best-agents">
              <div className="section-title">
                <Trophy size={20} />
                Лучшие агенты
              </div>

              <div className="agent-card">
                <h3>Alexander</h3>
                <p>12 покупателей • 8 продавцов</p>
              </div>

              <div className="agent-card">
                <h3>Emma</h3>
                <p>10 покупателей • 7 продавцов</p>
              </div>

              <div className="agent-card">
                <h3>Daniel</h3>
                <p>9 покупателей • 6 продавцов</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <>
            <div className="section-header">
              <h2>Объекты</h2>

              <button onClick={() => setShowAddObject(true)}>
                <Plus size={18} />
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input placeholder="Поиск объекта" />
            </div>

            {objects.map(object => (
              <div className="object-card" key={object.id}>
                <h3>{object.district}</h3>

                <p>{object.area}м² • {object.rooms} комнаты</p>

                <p>{object.type}</p>

                <strong>€ {object.price}</strong>

                <span>Агент: {object.agent}</span>
              </div>
            ))}
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <div className="section-header">
              <h2>Клиенты</h2>

              <button onClick={() => setShowAddClient(true)}>
                <Plus size={18} />
              </button>
            </div>

            {clients.map(client => (
              <div className="client-card" key={client.id}>
                <h3>{client.name}</h3>

                <p>{client.type}</p>

                <p>Бюджет: € {client.budget}</p>

                <p>{client.district}</p>

                <span>Агент: {client.agent}</span>
              </div>
            ))}
          </>
        )}

        {activeTab === 'registry' && (
          <>
            <h2 className="registry-title">Реестр</h2>

            {matches.map((match, index) => (
              <div className="registry-card" key={index}>
                <h3>MATCH</h3>

                <p>
                  {match.name} подходит под объект в {match.district}
                </p>

                <strong>90%</strong>
              </div>
            ))}
          </>
        )}
      </section>

      <nav className="bottom-nav">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => setActiveTab('home')}
        >
          <Home size={22} />
          <span>Главная</span>
        </button>

        <button
          className={activeTab === 'objects' ? 'active' : ''}
          onClick={() => setActiveTab('objects')}
        >
          <Building2 size={22} />
          <span>Объекты</span>
        </button>

        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={22} />
          <span>Клиенты</span>
        </button>

        <button
          className={activeTab === 'registry' ? 'active' : ''}
          onClick={() => setActiveTab('registry')}
        >
          <ClipboardList size={22} />
          <span>Реестр</span>
        </button>
      </nav>

      {showAddObject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить объект</h2>

            <input
              placeholder="Район"
              value={newObject.district}
              onChange={e =>
                setNewObject({
                  ...newObject,
                  district: e.target.value
                })
              }
            />

            <input
              placeholder="Цена"
              value={newObject.price}
              onChange={e =>
                setNewObject({
                  ...newObject,
                  price: e.target.value
                })
              }
            />

            <input
              placeholder="Кв²"
              value={newObject.area}
              onChange={e =>
                setNewObject({
                  ...newObject,
                  area: e.target.value
                })
              }
            />

            <input
              placeholder="Комнаты"
              value={newObject.rooms}
              onChange={e =>
                setNewObject({
                  ...newObject,
                  rooms: e.target.value
                })
              }
            />

            <input
              placeholder="Тип"
              value={newObject.type}
              onChange={e =>
                setNewObject({
                  ...newObject,
                  type: e.target.value
                })
              }
            />

            <button onClick={addObject}>
              Сохранить объект
            </button>
          </div>
        </div>
      )}

      {showAddClient && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить клиента</h2>

            <input
              placeholder="Имя"
              value={newClient.name}
              onChange={e =>
                setNewClient({
                  ...newClient,
                  name: e.target.value
                })
              }
            />

            <input
              placeholder="Бюджет"
              value={newClient.budget}
              onChange={e =>
                setNewClient({
                  ...newClient,
                  budget: e.target.value
                })
              }
            />

            <input
              placeholder="Район"
              value={newClient.district}
              onChange={e =>
                setNewClient({
                  ...newClient,
                  district: e.target.value
                })
              }
            />

            <select
              value={newClient.type}
              onChange={e =>
                setNewClient({
                  ...newClient,
                  type: e.target.value
                })
              }
            >
              <option>Покупатель</option>
              <option>Продавец</option>
            </select>

            <button onClick={addClient}>
              Сохранить клиента
            </button>
          </div>
        </div>
      )}
    </main>
  )
                  }
