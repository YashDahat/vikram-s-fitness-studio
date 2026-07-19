package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.CreateOrderRequest;
import com.vikramsfitnessstudio.dto.OrderDto;
import com.vikramsfitnessstudio.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.vikramsfitnessstudio.model.User;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestHeader("X-User-ID") Long userId,
                                                @Valid @RequestBody CreateOrderRequest request) {
        OrderDto createdOrder = orderService.createOrder(userId, request);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> getMemberOrders(@RequestHeader("X-User-ID") Long userId) {
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}