import { useState } from 'react'
import UserForm from "./components/UserForm"
import UserList from "./components/UserList"
import InfoPanel from "./components/InfoPanel"
import WeatherPanel from "./panelAPI/WeatherPanel"
import HoroscopePanel from "./panelAPI/HoroscopePanel"
import AddressPanel from "./panelAPI/AddressPanel"

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

      {/* Layout principale con griglia responsive */}
      <div className="px-6 pb-6 max-w-7xl mx-auto">
        {/* Sezione superiore: UserForm e UserList */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="w-full">
            <UserForm />
          </div>
          <div className="w-full">
            <UserList onOpenPanel={handleOpenPanel} />
          </div>
        </div>

        {/* Sezione inferiore: Pannelli API */}
        <div id="api-panels-section" className="w-full">
          {activePanels.length > 0 ? (
            // Griglia di pannelli API attivi - adattiva al numero di pannelli
            <div className={`grid gap-4 ${activePanels.length === 1
                ? 'grid-cols-1'
                : activePanels.length === 2
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              }`}>
              {activePanels.map((panel) => (
                <div key={panel.id} className={`bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl ${activePanels.length === 3 ? 'p-4 xl:p-6' : 'p-6 lg:p-8'
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
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
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

      {/* InfoPanel flottante - posizionato nel body */}
      <InfoPanel />
    </>
  )
}

export default App
