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
  Medal
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

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
    type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: '', address: ''
  })

  const [newClient, setNewClient] = useState({
    clientType: 'Покупатель', propertyType: 'Квартира', budgetFrom: '', budgetTo: '',
    roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '',
    district: '', address: ''
  })

  const addObject = () => {
    if(!newObject.price) return alert("Введите цену");
    setObjects([...objects, { id: Date.now(), ...newObject, agent: agentName, phone: agentPhone }]);
    setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: '', address: '' });
    alert("Объект добавлен в реестр");
  }

  const addClient = () => {
    setClients([...clients, { id: Date.now(), ...newClient, agent: agentName, phone: agentPhone }]);
    alert("Клиент добавлен в реестр");
  }

  const sellers = clients.filter(c => c.clientType === 'Продавец')
  const buyers = clients.filter(c => c.clientType === 'Покупатель')

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>
          <p>CRM система для риелторов</p>
          <input placeholder="Имя агента" value={agentName} onChange={e => setAgentName(e.target.value)} />
          <input placeholder="Номер телефона" value={agentPhone} onChange={e => setAgentPhone(e.target.value)} />
          <button onClick={() => { if (agentName && agentPhone) setLoggedIn(true) }}>ВОЙТИ</button>
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
        <button className="profile-btn"><User size={20} /></button>
      </header>

      <section className="content" style={{ paddingBottom: '80px' }}>
        
        {activeTab === 'home' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>МОИ ПОКАЗАТЕЛИ</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="stat-box-simple"><h3>{buyers.length}</h3><span>Покупатели</span></div>
                  <div className="stat-box-simple"><h3>{sellers.length}</h3><span>Продавцы</span></div>
                  <div className="stat-box-simple"><h3>0</h3><span>Матчи</span></div>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>КОМПАНИЯ</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="stat-box-simple"><h3>124</h3><span>Покупатели</span></div>
                  <div className="stat-box-simple"><h3>86</h3><span>Продавцы</span></div>
                  <div className="stat-box-simple"><h3>12</h3><span>Агенты</span></div>
                </div>
              </div>
            </div>

            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Лучшие агенты</div>
              {[ 
                { name: 'Alexander', b: 12, s: 8, color: '#FFD700' },
                { name: 'Emma', b: 9, s: 7, color: '#C0C0C0' },
                { name: 'Daniel', b: 8, s: 6, color: '#CD7F32' }
              ].map((agent, index) => (
                <div key={agent.name} style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '12px', marginBottom: '10px', border: '1px solid #eee' }}>
                  <div style={{ width: '30px', fontWeight: 'bold', color: agent.color }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.b} покупателей • {agent.s} продавцов</p>
                  </div>
                  <Medal size={20} color={agent.color} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee' }}>
            <h2 style={{ marginBottom: '15px' }}>Добавить объект</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select className="form-input" onChange={e => setNewObject({...newObject, type: e.target.value})}>
                <option>Квартира</option><option>Дом</option>
              </select>
              <input className="form-input" placeholder="Цена" onChange={e => setNewObject({...newObject, price: e.target.value})} />
              <input className="form-input" placeholder="Кв²" onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <input className="form-input" placeholder="Район" onChange={e => setNewObject({...newObject, district: e.target.value})} />
              <input className="form-input" placeholder="Адрес" onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}>СОХРАНИТЬ ОБЪЕКТ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee' }}>
            <h2 style={{ marginBottom: '15px' }}>Добавить клиента</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select className="form-input" onChange={e => setNewClient({...newClient, clientType: e.target.value})}><option>Покупатель</option><option>Продавец</option></select>
                <select className="form-input" onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              </div>
              
              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>Цена (от / до)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input className="form-input" placeholder="От" onChange={e => setNewClient({...newClient, budgetFrom: e.target.value})} />
                <input className="form-input" placeholder="До" onChange={e => setNewClient({...newClient, budgetTo: e.target.value})} />
              </div>

              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>Кв² (от / до)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input className="form-input" placeholder="От" onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                <input className="form-input" placeholder="До" onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
              </div>

              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>Комнаты (от / до)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input className="form-input" placeholder="От" onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} />
                <input className="form-input" placeholder="До" onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} />
              </div>

              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>Этаж (от / до)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input className="form-input" placeholder="От" onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} />
                <input className="form-input" placeholder="До" onChange={e => setNewClient({...newClient, floorTo: e.target.value})} />
              </div>

              <input className="form-input" placeholder="Район" onChange={e => setNewClient({...newClient, district: e.target.value})} />
              <input className="form-input" placeholder="Адрес" onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ КЛИЕНТА</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-tabs">
              <button className={registryTab === 'objects' ? 'active' : ''} onClick={() => setRegistryTab('objects')}>Объекты</button>
              <button className={registryTab === 'clients' ? 'active' : ''} onClick={() => setRegistryTab('clients')}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'active' : ''} onClick={() => setRegistryTab('agents')}>Агенты</button>
            </div>
            <div className="search-box"><Search size={18} /><input placeholder="Поиск..." /></div>
            {registryTab === 'objects' && objects.map(obj => (
              <div className="registry-card" key={obj.id}>
                <h3>{obj.type}</h3><p>{obj.rooms} комн • {obj.area}м² • Этаж {obj.floor}</p>
                <p>{obj.district}, {obj.address}</p><strong>€ {obj.price}</strong><span>{obj.agent}</span>
              </div>
            ))}
            {registryTab === 'clients' && clients.map(cl => (
              <div className="registry-card" key={cl.id}>
                <h3>{cl.clientType}</h3><p>{cl.propertyType} • {cl.roomsFrom}-{cl.roomsTo} комн</p>
                <p>Бюджет: € {cl.budgetFrom} - {cl.budgetTo}</p><span>{cl.agent}</span>
              </div>
            ))}
          </>
        )}
      </section>

      <nav className="bottom-nav">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}><Home size={22} /><span>Главная</span></button>
        <button className={activeTab === 'objects' ? 'active' : ''} onClick={() => setActiveTab('objects')}><Building2 size={22} /><span>Объект</span></button>
        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}><Users size={22} /><span>Клиент</span></button>
        <button className={activeTab === 'registry' ? 'active' : ''} onClick={() => setActiveTab('registry')}><ClipboardList size={22} /><span>Реестр</span></button>
      </nav>

      <style jsx>{`
        .stat-box-simple { border: 1px solid #eee; padding: 10px; borderRadius: 12px; textAlign: center; background: #fff; }
        .stat-box-simple h3 { margin: 0; font-size: 18px; }
        .stat-box-simple span { font-size: 10px; color: #888; text-transform: uppercase; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; font-size: 14px; width: 100%; outline: none; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; font-weight: bold; margin-top: 10px; cursor: pointer; border: none; }
      `}</style>
    </main>
  )
              }
                                                                                            
