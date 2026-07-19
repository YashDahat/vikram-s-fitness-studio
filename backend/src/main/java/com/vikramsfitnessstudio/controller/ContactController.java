package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.ContactRequest;
import com.vikramsfitnessstudio.model.ContactMessage;
import com.vikramsfitnessstudio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ContactMessage> submitContactForm(@Valid @RequestBody ContactRequest request) {
        ContactMessage savedMessage = contactService.submitContactMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
    }
}