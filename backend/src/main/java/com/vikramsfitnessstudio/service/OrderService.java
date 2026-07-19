package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.dto.CreateOrderRequest;
import com.vikramsfitnessstudio.dto.OrderDto;
import com.vikramsfitnessstudio.dto.OrderItemDto;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.model.MembershipPlan;
import com.vikramsfitnessstudio.model.Order;
import com.vikramsfitnessstudio.model.OrderItem;
import com.vikramsfitnessstudio.model.OrderStatus;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.OrderRepository;
import com.vikramsfitnessstudio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import com.vikramsfitnessstudio.service.MembershipService;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MembershipService membershipService;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, MembershipService membershipService, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.membershipService = membershipService;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderDto createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        MembershipPlan membershipPlan = membershipService.getMembershipPlanById(request.getMembershipPlanId());

        if (!membershipPlan.getIsActive()) {
            throw new IllegalArgumentException("Cannot order an inactive membership plan.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal totalAmount = membershipPlan.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        order.setTotalAmount(totalAmount);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setMembershipPlan(membershipPlan);
        orderItem.setMembershipPlanName(membershipPlan.getName());
        orderItem.setPriceAtPurchase(membershipPlan.getPrice());
        orderItem.setDurationInMonthsAtPurchase(membershipPlan.getDurationInMonths());

        order.setOrderItems(List.of(orderItem));

        Order savedOrder = orderRepository.save(order);
        return convertToDto(savedOrder);
    }

    public List<OrderDto> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean doesOrderExist(UUID orderId) {
        return orderRepository.findAll().stream()
                .anyMatch(o -> orderId.toString().equals(o.getId().toString()));
    }

    @Transactional
    public void updateOrderStatus(UUID orderId, String status) {
        Order order = orderRepository.findAll().stream()
                .filter(o -> orderId.toString().equals(o.getId().toString()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(OrderStatus.valueOf(status));
        orderRepository.save(order);
    }

    private OrderDto convertToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .membershipPlanId(item.getMembershipPlan().getId())
                        .membershipPlanName(item.getMembershipPlanName())
                        .priceAtPurchase(item.getPriceAtPurchase())
                        .durationInMonthsAtPurchase(item.getDurationInMonthsAtPurchase())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(UUID.randomUUID())
                .userId(order.getUser().getId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderItems(itemDtos)
                .build();
    }
}