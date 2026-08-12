package com.nikhil.portfolio.controller;

import com.nikhil.portfolio.model.Models.ContactReceipt;
import com.nikhil.portfolio.model.Models.ContactRequest;
import com.nikhil.portfolio.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contacts;

    public ContactController(ContactService contacts) {
        this.contacts = contacts;
    }

    @PostMapping
    public ResponseEntity<?> send(@Valid @RequestBody ContactRequest request, HttpServletRequest http) {
        String client = clientKey(http);
        if (contacts.throttled(client)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(java.util.Map.of("error", "One message a minute. Try again shortly."));
        }
        ContactReceipt receipt = contacts.accept(request, client);
        return ResponseEntity.accepted().body(receipt);
    }

    private String clientKey(HttpServletRequest http) {
        String forwarded = http.getHeader("X-Forwarded-For");
        return forwarded != null && !forwarded.isBlank()
                ? forwarded.split(",")[0].trim()
                : http.getRemoteAddr();
    }
}
