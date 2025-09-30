import { useState } from 'react';
import { createUser } from '../utility/helpers';
import ConfirmationModal from './ConfirmationModal';

// Componente form per la registrazione di nuovi utenti
export default function UserForm() {
    const [formData, setFormData] = useState({
        nome: '',
        cognome: '',
        email: '',
        dataNascita: '',
        citta: '',
        indirizzo: '',
        cap: '',
        nazionalita: '',
        telefono: '',
        genere: ''
    });

    // Stati per le modali
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
        onConfirm: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Funzioni per gestire le modali
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
            type: 'success',
            title: '',
            message: '',
            onConfirm: null
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            // Crea il nuovo utente utilizzando la funzione helper
            createUser(formData);

            // Reset del form
            setFormData({
                nome: '',
                cognome: '',
                email: '',
                dataNascita: '',
                citta: '',
                indirizzo: '',
                cap: '',
                nazionalita: '',
                telefono: '',
                genere: ''
            });

            // Mostra modale di successo
            showModal('success', 'Successo', 'Profilo salvato con successo!', hideModal);
        } catch (error) {
            console.error('Errore nel salvare il profilo:', error);
            showModal('error', 'Errore', 'Errore nel salvare il profilo. Riprova.', hideModal);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 rounded-2xl h-full">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <div className="mx-auto h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Registrazione</h2>
                    <p className="text-sm text-gray-600">Completa il tuo profilo</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-8 border-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="Il tuo nome"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cognome
                                </label>
                                <input
                                    type="text"
                                    id="cognome"
                                    name="cognome"
                                    value={formData.cognome}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="Il tuo cognome"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="nome@esempio.com"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="dataNascita" className="block text-sm font-medium text-gray-700 mb-2">
                                Data di nascita
                            </label>
                            <input
                                type="date"
                                id="dataNascita"
                                name="dataNascita"
                                value={formData.dataNascita}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="citta" className="block text-sm font-medium text-gray-700 mb-2">
                                    Città
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="citta"
                                        name="citta"
                                        value={formData.citta}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="La tua città"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="cap" className="block text-sm font-medium text-gray-700 mb-2">
                                    CAP
                                </label>
                                <input
                                    type="text"
                                    id="cap"
                                    name="cap"
                                    value={formData.cap}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="00100"
                                    pattern="[0-9]{5}"
                                    maxLength="5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 mb-2">
                                Indirizzo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="indirizzo"
                                    name="indirizzo"
                                    value={formData.indirizzo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                    placeholder="Via Roma, 123"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="nazionalita" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nazionalità
                                </label>
                                <select
                                    id="nazionalita"
                                    name="nazionalita"
                                    value={formData.nazionalita}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                    required
                                >
                                    <option value="">Seleziona nazionalità</option>
                                    <option value="italiana">Italiana</option>
                                    <option value="straniera">Straniera</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefono
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                        placeholder="+39 123 456 7890"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="genere" className="block text-sm font-medium text-gray-700 mb-2">
                                Genere
                            </label>
                            <select
                                id="genere"
                                name="genere"
                                value={formData.genere}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                required
                            >
                                <option value="">Seleziona genere</option>
                                <option value="maschio">Maschio</option>
                                <option value="femmina">Femmina</option>
                                <option value="altro">Altro</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Salva Profilo
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    I tuoi dati sono al sicuro con noi 🔒
                </p>
            </div>

            {/* Modale di conferma */}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                onClose={hideModal}
                confirmText="OK"
                cancelText="Chiudi"
            />
        </div>
    );
}