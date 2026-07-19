// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { CreatePaymentOrderRequest, OrderDto, PaymentOrderResponse } from '@/types/order';

export const createPaymentOrder = async (request: CreatePaymentOrderRequest): Promise<PaymentOrderResponse> => {
  const response = await apiClient.post<PaymentOrderResponse>('/api/v1/payments/orders', request);
  return response.data;
};

export const createOrder = async (): Promise<OrderDto> => {
  const response = await apiClient.post<OrderDto>('/api/v1/orders');
  return response.data;
};

export const getMemberOrders = async (): Promise<OrderDto[]> => {
  const response = await apiClient.get<OrderDto[]>('/api/v1/orders/my-orders');
  return response.data;
};

export const getAllOrders = async (): Promise<OrderDto[]> => {
  const response = await apiClient.get<OrderDto[]>('/api/v1/admin/orders');
  return response.data;
};

