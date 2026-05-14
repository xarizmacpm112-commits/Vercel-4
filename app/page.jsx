'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  User,
  Trophy,
  Medal,
  Search,
  Zap
} from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ptidjrjpuhgfmoshauel.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0aWRqcmpwdWhnZm1vc2hhdWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODA4MTAsImV4cCI6MjA5MzY1NjgxMH0.9zUWm7Gv30ORwWXMOpJHsdmoMhHPQVPi-kgyFyt-Vtw'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [agentsList, setAgentsList] = useState([])

  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '', clientName: '', clientPhone: '' })

  useEffect(() => {
    if (loggedIn) {
      loadAllData()
      
      const objectsChannel = supabase.channel('realtime-objects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'objects' }, () => loadAllData())
        .subscribe()

      const clientsChannel = supabase.channel('realtime-clients')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadAllData())
        .subscribe()

      return () => {
        supabase.removeChannel(objectsChannel)
        supabase.removeChannel(clientsChannel)
      }
    }
  }, [loggedIn])

  async function loadAllData() {
    const { data: obs } = await supabase.from('objects').select('*').order('created_at', { ascending: false })
    const { data: cls } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: ags } = await supabase.from('agents').select('*').order('created_at', { ascending: false })
    
    if (obs) setObjects(obs)
    if (cls) setClients(cls)
    if (ags) setAgentsList(ags)
  }

  const formatNumber = (val) => {
    if (!val) return ''
    return val.toString().replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const len = phoneNumber.length;
    if (len < 2) return `+${phoneNumber}`;
    if (len < 5) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1)}`;
    if (len < 8) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4)}`;
    if (len < 10) return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
    return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
  };

  const handleLogin = async () => {
    if (agentName && agentPhone) {
      await supabase.from('agents').upsert({ name: agentName, phone: agentPhone }, { onConflict: 'name' })
      setLoggedIn(true)
    }
  }

  const addObject = async () => {
    if(!newObject.price) return alert("Введите цену");
    const { error } = await supabase.from('objects').insert([{ ...newObject, agent: agentName }]);
    if (!error) {
      setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' });
      alert("Объект опубликован");
    }
  }

  const addClient = async () => {
    const { error } = await supabase.from('clients').insert([{ ...newClient, agent: agentName }]);
    if (!error) {
      setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '', clientName: '', clientPhone: '' });
      alert("Заявка клиента сохранена");
    }
  }

  const filteredObjects = objects.filter(o => 
    o.address?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.district?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div><h1>B2B GARANT</h1></div>
        <button className="profile-btn"><User size={20} /></button>
      </header>

      <section className="content" style={{ paddingBottom: '100px' }}>
        
        {activeTab === 'home' && (
          <>
            <div className="stats-section">
              <p className="group-label">МОИ ПОКАЗАТЕЛИ</p>
              <div className="stats-grid-3">
                <div className="stat-box-simple"><h3>{clients.filter(c => c.agent === agentName).length}</h3><span>Клиенты</span></div>
                <div className="stat-box-simple"><h3>{objects.filter(o => o.agent === agentName).length}</h3><span>Объекты</span></div>
                <div className="stat-box-simple"><h3>0</h3><span>Матчи</span></div>
              </div>
            </div>

            <div className="agents-section" style={{ marginTop: '24px' }}>
              <div className="section-title"><Trophy size={18} /> Лучшие агенты</div>
              {agentsList.slice(0, 3).map((agent, index) => (
                <div key={agent.id} className="agent-rank-card">
                  <div style={{ width: '30px', fontWeight: 'bold' }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.phone}</p>
                  </div>
                  <Medal size={20} color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} />
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
                <option>Квартира</option><option>Дом</option><option>Участок</option><option>Коммерция</option>
              </select>
              <input className="form-input" placeholder="Цена (₽)" value={formatNumber(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}>
                <option>Ленинский</option><option>Кировский</option><option>Московский</option><option>Советский</option><option>Приволжский</option>
              </select>
              <input className="form-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}><Zap size={18} /> ОПУБЛИКОВАТЬ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="form-container">
            <h2>Заявка покупателя</h2>
            <div className="form-stack">
              <input className="form-input" placeholder="Имя клиента" value={newClient.clientName} onChange={e => setNewClient({...newClient, clientName: e.target.value})} />
              <input className="form-input" placeholder="Телефон клиента" value={newClient.clientPhone} onChange={e => setNewClient({...newClient, clientPhone: formatPhoneNumber(e.target.value)})} />
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option></select>
              <div className="dual-input">
                <input className="form-input" placeholder="Цена от" value={formatNumber(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                <input className="form-input" placeholder="Цена до" value={formatNumber(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Кв² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                <input className="form-input" placeholder="Кв² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
              </div>
              <div className="dual-input">
                <input className="form-input" placeholder="Комнат от" value={newClient.roomsFrom} onChange={e => setNewClient({...newClient, roomsFrom: e.target.value})} />
                <input className="form-input" placeholder="Комнат до" value={newClient.roomsTo} onChange={e => setNewClient({...newClient, roomsTo: e.target.value})} />
              </div>
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input placeholder="Поиск по адресу или району..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <div className="registry-nav-grid">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('objects')}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('clients')}>Клиенты</button>
              <button className={registryTab === 'matches' ? 'reg-btn active' : 'reg-btn'} onClick={() => setRegistryTab('matches')}>Матчи</button>
            </div>

            <div className="list-section">
              {registryTab === 'objects' && filteredObjects.map(obj => (
                <div className="registry-card" key={obj.id}>
                  <div className="card-badge">{obj.type}</div>
                  <h3>{obj.rooms} комн. • {obj.area} м²</h3>
                  <p>{obj.district}, {obj.address}</p>
                  <strong>{formatNumber(obj.price)} ₽</strong>
                  <div className="card-footer"><span>{obj.agent}</span><span>{new Date(obj.created_at).toLocaleDateString()}</span></div>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="registry-card" key={cl.id}>
                  <div className="card-badge client">Заявка</div>
                  <h3>{cl.clientName || 'Без имени'}</h3>
                  <p>{cl.propertyType} • {cl.district}</p>
                  <strong>{formatNumber(cl.budgetFrom)} - {formatNumber(cl.budgetTo)} ₽</strong>
                  <div className="card-footer"><span>{cl.agent}</span><span>{cl.clientPhone}</span></div>
                </div>
              ))}
              {registryTab === 'matches' && <div className="empty-state">Нет активных совпадений</div>}
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
        .search-bar { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #eee; gap: 10px; }
        .search-bar input { border: none; outline: none; width: 100%; font-size: 14px; }
        .search-icon { color: #888; }
        .group-label { font-size: 11px; font-weight: 800; color: #999; margin-bottom: 10px; letter-spacing: 1px; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box-simple { border: 1px solid #eee; padding: 15px 10px; border-radius: 16px; text-align: center; background: #fff; }
        .stat-box-simple h3 { margin: 0; font-size: 20px; color: #000; }
        .stat-box-simple span { font-size: 10px; color: #aaa; text-transform: uppercase; font-weight: bold; }
        .agent-rank-card { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #eee; }
        .form-container { background: #fff; padding: 20px; border-radius: 20px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 12px; }
        .form-input { padding: 14px; border-radius: 10px; border: 1px solid #eee; font-size: 14px; background: #fcfcfc; outline: none; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 16px; border-radius: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; }
        .registry-nav-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .reg-btn { padding: 12px; border: 1px solid #eee; border-radius: 10px; background: #fff; font-weight: 600; font-size: 13px; color: #666; cursor: pointer; }
        .reg-btn.active { background: #000; color: #fff; border-color: #000; }
        .registry-card { background: #fff; padding: 16px; border-radius: 16px; border: 1px solid #eee; margin-bottom: 12px; position: relative; }
        .card-badge { position: absolute; right: 16px; top: 16px; background: #f0f0f0; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; color: #666; }
        .card-badge.client { background: #eef2ff; color: #4f46e5; }
        .registry-card h3 { margin: 0 0 6px; font-size: 17px; }
        .registry-card p { margin: 0; font-size: 13px; color: #777; }
        .registry-card strong { display: block; margin-top: 10px; font-size: 18px; color: #000; }
        .card-footer { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f9f9f9; font-size: 11px; color: #bbb; }
        .empty-state { text-align: center; padding: 40px; color: #999; font-size: 14px; }
        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: -apple-system, system-ui, sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 10; }
        .topbar h1 { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 75px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; padding-bottom: 10px; }
        .bottom-nav button { background: none; border: none; color: #bbb; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; transition: 0.2s; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: 700; }
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8f8f8; padding: 20px; }
        .login-card { background: #fff; padding: 40px 24px; border-radius: 24px; width: 100%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .login-card h1 { font-size: 24px; margin-bottom: 30px; font-weight: 900; }
        .login-card input { padding: 16px; width: 100%; border-radius: 12px; border: 1px solid #eee; margin-bottom: 12px; background: #fcfcfc; outline: none; }
        .login-card button { width: 100%; padding: 18px; background: #000; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; }
      `}</style>
    </main>
  )
                  }
