package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.PaymentConfirmationRequest;
import com.vikramsfitnessstudio.dto.PaymentOrderResponse;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(@Valid @RequestBody CreatePaymentOrderRequest createPaymentOrderRequest) {
        try {
            PaymentOrderResponse response = paymentService.createPaymentOrder(
                    createPaymentOrderRequest.getOrderId(),
                    createPaymentOrderRequest.getAmount()
            );
            return ResponseEntity.ok(response);
        } catch (PaymentGatewayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> handlePaymentConfirmation(@Valid @RequestBody PaymentConfirmationRequest request) {
        try {
            paymentService.confirmPayment(request);
            return ResponseEntity.ok("Payment confirmed successfully.");
        } catch (PaymentGatewayException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}