import { useState } from 'react';
import { submitContactForm as submitContactFormService } from '@/services/contactService';
import type { ContactRequest } from '@/types/contact';

export const useContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (contactData: ContactRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await submitContactFormService(contactData);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitContactForm,
    isLoading,
    error,
  };
};