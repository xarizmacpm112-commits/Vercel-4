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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function HomePage() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [objects, setObjects] = useState([])
  const [clients, setClients] = useState([])
  const [allAgents, setAllAgents] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriceFrom, setFilterPriceFrom] = useState('')
  const [filterPriceTo, setFilterPriceTo] = useState('')

  const [newObject, setNewObject] = useState({
    type: 'Квартира',
    price: '',
    rooms: '',
    area: '',
    floor: '',
    district: 'Ленинский',
    address: ''
  })

  const [newClient, setNewClient] = useState({
    propertyType: 'Квартира',
    budgetFrom: '',
    budgetTo: '',
    roomsFrom: '',
    roomsTo: '',
    floorFrom: '',
    floorTo: '',
    areaFrom: '',
    areaTo: '',
    district: 'Ленинский',
    address: ''
  })

  useEffect(() => {
    if (loggedIn) {
      fetchAllData()
    }
  }, [loggedIn])

  const fetchAllData = async () => {
    await Promise.all([
      fetchObjects(),
      fetchClients(),
      fetchAgents()
    ])
  }

  const fetchObjects = async () => {
    const { data } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setObjects(data)
  }

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setClients(data)
  }

  const fetchAgents = async () => {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .order('name', { ascending: true })

    if (data) setAllAgents(data)
  }

  const handleLogin = async () => {

    if (!agentName || !agentPhone) {
      return alert('Заполните данные')
    }

    const { data: existingAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('name', agentName)
      .maybeSingle()

    if (!existingAgent) {

      const { error } = await supabase
        .from('agents')
        .insert([
          {
            name: agentName,
            phone: agentPhone
          }
        ])

      if (error) {
        return alert('Ошибка регистрации')
      }
    }

    setLoggedIn(true)
  }

  const addObject = async () => {

    if (!newObject.price) {
      return alert('Введите цену')
    }

    const { error } = await supabase
      .from('objects')
      .insert([
        {
          ...newObject,
          agent: agentName
        }
      ])

    if (error) {
      return alert('Ошибка добавления')
    }

    await fetchObjects()

    setNewObject({
      type: 'Квартира',
      price: '',
      rooms: '',
      area: '',
      floor: '',
      district: 'Ленинский',
      address: ''
    })

    alert('Объект добавлен')
  }

  const addClient = async () => {

    const { error } = await supabase
      .from('clients')
      .insert([
        {
          ...newClient,
          agent: agentName
        }
      ])

    if (error) {
      return alert('Ошибка сохранения')
    }

    await fetchClients()

    setNewClient({
      propertyType: 'Квартира',
      budgetFrom: '',
      budgetTo: '',
      roomsFrom: '',
      roomsTo: '',
      floorFrom: '',
      floorTo: '',
      areaFrom: '',
      areaTo: '',
      district: 'Ленинский',
      address: ''
    })

    alert('Заявка добавлена')
  }

  const formatNumber = (val) => {
    if (!val) return ''
    let number = val.toString().replace(/\s/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value

    const phoneNumber = value.replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length

    if (phoneNumberLength < 2) return `+${phoneNumber}`

    if (phoneNumberLength < 5) {
      return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1)}`
    }

    if (phoneNumberLength < 8) {
      return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4)}`
    }

    if (phoneNumberLength < 10) {
      return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`
    }

    return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`
  }

  const filteredObjects = objects.filter(obj => {

    const matchesSearch =
      obj.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.agent?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriceFrom =
      !filterPriceFrom || Number(obj.price) >= Number(filterPriceFrom)

    const matchesPriceTo =
      !filterPriceTo || Number(obj.price) <= Number(filterPriceTo)

    return matchesSearch && matchesPriceFrom && matchesPriceTo
  })

  if (!loggedIn) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>B2B GARANT</h1>

          <input
            placeholder="Имя агента"
            value={agentName}
            onChange={e => setAgentName(e.target.value)}
          />

          <input
            placeholder="+7 999 000 00 00"
            value={agentPhone}
            onChange={e => setAgentPhone(formatPhoneNumber(e.target.value))}
          />

          <button onClick={handleLogin}>
            ВОЙТИ
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="crm-container">

      <header className="topbar">
        <h1>B2B GARANT</h1>

        <button className="profile-btn">
          <User size={20} />
        </button>
      </header>

      <section className="content" style={{ paddingBottom: '100px' }}>

        {activeTab === 'home' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

              <div>
                <p className="group-label">МОИ ПОКАЗАТЕЛИ</p>

                <div className="stats-grid-3">

                  <div className="stat-box-simple">
                    <h3>{clients.filter(c => c.agent === agentName).length}</h3>
                    <span>Клиенты</span>
                  </div>

                  <div className="stat-box-simple">
                    <h3>{objects.filter(o => o.agent === agentName).length}</h3>
                    <span>Объекты</span>
                  </div>

                  <div className="stat-box-simple">
                    <h3>0</h3>
                    <span>Матчи</span>
                  </div>

                </div>
              </div>

              <div>
                <p className="group-label">КОМПАНИЯ</p>

                <div className="stats-grid-3">

                  <div className="stat-box-simple">
                    <h3>{clients.length}</h3>
                    <span>Клиенты</span>
                  </div>

                  <div className="stat-box-simple">
                    <h3>{objects.length}</h3>
                    <span>Объекты</span>
                  </div>

                  <div className="stat-box-simple">
                    <h3>{allAgents.length}</h3>
                    <span>Агенты</span>
                  </div>

                </div>
              </div>
            </div>

            <div className="agents-section">

              <div className="section-title">
                <Trophy size={18} />
                Список агентов
              </div>

              {allAgents.map((agent, index) => (

                <div key={agent.id} className="agent-rank-card">

                  <div style={{ width: '30px', fontWeight: 'bold', color: '#000' }}>
                    {index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>
                      {agent.name}
                    </h3>

                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {agent.phone}
                    </p>
                  </div>

                  <Medal size={20} color="#000" />

                </div>
              ))}
            </div>
          </>
        )}

      </section>

      <nav className="bottom-nav">

        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          <Home size={22} />
          <span>Главная</span>
        </button>

        <button className={activeTab === 'objects' ? 'active' : ''} onClick={() => setActiveTab('objects')}>
          <Building2 size={22} />
          <span>Объект</span>
        </button>

        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => setActiveTab('clients')}>
          <Users size={22} />
          <span>Клиент</span>
        </button>

        <button className={activeTab === 'registry' ? 'active' : ''} onClick={() => setActiveTab('registry')}>
          <ClipboardList size={22} />
          <span>Реестр</span>
        </button>

      </nav>

      <style jsx>{`
        .group-label { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 8px; text-transform: uppercase; }
        .stats-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .stat-box-simple { border: 1px solid #eee; padding: 10px; border-radius: 12px; text-align: center; background: #fff; }
        .stat-box-simple h3 { margin: 0; font-size: 18px; }
        .stat-box-simple span { font-size: 10px; color: #888; text-transform: uppercase; }
        .agent-rank-card { display: flex; align-items: center; background: #fff; padding: 12px; border-radius: 12px; margin-bottom: 10px; border: 1px solid #eee; }
        .form-container { background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #eee; }
        .form-stack { display: flex; flex-direction: column; gap: 10px; }
        .form-input { padding: 12px; border-radius: 8px; border: 1px solid #ddd; width: 100%; outline: none; background: #f9f9f9; }
        .dual-input { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .save-btn { background: #000; color: #fff; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none; width: 100%; }
        .crm-container { max-width: 500px; margin: 0 auto; background: #fcfcfc; min-height: 100vh; font-family: sans-serif; }
        .topbar { padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .content { padding: 20px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 70px; background: #fff; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #eee; }
        .bottom-nav button { background: none; border: none; color: #ccc; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bottom-nav button.active { color: #000; }
        .bottom-nav span { font-size: 10px; font-weight: bold; }
        .login-page { display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4; padding: 20px; }
        .login-card { background: #fff; padding: 40px 20px; border-radius: 20px; width: 100%; text-align: center; }
        .login-card input { padding: 15px; width: 100%; border-radius: 10px; border: 1px solid #eee; margin-bottom: 15px; background: #f9f9f9; }
        .login-card button { width: 100%; padding: 16px; background: #000; color: #fff; border-radius: 10px; font-weight: bold; cursor: pointer; border: none; }
      `}</style>

    </main>
  )
      }
