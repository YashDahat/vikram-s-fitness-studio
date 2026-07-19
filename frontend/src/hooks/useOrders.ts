import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createOrder, createPaymentOrder } from '@/services/orderService';
import { ROUTES } from '@/routes';
import type { OrderDto } from '@/types/order';

export const useOrders = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createOrderMutation = useMutation({
    mutationFn: async (membershipPlanId: string) => {
      setError(null);
      try {
        const newOrder: OrderDto = await createOrder();

        if (!newOrder.id || !newOrder.totalAmount) {
          throw new Error('Order creation failed: Missing order ID or total amount.');
        }

        const paymentResponse = await createPaymentOrder({
          orderId: newOrder.id,
          amount: newOrder.totalAmount,
        });

        if (paymentResponse.paymentGatewayOrderId) {
          // In a real application, this would redirect to a payment gateway.
          // For this exercise, we'll simulate success and navigate to the success page.
          navigate(ROUTES.PAYMENT_SUCCESS);
        } else {
          throw new Error('Payment initiation failed: No payment gateway order ID received.');
        }
        return newOrder;
      } catch (err) {
        console.error('Failed to create order or initiate payment:', err);
        setError('Failed to create order or initiate payment. Please try again.');
        throw err;
      }
    },
    onSuccess: () => {
      // Navigation is handled within the mutationFn for payment redirection
    },
    onError: (err) => {
      setError(err.message || 'An unexpected error occurred.');
    },
  });

  return {
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    error,
  };
};