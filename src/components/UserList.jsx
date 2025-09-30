import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser, searchUsers } from '../utility/helpers';
import ConfirmationModal from './ConfirmationModal';

export default function UserList({ onOpenPanel }) {
    // STATI
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // Stati per le modali
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
        onConfirm: null
    });

    //CARICAMENTO UTENTI
    useEffect(() => {
        const loadUsers = () => {
            try {
                const savedUsers = getAllUsers();
                setAllUsers(savedUsers);
                if (searchTerm) {
                    const filteredUsers = searchUsers(searchTerm);
                    setUsers(filteredUsers);
                } else {
                    setUsers(savedUsers);
                }
            } catch (error) {
                console.error('Errore nel caricare gli utenti:', error);
            }
        };

        loadUsers();
        window.addEventListener('storage', loadUsers);
        const interval = setInterval(loadUsers, 1000);

        return () => {
            window.removeEventListener('storage', loadUsers);
            clearInterval(interval);
        };
    }, [searchTerm]);

    //GESTIONE CRUD
    const showModal = (type, title, message, onConfirm) => {
        setModalState({
            isOpen: true,
            type,
            title,
            message,
            onConfirm
        });
    };

    const hideModal = () => {
        setModalState({
            isOpen: false,
            type: 'warning',
            title: '',
            message: '',
            onConfirm: null
        });
    };

    const handleDeleteUser = (userId) => {
        const user = users.find(u => u.id === userId);
        const userName = user ? `${user.nome} ${user.cognome}` : 'questo utente';

        showModal(
            'warning',
            'Conferma eliminazione',
            `Sei sicuro di voler eliminare ${userName}? Questa azione non può essere annullata.`,
            () => {
                try {
                    const success = deleteUser(userId);
                    if (success) {
                        setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                        hideModal();
                        showModal('success', 'Successo', 'Utente eliminato con successo!', hideModal);
                    } else {
                        hideModal();
                        showModal('error', 'Errore', 'Errore nell\'eliminazione dell\'utente', hideModal);
                    }
                } catch (error) {
                    console.error('Errore nell\'eliminare l\'utente:', error);
                    hideModal();
                    showModal('error', 'Errore', 'Errore nell\'eliminazione dell\'utente', hideModal);
                }
            }
        );
    };

    const handleEditUser = (user) => {
        setEditingUser(user.id);
        setEditFormData({
            nome: user.nome,
            cognome: user.cognome,
            email: user.email,
            dataNascita: user.dataNascita,
            citta: user.citta,
            genere: user.genere,
            indirizzo: user.indirizzo || '',
            cap: user.cap || '',
            nazionalita: user.nazionalita || '',
            telefono: user.telefono || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditFormData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = (userId) => {
        try {
            const updatedUser = updateUser(userId, editFormData);
            if (updatedUser) {
                setAllUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? updatedUser : user
                    )
                );
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? updatedUser : user
                    )
                );
                setEditingUser(null);
                setEditFormData({});
                showModal('success', 'Successo', 'Utente aggiornato con successo!', hideModal);
            } else {
                showModal('error', 'Errore', 'Errore nell\'aggiornamento dell\'utente', hideModal);
            }
        } catch (error) {
            console.error('Errore nell\'aggiornare l\'utente:', error);
            showModal('error', 'Errore', 'Errore nell\'aggiornamento dell\'utente', hideModal);
        }
    };

    //FUNZIONI HELPER
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term) {
            const filteredUsers = searchUsers(term);
            setUsers(filteredUsers);
        } else {
            setUsers(allUsers);
        }
    };

    const getGenderIcon = (genere) => {
        switch (genere) {
            case 'maschio':
                return '♂️';
            case 'femmina':
                return '♀️';
            default:
                return '🌈';
        }
    };

    //RENDER
    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4 rounded-2xl h-full">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(to right, #0b232a, #172634)' }}>
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Lista Utenti</h2>
                    <p className="text-gray-600">
                        {users.length === 0 ? (searchTerm ? 'Nessun risultato trovato' : 'Nessun utente registrato') : `${users.length} utent${users.length === 1 ? 'e' : 'i'} ${searchTerm ? 'trovat' : 'registrat'}${users.length === 1 ? (searchTerm ? 'o' : 'o') : 'i'}`}
                    </p>
                </div>

                {/* Campo di ricerca */}
                <div className="mb-6">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Cerca per nome, cognome, email o città..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setUsers(allUsers);
                                }}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                title="Cancella ricerca"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista utenti */}
                {users.length === 0 ? (
                    <div className="bg-white/95 rounded-xl shadow-lg p-8 text-center">
                        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun utente trovato</h3>
                        <p className="text-gray-600">Aggiungi il primo utente compilando il modulo di registrazione!</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {users.map((user) => (
                            <div key={user.id}>
                                {editingUser === user.id ? (
                                    /* Form di modifica */
                                    <div className="bg-white/95 rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:bg-white transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900 text-lg">Modifica Utente</h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleSaveEdit(user.id)}
                                                    className="text-green-400 hover:text-green-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Salva modifiche"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Annulla modifiche"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="nome"
                                                    value={editFormData.nome}
                                                    onChange={handleEditChange}
                                                    placeholder="Nome"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="cognome"
                                                    value={editFormData.cognome}
                                                    onChange={handleEditChange}
                                                    placeholder="Cognome"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <input
                                                type="email"
                                                name="email"
                                                value={editFormData.email}
                                                onChange={handleEditChange}
                                                placeholder="Email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />

                                            <input
                                                type="date"
                                                name="dataNascita"
                                                value={editFormData.dataNascita}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />

                                            <input
                                                type="text"
                                                name="citta"
                                                value={editFormData.citta}
                                                onChange={handleEditChange}
                                                placeholder="Città"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            />

                                            <select
                                                name="genere"
                                                value={editFormData.genere}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                            >
                                                <option value="">Seleziona genere</option>
                                                <option value="maschio">Maschio</option>
                                                <option value="femmina">Femmina</option>
                                                <option value="altro">Altro</option>
                                            </select>

                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="indirizzo"
                                                    value={editFormData.indirizzo}
                                                    onChange={handleEditChange}
                                                    placeholder="Indirizzo"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="cap"
                                                    value={editFormData.cap}
                                                    onChange={handleEditChange}
                                                    placeholder="CAP"
                                                    pattern="[0-9]{5}"
                                                    maxLength="5"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <select
                                                    name="nazionalita"
                                                    value={editFormData.nazionalita}
                                                    onChange={handleEditChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                                                >
                                                    <option value="">Seleziona nazionalità</option>
                                                    <option value="italiana">Italiana</option>
                                                    <option value="straniera">Straniera</option>
                                                </select>
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={editFormData.telefono}
                                                    onChange={handleEditChange}
                                                    placeholder="Numero di telefono"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Card utente */
                                    <div className="bg-white/95 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 border-0 transform hover:scale-[1.01] hover:bg-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">
                                                    {getGenderIcon(user.genere)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-base">
                                                        {user.nome} {user.cognome}
                                                    </h3>
                                                    {user.telefono && (
                                                        <div className="flex items-center text-blue-600 mt-1">
                                                            <svg className="h-3 w-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="text-xs font-medium">{user.telefono}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-400 hover:text-blue-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Modifica utente"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Elimina utente"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                <span className="text-xs truncate">{user.email}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-xs">{user.citta}</span>
                                                </div>
                                                <button
                                                    onClick={() => onOpenPanel && onOpenPanel('weather', user)}
                                                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Vedi meteo"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6-2a6 6 0 11-12 0 6 6 0 0112 0z" />
                                                    </svg>
                                                    <span className="text-xs">Nato il {formatDate(user.dataNascita)}</span>
                                                </div>
                                                <button
                                                    onClick={() => onOpenPanel && onOpenPanel('horoscope', user)}
                                                    className="text-purple-500 hover:text-purple-600 transition-colors duration-200 p-1 cursor-pointer"
                                                    title="Vedi oroscopo"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Indirizzo */}
                                            {user.indirizzo && (
                                                <div className="flex items-center justify-between text-gray-600">
                                                    <div className="flex items-center">
                                                        <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        <span className="text-xs truncate">{user.indirizzo}{user.cap && `, ${user.cap}`}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => onOpenPanel && onOpenPanel('address', user)}
                                                        className="text-green-500 hover:text-green-600 transition-colors duration-200 p-1 cursor-pointer"
                                                        title="Vedi coordinate GPS"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Nazionalità */}
                                            {user.nazionalita && (
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="h-3 w-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs capitalize">{user.nazionalita}</span>
                                                </div>
                                            )}

                                            <div className="pt-1.5 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                        {user.genere}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(user.dataCreazione)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modale di conferma */}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                onClose={hideModal}
                confirmText={modalState.type === 'warning' ? 'Elimina' : 'OK'}
                cancelText="Annulla"
                showCancel={modalState.type === 'warning'} // Mostra Annulla solo per eliminazione
            />
        </div>
    );
}