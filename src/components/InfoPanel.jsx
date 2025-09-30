export default function InfoPanel() {
    return (
        <div className="fixed top-32 right-0 w-24 md:w-32 xl:w-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-l-lg shadow-2xl p-1.5 md:p-2 xl:p-3 z-50 transform translate-x-0 hover:translate-x-1 transition-transform duration-300 border-l-2 xl:border-l-4 border-emerald-300">
            <div className="text-center">
                <div className="flex items-center justify-center mb-1 md:mb-2">
                    <div className="h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-1 xl:mr-2 border border-white/30">
                        <svg className="h-2 w-2 md:h-2.5 md:w-2.5 xl:h-3 xl:w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xs xl:text-sm font-bold text-white drop-shadow-sm hidden md:block">API Dashboard</h3>
                    <h3 className="text-xs font-bold text-white drop-shadow-sm md:hidden">API</h3>
                </div>
                <p className="text-white/90 text-xs mb-2 xl:mb-3 drop-shadow-sm hidden xl:block">
                    Clicca le icone per visualizzare le API
                </p>
                <div className="space-y-0.5 md:space-y-1 xl:space-y-2">
                    <div className="bg-white/95 backdrop-blur-sm rounded md:rounded-md xl:rounded-lg p-1 md:p-1.5 xl:p-2 shadow-lg border border-white/50 hover:bg-white hover:scale-105 transition-all duration-200">
                        <div className="flex items-center space-x-1 xl:space-x-2">
                            <div className="text-orange-500">
                                <svg className="h-3 w-3 md:h-4 md:w-4 xl:h-5 xl:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 text-xs xl:text-sm truncate">Meteo</h4>
                                <p className="text-xs text-gray-600 hidden xl:block">Condizioni attuali</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded md:rounded-md xl:rounded-lg p-1 md:p-1.5 xl:p-2 shadow-lg border border-white/50 hover:bg-white hover:scale-105 transition-all duration-200">
                        <div className="flex items-center space-x-1 xl:space-x-2">
                            <div className="text-indigo-600">
                                <svg className="h-3 w-3 md:h-4 md:w-4 xl:h-5 xl:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 text-xs xl:text-sm truncate">Oroscopo</h4>
                                <p className="text-xs text-gray-600 hidden xl:block">Previsioni giornaliere</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded md:rounded-md xl:rounded-lg p-1 md:p-1.5 xl:p-2 shadow-lg border border-white/50 hover:bg-white hover:scale-105 transition-all duration-200">
                        <div className="flex items-center space-x-1 xl:space-x-2">
                            <div className="text-emerald-600">
                                <svg className="h-3 w-3 md:h-4 md:w-4 xl:h-5 xl:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 text-xs xl:text-sm truncate">Coordinate</h4>
                                <p className="text-xs text-gray-600 hidden xl:block">Posizione GPS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}