'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Search,
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

  // Функция для форматирования цены с пробелами
  const formatPrice = (val) => {
    if (!val) return ''
    const number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  // База данных
  const [objects, setObjects] = useState([
    { id: 1, type: 'Квартира', price: '8500000', rooms: '3', area: '85', floor: '4', district: 'Ленинский', address: 'ул. Пушкина, 10', agent: 'Александр' }
  ])

  const [clients, setClients] = useState([
    { id: 1, propertyType: 'Квартира', budgetFrom: '5000000', budgetTo: '9000000', roomsFrom: '2', roomsTo: '4', floorFrom: '1', floorTo: '10', areaFrom: '40', areaTo: '100', district: 'Кировский', address: 'ул. Ленина, 5', agent: 'Александр' }
  ])

  // Состояния форм
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
    alert("Заявка сохранена");
  }

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>
          <input placeholder="Имя агента" value={agentName} onChange={e => setAgentName(e.target.value)} />
          <input placeholder="Номер телефона (+7...)" value={agentPhone} onChange={e => setAgentPhone(e.target.value)} />
          <button onClick={() => { if (agentName && agentPhone) setLoggedIn(true) }}>ВОЙТИ</button>
        </div>
      </main>
    )
  }

  return (
    <main className="crm-container">
      <header className="topbar">
        <h1>B2B GARANT</h1>
      </header>

      <section className="content" style={{ paddingBottom: '100px' }}>
        
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="stats-section">
              <p className="group-label">МОИ ПОКАЗАТЕЛИ</p>
              <div className="stats-grid-3">
                <div className="stat-box"><h3>{clients.length}</h3><span>Клиенты</span></div>
                <div className="stat-box"><h3>{objects.length}</h3><span>Объекты</span></div>
                <div className="stat-box"><h3>0</h3><span>Сделки</span></div>
              </div>
            </div>

            <div className="agents-list">
              <p className="group-label">РЕЙТИНГ АГЕНТОВ</p>
              {['Александр', 'Елена', 'Дмитрий'].map((name, i) => (
                <div key={name} className="agent-item">
                  <span className="rank">{i + 1}</span>
                  <div className="info"><b>{name}</b><p>Агент по недвижимости</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="form-container">
            <h2>Новый объект</h2>
            <div className="form-stack">
              <select className="form-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}>
                <option>Квартира</option><option>Дом</option>
              </select>
              <input className="form-input" placeholder="Цена (₽)" value={formatPrice(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Площадь (м²)" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнат" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}>
                <option>Ленинский</option><option>Кировский</option><option>Московский</option>
              </select>
              <input className="form-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}>ОПУБЛИКОВАТЬ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="form-container">
            <h2>Поиск покупателя</h2>
            <div className="form-stack">
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <div className="dual-input">
                <input className="form-input" placeholder="Цена от" value={formatPrice(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                <input className="form-input" placeholder="Цена до" value={formatPrice(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="м² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                <input className="form-input" placeholder="м² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Комнат от" value={newClient.roomsFrom} onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} />
                <input className="form-input" placeholder="Комнат до" value={newClient.roomsTo} onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Этаж от" value={newClient.floorFrom} onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} />
                <input className="form-input" placeholder="Этаж до" value={newClient.floorTo} onChange={e => setNewClient({...newClient, floorTo: e.target.value})} />
              </div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}>
                <option>Ленинский</option><option>Кировский</option><option>Московский</option>
              </select>
              <input className="form-input" placeholder="Адрес (желаемый)" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ</button>
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
              <div className="filter-wrapper">
                <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                   <Search size={16} /> Фильтры поиска {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showFilters && (
                  <div className="filter-panel">
                    <div className="form-stack">
                      <div className="dual-input">
                        <input className="form-input" placeholder="Цена от" />
                        <input className="form-input" placeholder="Цена до" />
                      </div>
                      <div className="dual-input">
                        <input className="form-input" placeholder="м² от" />
                        <input className="form-input" placeholder="м² до" />
                      </div>
                      <div className="dual-input">
                        <input className="form-input" placeholder="Комнат от" />
                        <input className="form-input" placeholder="Комнат до" />
                      </div>
                      <div className="dual-input">
                        <input className="form-input" placeholder="Этаж от" />
                        <input className="form-input" placeholder="Этаж до" />
                      </div>
                      <select className="form-input">
                        <option>Все районы</option><option>Ленинский</option><option>Кировский</option><option>Московский</option>
                      </select>
                      <button className="save-btn" onClick={() => setShowFilters(false)}>НАЙТИ</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="list-area">
              {registryTab === 'objects' && objects.map(obj => (
                <div className="card" key={obj.id}>
                  <h3>{obj.type} • {obj.area}м²</h3>
                  <p>{obj.rooms} комн • Этаж {obj.floor} • р-н {obj.district}</p>
                  <p className="addr">{obj.address}</p>
                  <div className="card-footer">
                    <strong>{formatPrice(obj.price)} ₽</strong>
                    <span>{obj.agent}</span>
                  </div>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="card" key={cl.id}>
                  <h3>Поиск: {cl.propertyType}</h3>
                  <p>{cl.roomsFrom}-{cl.roomsTo} комн • {cl.areaFrom}-{cl.areaTo}м²</p>
                  <p className="addr">р-н {cl.district}, {cl.address}</p>
                  <div className="card-footer">
                    <strong>{formatPrice(cl.budgetFrom)} - {formatPrice(cl.budgetTo)} ₽</strong>
                    <span>{cl.agent}</span>
                  </div>
                </div>
              ))}
              {registryTab === 'agents' && (
                <div className="card"><h3>Александр</h3><p>Объекты: 14 • Клиенты: 22</p><span className="tel">+7 (999) 000-00-00</span></div>
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
        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; text-align: center; border-bottom: 1px solid #eee; }
        .topbar h1 { margin: 0; font-size: 20px; letter-spacing: 1px; }
        
        .group-label { font-size: 11px; font-weight: 800; color: #999; margin-bottom: 10px; letter-spacing: 0.5px; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box { background: #fff; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #eee; }
        .stat-box h3 { margin: 0; font-size: 20px; }
        .stat-box span { font-size: 11px; color: #666; }

        .agent-item { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #eee; }
        .rank { width: 30px; font-weight: bold; color: #000; }
        .info b { font-size: 15px; }
        .info p { margin: 0; font-size: 12px; color: #888; }

        .form-container { background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 12px; }
        .form-input { padding: 14px; border-radius: 10px; border: 1px solid #eee; font-size: 15px; width: 100%; background: #f9f9f9; outline: none; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 16px; border-radius: 10px; font-weight: bold; border: none; cursor: pointer; }
        
        .registry-nav { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; padding: 0 5px; }
        .reg-btn { padding: 12px; border: 1px solid #eee; border-radius: 10px; background: #fff; font-weight: 600; cursor: pointer; }
        .reg-btn.active { background: #000; color: #fff; border-color: #000; }
        
        .filter-wrapper { margin-bottom: 15px; }
        .filter-toggle { width: 100%; padding: 14px; background: #fff; border: 1px solid #eee; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; font-weight: bold; cursor: pointer; }
        .filter-panel { background: #fff; padding: 15px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px; }

        .card { background: #fff; padding: 16px; border-radius: 14px; border: 1px solid #eee; margin-bottom: 12px; position: relative; }
        .card h3 { margin: 0 0 5px; font-size: 17px; }
        .card p { margin: 0; font-size: 13px; color: #666; }
        .card .addr { color: #999; margin-top: 4px; }
        .card-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 12px; }
        .card-footer strong { font-size: 18px; color: #000; }
        .card-footer span { font-size: 12px; color: #999; }
        .tel { color: #000; font-weight: bold; display: block; margin-top: 5px; }

        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; padding-bottom: 10px; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }

        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px 20px; border-radius: 20px; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .login-card h1 { margin-bottom: 30px; }
        .login-card input { padding: 15px; width: 100%; border-radius: 10px; border: 1px solid #eee; margin-bottom: 15px; outline: none; background: #f9f9f9; }
        .login-card button { width: 100%; padding: 16px; background: #000; color: #fff; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
      `}</style>
    </main>
  )
            }
          
