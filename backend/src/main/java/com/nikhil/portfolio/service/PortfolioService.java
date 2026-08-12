package com.nikhil.portfolio.service;

import com.nikhil.portfolio.model.Models.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Single source of truth for the site's content.
 *
 * The topology here is not decoration: the frontend reads these nodes, tiers
 * and edges and renders them directly in WebGL. Change a node and the 3D scene
 * changes with it — no duplicated data in the client.
 */
@Service
public class PortfolioService {

    private static final Profile PROFILE = new Profile(
            "Nikhil Javvaji",
            "Software Engineer III — Backend & Distributed Systems",
            "Columbus, OH",
            "nikhiljavvaji9@gmail.com",
            "(513) 616-0456",
            "https://www.linkedin.com/in/javvaji-nikhil/",
            "I build the Java services that move 22 million financial records a day — "
                    + "and keep them consistent when a node drops, a queue backs up, "
                    + "or month-end lands on a Friday.",
            List.of("Java", "Spring Boot", "Distributed Systems", "AWS", "Kubernetes", "PostgreSQL", "Kafka")
    );

    private static final List<Metric> METRICS = List.of(
            new Metric("records / day", 22, "M"),
            new Metric("services integrated", 180, "+"),
            new Metric("rows tuned", 420, "M"),
            new Metric("fewer incidents", 46, "%")
    );

    private static final List<Role> ROLES = List.of(
            new Role("keyhole", "Software Engineer III", "Keyhole Software", "Aug 2025", "Present", List.of(
                    "Built multithreaded services processing ~22M financial records daily — +39% concurrent throughput, with transactional consistency held across distributed nodes.",
                    "Designed REST APIs and integrations across 180+ internal services, cutting response times 31% through better service orchestration.",
                    "Tuned Oracle PL/SQL and PostgreSQL over 420M-row datasets — month-end reporting fell from 42 min to 17 min via indexing and partitioning.",
                    "Cut recurring production incidents 46% by instrumenting the ugly paths and fixing root causes instead of symptoms.",
                    "Shipped cloud-native services on EC2, S3, Lambda and Docker behind GitHub Actions, Maven, Jenkins and Kubernetes pipelines."
            )),
            new Role("hitachi-cloud", "Cloud IaaS Professional — Full Stack Developer", "Hitachi Digital Services", "Nov 2023", "Dec 2024", List.of(
                    "Shipped Spring Boot services onto AWS — EC2, S3, Lambda, Docker, Kubernetes — for cloud-hosted business platforms.",
                    "Built REST APIs and multithreaded components integrating Oracle, PostgreSQL and enterprise systems across distributed environments.",
                    "Wrote PL/SQL, tuned Oracle, and worked with DBAs to land schema changes without downtime.",
                    "Automated builds and deploys through Maven, Jenkins, GitHub Actions and Bitbucket; scripted the Linux operational work nobody wanted to repeat."
            )),
            new Role("hitachi-app", "Application Developer", "Hitachi Digital Services", "Jan 2023", "Oct 2023", List.of(
                    "Built Java enterprise applications, Spring Boot REST APIs and Oracle modules behind financial workflows.",
                    "Wrote multithreaded components and reusable services against real object-oriented design patterns, not just annotations.",
                    "Designed the SQL, PL/SQL procedures and database objects carrying transaction processing and reporting.",
                    "Automated delivery with Maven, GitHub Actions, Jenkins, Docker and Kubernetes, backed by unit tests and peer review."
            )),
            new Role("infrabyte", "Software Development Intern", "Infrabyte Consulting", "Aug 2021", "Sep 2022", List.of(
                    "Backend services, REST APIs and Oracle modules for enterprise applications — the first version of everything above.",
                    "Designed relational schemas and learned that a missing index costs more than a bad algorithm.",
                    "Worked alongside senior developers through testing, deployment, documentation and production support."
            ))
    );

