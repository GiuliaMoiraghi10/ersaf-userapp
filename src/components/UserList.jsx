import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../utility/helpers';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Carica gli utenti dal localStorage
    useEffect(() => {
        const loadUsers = () => {
            try {
                const savedUsers = getAllUsers();
                setUsers(savedUsers);
            } catch (error) {
                console.error('Errore nel caricare gli utenti:', error);
            }
        };

        loadUsers();

        // Ascolta i cambiamenti del localStorage per aggiornare la lista in tempo reale
        window.addEventListener('storage', loadUsers);

        // Controlla periodicamente per aggiornamenti (per quando si aggiunge un utente nella stessa finestra)
        const interval = setInterval(loadUsers, 1000);

        return () => {
            window.removeEventListener('storage', loadUsers);
            clearInterval(interval);
        };
    }, []);

    const handleDeleteUser = (userId) => {
        try {
            const success = deleteUser(userId);
            if (success) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } else {
                alert('Errore nell\'eliminazione dell\'utente');
            }
        } catch (error) {
            console.error('Errore nell\'eliminare l\'utente:', error);
            alert('Errore nell\'eliminazione dell\'utente');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user.id);
        setEditFormData({
            nome: user.nome,
            cognome: user.cognome,
            email: user.email,
            dataNascita: user.dataNascita,
            citta: user.citta,
            genere: user.genere
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
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? updatedUser : user
                    )
                );
                setEditingUser(null);
                setEditFormData({});
                alert('Utente aggiornato con successo!');
            } else {
                alert('Errore nell\'aggiornamento dell\'utente');
            }
        } catch (error) {
            console.error('Errore nell\'aggiornare l\'utente:', error);
            alert('Errore nell\'aggiornamento dell\'utente');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('it-IT');
    };

    const getGenderIcon = (genere) => {
        switch (genere) {
            case 'maschio':
                return '👨';
            case 'femmina':
                return '👩';
            default:
                return '🌈';
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4 rounded-2xl h-full">
            <div className="max-w-full mx-auto">
                <div className="text-center mb-6">
                    <div className="mx-auto h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Lista Utenti</h2>
                    <p className="text-gray-600">
                        {users.length === 0 ? 'Nessun utente registrato' : `${users.length} utent${users.length === 1 ? 'e' : 'i'} registrat${users.length === 1 ? 'o' : 'i'}`}
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun utente trovato</h3>
                        <p className="text-gray-600">Aggiungi il primo utente compilando il modulo di registrazione!</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {users.map((user) => (
                            <div key={user.id}>
                                {editingUser === user.id ? (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border-0 transform hover:scale-[1.02]">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                                    {getGenderIcon(user.genere)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                        {user.nome} {user.cognome}
                                                    </h3>
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

                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                <span className="text-sm">{user.email}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm">{user.citta}</span>
                                            </div>

                                            <div className="flex items-center text-gray-600">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6-2a6 6 0 11-12 0 6 6 0 0112 0z" />
                                                </svg>
                                                <span className="text-sm">Nato il {formatDate(user.dataNascita)}</span>
                                            </div>

                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
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
        </div>
    );
}