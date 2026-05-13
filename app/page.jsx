'use client'

import { useState } from 'react'
import {
  Home,
  Building2,
  Users,
  ClipboardList,
  Plus,
  Search,
  User,
  Trophy,
  X
} from 'lucide-react'

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [registryTab, setRegistryTab] = useState('objects')

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')

  const [showAddObject, setShowAddObject] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)

  const [search, setSearch] = useState('')

  const [objects, setObjects] = useState([
    {
      id: 1,
      type: 'Квартира',
      price: '450000',
      rooms: '3',
      area: '85',
      floor: '4',
      district: 'Frankfurt Center',
      address: 'Main Street 21',
      agent: 'Alexander'
    }
  ])

  const [clients, setClients] = useState([
    {
      id: 1,
      clientType: 'Покупатель',
      propertyType: 'Квартира',
      budgetFrom: '300000',
      budgetTo: '500000',
      roomsFrom: '2',
      roomsTo: '4',
      areaFrom: '60',
      areaTo: '120',
      floorFrom: '1',
      floorTo: '6',
      district: 'Frankfurt Center',
      address: 'Center',
      agent: 'Alexander'
    }
  ])

  const [newObject, setNewObject] = useState({
    type: 'Квартира',
    price: '',
    rooms: '',
    area: '',
    floor: '',
    district: '',
    address: ''
  })

  const [newClient, setNewClient] = useState({
    clientType: 'Покупатель',
    propertyType: 'Квартира',
    budgetFrom: '',
    budgetTo: '',
    roomsFrom: '',
    roomsTo: '',
    areaFrom: '',
    areaTo: '',
    floorFrom: '',
    floorTo: '',
    district: '',
    address: ''
  })

  const addObject = () => {
    setObjects([
      {
        id: Date.now(),
        ...newObject,
        agent: agentName
      },
      ...objects
    ])

    setShowAddObject(false)
  }

  const addClient = () => {
    setClients([
      {
        id: Date.now(),
        ...newClient,
        agent: agentName
      },
      ...clients
    ])

    setShowAddClient(false)
  }

  const buyers = clients.filter(
    client => client.clientType === 'Покупатель'
  )

  const sellers = clients.filter(
    client => client.clientType === 'Продавец'
  )

  const matches = buyers.filter(buyer =>
    objects.some(
      object =>
        buyer.propertyType === object.type &&
        Number(object.price) >= Number(buyer.budgetFrom) &&
        Number(object.price) <= Number(buyer.budgetTo)
    )
  )

  const filteredObjects = objects.filter(object =>
    JSON.stringify(object)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredClients = clients.filter(client =>
    JSON.stringify(client)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (!loggedIn) {
    return (
      <main className='min-h-screen bg-black text-white flex items-center justify-center px-5'>
        <div className='w-full max-w-sm bg-[#111111] border border-[#2d2d2d] rounded-3xl p-6 shadow-2xl'>
          <h1 className='text-3xl font-bold text-center text-[#d4af37]'>
            B2B GARANT
          </h1>

          <p className='text-center text-gray-400 mt-2'>
            CRM для риелторов
          </p>

          <div className='mt-8 space-y-4'>
            <input
              className='w-full h-14 bg-[#181818] border border-[#2b2b2b] rounded-2xl px-4 outline-none'
              placeholder='Имя агента'
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
            />

            <input
              className='w-full h-14 bg-[#181818] border border-[#2b2b2b] rounded-2xl px-4 outline-none'
              placeholder='Номер телефона'
              value={agentPhone}
              onChange={e => setAgentPhone(e.target.value)}
            />

            <button
              onClick={() => {
                if (agentName && agentPhone) {
                  setLoggedIn(true)
                }
              }}
              className='w-full h-14 rounded-2xl bg-[#d4af37] text-black font-bold'
            >
              Войти
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-black text-white pb-32'>
      <header className='sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-[#1f1f1f] p-5 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-[#d4af37]'>
            B2B GARANT
          </h1>

          <p className='text-gray-400 text-sm'>CRM система</p>
        </div>

        <button className='w-12 h-12 rounded-2xl bg-[#141414] border border-[#2c2c2c] flex items-center justify-center'>
          <User size={20} />
        </button>
      </header>

      <section className='p-5'>
        {activeTab === 'home' && (
          <>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-[#111111] border border-[#232323] rounded-3xl p-4'>
                <h3 className='text-3xl font-bold text-[#d4af37]'>
                  {objects.length}
                </h3>

                <p className='text-gray-400 mt-1'>Объекты агента</p>
              </div>

              <div className='bg-[#111111] border border-[#232323] rounded-3xl p-4'>
                <h3 className='text-3xl font-bold text-[#d4af37]'>
                  {buyers.length}
                </h3>

                <p className='text-gray-400 mt-1'>Покупатели агента</p>
              </div>

              <div className='bg-[#111111] border border-[#232323] rounded-3xl p-4'>
                <h3 className='text-3xl font-bold text-[#d4af37]'>
                  {clients.length}
                </h3>

                <p className='text-gray-400 mt-1'>Клиенты компании</p>
              </div>

              <div className='bg-[#111111] border border-[#232323] rounded-3xl p-4'>
                <h3 className='text-3xl font-bold text-[#d4af37]'>
                  {matches.length}
                </h3>

                <p className='text-gray-400 mt-1'>Матчи</p>
              </div>
            </div>

            <div className='mt-8'>
              <div className='flex items-center gap-2 mb-4'>
                <Trophy size={18} className='text-[#d4af37]' />

                <h2 className='text-xl font-bold'>Лучшие агенты</h2>
              </div>

              <div className='space-y-4'>
                <div className='bg-[#111111] border border-[#232323] rounded-3xl p-5'>
                  <h3 className='text-lg font-bold'>Alexander</h3>

                  <p className='text-gray-400 mt-2'>
                    12 покупателей • 8 продавцов
                  </p>
                </div>

                <div className='bg-[#111111] border border-[#232323] rounded-3xl p-5'>
                  <h3 className='text-lg font-bold'>Emma</h3>

                  <p className='text-gray-400 mt-2'>
                    9 покупателей • 7 продавцов
                  </p>
                </div>

                <div className='bg-[#111111] border border-[#232323] rounded-3xl p-5'>
                  <h3 className='text-lg font-bold'>Daniel</h3>

                  <p className='text-gray-400 mt-2'>
                    7 покупателей • 5 продавцов
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'objects' && (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold'>Объекты</h2>

                <p className='text-gray-400'>Добавление объекта</p>
              </div>

              <button
                onClick={() => setShowAddObject(true)}
                className='w-14 h-14 rounded-2xl bg-[#d4af37] text-black flex items-center justify-center'
              >
                <Plus />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold'>Клиенты</h2>

                <p className='text-gray-400'>Добавление клиента</p>
              </div>

              <button
                onClick={() => setShowAddClient(true)}
                className='w-14 h-14 rounded-2xl bg-[#d4af37] text-black flex items-center justify-center'
              >
                <Plus />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <>
            <div className='flex gap-3 mb-5 overflow-x-auto'>
              <button
                onClick={() => setRegistryTab('objects')}
                className={`px-5 h-12 rounded-2xl whitespace-nowrap border ${
                  registryTab === 'objects'
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'bg-[#111111] border-[#232323]'
                }`}
              >
                Объекты
              </button>

              <button
                onClick={() => setRegistryTab('buyers')}
                className={`px-5 h-12 rounded-2xl whitespace-nowrap border ${
                  registryTab === 'buyers'
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'bg-[#111111] border-[#232323]'
                }`}
              >
                Покупатели
              </button>

              <button
                onClick={() => setRegistryTab('agents')}
                className={`px-5 h-12 rounded-2xl whitespace-nowrap border ${
                  registryTab === 'agents'
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'bg-[#111111] border-[#232323]'
                }`}
              >
                Агенты
              </button>
            </div>

            <div className='bg-[#111111] border border-[#232323] rounded-2xl px-4 h-14 flex items-center gap-3 mb-6'>
              <Search size={18} className='text-gray-400' />

              <input
                placeholder='Поиск...'
                className='bg-transparent outline-none w-full'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {registryTab === 'objects' && (
              <div className='space-y-4'>
                {filteredObjects.map(object => (
                  <div
                    key={object.id}
                    className='bg-[#111111] border border-[#232323] rounded-3xl p-5'
                  >
                    <div className='flex items-center justify-between'>
                      <h3 className='text-xl font-bold'>
                        {object.type}
                      </h3>

                      <span className='text-[#d4af37] font-bold'>
                        € {object.price}
                      </span>
                    </div>

                    <p className='text-gray-400 mt-3'>
                      {object.rooms} комнаты • {object.area}м²
                    </p>

                    <p className='text-gray-400 mt-1'>
                      Этаж: {object.floor}
                    </p>

                    <p className='text-gray-400 mt-1'>
                      {object.district}
                    </p>

                    <div className='mt-4 text-sm text-[#d4af37]'>
                      {object.agent}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {registryTab === 'buyers' && (
              <div className='space-y-4'>
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    className='bg-[#111111] border border-[#232323] rounded-3xl p-5'
                  >
                    <div className='flex items-center justify-between'>
                      <h3 className='text-xl font-bold'>
                        {client.clientType}
                      </h3>

                      <span className='text-[#d4af37] font-bold'>
                        {client.propertyType}
                      </span>
                    </div>

                    <p className='text-gray-400 mt-3'>
                      € {client.budgetFrom} - € {client.budgetTo}
                    </p>

                    <p className='text-gray-400 mt-1'>
                      {client.roomsFrom}-{client.roomsTo} комнаты
                    </p>

                    <p className='text-gray-400 mt-1'>
                      {client.areaFrom}-{client.areaTo}м²
                    </p>

                    <p className='text-gray-400 mt-1'>
                      {client.district}
                    </p>

                    <div className='mt-4 text-sm text-[#d4af37]'>
                      {client.agent}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {registryTab === 'agents' && (
              <div className='space-y-4'>
                <div className='bg-[#111111] border border-[#232323] rounded-3xl p-5'>
                  <h3 className='text-xl font-bold'>Alexander</h3>

                  <p className='text-gray-400 mt-2'>
                    12 покупателей • 8 продавцов
                  </p>
                </div>

                <div className='bg-[#111111] border border-[#232323] rounded-3xl p-5'>
                  <h3 className='text-xl font-bold'>Emma</h3>

                  <p className='text-gray-400 mt-2'>
                    9 покупателей • 7 продавцов
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <nav className='fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-[#111111]/95 border border-[#232323] backdrop-blur rounded-3xl h-20 flex items-center justify-around px-4'>
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'home'
              ? 'text-[#d4af37]'
              : 'text-gray-400'
          }`}
        >
          <Home size={22} />
          <span className='mt-1'>Главная</span>
        </button>

        <button
          onClick={() => setActiveTab('objects')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'objects'
              ? 'text-[#d4af37]'
              : 'text-gray-400'
          }`}
        >
          <Building2 size={22} />
          <span className='mt-1'>Объект</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'clients'
              ? 'text-[#d4af37]'
              : 'text-gray-400'
          }`}
        >
          <Users size={22} />
          <span className='mt-1'>Клиент</span>
        </button>

        <button
          onClick={() => setActiveTab('registry')}
          className={`flex flex-col items-center text-xs ${
            activeTab === 'registry'
              ? 'text-[#d4af37]'
              : 'text-gray-400'
          }`}
        >
          <ClipboardList size={22} />
          <span className='mt-1'>Реестр</span>
        </button>
      </nav>

      {showAddObject && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end'>
          <div className='w-full bg-[#111111] rounded-t-[40px] p-5 border-t border-[#2a2a2a]'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold'>Добавить объект</h2>

              <button onClick={() => setShowAddObject(false)}>
                <X />
              </button>
            </div>

            <div className='space-y-4'>
              <select
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    type: e.target.value
                  })
                }
              >
                <option>Квартира</option>
                <option>Дом</option>
              </select>

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Цена'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    price: e.target.value
                  })
                }
              />

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Комнаты'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    rooms: e.target.value
                  })
                }
              />

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Кв²'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    area: e.target.value
                  })
                }
              />

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Этаж'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    floor: e.target.value
                  })
                }
              />

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Район'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    district: e.target.value
                  })
                }
              />

              <input
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                placeholder='Адрес'
                onChange={e =>
                  setNewObject({
                    ...newObject,
                    address: e.target.value
                  })
                }
              />

              <button
                onClick={addObject}
                className='w-full h-14 rounded-2xl bg-[#d4af37] text-black font-bold mt-2'
              >
                Сохранить объект
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddClient && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end'>
          <div className='w-full bg-[#111111] rounded-t-[40px] p-5 border-t border-[#2a2a2a] max-h-[95vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold'>Добавить клиента</h2>

              <button onClick={() => setShowAddClient(false)}>
                <X />
              </button>
            </div>

            <div className='space-y-4'>
              <select
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
                onChange={e =>
                  setNewClient({
                    ...newClient,
                    clientType: e.target.value
                  })
                }
              >
                <option>Покупатель</option>
                <option>Продавец</option>
              </select>

              <select
                className='w-full h-14 bg-[#181818] border border-[#2a2a2a] rounded-2xl px-4 outline-none'
     
