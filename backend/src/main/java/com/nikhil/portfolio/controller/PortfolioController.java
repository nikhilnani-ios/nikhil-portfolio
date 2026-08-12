package com.nikhil.portfolio.controller;

import com.nikhil.portfolio.model.Models.*;
import com.nikhil.portfolio.service.PortfolioService;
import com.nikhil.portfolio.service.ThroughputService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/** Read side of the portfolio. Everything here is cacheable except the stream. */
@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final PortfolioService portfolio;
    private final ThroughputService throughput;

    public PortfolioController(PortfolioService portfolio, ThroughputService throughput) {
        this.portfolio = portfolio;
        this.throughput = throughput;
    }

    /** One request on page load instead of five. */
    @GetMapping("/bootstrap")
    public ResponseEntity<Map<String, Object>> bootstrap() {
        return cached(Map.of(
                "profile", portfolio.profile(),
                "metrics", portfolio.metrics(),
                "roles", portfolio.roles(),
                "skills", portfolio.skills(),
                "topology", portfolio.topology()
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<Profile> profile() {
        return cached(portfolio.profile());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> roles() {
        return cached(portfolio.roles());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillTier>> skills() {
        return cached(portfolio.skills());
    }

    @GetMapping("/metrics")
    public ResponseEntity<List<Metric>> metrics() {
        return cached(portfolio.metrics());
    }

    /** The graph the WebGL scene draws. */
    @GetMapping("/topology")
    public ResponseEntity<Topology> topology() {
        return cached(portfolio.topology());
    }

    /** Live throughput over Server-Sent Events. One connection, one tick per second. */
    @GetMapping(path = "/throughput/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return throughput.subscribe();
    }

    /** Fallback for clients that cannot hold an SSE connection open. */
    @GetMapping("/throughput")
    public Tick snapshot() {
        return throughput.current();
    }

    private <T> ResponseEntity<T> cached(T body) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(10)).cachePublic())
                .body(body);
    }
}
