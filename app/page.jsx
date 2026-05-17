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
  Trash2,
  LogOut
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

  // Состояния фильтров
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

  // НОВОЕ: Состояние для красивого кастомного уведомления
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    showCancel: false
  })

  const showAlert = (message, onConfirm = null, showCancel = false) => {
    setAlertConfig({ isOpen: true, message, onConfirm, showCancel })
  }

  useEffect(() => {
    const savedAgent = localStorage.getItem('b2b_agent_name')
    const savedPhone = localStorage.getItem('b2b_agent_phone')
    if (savedAgent && savedPhone) {
      setAgentName(savedAgent)
      setAgentPhone(savedPhone)
      loggedInWithExisting(savedAgent, savedPhone)
    }
  }, [])

  const loggedInWithExisting = async (name, phone) => {
    setLoggedIn(true)
  }

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
    showAlert("Вы уверены, что хотите удалить этот объект?", async () => {
      const { error } = await supabase.from('objects').delete().eq('id', id)
      if (error) showAlert("Ошибка при удалении: " + error.message)
      else fetchObjects()
    }, true)
  }

  const deleteClient = async (id) => {
    showAlert("Вы уверены, что хотите удалить эту заявку?", async () => {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) showAlert("Ошибка при удалении: " + error.message)
      else fetchClients()
    }, true)
                           }
          const handleLogin = async () => {
    if (!agentName || !agentPhone) return showAlert("Заполните данные")
    try {
      const { data: existingAgent, error: fetchError } = await supabase
        .from('agents').select('*').eq('name', agentName).maybeSingle()
      if (fetchError) throw fetchError
      
      if (!existingAgent) {
        return showAlert("Аккаунт не зарегистрирован")
      }
      
      setAgentPhone(existingAgent.phone)
      localStorage.setItem('b2b_agent_name', agentName)
      localStorage.setItem('b2b_agent_phone', existingAgent.phone)
      setLoggedIn(true)
    } catch (err) {
      showAlert("Ошибка при авторизации: " + err.message)
    }
  }

  const handleRegister = async () => {
    if (!agentName || !agentPhone) return showAlert("Заполните данные")
    try {
      const { data: existingAgent, error: fetchError } = await supabase
        .from('agents').select('*').eq('name', agentName).maybeSingle()
      if (fetchError) throw fetchError
      
      if (existingAgent) {
        return showAlert("Аккаунт зарегистрирован")
      }
      
      const { error: insertError } = await supabase
        .from('agents').insert([{ name: agentName, phone: agentPhone }])
      if (insertError) throw insertError
      
      localStorage.setItem('b2b_agent_name', agentName)
      localStorage.setItem('b2b_agent_phone', agentPhone)
      setLoggedIn(true)
      showAlert("Регистрация успешна!")
    } catch (err) {
      showAlert("Ошибка при регистрации: " + err.message)
    }
  }

  const handleLogout = () => {
    showAlert("Вы уверены, что хотите выйти из профиля?", () => {
      localStorage.removeItem('b2b_agent_name')
      localStorage.removeItem('b2b_agent_phone')
      setAgentName('')
      setAgentPhone('')
      setLoggedIn(false)
      setActiveTab('home')
    }, true)
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
    if(!newObject.price) return showAlert("Введите цену");
    const objectToSend = {
      role: newObject.role, type: newObject.type, price: parseFloat(newObject.price), rooms: newObject.rooms, area: newObject.area,
      floor: newObject.floor, district: newObject.district, address: newObject.address, agent: agentName
    }
    const { error } = await supabase.from('objects').insert([objectToSend])
    if (error) showAlert("Ошибка при сохранении объекта: " + error.message)
    else { await fetchObjects(); setNewObject({ role: 'Продавец', type: 'Квартира', price: '', rooms: '', area: '', floor: '', district: 'Пропустить', address: '' }); showAlert("Объект опубликован"); }
      }
    const addClient = async () => {
    const clientToSend = {
      role: newClient.role, propertytype: newClient.propertyType, budgetfrom: newClient.budgetFrom ? parseFloat(newClient.budgetFrom) : null,
      budgetto: newClient.budgetTo ? parseFloat(newClient.budgetTo) : null, roomsfrom: newClient.roomsFrom, roomsto: newClient.roomsTo,
      floorfrom: newClient.floorFrom, floorto: newClient.floorTo, areafrom: newClient.areaFrom, areato: newClient.areaTo,
      district: newClient.district, address: newClient.address, agent: agentName
    }
    const { error } = await supabase.from('clients').insert([clientToSend])
    if (error) showAlert("Ошибка при сохранении заявки: " + error.message)
    else { await fetchClients(); setNewClient({ role: 'Покупатель', propertyType: 'Квартира', budgetFrom: '', budgetTo: '', roomsFrom: '', roomsTo: '', floorFrom: '', floorTo: '', areaFrom: '', areaTo: '', district: 'Пропустить', address: '' }); showAlert("Заявка покупателя сохранена"); }
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
    if (filterType !== 'Все типы' && obj.type !== filterType) return false
    if (filterRole !== 'Все категории' && obj.role !== filterRole) return false
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
    const pType = cl.propertytype || cl.propertyType
    const bFrom = cl.budgetfrom || cl.budgetFrom
    const bTo = cl.budgetto || cl.budgetTo
    const rFrom = cl.roomsfrom || cl.roomsFrom
    const rTo = cl.roomsto || cl.roomsTo
    const aFrom = cl.areafrom || cl.areaFrom
    const aTo = cl.areato || cl.areaTo
    const cRole = cl.role || 'Покупатель'

    if (filterType !== 'Все типы' && pType !== filterType) return false
    if (filterRole !== 'Все категории' && cRole !== filterRole) return false
    if (filterDistrict !== 'Все районы' && cl.district !== filterDistrict) return false
    if (filterPriceFrom && bFrom && parseFloat(bFrom) < parseFloat(filterPriceFrom)) return false
    if (filterPriceTo && bTo && parseFloat(bTo) > parseFloat(filterPriceTo)) return false
    if (filterAreaFrom && aFrom && parseFloat(aFrom) < parseFloat(filterAreaFrom)) return false
    if (filterAreaTo && aTo && parseFloat(aTo) > parseFloat(filterAreaTo)) return false
    if (filterRoomsFrom && rFrom && parseFloat(rFrom) < parseFloat(filterRoomsFrom)) return false
    if (filterRoomsTo && rTo && parseFloat(rTo) > parseFloat(filterRoomsTo)) return false
    return true
  })

  const getMatches = () => {
    const matchesList = []
    objects.forEach(obj => {
      clients.forEach(cl => {
        const pType = cl.propertytype || cl.propertyType
        const bFrom = cl.budgetfrom || cl.budgetFrom ? parseFloat(cl.budgetfrom || cl.budgetFrom) : 0
        const bTo = cl.budgetto || cl.budgetTo ? parseFloat(cl.budgetto || cl.budgetTo) : Infinity
        const rFrom = cl.roomsfrom || cl.roomsFrom ? parseFloat(cl.roomsfrom || cl.roomsFrom) : 0
        const rTo = cl.roomsto || cl.roomsTo ? parseFloat(cl.roomsto || cl.roomsTo) : Infinity
        const aFrom = cl.areafrom || cl.areaFrom ? parseFloat(cl.areafrom || cl.areaFrom) : 0
        const aTo = cl.areato || cl.areaTo ? parseFloat(cl.areato || cl.areaTo) : Infinity
        const cRole = cl.role || 'Покупатель'
        
        const matchRole = (obj.role === 'Продавец' && cRole === 'Покупатель') || (obj.role === 'Арендодатель' && cRole === 'Арендатор')
        const matchType = obj.type === pType
        const matchDistrict = obj.district === 'Пропустить' || cl.district === 'Пропустить' || obj.district === cl.district
        const matchRooms = parseFloat(obj.rooms) >= rFrom && parseFloat(obj.rooms) <= rTo
        const matchPrice = parseFloat(obj.price) >= bFrom && parseFloat(obj.price) <= bTo
        const matchArea = parseFloat(obj.area) >= aFrom && parseFloat(obj.area) <= aTo

        if (matchRole && matchType && matchDistrict && matchRooms && matchPrice && matchArea) {
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
          <button onClick={handleRegister}>ЗАРЕГИСТРИРОВАТЬСЯ</button>
        </div>

        {/* Кастомное окно уведомлений для экрана входа */}
        {alertConfig.isOpen && (
          <div className="custom-alert-overlay">
            <div className="custom-alert-box">
              <p>{alertConfig.message}</p>
              <div className="custom-alert-buttons">
                {alertConfig.showCancel && (
                  <button className="custom-alert-btn-cancel" onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>
                    Отмена
                  </button>
                )}
                <button className="custom-alert-btn-confirm" onClick={() => {
                  if (alertConfig.onConfirm) alertConfig.onConfirm();
                  setAlertConfig(prev => ({ ...prev, isOpen: false }));
                }}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="crm-container">
      {/* Сюда встык встает твой код интерфейса CRM из телефона */}
      
      {/* Кастомное окно уведомлений для внутренней части CRM */}
      {alertConfig.isOpen && (
        <div className="custom-alert-overlay">
          <div className="custom-alert-box">
            <p>{alertConfig.message}</p>
            <div className="custom-alert-buttons">
              {alertConfig.showCancel && (
                <button className="custom-alert-btn-cancel" onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>
                  Отмена
                </button>
              )}
              <button className="custom-alert-btn-confirm" onClick={() => {
                if (alertConfig.onConfirm) alertConfig.onConfirm();
                setAlertConfig(prev => ({ ...prev, isOpen: false }));
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
