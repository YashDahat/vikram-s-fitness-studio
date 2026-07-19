// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface OrderDto {
  id: string | null;
  userId: number | null;
  orderDate: string | null;
  totalAmount: number | null;
  status: OrderStatus | null;
  orderItems: OrderItemDto[] | null;
}

export interface CreatePaymentOrderRequest {
  orderId: string;
  amount: number;
}

export interface PaymentOrderResponse {
  orderId: string | null;
  paymentGatewayOrderId: string | null;
  amount: number | null;
  currency: string | null;
  receipt: string | null;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItemDto {
  id: string | null;
  membershipPlanId: string | null;
  membershipPlanName: string | null;
  priceAtPurchase: number | null;
  durationInMonthsAtPurchase: number | null;
}

