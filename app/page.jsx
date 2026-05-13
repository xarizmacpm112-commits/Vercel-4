'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Search,
  User,
  Trophy,
  Medal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  // База данных
  const [objects, setObjects] = useState([
    { id: 1, type: 'Квартира', price: '450000', rooms: '3', area: '85', floor: '4', district: 'Ленинский', address: 'Main Street 21', agent: 'Alexander' }
  ])

  const [clients, setClients] = useState([
    { id: 1, propertyType: 'Квартира', budgetFrom: '300000', budgetTo: '500000', roomsFrom: '2', roomsTo: '4', floorFrom: '1', floorTo: '6', areaFrom: '60', areaTo: '120', district: 'Кировский', address: 'Center 1', agent: 'Alexander' }
  ])

  // Формы добавления
  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })

  const addObject = () => {
    if(!newObject.price) return alert("Введите цену");
    setObjects([...objects, { id: Date.now(), ...newObject, agent: agentName }]);
    setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' });
    alert("Объект опубликован");
  }

  const addClient = () => {
    setClients([...clients, { id: Date.now(), ...newClient, agent: agentName }]);
    setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' });
    alert("Заявка клиента сохранена");
  }

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>
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
        </div>
        <button className="profile-btn"><User size={20} /></button>
      </header>

      <section className="content" style={{ paddingBottom: '100px' }}>
        
        {activeTab === 'home' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div>
                <p className="group-label">МОИ ПОКАЗАТЕЛИ</p>
                <div className="stats-grid-3">
                  <div className="stat-box-simple"><h3>{clients.length}</h3><span>Клиенты</span></div>
                  <div className="stat-box-simple"><h3>{objects.length}</h3><span>Объекты</span></div>
                  <div className="stat-box-simple"><h3>0</h3><span>Матчи</span></div>
                </div>
              </div>
              <div>
                <p className="group-label">КОМПАНИЯ</p>
                <div className="stats-grid-3">
                  <div className="stat-box-simple"><h3>124</h3><span>Клиенты</span></div>
                  <div className="stat-box-simple"><h3>86</h3><span>Объекты</span></div>
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
                <div key={agent.name} className="agent-rank-card">
                  <div style={{ width: '30px', fontWeight: 'bold', color: agent.color }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.b} клиентов • {agent.s} объектов</p>
                  </div>
                  <Medal size={20} color={agent.color} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <div className="form-container">
            <h2>Выставить объект</h2>
            <div className="form-stack">
              <select className="form-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}>
                <option>Квартира</option><option>Дом</option>
              </select>
              <input className="form-input" placeholder="Цена" value={newObject.price} onChange={e => setNewObject({...newObject, price: e.target.value})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}>
                <option>Ленинский</option>
                <option>Кировский</option>
                <option>Московский</option>
              </select>
              <input className="form-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}>ОПУБЛИКОВАТЬ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="form-container">
            <h2>Заявка покупателя</h2>
            <div className="form-stack">
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <div className="dual-input"><input className="form-input" placeholder="Цена от" onChange={e => setNewClient({...newClient, budgetFrom: e.target.value})} /><input className="form-input" placeholder="Цена до" onChange={e => setNewClient({...newClient, budgetTo: e.target.value})} /></div>
              <div className="dual-input"><input className="form-input" placeholder="Кв² от" onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} /><input className="form-input" placeholder="Кв² до" onChange={e => setNewClient({...newClient, areaTo: e.target.value})} /></div>
              <div className="dual-input"><input className="form-input" placeholder="Комнат от" onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} /><input className="form-input" placeholder="Комнат до" onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} /></div>
              <div className="dual-input"><input className="form-input" placeholder="Этаж от" onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} /><input className="form-input" placeholder="Этаж до" onChange={e => setNewClient({...newClient, floorTo: e.target.value})} /></div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}>
                <option>Ленинский</option>
                <option>Кировский</option>
                <option>Московский</option>
              </select>
              <input className="form-input" placeholder="Адрес" onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-nav">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('objects'); setShowFilters(false); }}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('clients'); setShowFilters(false); }}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('agents'); setShowFilters(false); }}>Агенты</button>
            </div>

            {registryTab !== 'agents' && (
              <div className="registry-filter-container">
                <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                   <Search size={16} /> Поиск {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showFilters && (
                  <div className="expanded-filter-panel">
                    <div className="filter-fields">
                      <select className="form-input"><option>Все типы</option><option>Квартира</option><option>Дом</option></select>
                      <div className="dual-input"><input className="form-input" placeholder="Цена от" /><input className="form-input" placeholder="Цена до" /></div>
                      <div className="dual-input"><input className="form-input" placeholder="Комнаты от" /><input className="form-input" placeholder="Комнаты до" /></div>
                      <div className="dual-input"><input className="form-input" placeholder="Этаж от" /><input className="form-input" placeholder="Этаж до" /></div>
                      <select className="form-input">
                        <option>Все районы</option>
                        <option>Ленинский</option>
                        <option>Кировский</option>
                        <option>Московский</option>
                      </select>
                      <button className="save-btn" onClick={() => setShowFilters(false)}>НАЙТИ</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="list-section">
              {registryTab === 'objects' && objects.map(obj => (
                <div className="registry-card" key={obj.id}>
                  <h3>{obj.type}</h3><p>{obj.rooms} комн • {obj.area}м² • Этаж {obj.floor}</p>
                  <p>{obj.district}, {obj.address}</p><strong>€ {obj.price}</strong><span>{obj.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="registry-card" key={cl.id}>
                  <h3>Поиск: {cl.propertyType}</h3><p>Бюджет: € {cl.budgetFrom} - {cl.budgetTo}</p>
                  <p>{cl.roomsFrom}-{cl.roomsTo} комн • Этаж {cl.floorFrom}-{cl.floorTo}</p>
                  <p>{cl.district}, {cl.address}</p><span>{cl.agent}</span>
                </div>
              ))}
              {registryTab === 'agents' && (
                <div className="registry-card"><h3>Alexander</h3><p>Объекты: 8 • Клиенты: 12</p><span>+49 111 111</span></div>
              )}
            </div>
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
        .group-label { fontSize: 12px; fontWeight: bold; color: #666; marginBottom: 8px; text-transform: uppercase; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box-simple { border: 1px solid #eee; padding: 10px; border-radius: 12px; text-align: center; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .stat-box-simple h3 { margin: 0; font-size: 18px; }
        .stat-box-simple span { font-size: 10px; color: #888; text-transform: uppercase; }
        
        .agent-rank-card { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #eee; }
        
        .form-container { background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 10px; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; font-size: 14px; width: 100%; outline: none; background: #f9f9f9; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; font-weight: bold; margin-top: 10px; cursor: pointer; border: none; width: 100%; }
        
        .registry-nav { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .reg-btn { padding: 12px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .reg-btn.active { background: #000; color: #fff; }
        
        .registry-filter-container { margin-bottom: 15px; }
        .filter-toggle-btn { width: 100%; padding: 12px; background: #fff; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; font-weight: 600; cursor: pointer; }
        .expanded-filter-panel { background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 0 0 12px 12px; border-top: none; }
        .filter-fields { display: flex; flex-direction: column; gap: 10px; }

        .registry-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; position: relative; }
        .registry-card h3 { margin: 0 0 5px; font-size: 16px; }
        .registry-card p { margin: 0; font-size: 13px; color: #666; }
        .registry-card strong { display: block; margin-top: 5px; color: #000; }
        .registry-card span { position: absolute; right: 15px; top: 15px; font-size: 11px; color: #aaa; }

        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .topbar h1 { margin: 0; font-size: 20px; }
        .profile-btn { background: none; border: none; cursor: pointer; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }
        
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px 20px; border-radius: 20px; width: 100%; text-align: center; }
        .login-card h1 { margin-bottom: 30px; }
        .login-card input { padding: 15px; width: 100%; border-radius: 10px; border: 1px solid #eee; margin-bottom: 15px; outline: none; background: #f9f9f9; }
        .login-card button { width: 100%; padding: 16px; background: #000; color: #fff; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
      `}</style>
    </main>
  )
              }
