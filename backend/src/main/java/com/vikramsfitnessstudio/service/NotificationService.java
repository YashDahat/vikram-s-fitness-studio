package com.vikramsfitnessstudio.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final JavaMailSender javaMailSender;

    public NotificationService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // true for multipart message

            helper.setFrom("noreply@vikramsfitnessstudio.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true for HTML content

            javaMailSender.send(mimeMessage);
            logger.info("Email sent successfully to {} with subject: {}", to, subject);
        } catch (MailException e) {
            logger.error("Failed to send email to {} with subject: {}. Error: {}", to, subject, e.getMessage());
        } catch (jakarta.mail.MessagingException e) {
            logger.error("Failed to construct email to {} with subject: {}. Error: {}", to, subject, e.getMessage());
        }
    }

    public void sendContactFormNotification(String name, String email, String subject, String message) {
        String notificationSubject = "New Contact Form Submission: " + subject;
        String notificationBody = String.format(
                "<h1>New Contact Form Submission</h1>" +
                        "<p><strong>Name:</strong> %s</p>" +
                        "<p><strong>Email:</strong> %s</p>" +
                        "<p><strong>Subject:</strong> %s</p>" +
                        "<p><strong>Message:</strong> %s</p>",
                name, email, subject, message
        );
        sendEmail("admin@vikramsfitnessstudio.com", notificationSubject, notificationBody);
    }
}