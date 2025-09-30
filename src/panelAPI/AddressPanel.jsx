import { useState, useEffect } from 'react';

// Pannello indirizzo che mostra coordinate precise e informazioni geografiche dettagliate
export default function AddressPanel({ user, onClose }) {
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.indirizzo && user?.citta) {
            fetchLocationData(user);
        } else {
            setError('Indirizzo non disponibile per questo utente');
            setLoading(false);
        }
    }, [user]);

    const fetchLocationData = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            // Costruisco la query di ricerca combinando indirizzo, città e CAP se disponibile
            const searchQuery = [
                userData.indirizzo,
                userData.citta,
                userData.cap,
                'Italy'
            ].filter(Boolean).join(', ');

            // API Nominatim di OpenStreetMap
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(searchQuery)}`,
                {
                    headers: {
                        'User-Agent': 'ErsafUserApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Errore nella ricerca: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error('Indirizzo non trovato');
            }

            const location = data[0];

            // Struttura i dati geografici
            const locationInfo = {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon),
                displayName: location.display_name,
                address: {
                    houseNumber: location.address?.house_number || userData.indirizzo.split(' ')[0] || '',
                    road: location.address?.road || '',
                    city: location.address?.city || location.address?.town || location.address?.village || userData.citta,
                    postcode: location.address?.postcode || userData.cap,
                    state: location.address?.state || '',
                    country: location.address?.country || 'Italia',
                    region: location.address?.region || location.address?.state || '',
                },
                boundingBox: location.boundingbox ? {
                    south: parseFloat(location.boundingbox[0]),
                    north: parseFloat(location.boundingbox[1]),
                    west: parseFloat(location.boundingbox[2]),
                    east: parseFloat(location.boundingbox[3])
                } : null,
                importance: location.importance,
                placeRank: location.place_rank,
                osmType: location.osm_type,
                osmId: location.osm_id
            };

            setLocationData(locationInfo);
            setLoading(false);

        } catch (error) {
            console.error('Errore nel recupero dati geografici:', error);
            setError(error.message || 'Errore nel caricamento dei dati geografici');
            setLoading(false);
        }
    };

    const formatCoordinate = (coord, type) => {
        const absCoord = Math.abs(coord);
        const degrees = Math.floor(absCoord);
        const minutes = Math.floor((absCoord - degrees) * 60);
        const seconds = ((absCoord - degrees - minutes / 60) * 3600).toFixed(2);

        const direction = type === 'lat'
            ? (coord >= 0 ? 'N' : 'S')
            : (coord >= 0 ? 'E' : 'O');

        return `${degrees}°${minutes}'${seconds}"${direction}`;
    };

    const getGoogleMapsUrl = () => {
        if (!locationData) return '#';
        return `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
    };

    if (loading) {
        return (
            <div className="relative">
                {/* Header del pannello */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Coordinate Geografiche</h3>
                            <p className="text-sm text-gray-600">{user.nome} {user.cognome}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                        title="Chiudi pannello"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading state */}
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-gray-600 font-medium">Caricamento coordinate...</p>
                    <p className="text-sm text-gray-500">Ricerca di {user.indirizzo}, {user.citta}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                {/* Header del pannello */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.352 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Coordinate Geografiche</h3>
                            <p className="text-sm text-gray-600">{user.nome} {user.cognome}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                        title="Chiudi pannello"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error state */}
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium text-center">{error}</p>
                    <button
                        onClick={() => fetchLocationData(user)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                    >
                        Riprova
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Header del pannello */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Coordinate Geografiche</h3>
                        <p className="text-sm text-gray-600">{user.nome} {user.cognome}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                    title="Chiudi pannello"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Contenuto principale */}
            <div className="space-y-6">
                {/* Informazioni principali */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Posizione Esatta
                    </h4>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-gray-600 font-medium">Latitudine:</span>
                            <div className="text-right">
                                <span className="text-gray-900 font-mono">{locationData.latitude.toFixed(6)}°</span>
                                <div className="text-xs text-gray-500">{formatCoordinate(locationData.latitude, 'lat')}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="text-gray-600 font-medium">Longitudine:</span>
                            <div className="text-right">
                                <span className="text-gray-900 font-mono">{locationData.longitude.toFixed(6)}°</span>
                                <div className="text-xs text-gray-500">{formatCoordinate(locationData.longitude, 'lon')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indirizzo dettagliato */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Indirizzo Completo
                    </h4>

                    <div className="space-y-2">
                        <div className="text-gray-900 font-medium">
                            {locationData.address.houseNumber && `${locationData.address.houseNumber} `}
                            {locationData.address.road}
                        </div>
                        <div className="text-gray-600">
                            {locationData.address.city}
                            {locationData.address.postcode && `, ${locationData.address.postcode}`}
                        </div>
                        {locationData.address.state && (
                            <div className="text-gray-600">{locationData.address.state}</div>
                        )}
                        <div className="text-gray-600 font-medium">{locationData.address.country}</div>
                    </div>
                </div>

                {/* Link a Google Maps */}
                <div className="flex justify-center">
                    <a
                        href={getGoogleMapsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 font-medium"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Vedi su Google Maps</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
