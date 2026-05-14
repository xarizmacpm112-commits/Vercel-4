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
  ChevronUp,
  X,
  Trash2
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  // Функция для форматирования чисел с пробелами: 1 000 000
  const formatNumber = (val) => {
    if (!val) return ''
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  // Функция для форматирования телефона
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 2) return `+${phoneNumber}`;
    if (phoneNumberLength < 5) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1)}`;
    if (phoneNumberLength < 8) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4)}`;
    if (phoneNumberLength < 10) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
  };

  const [filterPriceFrom, setFilterPriceFrom] = useState('')
  const [filterPriceTo, setFilterPriceTo] = useState('')

  // База данных
  const [objects, setObjects] = useState([
    { id: 1, type: 'Квартира', price: '8500000', rooms: '3', area: '85', floor: '4', district: 'Ленинский', address: 'ул. Пушкина, 10', agent: 'Admin' }
  ])

  const [clients, setClients] = useState([
    { id: 1, propertyType: 'Квартира', budgetFrom: '5000000', budgetTo: '9500000', roomsFrom: '2', roomsTo: '4', floorFrom: '1', floorTo: '6', areaFrom: '60', areaTo: '120', district: 'Кировский', address: 'Центр 1', agent: 'Admin' }
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

  const deleteObject = (id) => {
    if(confirm("Удалить этот объект?")) {
      setObjects(objects.filter(obj => obj.id !== id));
    }
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
          <input placeholder="+7 999 000 00 00" value={agentPhone} onChange={e => setAgentPhone(formatPhoneNumber(e.target.value))} />
          <button onClick={() => { if (agentName && agentPhone) setLoggedIn(true) }}>ВОЙТИ</button>
        </div>
      </main>
    )
  }

  return (
    <main className="crm-container">
      <header className="topbar">
        <div><h1>B2B GARANT</h1></div>
        <button className="profile-btn" onClick={() => setShowProfile(true)}><User size={24} /></button>
      </header>

      {/* Модальное окно профиля */}
      {showProfile && (
        <div className="profile-overlay">
          <div className="profile-window">
            <div className="profile-header">
              <h2>Мой профиль</h2>
              <button onClick={() => setShowProfile(false)}><X size={24} /></button>
            </div>
            
            <div className="profile-edit-section">
              <label>Имя агента</label>
              <input className="form-input" value={agentName} onChange={e => setAgentName(e.target.value)} />
              <label>Телефон</label>
              <input className="form-input" value={agentPhone} onChange={e => setAgentPhone(formatPhoneNumber(e.target.value))} />
            </div>

            <div className="my-objects-section">
              <h3>Мои объекты ({objects.filter(o => o.agent === agentName).length})</h3>
              <div className="my-objects-list">
                {objects.filter(o => o.agent === agentName).length === 0 ? (
                  <p style={{color: '#999', fontSize: '14px'}}>У вас пока нет добавленных объектов</p>
                ) : (
                  objects.filter(o => o.agent === agentName).map(obj => (
                    <div className="registry-card mini" key={obj.id}>
                      <div>
                        <h4>{obj.type} — {formatNumber(obj.price)} ₽</h4>
                        <p>{obj.address}</p>
                      </div>
                      <button className="delete-btn" onClick={() => deleteObject(obj.id)}><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <button className="save-btn" onClick={() => setShowProfile(false)}>ГОТОВО</button>
          </div>
        </div>
      )}

      <section className="content" style={{ paddingBottom: '100px' }}>
        
        {activeTab === 'home' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
              <div>
                <p className="group-label">МОИ ПОКАЗАТЕЛИ</p>
                <div className="stats-grid-3">
                  <div className="stat-box-simple"><h3>{clients.filter(c => c.agent === agentName).length}</h3><span>Клиенты</span></div>
                  <div className="stat-box-simple"><h3>{objects.filter(o => o.agent === agentName).length}</h3><span>Объекты</span></div>
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
              <input className="form-input" placeholder="Цена (₽)" value={formatNumber(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
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
            <h2>Заявка покупателя</h2>
            <div className="form-stack">
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <div className="dual-input">
                <input className="form-input" placeholder="Цена от (₽)" value={formatNumber(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                <input className="form-input" placeholder="Цена до (₽)" value={formatNumber(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
              </div>
              <div className="dual-input"><input className="form-input" placeholder="Кв² от" /><input className="form-input" placeholder="Кв² до" /></div>
              <div className="dual-input"><input className="form-input" placeholder="Комнат от" /><input className="form-input" placeholder="Комнат до" /></div>
              <div className="dual-input"><input className="form-input" placeholder="Этаж от" /><input className="form-input" placeholder="Этаж до" /></div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}>
                <option>Ленинский</option><option>Кировский</option><option>Московский</option>
              </select>
              <input className="form-input" placeholder="Адрес" onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-nav-grid">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('objects'); setShowFilters(false); }}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('clients'); setShowFilters(false); }}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('agents'); setShowFilters(false); }}>Агенты</button>
              <button className={registryTab === 'matches' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('matches'); setShowFilters(false); }}>Матчи</button>
            </div>

            {registryTab !== 'agents' && registryTab !== 'matches' && (
              <div className="registry-filter-container">
                <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                   <Search size={16} /> Поиск {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showFilters && (
                  <div className="expanded-filter-panel">
                    <div className="filter-fields">
                      <select className="form-input"><option>Все типы</option><option>Квартира</option><option>Дом</option></select>
                      <div className="dual-input">
                        <input className="form-input" placeholder="Цена от" value={formatNumber(filterPriceFrom)} onChange={e => setFilterPriceFrom(e.target.value.replace(/\s/g, ''))} />
                        <input className="form-input" placeholder="Цена до" value={formatNumber(filterPriceTo)} onChange={e => setFilterPriceTo(e.target.value.replace(/\s/g, ''))} />
                      </div>
                      <div className="dual-input"><input className="form-input" placeholder="Кв² от" /><input className="form-input" placeholder="Кв² до" /></div>
                      <div className="dual-input"><input className="form-input" placeholder="Комнаты от" /><input className="form-input" placeholder="Комнаты до" /></div>
                      <select className="form-input"><option>Все районы</option><option>Ленинский</option><option>Кировский</option></select>
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
                  <p>{obj.district}, {obj.address}</p><strong>{formatNumber(obj.price)} ₽</strong><span>{obj.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="registry-card" key={cl.id}>
                  <h3>Поиск: {cl.propertyType}</h3><p>Бюджет: {formatNumber(cl.budgetFrom)} - {formatNumber(cl.budgetTo)} ₽</p>
                  <p>{cl.roomsFrom}-{cl.roomsTo} комн</p><span>{cl.agent}</span>
                </div>
              ))}
              {registryTab === 'agents' && <div className="registry-card"><h3>{agentName}</h3><p>Мой номер: {agentPhone}</p></div>}
              {registryTab === 'matches' && <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Активных матчей нет</div>}
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
        .profile-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; }
        .profile-window { background: #fff; width: 100%; max-width: 500px; margin: 0 auto; border-radius: 20px 20px 0 0; padding: 20px; max-height: 90vh; overflow-y: auto; }
        .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .profile-edit-section { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
        .profile-edit-section label { font-size: 12px; font-weight: bold; color: #666; }
        .my-objects-section h3 { font-size: 16px; margin-bottom: 12px; }
        .my-objects-list { display: flex; flex-direction: column; gap: 10px; }
        .registry-card.mini { padding: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #eee; }
        .registry-card.mini h4 { margin: 0; font-size: 14px; }
        .delete-btn { background: #fee2e2; color: #dc2626; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }

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
        
        .registry-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        @media (min-width: 400px) { .registry-nav-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        .reg-btn { padding: 12px 5px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; cursor: pointer; font-size: 12px; }
        .reg-btn.active { background: #000; color: #fff; }
        
        .registry-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; position: relative; }
        .registry-card strong { display: block; margin-top: 5px; color: #000; }
        .registry-card span { position: absolute; right: 15px; top: 15px; font-size: 11px; color: #aaa; }

        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; position: relative; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .topbar h1 { margin: 0; font-size: 20px; }
        .profile-btn { background: none; border: none; cursor: pointer; color: #000; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justi
