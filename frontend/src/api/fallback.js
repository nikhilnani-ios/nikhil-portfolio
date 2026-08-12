/**
 * Mirror of GET /api/bootstrap. Used only when the API cannot be reached.
 * Keep in sync with PortfolioService.java — that file is the source of truth.
 */
export const FALLBACK = {
  profile: {
    name: 'Nikhil Javvaji',
    title: 'Software Engineer III — Backend & Distributed Systems',
    location: 'Columbus, OH',
    email: 'nikhiljavvaji9@gmail.com',
    phone: '(513) 616-0456',
    linkedin: 'https://www.linkedin.com/in/javvaji-nikhil/',
    lede:
      'I build the Java services that move 22 million financial records a day — and keep them consistent when a node drops, a queue backs up, or month-end lands on a Friday.',
    tags: ['Java', 'Spring Boot', 'Distributed Systems', 'AWS', 'Kubernetes', 'PostgreSQL', 'Kafka'],
  },
  metrics: [
    { label: 'records / day', value: 22, unit: 'M' },
    { label: 'services integrated', value: 180, unit: '+' },
    { label: 'rows tuned', value: 420, unit: 'M' },
    { label: 'fewer incidents', value: 46, unit: '%' },
  ],
  roles: [
    {
      id: 'keyhole', title: 'Software Engineer III', org: 'Keyhole Software',
      start: 'Aug 2025', end: 'Present',
      highlights: [
        'Built multithreaded services processing ~22M financial records daily — +39% concurrent throughput, with transactional consistency held across distributed nodes.',
        'Designed REST APIs and integrations across 180+ internal services, cutting response times 31% through better service orchestration.',
        'Tuned Oracle PL/SQL and PostgreSQL over 420M-row datasets — month-end reporting fell from 42 min to 17 min via indexing and partitioning.',
        'Cut recurring production incidents 46% by instrumenting the ugly paths and fixing root causes instead of symptoms.',
      ],
    },
    {
      id: 'hitachi-cloud', title: 'Cloud IaaS Professional — Full Stack Developer', org: 'Hitachi Digital Services',
      start: 'Nov 2023', end: 'Dec 2024',
      highlights: [
        'Shipped Spring Boot services onto AWS — EC2, S3, Lambda, Docker, Kubernetes — for cloud-hosted business platforms.',
        'Wrote PL/SQL, tuned Oracle, and worked with DBAs to land schema changes without downtime.',
        'Automated builds and deploys through Maven, Jenkins, GitHub Actions and Bitbucket.',
      ],
    },
    {
      id: 'hitachi-app', title: 'Application Developer', org: 'Hitachi Digital Services',
      start: 'Jan 2023', end: 'Oct 2023',
      highlights: [
        'Built Java enterprise applications, Spring Boot REST APIs and Oracle modules behind financial workflows.',
        'Wrote multithreaded components and reusable services against real object-oriented design patterns.',
        'Designed the SQL, PL/SQL procedures and database objects carrying transaction processing and reporting.',
      ],
    },
    {
      id: 'infrabyte', title: 'Software Development Intern', org: 'Infrabyte Consulting',
      start: 'Aug 2021', end: 'Sep 2022',
      highlights: [
        'Backend services, REST APIs and Oracle modules for enterprise applications.',
        'Designed relational schemas and learned that a missing index costs more than a bad algorithm.',
      ],
    },
  ],
  skills: [
    { tier: 0, name: 'Edge', caption: 'entry & contracts', items: ['REST APIs', 'Spring MVC', 'OpenAPI', 'Auth / JWT'] },
    { tier: 1, name: 'Services', caption: 'where the logic lives', items: ['Java', 'Spring Boot', 'Spring Data JPA', 'Go', 'Python', 'Multithreading', 'SOA', 'Design patterns'] },
    { tier: 2, name: 'Messaging', caption: 'decoupling & backpressure', items: ['Apache Kafka', 'RabbitMQ'] },
    { tier: 3, name: 'Data', caption: 'the part that must not lie', items: ['PostgreSQL', 'Oracle · PL/SQL', 'SQL Server', 'MySQL', 'MongoDB', 'S3'] },
    { tier: 4, name: 'Platform', caption: 'how it ships and scales', items: ['AWS EC2 · Lambda', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions', 'Maven'] },
    { tier: 5, name: 'Signals', caption: 'knowing before the user does', items: ['ELK Stack', 'Prometheus', 'Grafana', 'CloudWatch', 'Tableau'] },
  ],
  topology: {
    nodes: [
      { id: 'api-gateway', tier: 0, roleIndex: 0, description: 'Fronts 180+ internal services. Routing, auth, rate limits.' },
      { id: 'auth-svc', tier: 0, roleIndex: 3, description: 'Token issue and validation on every inbound call.' },
      { id: 'txn-processor', tier: 1, roleIndex: 0, description: 'Multithreaded core. ~22M financial records a day.' },
      { id: 'ledger-svc', tier: 1, roleIndex: 0, description: 'Double-entry state. Consistency is non-negotiable.' },
      { id: 'reporting-svc', tier: 1, roleIndex: 2, description: 'Month-end runs. 42 min to 17 min after tuning.' },
      { id: 'notification-svc', tier: 1, roleIndex: 3, description: 'Fan-out on settlement and failure events.' },
      { id: 'batch-orchestrator', tier: 1, roleIndex: 2, description: 'Schedules and retries the overnight pipelines.' },
      { id: 'kafka', tier: 2, roleIndex: 0, description: 'Event backbone. Absorbs bursts the database cannot.' },
      { id: 'rabbitmq', tier: 2, roleIndex: 3, description: 'Work queues for the slower, ordered jobs.' },
      { id: 'postgres', tier: 3, roleIndex: 2, description: 'OLTP primary. Partitioned, indexed, watched.' },
      { id: 'oracle', tier: 3, roleIndex: 0, description: 'PL/SQL procedures over 420M-row datasets.' },
      { id: 'mongodb', tier: 3, roleIndex: 3, description: 'Document store for the shapes SQL fought.' },
      { id: 's3', tier: 3, roleIndex: 1, description: 'Cold storage, artifacts, report drops.' },
      { id: 'eks', tier: 4, roleIndex: 1, description: 'Kubernetes. Rollouts, HPA, blue-green.' },
      { id: 'lambda', tier: 4, roleIndex: 1, description: 'Event glue and scheduled small work.' },
      { id: 'terraform', tier: 4, roleIndex: 1, description: 'The infrastructure, in review, in git.' },
      { id: 'elk', tier: 5, roleIndex: 2, description: 'Log search when the incident is already live.' },
      { id: 'prometheus', tier: 5, roleIndex: 0, description: 'Metrics and alert rules. The 46% came from here.' },
      { id: 'grafana', tier: 5, roleIndex: 1, description: 'Dashboards the on-call actually opens.' },
    ],
    edges: [
      ['api-gateway', 'auth-svc'], ['api-gateway', 'txn-processor'], ['api-gateway', 'ledger-svc'],
      ['api-gateway', 'reporting-svc'], ['txn-processor', 'ledger-svc'], ['txn-processor', 'kafka'],
      ['txn-processor', 'oracle'], ['ledger-svc', 'oracle'], ['reporting-svc', 'postgres'],
      ['reporting-svc', 's3'], ['batch-orchestrator', 'rabbitmq'], ['batch-orchestrator', 'postgres'],
      ['notification-svc', 'rabbitmq'], ['kafka', 'ledger-svc'], ['kafka', 'notification-svc'],
      ['auth-svc', 'mongodb'], ['postgres', 'eks'], ['oracle', 'eks'], ['txn-processor', 'eks'],
      ['eks', 'terraform'], ['lambda', 'kafka'], ['eks', 'lambda'], ['s3', 'lambda'],
      ['prometheus', 'txn-processor'], ['prometheus', 'ledger-svc'], ['prometheus', 'eks'],
      ['elk', 'txn-processor'], ['elk', 'reporting-svc'], ['grafana', 'prometheus'],
      ['grafana', 'elk'], ['mongodb', 'reporting-svc'], ['rabbitmq', 'notification-svc'],
      ['terraform', 'eks'], ['ledger-svc', 'postgres'], ['api-gateway', 'eks'],
    ].map(([from, to]) => ({ from, to })),
  },
};
