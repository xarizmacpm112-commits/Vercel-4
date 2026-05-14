'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Home, Building2, Users, ClipboardList, Search, User, Trophy, Medal, ChevronDown, ChevronUp
} from 'lucide-react'

// Инициализация Supabase через переменные Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  // Основные данные из БД
  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])

  // Состояния фильтров
  const [fPriceFrom, setFPriceFrom] = useState('')
  const [fPriceTo, setFPriceTo] = useState('')
  const [fAreaFrom, setFAreaFrom] = useState('')
  const [fAreaTo, setFAreaTo] = useState('')
  const [fRoomsFrom, setFRoomsFrom] = useState('')
  const [fRoomsTo, setFRoomsTo] = useState('')
  const [fFloorFrom, setFFloorFrom] = useState('')
  const [fFloorTo, setFFloorTo] = useState('')
  const [fDistrict, setFDistrict] = useState('Все районы')

  // Функции загрузки
  const fetchData = useCallback(async () => {
    const { data: objs, error: err1 } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data: cls, error: err2 } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (!err1 && objs) setObjects(objs)
    if (!err2 && cls) setClients(cls)
  }, [])

  useEffect(() => {
    if (loggedIn) fetchData()
  }, [loggedIn, fetchData])

  // Форматирование
  const formatNumber = (val) => {
    if (!val) return ''
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value
    const num = value.replace(/[^\d]/g, '')
    const len = num.length
    if (len < 2) return `+${num}`
    if (len < 5) return `+${num.slice(0, 1)} ${num.slice(1)}`
    if (len < 8) return `+${num.slice(0, 1)} ${num.slice(1, 4)} ${num.slice(4)}`
    if (len < 10) return `+${num.slice(0, 1)} ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(7)}`
    return `+${num.slice(0, 1)} ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(7, 9)} ${num.slice(9, 11)}`
  }

  // ТОП Агентов
  const topAgents = useMemo(() => {
    const stats = {}
    objects.forEach(obj => {
      if (!stats[obj.agent]) stats[obj.agent] = { name: obj.agent, b: 0, s: 0 }
      stats[obj.agent].s += 1
    })
    clients.forEach(cl => {
      if (!stats[cl.agent]) stats[cl.agent] = { name: cl.agent, b: 0, s: 0 }
      stats[cl.agent].b += 1
    })
    return Object.values(stats).sort((a, b) => (b.b + b.s) - (a.b + a.s)).slice(0, 3)
  }, [objects, clients])

  // Состояния новых записей
  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })

  // Работа с базой
  const addObject = async () => {
    if(!newObject.price) return alert("Введите цену")
    const { error } = await supabase.from('objects').insert([{ ...newObject, agent: agentName }])
    if (error) return alert("Ошибка сохранения: " + error.message)
    
    await fetchData()
    setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
    setActiveTab('registry'); setRegistryTab('objects')
    alert("Объект в базе!")
  }

  const addClient = async () => {
    const { error } = await supabase.from('clients').insert([{ ...newClient, agent: agentName }])
    if (error) return alert("Ошибка сохранения: " + error.message)

    await fetchData()
    setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })
    setActiveTab('registry'); setRegistryTab('clients')
    alert("Клиент в базе!")
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
        <h1>B2B GARANT</h1>
        <button className="profile-btn"><User size={20} /></button>
      </header>

      <section className="content" style={{ paddingBottom: '100px' }}>
        {activeTab === 'home' && (
          <>
            <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
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
                  <div className="stat-box-simple"><h3>{clients.length}</h3><span>Клиенты</span></div>
                  <div className="stat-box-simple"><h3>{objects.length}</h3><span>Объекты</span></div>
                  <div className="stat-box-simple"><h3>{topAgents.length}</h3><span>Агенты</span></div>
                </div>
              </div>
            </div>

            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Лучшие агенты</div>
              {[0, 1, 2].map((i) => {
                const agent = topAgents[i]
                return (
                  <div key={i} className="agent-rank-card" style={{ opacity: agent ? 1 : 0.4 }}>
                    <div style={{ width: '30px', fontWeight: 'bold', color: ['#FFD700', '#C0C0C0', '#CD7F32'][i] }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{agent ? agent.name : '—'}</h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent ? `${agent.b} кл • ${agent.s} об` : 'Свободно'}</p>
                    </div>
                    <Medal size={20} color={agent ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : '#eee'} />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <div className="form-container">
            <h2>Новый объект</h2>
            <div className="form-stack">
              <select className="form-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <input className="form-input" placeholder="Цена (₽)" value={formatNumber(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}><option>Ленинский</option><option>Кировский</option><option>Московский</option></select>
              <input className="form-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}>ДОБАВИТЬ В БАЗУ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="form-container">
            <h2>Заявка клиента</h2>
            <div className="form-stack">
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <div className="dual-input">
                <input className="form-input" placeholder="Цена от" value={formatNumber(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                <input className="form-input" placeholder="Цена до" value={formatNumber(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
              </div>
              <div className="dual-input"><input className="form-input" placeholder="Кв² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} /><input className="form-input" placeholder="Кв² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} /></div>
              <div className="dual-input"><input className="form-input" placeholder="Комнат от" value={newClient.roomsFrom} onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} /><input className="form-input" placeholder="Комнат до" value={newClient.roomsTo} onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} /></div>
              <div className="dual-input"><input className="form-input" placeholder="Этаж от" value={newClient.floorFrom} onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} /><input className="form-input" placeholder="Этаж до" value={newClient.floorTo} onChange={e => setNewClient({...newClient, floorTo: e.target.value})} /></div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}><option>Ленинский</option><option>Кировский</option><option>Московский</option></select>
              <input className="form-input" placeholder="Адрес" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ В БАЗУ</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-nav-grid">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('objects')}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('clients')}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('agents')}>Агенты</button>
              <button className={registryTab === 'matches' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('matches')}>Матчи</button>
            </div>

            {registryTab !== 'agents' && registryTab !== 'matches' && (
              <div className="filter-area">
                <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                   <Search size={16} /> Фильтры поиска {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showFilters && (
                  <div className="expanded-filter-panel">
                    <div className="filter-fields">
                      <select className="form-input"><option>Все типы</option></select>
                      <div className="dual-input">
                        <input className="form-input" placeholder="Цена от" value={formatNumber(fPriceFrom)} onChange={e => setFPriceFrom(e.target.value.replace(/\s/g, ''))} />
                        <input className="form-input" placeholder="Цена до" value={formatNumber(fPriceTo)} onChange={e => setFPriceTo(e.target.value.replace(/\s/g, ''))} />
                      </div>
                      <div className="dual-input"><input className="form-input" placeholder="Кв² от" value={fAreaFrom} onChange={e => setFAreaFrom(e.target.value)} /><input className="form-input" placeholder="Кв² до" value={fAreaTo} onChange={e => setFAreaTo(e.target.value)} /></div>
                      <div className="dual-input"><input className="form-input" placeholder="Комнат от" value={fRoomsFrom} onChange={e => setFRoomsFrom(e.target.value)} /><input className="form-input" placeholder="Комнат до" value={fRoomsTo} onChange={e => setFRoomsTo(e.target.value)} /></div>
                      <div className="dual-input"><input className="form-input" placeholder="Этаж от" value={fFloorFrom} onChange={e => setFFloorFrom(e.target.value)} /><input className="form-input" placeholder="Этаж до" value={fFloorTo} onChange={e => setFFloorTo(e.target.value)} /></div>
                      <select className="form-input" value={fDistrict} onChange={e => setFDistrict(e.target.value)}><option>Все районы</option><option>Ленинский</option><option>Кировский</option><option>Московский</option></select>
                      <button className="save-btn" onClick={() => setShowFilters(false)}>ПРИМЕНИТЬ</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="list-section">
              {registryTab === 'objects' && objects.map(o => (
                <div className="registry-card" key={o.id}>
                  <h3>{o.type}</h3><p>{o.rooms}к • {o.area}м² • Этаж {o.floor}</p>
                  <p>{o.district}, {o.address}</p><strong>{formatNumber(o.price)} ₽</strong><span>{o.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(c => (
                <div className="registry-card" key={c.id}>
                  <h3>Клиент: {c.propertyType}</h3><p>Бюджет: {formatNumber(c.budgetFrom)} - {formatNumber(c.budgetTo)} ₽</p>
                  <p>{c.roomsFrom}-{c.roomsTo}к • Этаж {c.floorFrom}-{c.floorTo}</p>
                  <p>{c.district}, {c.address}</p><span>{c.agent}</span>
                </div>
              ))}
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
        .group-label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; text-transform: uppercase; }
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
        .registry-nav-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px; }
        @media (min-width: 400px) { .registry-nav-grid { grid-template-columns: repeat(4, 1fr); } }
        .reg-btn { padding: 12px 5px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; font-size: 12px; }
        .reg-btn.active { background: #000; color: #fff; }
        .filter-toggle-btn { width: 100%; padding: 12px; background: #fff; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; font-weight: 600; }
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
        .profile-btn { background: none; border: none; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; z-index: 100; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px 20px; border-radius: 20px; width: 100%; text-align: center; }
        .log
