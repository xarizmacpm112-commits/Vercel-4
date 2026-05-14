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
  Medal
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

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [agentsList, setAgentsList] = useState([])

  const [newObject, setNewObject] = useState({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' })
  const [newClient, setNewClient] = useState({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' })

  useEffect(() => {
    if (loggedIn) {
      loadAllData()
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
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

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

  const handleLogin = async () => {
    if (agentName && agentPhone) {
      await supabase.from('agents').upsert({ name: agentName, phone: agentPhone }, { onConflict: 'name' })
      setLoggedIn(true)
    }
  }

  const addObject = async () => {
    if(!newObject.price) return alert("Введите цену");
    const payload = { ...newObject, agent: agentName };
    const { data, error } = await supabase.from('objects').insert([payload]).select();
    
    if (!error) {
      setObjects([data[0], ...objects]);
      setNewObject({ type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Ленинский', address: '' });
      alert("Объект опубликован");
    }
  }

  const addClient = async () => {
    const payload = { ...newClient, agent: agentName };
    const { data, error } = await supabase.from('clients').insert([payload]).select();

    if (!error) {
      setClients([data[0], ...clients]);
      setNewClient({ propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Ленинский', address: '' });
      alert("Заявка клиента сохранена");
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
        <div><h1>B2B GARANT</h1></div>
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
                  <div className="stat-box-simple"><h3>{agentsList.length}</h3><span>Агенты</span></div>
                </div>
              </div>
            </div>

            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Лучшие агенты</div>
              {agentsList.slice(0, 3).map((agent, index) => (
                <div key={agent.id} className="agent-rank-card">
                  <div style={{ width: '30px', fontWeight: 'bold' }}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.phone}</p>
                  </div>
                  <Medal size={20} color={index === 0 ? '#FFD700' : '#C0C0C0'} />
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
              <input 
                className="form-input" 
                placeholder="Цена (₽)" 
                value={formatNumber(newObject.price)} 
                onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} 
              />
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
              <div className="dual-input">
                <input className="form-input" placeholder="Кв² от" value={newClient.areaFrom} onChange={e => setNewClient({...newClient, areaFrom: e.target.value})} />
                <input className="form-input" placeholder="Кв² до" value={newClient.areaTo} onChange={e => setNewClient({...newClient, areaTo: e.target.value})} />
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
                  <h3>{obj.type}</h3><p>{obj.rooms} комн • {obj.area}м² • Этаж {obj.floor}</p>
                  <p>{obj.district}, {obj.address}</p><strong>{formatNumber(obj.price)} ₽</strong><span>{obj.agent}</span>
                </div>
              ))}
              {registryTab === 'clients' && clients.map(cl => (
                <div className="registry-card" key={cl.id}>
                  <h3>Поиск: {cl.propertyType}</h3><p>Бюджет: {formatNumber(cl.budgetFrom)} - {formatNumber(cl.budgetTo)} ₽</p>
                  <p>{cl.district}</p><span>{cl.agent}</span>
                </div>
              ))}
              {registryTab === 'agents' && agentsList.map(ag => (
                <div className="registry-card" key={ag.id}>
                  <h3>{ag.name}</h3><p>Агент B2B GARANT</p><span>{ag.phone}</span>
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
        .registry-nav-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .reg-btn { padding: 12px 5px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; cursor: pointer; font-size: 12px; }
        .reg-btn.active { background: #000; color: #fff; }
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
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; z-index: 100; }
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
                
