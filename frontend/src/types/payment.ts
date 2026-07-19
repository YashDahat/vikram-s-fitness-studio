// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface PaymentConfirmationRequest {
  orderId: string | null;
  paymentGatewayOrderId: string | null;
  status: string | null;
  signature: string | null;
  amount: number | null;
  currency: string | null;
}

