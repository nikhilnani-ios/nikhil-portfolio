package com.nikhil.portfolio.service;

import com.nikhil.portfolio.model.Models.ContactRequest;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final String apiKey;
    private final String to;
    private final String from;

    public EmailService(
            @Value("${portfolio.email.api-key}") String apiKey,
            @Value("${portfolio.email.to}") String to,
            @Value("${portfolio.email.from}") String from
    ) {
        this.apiKey = apiKey;
        this.to = to;
        this.from = from;
    }

    public void sendContactMessage(ContactRequest request) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is not configured");
        }

        Resend resend = new Resend(apiKey);

        String subject = "Portfolio inquiry from " + request.name();

        String html = """
                <h2>New portfolio message</h2>

                <p><strong>Name:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>

                <p><strong>Message:</strong></p>
                <p>%s</p>
                """.formatted(
                        request.name(),
                        request.email(),
                        request.message().replace("\n", "<br>")
                );

        CreateEmailOptions email = CreateEmailOptions.builder()
                .from(from)
                .to(to)
                .subject(subject)
                .html(html)
                .replyTo(request.email())
                .build();

        try {
            resend.emails().send(email);
        } catch (ResendException e) {
            e.printStackTrace();
            throw new IllegalStateException(
                    "Unable to send contact email: " + e.getMessage(),
                    e
            );
        }
    }
}