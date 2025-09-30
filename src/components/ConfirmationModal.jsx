export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Conferma azione",
    message = "Sei sicuro di voler continuare?",
    confirmText = "OK",
    type = "warning" // warning, success, error, info
}) {
    if (!isOpen) return null;

    // Colori in base al tipo di modale
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    iconColor: 'text-green-600',
                    iconBg: 'bg-green-100',
                    confirmBtn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                };
            case 'error':
                return {
                    iconColor: 'text-red-600',
                    iconBg: 'bg-red-100',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                };
            case 'info':
                return {
                    iconColor: 'text-blue-600',
                    iconBg: 'bg-blue-100',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                };
            default: // warning
                return {
                    iconColor: 'text-yellow-600',
                    iconBg: 'bg-yellow-100',
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                };
        }
    };

    const styles = getTypeStyles();

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default: // warning
                return (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
        }
    };

    return (
        // Overlay di sfondo
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            {/* Contenitore modale */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                {/* Contenuto modale */}
                <div className="p-6">
                    {/* Icona e titolo */}
                    <div className="flex items-center mb-4">
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} ${styles.iconColor}`}>
                            {getIcon()}
                        </div>
                    </div>

                    {/* Titolo */}
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {title}
                        </h3>
                        {/* Messaggio */}
                        <p className="text-sm text-gray-600">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Pulsante OK */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-center">
                    {/* Pulsante OK */}
                    <button
                        onClick={onConfirm}
                        className={`cursor-pointer px-8 py-2 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${styles.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}