    private static final List<SkillTier> TIERS = List.of(
            new SkillTier(0, "Edge", "entry & contracts",
                    List.of("REST APIs", "Spring MVC", "OpenAPI", "Auth / JWT")),
            new SkillTier(1, "Services", "where the logic lives",
                    List.of("Java", "Spring Boot", "Spring Data JPA", "Go", "Python", "Multithreading", "SOA", "Design patterns")),
            new SkillTier(2, "Messaging", "decoupling & backpressure",
                    List.of("Apache Kafka", "RabbitMQ")),
            new SkillTier(3, "Data", "the part that must not lie",
                    List.of("PostgreSQL", "Oracle · PL/SQL", "SQL Server", "MySQL", "MongoDB", "S3")),
            new SkillTier(4, "Platform", "how it ships and scales",
                    List.of("AWS EC2 · Lambda", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions", "Maven")),
            new SkillTier(5, "Signals", "knowing before the user does",
                    List.of("ELK Stack", "Prometheus", "Grafana", "CloudWatch", "Tableau"))
    );

    private static final Topology TOPOLOGY = new Topology(
            List.of(
                    new Node("api-gateway", 0, 0, "Fronts 180+ internal services. Routing, auth, rate limits."),
                    new Node("auth-svc", 0, 3, "Token issue and validation on every inbound call."),
                    new Node("txn-processor", 1, 0, "Multithreaded core. ~22M financial records a day."),
                    new Node("ledger-svc", 1, 0, "Double-entry state. Consistency is non-negotiable."),
                    new Node("reporting-svc", 1, 2, "Month-end runs. 42 min to 17 min after tuning."),
                    new Node("notification-svc", 1, 3, "Fan-out on settlement and failure events."),
                    new Node("batch-orchestrator", 1, 2, "Schedules and retries the overnight pipelines."),
                    new Node("kafka", 2, 0, "Event backbone. Absorbs bursts the database cannot."),
                    new Node("rabbitmq", 2, 3, "Work queues for the slower, ordered jobs."),
                    new Node("postgres", 3, 2, "OLTP primary. Partitioned, indexed, watched."),
                    new Node("oracle", 3, 0, "PL/SQL procedures over 420M-row datasets."),
                    new Node("mongodb", 3, 3, "Document store for the shapes SQL fought."),
                    new Node("s3", 3, 1, "Cold storage, artifacts, report drops."),
                    new Node("eks", 4, 1, "Kubernetes. Rollouts, HPA, blue-green."),
                    new Node("lambda", 4, 1, "Event glue and scheduled small work."),
                    new Node("terraform", 4, 1, "The infrastructure, in review, in git."),
                    new Node("elk", 5, 2, "Log search when the incident is already live."),
                    new Node("prometheus", 5, 0, "Metrics and alert rules. The 46% came from here."),
                    new Node("grafana", 5, 1, "Dashboards the on-call actually opens.")
            ),
            List.of(
                    new Edge("api-gateway", "auth-svc"), new Edge("api-gateway", "txn-processor"),
                    new Edge("api-gateway", "ledger-svc"), new Edge("api-gateway", "reporting-svc"),
                    new Edge("txn-processor", "ledger-svc"), new Edge("txn-processor", "kafka"),
                    new Edge("txn-processor", "oracle"), new Edge("ledger-svc", "oracle"),
                    new Edge("reporting-svc", "postgres"), new Edge("reporting-svc", "s3"),
                    new Edge("batch-orchestrator", "rabbitmq"), new Edge("batch-orchestrator", "postgres"),
                    new Edge("notification-svc", "rabbitmq"), new Edge("kafka", "ledger-svc"),
                    new Edge("kafka", "notification-svc"), new Edge("auth-svc", "mongodb"),
                    new Edge("postgres", "eks"), new Edge("oracle", "eks"),
                    new Edge("txn-processor", "eks"), new Edge("eks", "terraform"),
                    new Edge("lambda", "kafka"), new Edge("eks", "lambda"),
                    new Edge("s3", "lambda"), new Edge("prometheus", "txn-processor"),
                    new Edge("prometheus", "ledger-svc"), new Edge("prometheus", "eks"),
                    new Edge("elk", "txn-processor"), new Edge("elk", "reporting-svc"),
                    new Edge("grafana", "prometheus"), new Edge("grafana", "elk"),
                    new Edge("mongodb", "reporting-svc"), new Edge("rabbitmq", "notification-svc"),
                    new Edge("terraform", "eks"), new Edge("ledger-svc", "postgres"),
                    new Edge("api-gateway", "eks")
            )
    );

    public Profile profile() { return PROFILE; }
    public List<Metric> metrics() { return METRICS; }
    public List<Role> roles() { return ROLES; }
    public List<SkillTier> skills() { return TIERS; }
    public Topology topology() { return TOPOLOGY; }
}
