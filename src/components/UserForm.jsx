import { useState } from 'react';
import { createUser } from '../utility/helpers';
import ConfirmationModal from './ConfirmationModal';
import foglieImage from '../assets/foglie.jpg';

// Componente form moderno per la registrazione di nuovi utenti
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

    const resetForm = () => {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createUser(formData);
            showModal('success', 'Successo!', 'Utente registrato con successo!', () => {
                resetForm();
                hideModal();
            });
        } catch (error) {
            showModal('error', 'Errore', 'Errore durante il salvataggio: ' + error.message);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Contenitore principale con due colonne */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[450px] flex">
                {/* Colonna sinistra - Branding */}
                <div
                    className="w-1/2 p-6 flex flex-col justify-center relative"
                    style={{
                        backgroundImage: `url(${foglieImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >

                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="text-white relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Benvenuto!</h1>
                        <p className="text-sm text-blue-100 mb-4">Compila il modulo per registrarti.</p>
                        <div className="space-y-2">
                            <div className="flex items-center text-blue-100 text-sm">
                                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Veloce e sicuro</span>
                            </div>
                            <div className="flex items-center text-blue-100 text-sm">
                                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Dati protetti</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonna destra - Form */}
                <div className="w-1/2 p-6">
                    <div className="max-w-sm mx-auto">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Registrati</h2>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Nome e Cognome */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                        placeholder="Nome"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        id="cognome"
                                        name="cognome"
                                        value={formData.cognome}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                        placeholder="Cognome"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            {/* Data di nascita */}
                            <div>
                                <input
                                    type="date"
                                    id="dataNascita"
                                    name="dataNascita"
                                    value={formData.dataNascita}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    required
                                />
                            </div>

                            {/* Città */}
                            <div>
                                <input
                                    type="text"
                                    id="citta"
                                    name="citta"
                                    value={formData.citta}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    placeholder="Città"
                                    required
                                />
                            </div>

                            {/* Indirizzo e CAP */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        id="indirizzo"
                                        name="indirizzo"
                                        value={formData.indirizzo}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                        placeholder="Indirizzo"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        id="cap"
                                        name="cap"
                                        value={formData.cap}
                                        onChange={handleChange}
                                        className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                        placeholder="CAP"
                                        pattern="[0-9]{5}"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Nazionalità */}
                            <div className="relative">
                                <select
                                    id="nazionalita"
                                    name="nazionalita"
                                    value={formData.nazionalita}
                                    onChange={handleChange}
                                    className="w-full px-3 pr-8 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 bg-transparent text-gray-900 appearance-none cursor-pointer text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    required
                                >
                                    <option value="">Seleziona nazionalità</option>
                                    <option value="italiana">Italiana</option>
                                    <option value="straniera">Straniera</option>
                                </select>
                                {/* Freccia personalizzata */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Telefono */}
                            <div>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 placeholder-gray-400 bg-transparent text-gray-900 text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    placeholder="Numero di telefono"
                                    required
                                />
                            </div>

                            {/* Genere */}
                            <div className="relative">
                                <select
                                    id="genere"
                                    name="genere"
                                    value={formData.genere}
                                    onChange={handleChange}
                                    className="w-full px-3 pr-8 py-1.5 border-0 border-b border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-0 transition-all duration-300 bg-transparent text-gray-900 appearance-none cursor-pointer text-sm hover:bg-blue-50/30 focus:bg-blue-50/50"
                                    required
                                >
                                    <option value="">Seleziona genere</option>
                                    <option value="maschio">Maschio</option>
                                    <option value="femmina">Femmina</option>
                                    <option value="altro">Altro</option>
                                </select>
                                {/* Freccia personalizzata */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Pulsante di invio */}
                            <button
                                type="submit"
                                className="cursor-pointer w-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 mt-5 shadow-sm hover:shadow-md text-sm hover:scale-[1.02] focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                            >
                                Registrati
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            I tuoi dati sono al sicuro con noi 🔒
                        </p>
                    </div>
                </div>
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
