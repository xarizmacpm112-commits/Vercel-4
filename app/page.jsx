'use client'

import { useState, useEffect } from 'react'
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

const NEXT_PUBLIC_SUPABASE_URL = "https://ptidjrjpuhgfmoshauel.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aWRqcmpwdWhnZm1vc2hhdWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODA4MTAsImV4cCI6MjA5MzY1NjgxMH0.9zUWm7Gv30ORwWXMOpJHsdmoMhHPQVPi-kgyFyt-Vtw"

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [showFilters, setShowFilters] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [allAgents, setAllAgents] = useState([])

  useEffect(() => {
    if (loggedIn) {
      fetchAllData()
    }
  }, [loggedIn])

  const fetchAllData = async () => {
    await Promise.all([fetchObjects(), fetchClients(), fetchAgents()])
  }

  const fetchObjects = async () => {
    const { data } = await supabase.from('objects').select('*').order('created_at', { ascending: false })
    if (data) setObjects(data)
  }

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (data) setClients(data)
  }

  const fetchAgents = async () => {
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false })
    if (data) setAllAgents(data)
  }

  const handleLogin = async () => {
    if (!agentName || !agentPhone) return alert("Заполните данные")
    
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('name', agentName)
      .maybeSingle()

    if (!existingAgent) {
      const { error } = await supabase.from('agents').insert([{ name: agentName, phone: agentPhone }])
      if (error) return alert("Ошибка регистрации")
    }
    
    setLoggedIn(true)
    fetchAllData() // Обновляем данные сразу после входа
  }

  const formatNumber = (val) => {
    if (!val) return ''
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 1) return '';
    return `+${phoneNumber.slice(0, 11)}`;
  };

  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })

  const addObject = async () => {
    if(!newObject.price) return alert("Введите цену");
    const { error } = await supabase.from('objects').insert([{ ...newObject, agent: agentName }])
    if (!error) {
      await fetchObjects() // Мгновенное обновление
      setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
      alert("Объект добавлен")
    } else {
      alert("Ошибка при добавлении объекта")
    }
  }

  const addClient = async () => {
    const { error } = await supabase.from('clients').insert([{ ...newClient, agent: agentName }])
    if (!error) {
      await fetchClients() // Мгновенное обновление
      setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })
      alert("Заявка добавлена")
    } else {
      alert("Ошибка при добавлении заявки")
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
                  <div className="stat-box-simple"><h3>{clients.length}</h3><span>Клиенты</span></div>
                  <div className="stat-box-simple"><h3>{objects.length}</h3><span>Объекты</span></div>
                  <div className="stat-box-simple"><h3>{allAgents.length}</h3><span>Агенты</span></div>
                </div>
              </div>
            </div>

            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Список агентов</div>
              {allAgents.map((agent, index) => (
                <div key={agent.id} className="agent-rank-card">
                  <div style={{ width: '30px', fontWeight: 'bold', color: '#000' }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.phone}</p>
                  </div>
                  <Medal size={20} color="#000" />
                </div>
              ))}
            </div>
          </>
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
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-nav-grid">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('objects')}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('clients')}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('agents')}>Агенты</button>
            </div>
            <div className="list-section">
              {registryTab === 'objects' && objects.map(obj => (
                <div className="registry-card" key={obj.id}>
                  <h3>{obj.type}</h3><p>{obj.address}</p><strong>{formatNumber(obj.price)} ₽</strong><span>{obj.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="registry-card" key={cl.id}>
                  <h3>{cl.propertyType}</h3><p>Бюджет: {formatNumber(cl.budgetFrom)} ₽</p>
                  <span>{cl.agent}</span>
                </div>
              ))}
              {registryTab === 'agents' && allAgents.map(a => (
                <div className="registry-card" key={a.id}><h3>{a.name}</h3><p>{a.phone}</p></div>
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
        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bottom-nav button.active { color: #000; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; width: 100%; margin-bottom: 10px; background: #f9f9f9; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; width: 100%; border: none; font-weight: bold; cursor: pointer; }
        .stat-box-simple { border: 1px solid #eee; padding: 10px; border-radius: 12px; text-align: center; background: #fff; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px; border-radius: 20px; width: 100%; text-align: center; }
        .registry-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; }
        .reg-btn { padding: 10px; border: 1px solid #000; border-radius: 8px; background: transparent; font-size: 12px; }
        .reg-btn.active { background: #000; color: #fff; }
        .registry-nav-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .group-label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; }
      `}</style>
    </main>
  )
        }
