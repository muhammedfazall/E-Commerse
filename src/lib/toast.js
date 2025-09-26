import { toast } from 'sonner';

export const showToast = {
  // Success toast
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 2000,
      ...options,
    });
  },

  // Error toast
  error: (message, options = {}) => {
    toast.error(message, {
      duration: 2000,
      ...options,
    });
  },

};

export { toast };