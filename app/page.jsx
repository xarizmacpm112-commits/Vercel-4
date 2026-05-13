'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronUp,
  Trophy,
  Medal
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  // Функция для красивого вывода цены: 10 000 000
  const formatPrice = (val) => {
    if (!val) return ''
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  // База данных
  const [objects, setObjects] = useState([
    { id: 1, type: 'Квартира', price: '8500000', rooms: '3', area: '85', floor: '4', district: 'Ленинский', address: 'ул. Пушкина, 10', agent: 'Александр' }
  ])

  const [clients, setClients] = useState([
    { id: 1, propertyType: 'Квартира', budgetFrom: '5000000', budgetTo: '9500000', roomsFrom: '2', roomsTo: '4', floorFrom: '1', floorTo: '10', areaFrom: '40', areaTo: '100', district: 'Кировский', address: 'Центр', agent: 'Александр' }
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
        <div className="login-card glass">
          <h1 className="gold-text">B2B GARANT</h1>
          <input className="gold-input" placeholder="Имя агента" value={agentName} onChange={e => setAgentName(e.target.value)} />
          <input className="gold-input" placeholder="Номер телефона (+7...)" value={agentPhone} onChange={e => setAgentPhone(e.target.value)} />
          <button className="gold-btn" onClick={() => { if (agentName && agentPhone) setLoggedIn(true) }}>ВОЙТИ</button>
        </div>
      </main>
    )
  }

  return (
    <main className="crm-container">
      <header className="topbar">
        <h1 className="gold-text">B2B GARANT</h1>
      </header>

      <section className="content">
        
        {activeTab === 'home' && (
          <div className="home-layout">
            <div className="stats-section">
              <p className="section-label">АНАЛИТИКА</p>
              <div className="stats-grid">
                <div className="stat-card glass"><h3>{clients.length}</h3><span>Клиенты</span></div>
                <div className="stat-card glass"><h3>{objects.length}</h3><span>Объекты</span></div>
                <div className="stat-card glass"><h3>0</h3><span>Сделки</span></div>
              </div>
            </div>

            <div className="rating-section glass">
              <p className="section-label"><Trophy size={14} /> ТОП АГЕНТОВ</p>
              {['Александр', 'Елена', 'Дмитрий'].map((name, i) => (
                <div key={name} className="rank-item">
                  <span className="rank-num">{i + 1}</span>
                  <div className="rank-info"><b>{name}</b></div>
                  <Medal size={18} className="gold-text" />
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'objects' || activeTab === 'clients') && (
          <div className="form-container glass">
            <h2 className="gold-text">{activeTab === 'objects' ? 'Новый объект' : 'Поиск покупателя'}</h2>
            <div className="form-stack">
              {activeTab === 'objects' ? (
                <>
                  <select className="gold-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}><option>Квартира</option><option>Дом</option></select>
                  <input className="gold-input" placeholder="Цена (₽)" value={formatPrice(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
                  <div className="dual-input">
                    <input className="gold-input" placeholder="Площадь м²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
                    <input className="gold-input" placeholder="Комнат" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
                  </div>
                  <input className="gold-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
                  <select className="gold-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}>
                    <option>Ленинский</option><option>Кировский</option><option>Московский</option>
                  </select>
                  <input className="gold-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
                  <button className="gold-btn" onClick={addObject}>ОПУБЛИКОВАТЬ</button>
                </>
              ) : (
                <>
                  <select className="gold-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
                  <div className="dual-input">
                    <input className="gold-input" placeholder="Цена от" value={formatPrice(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                    <input className="gold-input" placeholder="Цена до" value={formatPrice(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
                  </div>
                  <div className="dual-input">
                    <input className="gold-input" placeholder="м² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                    <input className="gold-input" placeholder="м² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
                  </div>
                  <div className="dual-input">
                    <input className="gold-input" placeholder="Комнат от" value={newClient.roomsFrom} onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} />
                    <input className="gold-input" placeholder="Комнат до" value={newClient.roomsTo} onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} />
                  </div>
                  <div className="dual-input">
                    <input className="gold-input" placeholder="Этаж от" value={newClient.floorFrom} onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} />
                    <input className="gold-input" placeholder="Этаж до" value={newClient.floorTo} onChange={e => setNewClient({...newClient, floorTo: e.target.value})} />
                  </div>
                  <select className="gold-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}>
                    <option>Ленинский</option><option>Кировский</option><option>Московский</option>
                  </select>
                  <input className="gold-input" placeholder="Адрес (желаемый)" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
                  <button className="gold-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <div className="registry-container">
            <div className="registry-tabs glass">
              <button className={registryTab === 'objects' ? 'reg-nav-btn active' : 'reg-nav-btn'} onClick={() => { setRegistryTab('objects'); setShowFilters(false); }}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-nav-btn active' : 'reg-nav-btn'} onClick={() => { setRegistryTab('clients'); setShowFilters(false); }}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-nav-btn active' : 'reg-nav-btn'} onClick={() => { setRegistryTab('agents'); setShowFilters(false); }}>Агенты</button>
            </div>

            {registryTab !== 'agents' && (
              <div className="filter-dropdown">
                <button className="filter-trigger glass" onClick={() => setShowFilters(!showFilters)}>
                   <Search size={16} /> Поиск {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showFilters && (
                  <div className="filter-panel glass animate-slide">
                    <div className="form-stack">
                      <div className="dual-input">
                        <input className="gold-input" placeholder="Цена от" />
                        <input className="gold-input" placeholder="Цена до" />
                      </div>
                      <div className="dual-input">
                        <input className="gold-input" placeholder="м² от" />
                        <input className="gold-input" placeholder="м² до" />
                      </div>
                      <div className="dual-input">
                        <input className="gold-input" placeholder="Комнаты от" />
                        <input className="gold-input" placeholder="Комнаты до" />
                      </div>
                      <div className="dual-input">
                        <input className="gold-input" placeholder="Этаж от" />
                        <input className="gold-input" placeholder="Этаж до" />
                      </div>
                      <select className="gold-input">
                        <option>Все районы</option><option>Ленинский</option><option>Кировский</option><option>Московский</option>
                      </select>
                      <button className="gold-btn">НАЙТИ</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="scroll-area">
              {registryTab === 'objects' && objects.map(obj => (
                <div className="item-card glass" key={obj.id}>
                  <h3 className="gold-text">{obj.type} • {obj.area}м²</h3>
                  <p>{obj.rooms} комн • Этаж {obj.floor} • р-н {obj.district}</p>
                  <p className="dim-text">{obj.address}</p>
                  <div className="card-bottom">
                    <span className="price-tag">{formatPrice(obj.price)} ₽</span>
                    <span className="agent-tag">{obj.agent}</span>
                  </div>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="item-card glass" key={cl.id}>
                  <h3 className="gold-text">Поиск: {cl.propertyType}</h3>
                  <p>{cl.roomsFrom}-{cl.roomsTo} комн • {cl.areaFrom}-{cl.areaTo}м²</p>
                  <p className="dim-text">р-н {cl.district}, {cl.address}</p>
                  <div className="card-bottom">
                    <span className="price-tag">{formatPrice(cl.budgetFrom)} - {formatPrice(cl.budgetTo)} ₽</span>
                  </div>
                </div>
              ))}
              {registryTab === 'agents' && (
                <div className="item-card glass">
                  <h3 className="gold-text">Александр</h3>
                  <p>Объекты: 14 • Клиенты: 22</p>
                  <p className="gold-text">+7 (999) 000-00-00</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <nav className="bottom-nav glass">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}><Home size={20} /><span>Главная</span></button>
        <button className={activeTab === 'objects' ? 'active' : ''} onClick={() => setActiveTab('objects')}><Building2 size={20} /><span>Объект</span></button>
        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}><Users size={20} /><span>Клиент</span></button>
        <button className={activeTab === 'registry' ? 'active' : ''} onClick={() => setActiveTab('registry')}><ClipboardList size={20} /><span>Реестр</span></button>
      </nav>

      <style jsx>{`
        :global(body) { background: #0a0a0a; color: #fff; margin: 0; font-family: 'Inter', sans-serif; }
        .crm-container { max-width: 480px; margin: 0 auto; min-height: 100vh; padding-bottom: 90px; }
        
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; }
        .gold-text { color: #d4af37; font-weight: bold; }
        .dim-text { color: rgba(255, 255, 255, 0.5); font-size: 13px; }
        
        .topbar { padding: 25px; text-align: center; }
        .topbar h1 { margin: 0; font-size: 22px; letter-spacing: 2px; }

        .section-label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 800; letter-spacing: 1px; margin-bottom: 12px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .stat-card { padding: 15px; text-align: center; }
        .stat-card h3 { margin: 0; font-size: 22px; color: #d4af37; }
        .stat-card span { font-size: 10px; opacity: 0.6; text-transform: uppercase; }

        .rating-section { padding: 20px; }
        .rank-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .rank-num { width: 30px; font-weight: 900; color: #d4af37; }
        .rank-info { flex: 1; font-size: 15px; }

        .form-container { padding: 25px; margin: 0 15px; }
        .form-stack { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
        
        .gold-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 14px; color: #fff; outline: none; font-size: 15px; }
        .gold-input:focus { border-color: #d4af37; box-shadow: 0 0 10px rgba(212, 175, 55, 0.1); }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        .gold-btn { background: #d4af37; color: #000; font-weight: 900; padding: 16px; border-radius: 12px; border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
        .gold-btn:active { transform: scale(0.98); }

        .registry-tabs { display: grid; grid-template-columns: 1fr 1fr 1fr; margin: 0 15px 15px; padding: 5px; }
        .reg-nav-btn { padding: 12px; background: none; border: none; color: #888; font-weight: 600; cursor: pointer; border-radius: 15px; }
        .reg-nav-btn.active { background: rgba(212, 175, 55, 0.15); color: #d4af37; }

        .filter-dropdown { margin: 0 15px 20px; }
        .filter-trigger { width: 100%; padding: 15px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: bold; }
        .filter-panel { padding: 20px; border-top: none; border-radius: 0 0 20px 20px; }

        .item-card { padding: 20px; margin: 0 15px 12px; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
        .price-tag { font-size: 18px; font-weight: 800; color: #d4af37; }
        .agent-tag { font-size: 12px; opacity: 0.5; }

        .bottom-nav { position: fixed; bottom: 15px; left: 50%; transform: translateX(-50%); width: 92%; max-width: 440px; height: 70px; display: flex; justify-content: space-around; align-items: center; z-index: 100; border: 1px solid rgba(255,255,255,0.15); }
        .bottom-nav button { background: none; border: none; color: rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; }
        .bottom-nav button.active { color: #d4af37; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }

        .login-page { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .login-card { width: 100%; max-width: 350px; padding: 40px 30px; text-align: center; }
        .animate-slide { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  )
              }
                    
