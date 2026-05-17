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
  ChevronUp,
  Trash2
} from 'lucide-react'

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')
  const [profileTab, setProfileTab] = useState('my-objects')
  const [showFilters, setShowFilters] = useState(false)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [allAgents, setAllAgents] = useState([])

  // Состояния фильтров реестра
  const [filterType, setFilterType] = useState('Все типы')
  const [filterRole, setFilterRole] = useState('Все категории')
  const [filterPriceFrom, setFilterPriceFrom] = useState('')
  const [filterPriceTo, setFilterPriceTo] = useState('')
  const [filterAreaFrom, setFilterAreaFrom] = useState('')
  const [filterAreaTo, setFilterAreaTo] = useState('')
  const [filterRoomsFrom, setFilterRoomsFrom] = useState('')
  const [filterRoomsTo, setFilterRoomsTo] = useState('')
  const [filterFloorFrom, setFilterFloorFrom] = useState('')
  const [filterFloorTo, setFilterFloorTo] = useState('')
  const [filterDistrict, setFilterDistrict] = useState('Все районы')

  useEffect(() => {
    const savedAgent = localStorage.getItem('b2b_agent_name')
    const savedPhone = localStorage.getItem('b2b_agent_phone')
    if (savedAgent && savedPhone) {
      setAgentName(savedAgent)
      setAgentPhone(savedPhone)
      setLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (loggedIn) {
      fetchAllData()
    }
  }, [loggedIn])

  const fetchAllData = async () => {
    fetchObjects()
    fetchClients()
    fetchAgents()
  }

  const fetchObjects = async () => {
    const { data, error } = await supabase.from('objects').select('*').order('created_at', { ascending: false })
    if (!error && data) setObjects(data)
  }

  const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (!error && data) setClients(data)
  }

  const fetchAgents = async () => {
    const { data, error } = await supabase.from('agents').select('*').order('name', { ascending: true })
    if (!error && data) setAllAgents(data)
  }

  const deleteObject = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить этот объект?")) return
    const { error } = await supabase.from('objects').delete().eq('id', id)
    if (error) alert("Ошибка при удалении: " + error.message)
    else fetchObjects()
  }

  const deleteClient = async (id) => {
    if (!confirm("Вы уверены, что хотите удалить эту заявку?")) return
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) alert("Ошибка при удалении: " + error.message)
    else fetchClients()
  }
    const handleLogin = async () => {
    if (!agentName || !agentPhone) return alert("Заполните данные")
    try {
      const { data: existingAgent, error: fetchError } = await supabase
        .from('agents').select('*').eq('name', agentName).maybeSingle()
      if (fetchError) throw fetchError
      if (!existingAgent) {
        const { error: insertError } = await supabase
          .from('agents').insert([{ name: agentName, phone: agentPhone }])
        if (insertError) throw insertError
      }
      localStorage.setItem('b2b_agent_name', agentName)
      localStorage.setItem('b2b_agent_phone', agentPhone)
      setLoggedIn(true)
    } catch (err) {
      alert("Ошибка при авторизации: " + err.message)
    }
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

  const [newObject, setNewObject] = useState({ role: 'Продавец', type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Пропустить', address: '' })
  const [newClient, setNewClient] = useState({ role: 'Покупатель', propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Пропустить', address: '' })

  const addObject = async () => {
    if(!newObject.price) return alert("Введите цену");
    const objectToSend = {
      role: newObject.role, type: newObject.type, price: parseFloat(newObject.price), rooms: newObject.rooms, area: newObject.area,
      floor: newObject.floor, district: newObject.district, address: newObject.address, agent: agentName
    }
    const { error } = await supabase.from('objects').insert([objectToSend])
    if (error) return alert("Ошибка при сохранении объекта: " + error.message)
    
    await fetchObjects(); 
    setNewObject({ role: 'Продавец', type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Пропустить', address: '' }); 
    alert("Объект опубликован");
  }

  const addClient = async () => {
    const clientToSend = {
      role: newClient.role, propertytype: newClient.propertyType, budgetfrom: newClient.budgetFrom ? parseFloat(newClient.budgetFrom) : null,
      budgetto: newClient.budgetTo ? parseFloat(newClient.budgetTo) : null, roomsfrom: newClient.roomsFrom, roomsto: newClient.roomsTo,
      floorfrom: newClient.floorFrom, floorto: newClient.floorTo, areafrom: newClient.areaFrom, areato: newClient.areaTo,
      district: newClient.district, address: newClient.address, agent: agentName
    }
    const { error } = await supabase.from('clients').insert([clientToSend])
    if (error) return alert("Ошибка при сохранении заявки: " + error.message)
    
    await fetchClients(); 
    setNewClient({ role: 'Покупатель', propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Пропустить', address: '' }); 
    alert("Заявка сохранена");
  }

  const getTopAgents = () => {
    const stats = allAgents.map(agent => {
      const agentObjects = objects.filter(o => o.agent === agent.name).length
      const agentClients = clients.filter(c => c.agent === agent.name).length
      return { name: agent.name, objectsCount: agentObjects, clientsCount: agentClients, total: agentObjects + agentClients }
    })
    return stats.sort((a, b) => b.total - a.total).slice(0, 3)
  }

  const rankStyles = [ { color: '#FFD700' }, { color: '#C0C0C0' }, { color: '#CD7F32' } ]

  const filteredObjects = objects.filter(obj => {
    const objRole = obj.role || 'Продавец' // Защита: если роли в базе нет, считаем Продавцом
    if (filterType !== 'Все типы' && obj.type !== filterType) return false
    if (filterRole !== 'Все категории' && objRole !== filterRole) return false
    if (filterDistrict !== 'Все районы' && obj.district !== filterDistrict) return false
    if (filterPriceFrom && parseFloat(obj.price) < parseFloat(filterPriceFrom)) return false
    if (filterPriceTo && parseFloat(obj.price) > parseFloat(filterPriceTo)) return false
    if (filterAreaFrom && parseFloat(obj.area) < parseFloat(filterAreaFrom)) return false
    if (filterAreaTo && parseFloat(obj.area) > parseFloat(filterAreaTo)) return false
    if (filterRoomsFrom && parseFloat(obj.rooms) < parseFloat(filterRoomsFrom)) return false
    if (filterRoomsTo && parseFloat(obj.rooms) > parseFloat(filterRoomsTo)) return false
    if (filterFloorFrom && parseFloat(obj.floor) < parseFloat(filterFloorFrom)) return false
    if (filterFloorTo && parseFloat(obj.floor) > parseFloat(filterFloorTo)) return false
    return true
  })

  const filteredClients = clients.filter(cl => {
    const cRole = cl.role || 'Покупатель' // Защита: если роли нет, считаем Покупателем
    if (filterType !== 'Все типы' && (cl.propertytype || cl.propertyType) !== filterType) return false
    if (filterRole !== 'Все categories' && filterRole !== 'Все категории' && cRole !== filterRole) return false
    if (filterDistrict !== 'Все районы' && cl.district !== filterDistrict) return false
    if (filterPriceFrom && (cl.budgetfrom || cl.budgetFrom) && parseFloat(cl.budgetfrom || cl.budgetFrom) < parseFloat(filterPriceFrom)) return false
    if (filterPriceTo && (cl.budgetto || cl.budgetTo) && parseFloat(cl.budgetto || cl.budgetTo) > parseFloat(filterPriceTo)) return false
    return true
  })

  const getMatches = () => {
    const matchesList = []
    objects.forEach(obj => {
      clients.forEach(cl => {
        const objRole = obj.role || 'Продавец'
        const cRole = cl.role || 'Покупатель'
        const pType = cl.propertytype || cl.propertyType

        const matchRole = (objRole === 'Продавец' && cRole === 'Покупатель') || (objRole === 'Арендодатель' && cRole === 'Арендатор')
        const matchType = obj.type === pType
        const matchDistrict = obj.district === 'Пропустить' || cl.district === 'Пропустить' || obj.district === cl.district
        
        if (matchRole && matchType && matchDistrict) {
          if (obj.agent === agentName || cl.agent === agentName) {
            matchesList.push({ id: `${obj.id}-${cl.id}`, object: obj, client: cl })
          }
        }
      })
    })
    return matchesList
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
        <button className={activeTab === 'profile' ? 'profile-btn active-prof' : 'profile-btn'} onClick={() => { setActiveTab('profile'); setFilterRole('Все категории'); }}><User size={20} /></button>
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
                  <div className="stat-box-simple"><h3>{getMatches().length}</h3><span>Матчи</span></div>
                </div>
              </div>
            </div>
            <div className="agents-section">
              <div className="section-title"><Trophy size={18} /> Лучшие агенты</div>
              {getTopAgents().map((agent, index) => {
                const styleConfig = rankStyles[index] || { color: '#eee' }
                return (
                  <div key={agent.name} className="agent-rank-card" style={{ borderColor: styleConfig.color, borderWidth: '2px', borderStyle: 'solid' }}>
                    <div style={{ width: '30px', fontWeight: 'bold', color: styleConfig.color }}>{index + 1}</div>
                    <div style={{ flex: 1 }}><h3 style={{ margin: 0, fontSize: '16px' }}>{agent.name}</h3><p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{agent.clientsCount} кл • {agent.objectsCount} об</p></div>
                    <Medal size={20} color={styleConfig.color} />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <div className="form-container">
            <h2>Выставить объект</h2>
            <div className="form-stack">
              <select className="form-input" value={newObject.role} onChange={e => setNewObject({...newObject, role: e.target.value})}><option>Продавец</option><option>Арендодатель</option></select>
              <select className="form-input" value={newObject.type} onChange={e => setNewObject({...newObject, type: e.target.value})}><option>Квартира</option><option>Дом</option><option>Коммерция</option></select>
              <input className="form-input" placeholder="Цена (₽)" value={formatNumber(newObject.price)} onChange={e => setNewObject({...newObject, price: e.target.value.replace(/\s/g, '')})} />
              <input className="form-input" placeholder="Кв²" value={newObject.area} onChange={e => setNewObject({...newObject, area: e.target.value})} />
              <input className="form-input" placeholder="Комнаты" value={newObject.rooms} onChange={e => setNewObject({...newObject, rooms: e.target.value})} />
              <input className="form-input" placeholder="Этаж" value={newObject.floor} onChange={e => setNewObject({...newObject, floor: e.target.value})} />
              <select className="form-input" value={newObject.district} onChange={e => setNewObject({...newObject, district: e.target.value})}><option>Пропустить</option><option>Альбурикент</option><option>Кировский</option><option>Кяхулай</option><option>Ленинский</option><option>Новый Кяхулай</option><option>Советский</option><option>Тарки</option></select>
              <input className="form-input" placeholder="Адрес" value={newObject.address} onChange={e => setNewObject({...newObject, address: e.target.value})} />
              <button className="save-btn" onClick={addObject}>ОПУБЛИКОВАТЬ</button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="form-container">
            <h2>Заявка клиента</h2>
            <div className="form-stack">
              <select className="form-input" value={newClient.role} onChange={e => setNewClient({...newClient, role: e.target.value})}><option>Покупатель</option><option>Арендатор</option></select>
              <select className="form-input" value={newClient.propertyType} onChange={e => setNewClient({...newClient, propertyType: e.target.value})}><option>Квартира</option><option>Дом</option><option>Коммерция</option></select>
              <div className="dual-input">
                <input className="form-input" placeholder="Цена от" value={formatNumber(newClient.budgetFrom)} onChange={e => setNewClient({...newClient, budgetFrom: e.target.value.replace(/\s/g, '')})} />
                <input className="form-input" placeholder="Цена до" value={formatNumber(newClient.budgetTo)} onChange={e => setNewClient({...newClient, budgetTo: e.target.value.replace(/\s/g, '')})} />
              </div>
              <select className="form-input" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})}><option>Пропустить</option><option>Альбурикент</option><option>Кировский</option><option>Кяхулай</option><option>Ленинский</option><option>Новый Кяхулай</option><option>Советский</option><option>Тарки</option></select>
              <input className="form-input" placeholder="Адрес" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
              <button className="save-btn" onClick={addClient}>СОХРАНИТЬ ЗАЯВКУ</button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="form-container">
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}><h2>{agentName}</h2><p style={{ color: '#666' }}>{agentPhone}</p></div>
            <div className="registry-nav-grid" style={{ marginBottom: '20px' }}>
              <button className={profileTab === 'my-objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setProfileTab('my-objects'); setFilterRole('Все категории'); }}>Мои Объекты</button>
              <button className={profileTab === 'my-clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setProfileTab('my-clients'); setFilterRole('Все категории'); }}>Мои Клиенты</button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <select className="form-input" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option>Все категории</option>
                {profileTab === 'my-objects' ? (
                  <><option>Продавец</option><option>Арендодатель</option></>
                ) : (
                  <><option>Покупатель</option><option>Арендатор</option></>
                )}
              </select>
            </div>

            <div className="list-section">
              {profileTab === 'my-objects' && (
                objects.filter(o => o.agent === agentName && (filterRole === 'Все категории' || (o.role || 'Продавец') === filterRole)).map(obj => (
                  <div className="registry-card" key={obj.id}><span className="type-badge">{obj.role || 'Продавец'}</span><h3>{obj.type}</h3><p>{obj.rooms} комн • {obj.area}м²</p><p>{obj.district}, {obj.address}</p><strong>{formatNumber(obj.price)} ₽</strong><button className="delete-card-btn" onClick={() => deleteObject(obj.id)}><Trash2 size={16} /></button></div>
                ))
              )}
              {profileTab === 'my-clients' && (
                clients.filter(c => c.agent === agentName && (filterRole === 'Все категории' || (c.role || 'Покупатель') === filterRole)).map(cl => (
                  <div className="registry-card" key={cl.id}><span className="type-badge">{cl.role || 'Покупатель'}</span><h3>Поиск: {cl.propertytype || cl.propertyType}</h3><p>Бюджет: {formatNumber(cl.budgetfrom || cl.budgetFrom)} - {formatNumber(cl.budgetto || cl.budgetTo)} ₽</p><button className="delete-card-btn" onClick={() => deleteClient(cl.id)}><Trash2 size={16} /></button></div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className="registry-nav-grid">
              <button className={registryTab === 'objects' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('objects'); setFilterRole('Все категории'); }}>Объекты</button>
              <button className={registryTab === 'clients' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('clients'); setFilterRole('Все категории'); }}>Клиенты</button>
              <button className={registryTab === 'agents' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('agents'); }}>Агенты</button>
              <button className={registryTab === 'matches' ? 'reg-btn active' : 'reg-btn'} onClick={() => { setRegistryTab('matches'); }}>Матчи</button>
            </div>
            
            {registryTab !== 'agents' && registryTab !== 'matches' && (
              <div style={{ marginBottom: '15px' }}>
                <select className="form-input" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                  <option>Все категории</option>
                  {registryTab === 'objects' ? (
                    <><option>Продавец</option><option>Арендодатель</option></>
                  ) : (
                    <><option>Покупатель</option><option>Арендатор</option></>
                  )}
                </select>
              </div>
            )}

            <div className="list-section">
              {registryTab === 'objects' && filteredObjects.map(obj => (<div className="registry-card" key={obj.id}><span className="type-badge">{obj.role || 'Продавец'}</span><h3>{obj.type}</h3><strong>{formatNumber(obj.price)} ₽</strong><span className="agent-tag-bottom">{obj.agent}</span></div>))}
              {registryTab === 'clients' && filteredClients.map(cl => (<div className="registry-card" key={cl.id}><span className="type-badge">{cl.role || 'Покупатель'}</span><h3>Поиск: {cl.propertytype || cl.propertyType}</h3><span className="agent-tag-bottom">{cl.agent}</span></div>))}
              {registryTab === 'agents' && allAgents.map(a => (<div className="agent-row-card" key={a.id}><h3>{a.name}</h3><p>{a.phone}</p></div>))}
              {registryTab === 'matches' && getMatches().map(m => (
                <div className="match-card" key={m.id}><div className="match-badge">МАТЧ</div><p>{m.object.type} - {formatNumber(m.object.price)} ₽</p></div>
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
        .stat-box-simple { border: 1px solid #eee; padding: 10px; border-radius: 12px; text-align: center; background: #fff; }
        .stat-box-simple h3 { margin: 0; font-size: 18px; }
        .stat-box-simple span { font-size: 10px; color: #888; }
        
        .agent-rank-card { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #eee; }
        .form-container { background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 10px; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; font-size: 14px; width: 100%; background: #f9f9f9; outline: none; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; }
        
        .registry-nav-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px; }
        .reg-btn { padding: 10px 2px; border: 1px solid #000; border-radius: 8px; background: transparent; font-weight: bold; font-size: 11px; cursor: pointer; text-align: center; }
        .reg-btn.active { background: #000; color: #fff; }

        .registry-card { background: #fff; padding: 15px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 10px; position: relative; }
        .type-badge { background: #f0f0f0; color: #333; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
        .delete-card-btn { position: absolute; right: 15px; top: 15px; background: none; border: none; color: #ff4d4d; cursor: pointer; }
        .agent-tag-bottom { position: absolute; right: 15px; bottom: 15px; font-size: 11px; color: #aaa; }

        .agent-row-card { background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 8px; }
        .match-card { background: #fff; border: 2px dashed #000; padding: 15px; border-radius: 16px; margin-bottom: 15px; }
        .match-badge { display: inline-block; background: #000; color: #fff; font-size: 9px; font-weight: bold; padding: 4px 8px; border-radius: 20px; margin-bottom: 10px; }

        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .profile-btn { background: none; border: none; color: #ccc; cursor: pointer; }
        .profile-btn.active-prof { color: #000; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }
        
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px 20px; border-radius: 20px; width: 100%; text-align: center; }
        .login-card input { padding: 15px; width: 100%; border-radius: 10px; border: 1px solid #eee; margin-bottom: 15px; outline: none; background: #f9f9f9; }
        .login-card button { width: 100%; padding: 16px; background: #000; color: #fff; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
      `}</style>
    </main>
  )
}
