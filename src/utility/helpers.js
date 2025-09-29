// Costante per la chiave del localStorage
const USERS_STORAGE_KEY = 'users';

// Recupera tutti gli utenti dal localStorage
export const getAllUsers = () => {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Errore nel recuperare gli utenti:', error);
        return [];
    }
};

// Recupera un utente specifico per ID
export const getUserById = (id) => {
    const users = getAllUsers();
    return users.find(user => user.id === id) || null;
};

// Crea un nuovo utente
export const createUser = (userData) => {
    try {
        const users = getAllUsers();

        // Crea un nuovo utente con ID univoco e timestamp
        const newUser = {
            id: Date.now(), // Usa timestamp come ID semplice
            ...userData,
            dataCreazione: new Date().toISOString()
        };

        // Aggiungi il nuovo utente alla lista
        const updatedUsers = [...users, newUser];

        // Salva nel localStorage
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        console.log('Utente creato:', newUser);
        return newUser;
    } catch (error) {
        console.error('Errore nella creazione dell\'utente:', error);
        throw error;
    }
};

// Aggiorna un utente esistente
export const updateUser = (id, userData) => {
    try {
        const users = getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            console.warn('Utente non trovato:', id);
            return null;
        }

        // Aggiorna l'utente mantenendo l'ID e la data di creazione
        const updatedUser = {
            ...users[userIndex],
            ...userData,
            id: users[userIndex].id, // Mantieni l'ID originale
            dataCreazione: users[userIndex].dataCreazione, // Mantieni la data originale
            dataModifica: new Date().toISOString() // Aggiungi timestamp di modifica
        };

        users[userIndex] = updatedUser;

        // Salva nel localStorage
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        console.log('Utente aggiornato:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Errore nell\'aggiornamento dell\'utente:', error);
        throw error;
    }
};

// Elimina un utente
export const deleteUser = (id) => {
    try {
        const users = getAllUsers();
        const initialLength = users.length;

        // Filtra l'utente da eliminare
        const updatedUsers = users.filter(user => user.id !== id);

        if (updatedUsers.length === initialLength) {
            console.warn('Utente non trovato per l\'eliminazione:', id);
            return false;
        }

        // Salva nel localStorage
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        console.log('Utente eliminato con ID:', id);
        return true;
    } catch (error) {
        console.error('Errore nell\'eliminazione dell\'utente:', error);
        throw error;
    }
};

// Elimina tutti gli utenti
export const deleteAllUsers = () => {
    try {
        localStorage.removeItem(USERS_STORAGE_KEY);
        console.log('Tutti gli utenti eliminati');
        return true;
    } catch (error) {
        console.error('Errore nell\'eliminazione di tutti gli utenti:', error);
        return false;
    }
};

// Conta il numero totale di utenti
export const getUsersCount = () => {
    return getAllUsers().length;
};

// Cerca utenti per nome, cognome o email
export const searchUsers = (searchTerm) => {
    if (!searchTerm) return getAllUsers();

    const users = getAllUsers();
    const term = searchTerm.toLowerCase();

    return users.filter(user =>
        user.nome.toLowerCase().includes(term) ||
        user.cognome.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.citta.toLowerCase().includes(term)
    );
};