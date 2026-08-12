package com.nikhil.portfolio.service;

import com.nikhil.portfolio.model.Models.ContactReceipt;
import com.nikhil.portfolio.model.Models.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Accepts contact messages and throttles them per client.
 *
 * Storage is in-memory on purpose — swap the store for JPA or an SES send
 * without touching the controller.
 */
@Service
public class ContactService {
    private final EmailService emailService;

    public ContactService(EmailService emailService) {
        this.emailService = emailService;
    }
    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private static final Duration COOLDOWN = Duration.ofMinutes(1);

    private final Map<String, Instant> lastSeen = new ConcurrentHashMap<>();
    private final Map<String, ContactRequest> received = new ConcurrentHashMap<>();

    /** @return true when the caller is inside the cooldown window. */
    public boolean throttled(String client) {
        Instant previous = lastSeen.get(client);
        return previous != null && previous.isAfter(Instant.now().minus(COOLDOWN));
    }

    public ContactReceipt accept(ContactRequest request, String client) {
        String id = UUID.randomUUID().toString().substring(0, 8);
        emailService.sendContactMessage(request);
        received.put(id, request);
        lastSeen.put(client, Instant.now());
        log.info("Contact {} from {} <{}>", id, request.name(), request.email());
        return new ContactReceipt(id, Instant.now(), "received");
    }

    public int count() {
        return received.size();
    }
}
