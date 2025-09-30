import { useState, useEffect } from 'react';

// Pannello meteo che mostra dati in tempo reale per la città dell'utente
export default function WeatherPanel({ user, onClose }) {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.citta) {
            fetchWeatherData(user.citta);
        }
    }, [user]);

    const fetchWeatherData = async (city) => {
        try {
            setLoading(true);
            setError(null);

            // Fetch API - Aggiungo Italia per maggiore precisione
            try {
                const cityQuery = `${city}, Italy`;
                const response = await fetch(
                    `https://wttr.in/${encodeURIComponent(cityQuery)}?format=j1`
                );

                if (response.ok) {
                    const data = await response.json();
                    const current = data.current_condition[0];
                    const location = data.nearest_area[0];

                    const convertedData = {
                        name: location.areaName[0].value,
                        main: {
                            temp: Math.round(current.temp_C),
                            feels_like: Math.round(current.FeelsLikeC),
                            humidity: current.humidity,
                            pressure: current.pressure
                        },
                        weather: [{
                            description: current.weatherDesc[0].value,
                            icon: current.weatherCode
                        }],
                        wind: {
                            speed: Math.round(current.windspeedKmph / 3.6),
                            deg: current.winddirDegree
                        }
                    };

                    setWeatherData(convertedData);
                    setLoading(false);
                    return;
                }
            } catch (primaryError) {
                console.log('wttr.in non disponibile, provo Open-Meteo...');
            }

            // Fetch API
            try {
                const geoResponse = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it&format=json`
                );

                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();

                    if (geoData.results && geoData.results.length > 0) {
                        const location = geoData.results[0];

                        const weatherResponse = await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,surface_pressure`
                        );

                        if (weatherResponse.ok) {
                            const weatherData = await weatherResponse.json();
                            const current = weatherData.current_weather;
                            const hourly = weatherData.hourly;

                            const convertedData = {
                                name: location.name,
                                main: {
                                    temp: Math.round(current.temperature),
                                    feels_like: Math.round(current.temperature),
                                    humidity: hourly.relativehumidity_2m[0] || 50,
                                    pressure: Math.round(hourly.surface_pressure[0]) || 1013
                                },
                                weather: [{
                                    description: getWeatherDescription(current.weathercode),
                                    icon: current.weathercode
                                }],
                                wind: {
                                    speed: Math.round(current.windspeed),
                                    deg: current.winddirection
                                }
                            };

                            setWeatherData(convertedData);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (fallbackError) {
                console.log('Anche Open-Meteo non disponibile');
            }

            // Se tutte le API falliscono
            throw new Error('Servizi meteo temporaneamente non disponibili');

        } catch (err) {
            setError(err.message || 'Errore nel recuperare i dati meteo');
        } finally {
            setLoading(false);
        }
    };

    const getWeatherDescription = (code) => {
        const descriptions = {
            0: 'Sereno',
            1: 'Prevalentemente sereno',
            2: 'Parzialmente nuvoloso',
            3: 'Coperto',
            45: 'Nebbia',
            48: 'Nebbia con brina',
            51: 'Pioggerella leggera',
            53: 'Pioggerella moderata',
            55: 'Pioggerella intensa',
            61: 'Pioggia leggera',
            63: 'Pioggia moderata',
            65: 'Pioggia intensa',
            80: 'Rovesci leggeri',
            81: 'Rovesci moderati',
            82: 'Rovesci violenti'
        };
        return descriptions[code] || 'Condizioni variabili';
    };

    const getWeatherIcon = (code) => {
        if (code <= 1) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 48) return '🌫️';
        if (code <= 67) return '🌧️';
        if (code <= 82) return '⛈️';
        return '🌤️';
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-50 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-red-800">Errore Meteo</h3>
                    <button
                        onClick={onClose}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Chiudi pannello"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="text-red-600 mb-4">
                    <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                    </svg>
                    <p className="text-lg">{error}</p>
                </div>
                <button
                    onClick={() => fetchWeatherData(user?.citta)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Riprova
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Previsioni Meteo</h3>
                        <p className="text-sm text-gray-600">{user.nome} {user.cognome} - {user.citta}</p>
                        {weatherData?.name && weatherData.name !== user.citta && (
                            <p className="text-xs text-gray-500 italic">Dati da: {weatherData.name}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                    title="Chiudi pannello"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {weatherData && (
                <div className="space-y-4">
                    {/* Temperatura principale */}
                    <div className="bg-white rounded-xl p-4 shadow-lg text-center flex flex-col justify-center">
                        <div className="text-4xl mb-2">{getWeatherIcon(weatherData.weather[0].icon)}</div>
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                            {weatherData.main.temp}°C
                        </div>
                        <div className="text-sm text-gray-600 capitalize mb-1 line-clamp-2">
                            {weatherData.weather[0].description}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                            Percepiti {weatherData.main.feels_like}°C
                        </div>
                        <div className="text-xs font-medium text-gray-700 truncate">
                            {weatherData.name}
                        </div>
                    </div>

                    {/* Dettagli atmosferici */}
                    <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col text-center">
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Condizioni</h4>
                        <div className="space-y-3 flex-1 flex flex-col justify-center">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center mb-1">
                                    <span className="text-blue-500 mr-1 text-sm">💧</span>
                                    <span className="text-gray-600 text-sm">Umidità</span>
                                </div>
                                <span className="font-semibold text-blue-600 text-sm">{weatherData.main.humidity}%</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center mb-1">
                                    <span className="text-gray-500 mr-1 text-sm">📊</span>
                                    <span className="text-gray-600 text-sm">Pressione</span>
                                </div>
                                <span className="font-semibold text-gray-700 text-xs">{weatherData.main.pressure} hPa</span>
                            </div>
                        </div>
                    </div>

                    {/* Vento */}
                    <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col justify-center">
                        <h4 className="text-base font-semibold text-gray-800 mb-3 text-center">Vento</h4>
                        <div className="text-center flex-1 flex flex-col justify-center">
                            <div className="text-xl mb-2">🌪️</div>
                            <div className="text-lg font-bold text-gray-700 mb-1">
                                {weatherData.wind.speed} m/s
                            </div>
                            <div className="text-xs text-gray-500">
                                Direzione: {weatherData.wind.deg}°
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}