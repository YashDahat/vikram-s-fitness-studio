package com.vikramsfitnessstudio.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private UUID id;
    private UUID membershipPlanId;
    private String membershipPlanName;
    private BigDecimal priceAtPurchase;
    private Integer durationInMonthsAtPurchase;
}
