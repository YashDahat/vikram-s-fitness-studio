package com.vikramsfitnessstudio.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.vikramsfitnessstudio.model.OrderStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private UUID id;
    private Long userId;
    private LocalDateTime orderDate;
    private java.math.BigDecimal totalAmount;
    private OrderStatus status;
    private List<OrderItemDto> orderItems;
}
