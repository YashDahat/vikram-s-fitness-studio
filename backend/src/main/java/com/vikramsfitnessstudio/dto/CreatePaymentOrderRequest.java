package com.vikramsfitnessstudio.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentOrderRequest {
    @NotNull
    private UUID orderId;
    @NotNull
    @Positive
    private BigDecimal amount;
}
