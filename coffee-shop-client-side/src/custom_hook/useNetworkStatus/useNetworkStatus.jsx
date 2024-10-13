import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (!isOnline) {
            Swal.fire({
                title: 'No Internet Connection',
                text: 'Please check your internet connection and try again.',
                icon: 'error',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                confirmButtonText: 'Close'
            });
        } else {
            Swal.close();
        }
    }, [isOnline]);

    return isOnline;
};

export default useNetworkStatus;
