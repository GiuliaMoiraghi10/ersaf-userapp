import { useState } from 'react'
import UserForm from "./components/UserForm"
import UserList from "./components/UserList"
import InfoPanel from "./components/InfoPanel"
import WeatherPanel from "./panelAPI/WeatherPanel"
import HoroscopePanel from "./panelAPI/HoroscopePanel"
import AddressPanel from "./panelAPI/AddressPanel"
import foglieImage from "./assets/foglie.jpg"

function App() {
  const [activePanels, setActivePanels] = useState([])

  const handleOpenPanel = (panelType, user) => {
    // Controlla se esiste già un pannello per questo utente e tipo
    const existingPanel = activePanels.find(
      panel => panel.user.id === user.id && panel.type === panelType
    )

    // Se non esiste, aggiunge il nuovo pannello
    if (!existingPanel) {
      setActivePanels(prev => [...prev, { type: panelType, user, id: `${user.id}-${panelType}` }])

      // Scroll automatico alla sezione API dopo un breve delay per permettere il rendering
      setTimeout(() => {
        const apiSection = document.getElementById('api-panels-section')
        if (apiSection) {
          apiSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 100)
    }
  }

  const handleClosePanel = (panelId) => {
    setActivePanels(prev => prev.filter(panel => panel.id !== panelId))
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">App Users</h1>
      </div>

      {/* Layout principale */}
      <div className="px-6 pb-6 max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <UserForm />
        </div>

        {/* Separatore */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-gray-200 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(to right, #161331, #1f2770)' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">
                Dashboard Utenti & API
              </span>
            </div>
          </div>
        </div>

        {/* Sezione inferiore: UserList e Pannelli API in verticale */}
        <div className="space-y-8">
          {/* UserList */}
          <div className="w-full">
            <UserList onOpenPanel={handleOpenPanel} />
          </div>

          {/* Pannelli API */}
          <div id="api-panels-section" className="w-full">
            {activePanels.length > 0 ? (
              <div className={`grid gap-4 ${activePanels.length === 1
                ? 'grid-cols-1'
                : activePanels.length === 2
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}>
                {activePanels.map((panel) => (
                  <div key={panel.id} className={`bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-indigo-50/95 rounded-2xl shadow-xl ${activePanels.length === 3 ? 'p-4 xl:p-6' : 'p-6 lg:p-8'
                    }`}>
                    {panel.type === 'weather' && (
                      <WeatherPanel
                        user={panel.user}
                        onClose={() => handleClosePanel(panel.id)}
                      />
                    )}
                    {panel.type === 'horoscope' && (
                      <HoroscopePanel
                        user={panel.user}
                        onClose={() => handleClosePanel(panel.id)}
                      />
                    )}
                    {panel.type === 'address' && (
                      <AddressPanel
                        user={panel.user}
                        onClose={() => handleClosePanel(panel.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Messaggio quando non ci sono pannelli attivi
              <div className="bg-gradient-to-br from-slate-50/95 via-blue-50/95 to-indigo-50/95 rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun pannello attivo</h3>
                  <p className="text-gray-600">
                    Seleziona un'icona dalla lista utenti per iniziare a visualizzare i dati delle API
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* InfoPanel */}
      <InfoPanel />
    </>
  )
}

export default App
