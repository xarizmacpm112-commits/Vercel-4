'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ptidjrjpuhgfmoshauel.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aWRqcmpwdWhnZm1vc2hhdWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODA4MTAsImV4cCI6MjA5MzY1NjgxMH0.9zUWm7Gv30ORwWXMOpJHsdmoMhHPQVPi-kgyFyt-Vtw'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)
  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [agentsList, setAgentsList] = useState([])

  const [filterPriceFrom, setFilterPriceFrom] = useState('')
  const [filterPriceTo, setFilterPriceTo] = useState('')

  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })

  const fetchData = useCallback(async () => {
    const { data: o } = await supabase.from('objects').select('*').order('created_at', { ascending: false })
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: a } = await supabase.from('agents').select('*')
    if (o) setObjects(o)
    if (c) setClients(c)
    if (a) setAgentsList(a)
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchData()
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
  }, [loggedIn, fetchData])

  // Расширенная статистика для списка агентов
  const agentsWithStats = [...agentsList].map(agent => {
    const agentObjects = objects.filter(o => o.agent === agent.name).length
    const agentClients = clients.filter(c => c.agent === agent.name).length
    return { ...agent, agentObjects, agentClients }
  }).sort((a, b) => b.agentObjects - a.agentObjects)

  const topThreeAgents = agentsWithStats.slice(0, 3)

  const formatNumber = (val) => {
    if (!val) return ''
    return val.toString().replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatPhoneNumber = (v) => {
    if (!v) return v
    const n = v.replace(/[^\d]/g, '')
    const l = n.length
    if (l < 2) return `+${n}`
    if (l < 5) return `+${n.slice(0, 1)} ${n.slice(1)}`
    if (l < 8) return `+${n.slice(0, 1)} ${n.slice(1, 4)} ${n.slice(4)}`
    if (l < 10) return `+${n.slice(0, 1)} ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7)}`
    return `+${n.slice(0, 1)} ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7, 9)} ${n.slice(9, 11)}`
  }

  const handleLogin = async () => {
    if (agentName && agentPhone) {
      await supabase.from('agents').upsert({ name: agentName, phone: agentPhone }, { onConflict: 'name' })
      setLoggedIn(true)
    }
  }

  const addObject = async () => {
    if (!newObject.price) return alert("Введите цену")
    const { error } = await supabase.from('objects').insert([{ ...newObject, agent: agentName }])
    if (!error) {
      setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
      alert("Объект опубликован")
    }
  }

  const addClient = async () => {
    const { error } = await supabase.from('clients').insert([{
      propertyType: newClient.propertyType,
      budgetFrom: newClient.budgetFrom,
      budgetTo: newClient.budgetTo,
      roomsFrom: newClient.roomsFrom,
      roomsTo: newClient.roomsTo,
      floorFrom: newClient.floorFrom,
      floorTo: newClient.floorTo,
      areaFrom: newClient.areaFrom,
      areaTo: newClient.areaTo,
      district: newClient.district,
      address: newClient.address,
      agent: agentName
    }])
    if (!error) {
      setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })
      alert("Заявка клиента сохранена")
    } else {
      alert("Ошибка при сохранении клиента")
    }
  }

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>
          <input placeholder="Имя агента" value={agentName} onChange={e => setAgentName(e.target.value)} />
          <input placeholder="+7 999 000 00 00" value={agentPhone} onChange={e => setAgentPhone(formatPhoneNumber(e.target.value))} />
          <button onClick={handleLogin}>ВОЙТИ</button>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                <div className="stat-box-simple"><h3>{agentsList.length}</h3><span>Агенты</span></div>
              </div>
            </div>
            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Топ-3 агента</div>
              {topThreeAgents.map((agent, i) => (
                <div key={agent.id} className="agent-rank-card">
                  <div style={{ width: '30px', fontWeight: 'bold' }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '15px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>Объектов: {agent.agentObjects} | Клиентов: {agent.agentClients}</p>
                  </div>
                  <Medal size={20} color={i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="form-container">
            <h2>Выставить объект</h2>
            <div className="form-stack">
              <select className="form-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <input className="form-input" placeholder="Цена (₽)" value={formatNumber(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}><option>Ленинский</option><option>Кировский</option><option>Московский</option></select>
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
              <div className="dual-input">
                <input className="form-input" placeholder="Кв² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                <input className="form-input" placeholder="Кв² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Комнат от" value={newClient.roomsFrom} onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} />
                <input className="form-input" placeholder="Комнат до" value={newClient.roomsTo} onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Этаж от" value={newClient.floorFrom} onChange={e => setNewClient({...newClient, floorFrom: e.target.value})} />
                <input className="form-input" placeholder="Этаж до" value={newClient.floorTo} onChange={e => setNewClient({...newClient, floorTo: e.target.value})} />
              </div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}><option>Ленинский</option><option>Кировский</option><option>Московский</option></select>
              <input className="form-input" placeholder="Комментарий / Адрес" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
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
            <div className="list-section">
              {registryTab === 'objects' && objects.map(o => (
                <div className="registry-card" key={o.id}>
                  <h3>{o.type}</h3><p>{o.rooms} комн • {o.area}м² • Этаж {o.floor}</p>
                  <p>{o.district}, {o.address}</p><strong>{formatNumber(o.price)} ₽</strong><span>{o.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(c => (
                <div className="registry-card" key={c.id}>
                  <h3>Поиск: {c.propertyType}</h3><p>Бюджет: {formatNumber(c.budgetFrom)} - {formatNumber(c.budgetTo)} ₽</p>
                  <p>{c.roomsFrom}-{c.roomsTo} комн • Район: {c.district}</p><span>{c.agent}</span>
                </div>
              ))}
              {registryTab === 'agents' && agentsWithStats.map(a => (
                <div className="registry-card" key={a.id}>
                  <h3>{a.name}</h3>
                  <p>{a.phone}</p>
                  <p style={{fontSize: '11px', marginTop: '6px', color: '#000', fontWeight: 'bold'}}>
                    Объектов: {a.agentObjects} | Клиентов: {a.agentClients}
                  </p>
                </div>
              ))}
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
        .group-label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; text-transform: uppercase; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box-simple { border: 1px solid #eee; padding: 10px; border-radius: 12px; text-align: center; background: #fff; }
        .stat-box-simple h3 { margin: 0; font-size: 18px; }
        .stat-box-simple span { font-size: 10px; color: #888; }
        .agent-rank-card { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #eee; }
        .form-container { background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 10px; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; font-size: 14px; width: 100%; outline: none; background: #f9f9f9; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; width: 100%; }
        .registry-nav-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 15px; }
        .reg-btn { padding: 10px 2px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; cursor: pointer; font-size: 11px; }
        .reg-btn.active { background: #000; color: #fff; }
        .registry-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; position: relative; }
        .registry-card h3 { margin: 0 0 5px; font-size: 16px; }
        .registry-card p { margin: 0; font-size: 13px; color: #666; }
        .registry-card strong { display: block; margin-top: 5px; color: #000; font-size: 17px; }
        .registry-card span { position: absolute; right: 15px; top: 15px; font-size: 11px; color: #aaa; }
        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .topbar h1 { margin: 0; font-size: 20px; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
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
            
