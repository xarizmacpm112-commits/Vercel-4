'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Plus,
  Search,
  User,
  Trophy,
  Target
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [showAddObject, setShowAddObject] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)

  const [objects, setObjects] = useState([
    {
      id: 1,
      type: 'Квартира',
      price: '450000',
      rooms: '3',
      area: '85',
      floor: '4',
      district: 'Frankfurt Center',
      address: 'Main Street 21',
      agent: 'Alexander',
      phone: '+49 111 111'
    }
  ])

  const [clients, setClients] = useState([
    {
      id: 1,
      clientType: 'Покупатель',
      propertyType: 'Квартира',
      budgetFrom: '300000',
      budgetTo: '500000',
      roomsFrom: '2',
      roomsTo: '4',
      floorFrom: '1',
      floorTo: '6',
      areaFrom: '60',
      areaTo: '120',
      district: 'Frankfurt Center',
      address: 'Center',
      agent: 'Alexander',
      phone: '+49 111 111'
    }
  ])

  const [newObject, setNewObject] = useState({
    type: 'Квартира',
    price: '',
    rooms: '',
    area: '',
    floor: '',
    district: '',
    address: ''
  })

  const [newClient, setNewClient] = useState({
    clientType: 'Покупатель',
    propertyType: 'Квартира',
    budgetFrom: '',
    budgetTo: '',
    roomsFrom: '',
    roomsTo: '',
    floorFrom: '',
    floorTo: '',
    areaFrom: '',
    areaTo: '',
    district: '',
    address: ''
  })

  const addObject = () => {
    setObjects([
      ...objects,
      {
        id: Date.now(),
        ...newObject,
        agent: agentName,
        phone: agentPhone
      }
    ])
    setShowAddObject(false)
  }

  const addClient = () => {
    setClients([
      ...clients,
      {
        id: Date.now(),
        ...newClient,
        agent: agentName,
        phone: agentPhone
      }
    ])
    setShowAddClient(false)
  }

  const sellers = clients.filter(client => client.clientType === 'Продавец')
  const buyers = clients.filter(client => client.clientType === 'Покупатель')

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
          <p>CRM система</p>
        </div>
        <button className="profile-btn">
          <User size={20} />
        </button>
      </header>

      <section className="content">
        {activeTab === 'home' && (
          <>
            {/* Секция статистики в рамках */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              
              {/* Блок агента */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>Мои показатели</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>{buyers.length}</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Покупатели</span>
                  </div>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>{sellers.length}</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Продавцы</span>
                  </div>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>0</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Матчи</span>
                  </div>
                </div>
              </div>

              {/* Блок компании */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>Показатели компании</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>124</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Всего покупателей</span>
                  </div>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>86</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Всего продавцов</span>
                  </div>
                  <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
                    <h3 style={{ margin: 0 }}>12</h3>
                    <span style={{ fontSize: '10px', color: '#888' }}>Агенты</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="agents-section">
              <div className="section-title">
                <Trophy size={18} />
                Лучшие агенты
              </div>
              <div className="agent-card">
                <div>
                  <h3>Alexander</h3>
                  <p>12 покупателей • 8 продавцов</p>
                </div>
              </div>
              <div className="agent-card">
                <div>
                  <h3>Emma</h3>
                  <p>9 покупателей • 7 продавцов</p>
                </div>
              </div>
              <div className="agent-card">
                <div>
                  <h3>Daniel</h3>
                  <p>8 покупателей • 6 продавцов</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <>
            <div className="section-header">
              <h2>Добавить объект</h2>
              <button onClick={() => setShowAddObject(true)}>
                <Plus size={18} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <div className="section-header">
              <h2>Добавить клиента</h2>
              <button onClick={() => setShowAddClient(true)}>
                <Plus size={18} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-tabs">
              <button
                className={registryTab === 'objects' ? 'active' : ''}
                onClick={() => setRegistryTab('objects')}
              >
                Объекты
              </button>
              <button
                className={registryTab === 'clients' ? 'active' : ''}
                onClick={() => setRegistryTab('clients')}
              >
                Клиенты
              </button>
              <button
                className={registryTab === 'agents' ? 'active' : ''}
                onClick={() => setRegistryTab('agents')}
              >
                Агенты
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input placeholder="Поиск..." />
            </div>

            {registryTab === 'objects' &&
              objects.map(object => (
                <div className="registry-card" key={object.id}>
                  <h3>{object.type}</h3>
                  <p>{object.rooms} комнаты • {object.area}м²</p>
                  <p>Этаж: {object.floor}</p>
                  <p>{object.district}</p>
                  <strong>€ {object.price}</strong>
                  <span>{object.agent}</span>
                </div>
              ))}

            {registryTab === 'clients' &&
              clients.map(client => (
                <div className="registry-card" key={client.id}>
                  <h3>{client.clientType}</h3>
                  <p>{client.propertyType}</p>
                  <p>€ {client.budgetFrom} - € {client.budgetTo}</p>
                  <p>{client.roomsFrom}-{client.roomsTo} комнаты</p>
                  <span>{client.agent}</span>
                </div>
              ))}

            {registryTab === 'agents' && (
              <>
                <div className="registry-card">
                  <h3>Alexander</h3>
                  <p>Покупатели: 12</p>
                  <p>Продавцы: 8</p>
                  <span>+49 111 111</span>
                </div>
                <div className="registry-card">
                  <h3>Emma</h3>
                  <p>Покупатели: 9</p>
                  <p>Продавцы: 7</p>
                  <span>+49 222 222</span>
                </div>
              </>
            )}
          </>
        )}
      </section>

      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          <Home size={22} />
          <span>Главная</span>
        </button>
        <button className={activeTab === 'objects' ? 'active' : ''} onClick={() => setActiveTab('objects')}>
          <Building2 size={22} />
          <span>Объект</span>
        </button>
        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>
          <Users size={22} />
          <span>Клиент</span>
        </button>
        <button className={activeTab === 'registry' ? 'active' : ''} onClick={() => setActiveTab('registry')}>
          <ClipboardList size={22} />
          <span>Реестр</span>
        </button>
      </nav>

      {/* Модалки (Add Object / Add Client) без изменений */}
      {showAddObject && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить объект</h2>
            <select onChange={e => setNewObject({ ...newObject, type: e.target.value })}>
              <option>Квартира</option>
              <option>Дом</option>
            </select>
            <input placeholder="Цена" onChange={e => setNewObject({ ...newObject, price: e.target.value })} />
            <input placeholder="Комнаты" onChange={e => setNewObject({ ...newObject, rooms: e.target.value })} />
            <input placeholder="Кв²" onChange={e => setNewObject({ ...newObject, area: e.target.value })} />
            <input placeholder="Этаж" onChange={e => setNewObject({ ...newObject, floor: e.target.value })} />
            <input placeholder="Район" onChange={e => setNewObject({ ...newObject, district: e.target.value })} />
            <input placeholder="Адрес" onChange={e => setNewObject({ ...newObject, address: e.target.value })} />
            <button onClick={addObject}>Сохранить объект</button>
            <button onClick={() => setShowAddObject(false)} style={{ background: '#eee', color: '#000', marginTop: '10px' }}>Отмена</button>
          </div>
        </div>
      )}

      {showAddClient && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить клиента</h2>
            <select onChange={e => setNewClient({ ...newClient, clientType: e.target.value })}>
              <option>Покупатель</option>
              <option>Продавец</option>
            </select>
            <select onChange={e => setNewClient({ ...newClient, propertyType: e.target.value })}>
              <option>Квартира</option>
              <option>Дом</option>
            </select>
            <input placeholder="Цена от" onChange={e => setNewClient({ ...newClient, budgetFrom: e.target.value })} />
            <input placeholder="Цена до" onChange={e => setNewClient({ ...newClient, budgetTo: e.target.value })} />
            <input placeholder="Комнаты от" onChange={e => setNewClient({ ...newClient, roomsFrom: e.target.value })} />
            <input placeholder="Комнаты до" onChange={e => setNewClient({ ...newClient, roomsTo: e.target.value })} />
            <button onClick={addClient}>Сохранить клиента</button>
            <button onClick={() => setShowAddClient(false)} style={{ background: '#eee', color: '#000', marginTop: '10px' }}>Отмена</button>
          </div>
        </div>
      )}
    </main>
  )
            }
                
