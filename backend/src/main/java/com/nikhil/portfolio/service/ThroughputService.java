package com.nikhil.portfolio.service;

import com.nikhil.portfolio.model.Models.Tick;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Streams the throughput counter the HUD renders.
 *
 * One scheduled thread produces a tick; every open browser gets the same tick
 * over Server-Sent Events. Emitters live in a CopyOnWriteArrayList because the
 * read path (broadcast, once a second) massively outnumbers the write path
 * (a client connecting or dropping).
 */
@Service
public class ThroughputService {

    private static final Logger log = LoggerFactory.getLogger(ThroughputService.class);
    private static final long TIMEOUT_MS = 30 * 60 * 1000L;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final AtomicLong processed = new AtomicLong();
    private final double perSecond;

    public ThroughputService(@Value("${portfolio.records-per-day}") long recordsPerDay) {
        this.perSecond = recordsPerDay / 86_400d;
    }

    /** Registers a browser. Cleanup is wired to every terminal callback. */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("tick").data(current()));
        } catch (IOException e) {
            emitters.remove(emitter);
        }
        return emitter;
    }

    @Scheduled(fixedRate = 1000)
    public void broadcast() {
        if (emitters.isEmpty()) {
            return;
        }
        Tick tick = current();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("tick").data(tick));
            } catch (IOException | IllegalStateException e) {
                emitters.remove(emitter);
            }
        }
    }

    public Tick current() {
        long total = processed.addAndGet(Math.round(perSecond));
        double p99 = 11 + Math.sin(System.currentTimeMillis() / 1400d) * 3.4;
        return new Tick(total, perSecond, Math.round(p99 * 10) / 10d, Instant.now());
    }

    public int listeners() {
        return emitters.size();
    }

    @PreDestroy
    void shutdown() {
        log.info("Closing {} throughput listeners", emitters.size());
        emitters.forEach(SseEmitter::complete);
        emitters.clear();
    }
}
