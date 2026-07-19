package com.vikramsfitnessstudio.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfirmationRequest {
    private UUID orderId;
    private String paymentGatewayOrderId;
    private String status;
    private String signature;
    private java.math.BigDecimal amount;
    private String currency;
}
