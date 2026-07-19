// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ContactMessage, ContactRequest } from '@/types/contact';

export const submitContactForm = async (request: ContactRequest): Promise<ContactMessage> => {
  const response = await apiClient.post<ContactMessage>('/api/v1/contact', request);
  return response.data;
};

