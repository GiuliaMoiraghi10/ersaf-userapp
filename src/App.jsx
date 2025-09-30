import { useState } from 'react'
import UserForm from "./components/UserForm"
import UserList from "./components/UserList"
import WeatherPanel from "./panelAPI/WeatherPanel"
import HoroscopePanel from "./panelAPI/HoroscopePanel"

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
        <div className="w-full">
          {activePanels.length > 0 ? (
            // Griglia di pannelli API attivi
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activePanels.map((panel) => (
                <div key={panel.id} className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
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
                </div>
              ))}
            </div>
          ) : (
            // Pannello di benvenuto/istruzioni quando non ci sono pannelli attivi
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">API Dashboard</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Clicca sulle icone accanto ai dati degli utenti per visualizzare le informazioni in tempo reale
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-orange-500 mb-3">
                      <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Meteo</h4>
                    <p className="text-sm text-gray-600">Clicca l'icona accanto alla città per vedere le condizioni meteorologiche attuali</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-purple-500 mb-3">
                      <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Oroscopo</h4>
                    <p className="text-sm text-gray-600">Clicca l'icona accanto alla data di nascita per l'oroscopo personalizzato</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
