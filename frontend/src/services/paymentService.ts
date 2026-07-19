// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { PaymentConfirmationRequest } from '@/types/payment';

export const handlePaymentConfirmation = async (request: PaymentConfirmationRequest): Promise<unknown> => {
  const response = await apiClient.post<unknown>('/api/v1/payments/confirm', request);
  return response.data;
};

