package com.nikhil.portfolio.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

/**
 * Every payload the site renders. Records keep these immutable and JSON-ready
 * without a line of boilerplate.
 */
public final class Models {

    private Models() { }

    /** Hero + identity block. */
    public record Profile(
            String name, String title, String location, String email,
            String phone, String linkedin, String lede, List<String> tags
    ) { }

    /** One role on the timeline. Highlights carry the numbers. */
    public record Role(
            String id, String title, String org,
            String start, String end, List<String> highlights
    ) { }

    /** A named layer of the stack — mirrors a tier in the 3D graph. */
    public record SkillTier(int tier, String name, String caption, List<String> items) { }

    /** A headline number, animated on scroll. */
    public record Metric(String label, double value, String unit) { }

    /**
     * A service in the topology the frontend renders in WebGL.
     * tier drives the layered layout, roleIndex drives the timeline layout.
     */
    public record Node(String id, int tier, int roleIndex, String description) { }

    /** Dependency between two services. */
    public record Edge(String from, String to) { }

    public record Topology(List<Node> nodes, List<Edge> edges) { }

    /** One tick of the live throughput stream. */
    public record Tick(long recordsProcessed, double recordsPerSecond, double p99LatencyMs, Instant at) { }

    /** Inbound contact form. Validated before it is ever stored. */
    public record ContactRequest(
            @NotBlank @Size(max = 80) String name,
            @NotBlank @Email @Size(max = 160) String email,
            @NotBlank @Size(min = 10, max = 2000) String message
    ) { }

    public record ContactReceipt(String id, Instant receivedAt, String status) { }
}
