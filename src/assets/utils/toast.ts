// utils/toast.js
import { toast } from 'react-toastify';

export const showToast = (message: string, type = 'info') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warn':
            toast.warn(message);
            break;
        case 'info':
        default:
            toast.info(message);
            break;
    }
};
