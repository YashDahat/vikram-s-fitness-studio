package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.dto.ContactRequest;
import com.vikramsfitnessstudio.model.ContactMessage;
import com.vikramsfitnessstudio.repository.ContactMessageRepository;
import com.vikramsfitnessstudio.service.NotificationService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final NotificationService notificationService;

    public ContactService(ContactMessageRepository contactMessageRepository, NotificationService notificationService) {
        this.contactMessageRepository = contactMessageRepository;
        this.notificationService = notificationService;
    }

    public ContactMessage submitContactMessage(ContactRequest request) {
        ContactMessage contactMessage = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );
        contactMessage.setReceivedAt(LocalDateTime.now());
        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        notificationService.sendContactFormNotification(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );

        return savedMessage;
    }
}