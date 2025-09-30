import { useState, useEffect } from 'react';

// Pannello oroscopo personalizzato basato sulla data di nascita
export default function HoroscopePanel({ user, onClose }) {
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.dataNascita) {
            fetchHoroscopeData(user.dataNascita);
        }
    }, [user?.dataNascita, user?.id]); // Reagisce specificamente ai cambiamenti di data di nascita e ID utente

    // Calcola il segno zodiacale dalla data di nascita
    const getZodiacSign = (birthDate) => {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const signs = [
            { name: 'capricorno', nameEn: 'capricorn', start: [12, 22], end: [1, 19] },
            { name: 'acquario', nameEn: 'aquarius', start: [1, 20], end: [2, 18] },
            { name: 'pesci', nameEn: 'pisces', start: [2, 19], end: [3, 20] },
            { name: 'ariete', nameEn: 'aries', start: [3, 21], end: [4, 19] },
            { name: 'toro', nameEn: 'taurus', start: [4, 20], end: [5, 20] },
            { name: 'gemelli', nameEn: 'gemini', start: [5, 21], end: [6, 20] },
            { name: 'cancro', nameEn: 'cancer', start: [6, 21], end: [7, 22] },
            { name: 'leone', nameEn: 'leo', start: [7, 23], end: [8, 22] },
            { name: 'vergine', nameEn: 'virgo', start: [8, 23], end: [9, 22] },
            { name: 'bilancia', nameEn: 'libra', start: [9, 23], end: [10, 22] },
            { name: 'scorpione', nameEn: 'scorpio', start: [10, 23], end: [11, 21] },
            { name: 'sagittario', nameEn: 'sagittarius', start: [11, 22], end: [12, 21] }
        ];

        for (const sign of signs) {
            const [startMonth, startDay] = sign.start;
            const [endMonth, endDay] = sign.end;

            if (
                (month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                (startMonth > endMonth && (month === startMonth || month === endMonth))
            ) {
                return sign;
            }
        }

        return signs[0];
    };

    const fetchHoroscopeData = async (birthDate) => {
        try {
            setLoading(true);
            setError(null);

            const zodiacSign = getZodiacSign(birthDate);
            const signNameEn = zodiacSign.nameEn;

            // API Horoscope
            try {
                const response = await fetch(
                    `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${signNameEn}&day=today`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log('Risposta API Horoscope:', data); // Debug

                    if (data && data.data) {
                        setHoroscopeData({
                            sign: zodiacSign.name,
                            signEn: signNameEn,
                            date: data.data.date,
                            horoscope_data: data.data.horoscope_data,
                            source: 'horoscope-api'
                        });
                        return;
                    }
                }
            } catch (horoscopeError) {
                console.log('API Horoscope non disponibile');
            }

            // Se nessuna API funziona, genera oroscopo offline
            const horoscopeText = generateSmartHoroscope(zodiacSign.name);
            setHoroscopeData({
                sign: zodiacSign.name,
                signEn: signNameEn,
                date: new Date().toISOString().split('T')[0],
                horoscope_data: horoscopeText,
                source: 'offline-smart'
            });

        } catch (err) {
            console.error('Errore nel recuperare l\'oroscopo:', err);
            setError(`Impossibile recuperare l'oroscopo: ${err.message}. Verifica la connessione e riprova.`);
        } finally {
            setLoading(false);
        }
    };

    // Genera un oroscopo basato su algoritmi
    const generateSmartHoroscope = (userSign) => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const monthDay = today.getDate();
        const weekDay = today.getDay();

        // Database di previsioni dettagliate per segno
        const detailedPredictions = {
            'ariete': [
                "La tua natura dinamica è particolarmente favorita oggi. L'energia di Marte ti spinge verso nuove conquiste professionali.",
                "Oggi la tua leadership naturale emergerà. È il momento perfetto per prendere iniziative che hai rimandato.",
                "L'impulsività potrebbe essere sia un vantaggio che un rischio oggi. Canalizza la tua energia verso obiettivi costruttivi."
            ],
            'toro': [
                "La stabilità che cerchi sta per manifestarsi. I tuoi sforzi costanti stanno dando i frutti sperati.",
                "Oggi è una giornata perfetta per questioni pratiche e finanziarie. La tua prudenza sarà premiata.",
                "Il comfort e la bellezza ti circonderanno. Dedicati ai piaceri semplici della vita."
            ],
            'gemelli': [
                "La comunicazione è la chiave di tutto oggi. Le tue parole avranno un impatto maggiore del solito.",
                "La curiosità ti porterà verso nuove scoperte interessanti. Mantieni la mente aperta.",
                "I collegamenti sociali e le reti di contatti saranno particolarmente favorevoli oggi."
            ],
            'cancro': [
                "L'intuizione è particolarmente acuta oggi. Fidati delle tue sensazioni viscerali.",
                "La famiglia e la casa assumono un'importanza speciale. Dedica tempo alle persone care.",
                "Le emozioni profonde emergono: è il momento di elaborarle costruttivamente."
            ],
            'leone': [
                "Il palcoscenico è tutto tuo oggi. La tua creatività e il tuo carisma brilleranno intensamente.",
                "La generosità e la magnanimità ti porteranno riconoscimenti inaspettati.",
                "È tempo di prenderti i meriti che ti spettano. Non essere modesto sui tuoi successi."
            ],
            'vergine': [
                "L'attenzione ai dettagli sarà la tua arma vincente oggi. Niente sfugge al tuo occhio critico.",
                "Organizzazione e metodo ti porteranno risultati sorprendenti in ambito lavorativo.",
                "Il servizio agli altri ti darà grande soddisfazione personale oggi."
            ],
            'bilancia': [
                "L'armonia e l'equilibrio caratterizzano questa giornata. La diplomazia apre tutte le porte.",
                "Le relazioni sono al centro dell'attenzione. Partnership importanti potrebbero svilupparsi.",
                "La bellezza e l'arte nutrono la tua anima oggi. Circondati di cose belle."
            ],
            'scorpione': [
                "L'intensità emotiva è la tua forza oggi. Le trasformazioni profonde sono in atto.",
                "I misteri e i segreti potrebbero essere rivelati. La verità emerge dalle profondità.",
                "Il potere personale raggiunge il suo apice. Usalo saggiamente e responsabilmente."
            ],
            'sagittario': [
                "L'avventura chiama il tuo nome oggi. Espandi i tuoi orizzonti fisici e mentali.",
                "La filosofia e la conoscenza superiore attirano la tua attenzione. Studia qualcosa di nuovo.",
                "I viaggi o le connessioni internazionali sono particolarmente favoriti."
            ],
            'capricorno': [
                "L'ambizione e la disciplina ti conducono verso vette sempre più alte. Il successo è a portata di mano.",
                "Le responsabilità possono sembrare pesanti, ma ti stanno forgiando come un leader naturale.",
                "La struttura e il metodo sono i tuoi migliori alleati oggi. Procedi con strategia."
            ],
            'acquario': [
                "L'innovazione e l'originalità ti distinguono dalla massa oggi. Le tue idee sono rivoluzionarie.",
                "L'indipendenza è fondamentale per il tuo benessere. Non compromettere la tua libertà.",
                "I gruppi e le cause sociali attirano la tua energia. Contribuisci al bene comune."
            ],
            'pesci': [
                "La sensibilità artistica raggiunge livelli sublimi oggi. Esprimi la tua creatività.",
                "L'intuizione psichica è particolarmente sviluppata. I sogni portano messaggi importanti.",
                "La compassione e l'empatia ti connettono profondamente con gli altri."
            ]
        };

        // Seleziona previsione basata su algoritmi temporali
        const predictions = detailedPredictions[userSign] || detailedPredictions['ariete'];
        let selectedPrediction = predictions[dayOfYear % predictions.length];

        // Aggiungi elementi dinamici basati su data
        const intensifiers = ['particolarmente', 'straordinariamente', 'incredibilmente', 'notevolmente'];
        const timeMarkers = ['Oggi', 'In questa giornata', 'Durante queste ore'];

        const intensifier = intensifiers[monthDay % intensifiers.length];
        const timeMarker = timeMarkers[weekDay % timeMarkers.length];

        // Consigli finali personalizzati
        const finalAdvice = [
            'Mantieni la mente aperta alle opportunità.',
            'La fiducia in te stesso è la chiave del successo.',
            'Ascolta il tuo intuito: raramente sbaglia.',
            'Le sfide di oggi sono le vittorie di domani.',
            'Connettiti con la natura per rigenerare l\'energia.'
        ];

        const advice = finalAdvice[(dayOfYear + monthDay) % finalAdvice.length];

        return `${timeMarker} sarai ${intensifier} favorito. ${selectedPrediction} ${advice}`;
    };

    const getZodiacIcon = (sign) => {
        const icons = {
            'ariete': '♈',
            'toro': '♉',
            'gemelli': '♊',
            'cancro': '♋',
            'leone': '♌',
            'vergine': '♍',
            'bilancia': '♎',
            'scorpione': '♏',
            'sagittario': '♐',
            'capricorno': '♑',
            'acquario': '♒',
            'pesci': '♓'
        };
        return icons[sign] || '⭐';
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl shadow-xl p-8 animate-pulse">
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
                    <h3 className="text-2xl font-bold text-red-800">Errore Oroscopo</h3>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-lg">{error}</p>
                </div>
                <button
                    onClick={() => fetchHoroscopeData(user?.dataNascita)}
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
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Oroscopo Personalizzato</h3>
                        <p className="text-sm text-gray-600">{user.nome} {user.cognome}</p>
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

            {horoscopeData && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-3">
                            {getZodiacIcon(horoscopeData.sign)}
                        </div>
                        <h4 className="text-2xl font-bold text-purple-800 capitalize mb-2">
                            {horoscopeData.sign}
                        </h4>
                        <p className="text-gray-600">
                            {new Date(horoscopeData.date).toLocaleDateString('it-IT', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-purple-800 mb-3">La tua previsione</h5>
                        <p className="text-gray-700 leading-relaxed">
                            {horoscopeData.horoscope_data}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}