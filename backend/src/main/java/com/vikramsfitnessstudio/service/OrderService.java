package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.dto.CreateOrderRequest;
import com.vikramsfitnessstudio.dto.OrderDto;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.model.MembershipPlan;
import com.vikramsfitnessstudio.model.Order;
import com.vikramsfitnessstudio.model.OrderItem;
import com.vikramsfitnessstudio.model.OrderStatus;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.vikramsfitnessstudio.service.MembershipService;
import com.vikramsfitnessstudio.service.UserService;
import com.vikramsfitnessstudio.model.Membership;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MembershipService membershipService;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository, MembershipService membershipService, UserService userService) {
        this.orderRepository = orderRepository;
        this.membershipService = membershipService;
        this.userService = userService;
    }

    @Transactional
    public OrderDto createOrder(Long userId, CreateOrderRequest request) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        MembershipPlan membershipPlan = membershipService.getMembershipPlanById(request.getMembershipPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership Plan not found with ID: " + request.getMembershipPlanId()));

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
                .id(order.getId())
                .userId(order.getUser().getId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderItems(itemDtos)
                .build();
    }
}