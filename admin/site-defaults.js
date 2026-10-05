// ============================================================
// Default portfolio datasets (shared by admin.js and script.js)
// Loaded via CDN-free local <script> tag BEFORE admin.js /
// script.js so both the admin panel and the public site know
// the built-in content. Any record saved from the admin panel
// is written to localStorage (instant, same browser) and to
// Cloud Firestore (cross-device); the stored copy always wins
// over the defaults below.
//
// Keys must stay in sync with COLLECTIONS in admin/admin.js
// and with STORE_KEYS in script.js.
// ============================================================

(function () {
  'use strict';

  const experience = [
    {
      id: "route2uni-ito",
      role: "Information Technology Officer",
      company: "Route2Uni International Group",
      duration: "April 2026 – Present",
      description: "Directing internal IT infrastructure, education consultancy CRM administration, database integrity, and student application portal workflows. Managing secure communications, digital systems maintenance, and staff technical support.",
      tags: ["IT Operations", "CRM Management", "Network Administration", "Database Security"],
      icon: "fas fa-building"
    },
    {
      id: "citizen-frontend",
      role: "Front-End Developer",
      company: "Citizen Infotech Pvt. Ltd.",
      duration: "July 2025 – April 2026",
      description: "Engineered responsive, accessible front-end interfaces for enterprise software and client platforms. Implemented UI components in modern JavaScript/React, connected RESTful API services, and optimized cross-browser performance.",
      tags: ["React", "JavaScript (ES6+)", "REST APIs", "HTML5 / CSS3", "Responsive Design"],
      icon: "fas fa-building"
    },
    {
      id: "citizen-it-support",
      role: "IT Support Specialist",
      company: "Citizen Infotech Pvt. Ltd.",
      duration: "February 2025 – July 2025",
      description: "Provided technical systems administration, troubleshooting, hardware provisioning, network maintenance, and user support across company operations and healthcare technology deployments.",
      tags: ["Systems Administration", "LAN / WAN", "Technical Troubleshooting", "User Access"],
      icon: "fas fa-building"
    },
    {
      id: "citizen-trainer",
      role: "Technical Trainer",
      company: "Citizen Infotech Pvt. Ltd.",
      duration: "August 2024 – February 2025",
      description: "Trained over 400+ professionals, healthcare operators, and students on software systems (including e-HMIS, EHR, IDMS), database concepts, and IT operations through hands-on workshops and curriculum delivery.",
      tags: ["Technical Training", "e-HMIS / EHR", "Curriculum Design", "Workshops"],
      icon: "fas fa-chalkboard-teacher"
    },
    {
      id: "hamro-it-engineer",
      role: "Information Technology Engineer",
      company: "Hamro Madhyawarti Saving & Credit Co-operative Ltd.",
      duration: "November 2021 – July 2023",
      description: "Managed the cooperative's entire IT infrastructure, core banking software systems, financial data security, automated daily backups, network uptime, and institutional digitization.",
      tags: ["Banking Software", "Financial Data Security", "Backup Recovery", "Network Architecture"],
      icon: "fas fa-building-columns"
    },
    {
      id: "nepal-telecom-intern",
      role: "Electronic Engineer Intern",
      company: "Nepal Telecom",
      duration: "April 2019 – June 2019",
      description: "Hands-on engineering training in the IMU Section, Transmission, Mobile Project, and IT infrastructure. Analyzed telecommunication routing, transmission equipment, and signal integrity.",
      tags: ["Telecommunications", "Transmission Systems", "Mobile Networks", "RF & Fiber"],
      icon: "fas fa-tower-broadcast"
    }
  ];

  const skillPillars = [
    {
      id: "pillar-software",
      name: "Software Development",
      icon: "fas fa-code",
      skills: [
        { id: "skill-html-css", name: "HTML5 & CSS3", description: "Semantic, accessible layout systems with responsive CSS custom properties.", icon: "fab fa-html5" },
        { id: "skill-js", name: "JavaScript (ES6+)", description: "Modern asynchronous JS, DOM manipulation, state patterns, and API integration.", icon: "fab fa-js" },
        { id: "skill-typescript", name: "TypeScript", description: "Strict type safety, interfaces, generics, and scalable codebases.", icon: "fas fa-code" },
        { id: "skill-react", name: "React", description: "Component-driven architectures, hooks, context state, and performance tuning.", icon: "fab fa-react" },
        { id: "skill-rest", name: "RESTful API Integration", description: "Secure JSON endpoints, HTTP lifecycle, token authentication, and data binding.", icon: "fas fa-network-wired" },
        { id: "skill-db", name: "Database Management", description: "Relational modeling in PostgreSQL, MySQL, normalization, and query tuning.", icon: "fas fa-database" }
      ]
    },
    {
      id: "pillar-infra",
      name: "Infrastructure & Cloud",
      icon: "fas fa-cloud",
      skills: [
        { id: "skill-linux", name: "Linux Administration", description: "Debian/Ubuntu server configuration, CLI scripting, SSH, and daemon management.", icon: "fab fa-linux" },
        { id: "skill-aws", name: "AWS Fundamentals", description: "EC2 instances, S3 storage buckets, IAM permissions, and cloud networking basics.", icon: "fab fa-aws" },
        { id: "skill-server", name: "Server Management", description: "Web server administration (Nginx/Apache), monitoring, and resource scaling.", icon: "fas fa-server" },
        { id: "skill-network", name: "LAN / WAN Networking", description: "Subnetting, VLAN configuration, router and switch topologies, and VPN tunnels.", icon: "fas fa-sitemap" },
        { id: "skill-backup", name: "Backup & Disaster Recovery", description: "Scheduled snapshots, offsite storage replication, and continuity testing.", icon: "fas fa-floppy-disk" }
      ]
    },
    {
      id: "pillar-security",
      name: "Security & Threat Management",
      icon: "fas fa-shield-halved",
      skills: [
        { id: "skill-threat", name: "Cyber Threat Management", description: "Vulnerability assessment, intrusion prevention protocols, and threat containment.", icon: "fas fa-shield-virus" },
        { id: "skill-data-security", name: "Data Security & Compliance", description: "At-rest and in-transit encryption, role-based controls, and auditable trails.", icon: "fas fa-user-lock" },
        { id: "skill-net-security", name: "Network Security", description: "Firewall rule definitions, traffic filtering, port isolation, and secure routing.", icon: "fas fa-ethernet" }
      ]
    },
    {
      id: "pillar-ai",
      name: "AI & Data Engineering",
      icon: "fas fa-brain",
      skills: [
        { id: "skill-ai-eng", name: "AI Engineering", description: "Automated workflows, AI model integration, prompt architectures, and pipelines.", icon: "fas fa-microchip-ai" },
        { id: "skill-python", name: "Python for Data Science", description: "NumPy, Pandas, Scikit-learn, statistical data transformations, and scripting.", icon: "fab fa-python" },
        { id: "skill-analytics", name: "Data Analysis & Insights", description: "Exploratory analytics, trend identification, and KPI dashboard reporting.", icon: "fas fa-chart-line" },
        { id: "skill-db-tuning", name: "Database Design & Tuning", description: "Schema normalization, indexing strategy, constraint modeling, and optimization.", icon: "fas fa-diagram-project" }
      ]
    },
    {
      id: "pillar-iot",
      name: "Electronics & IoT",
      icon: "fas fa-microchip",
      skills: [
        { id: "skill-embedded", name: "Embedded Systems", description: "ESP32, Arduino microcontrollers, firmware in Embedded C/C++, and hardware timers.", icon: "fas fa-microchip" },
        { id: "skill-iot-proto", name: "IoT & Wireless Protocols", description: "MQTT, RFID (RC522), I2C, SPI, UART, and telemetry sensor networks.", icon: "fas fa-wifi" },
        { id: "skill-dsp", name: "Communication Systems & DSP", description: "Digital signal filtering, Fourier analysis, frequency modulation, and transmission.", icon: "fas fa-wave-square" },
        { id: "skill-circuits", name: "Circuit Design & Simulation", description: "Schematic modeling, Proteus, Multisim, and MATLAB simulation benchmarks.", icon: "fas fa-bolt" }
      ]
    }
  ];

  const certifications = [
    { id: "cert-cyber-threat", name: "Cyber Threat Management", issuer: "Cisco Networking Academy / Professional Credentials", category: "Security", year: "Verified", status: "Active", link: "" },
    { id: "cert-ai-associate", name: "AI Engineer for Data Scientists Associate", issuer: "Professional Accreditation", category: "Artificial Intelligence", year: "Verified", status: "Active", link: "" },
    { id: "cert-data-analyst", name: "Data Analyst Associate", issuer: "Data Science & Analytical Workflows", category: "Analytics", year: "Verified", status: "Active", link: "" },
    { id: "cert-hardware", name: "Computer Hardware Basics", issuer: "Systems Architecture & Provisioning", category: "Hardware", year: "Verified", status: "Active", link: "" },
    { id: "cert-db-designer", name: "Database Designer", issuer: "Relational Systems & Schema Architecture", category: "Database", year: "Verified", status: "Active", link: "" }
  ];

  const education = [
    {
      id: "edu-btech",
      degree: "Electronics & Communication Engineering",
      level: "Bachelor of Technology",
      institution: "Guru Nanak Institutions Of Technical Campus (JNTUH)",
      period: "2017 – 2022",
      description: "Rigorous curriculum spanning digital signal processing, embedded systems, microprocessors, communication networks, VLSI, and computer architecture.",
      icon: "fas fa-graduation-cap",
      accent: "primary"
    },
    {
      id: "edu-diploma",
      degree: "Diploma in Electronics and Communication Engineering",
      level: "Diploma in Engineering",
      institution: "SRM College of Technical Education (HSBTE)",
      period: "2014 – 2017",
      description: "Foundational laboratory and theoretical training in circuit design, analogue electronics, digital logic gates, microcontrollers, and communication systems.",
      icon: "fas fa-certificate",
      accent: "secondary"
    }
  ];

  const blog = [];

  const learning = [
    { id: "learn-llm-agents", title: "Modern LLM & Agentic AI Architecture", description: "Exploring autonomous AI agent orchestration, vector embeddings, and API tooling.", category: "AI Engineering", progress: "Active Study", icon: "fas fa-brain", link: "" },
    { id: "learn-cloud-native", title: "Cloud Native Solutions Architecture", description: "Containerization with Docker, Kubernetes cluster basics, and cloud infrastructure.", category: "Cloud Infra", progress: "In Progress", icon: "fas fa-cloud-arrow-up", link: "" },
    { id: "learn-threat-modeling", title: "Enterprise Threat Modeling & Zero-Trust", description: "Defense-in-depth methodologies, credential management, and infrastructure audits.", category: "Cybersecurity", progress: "Completed", icon: "fas fa-shield-virus", link: "" }
  ];

  window.PORTFOLIO_DEFAULTS = {
    experience_items: experience,
    skill_pillars: skillPillars,
    certification_items: certifications,
    education_items: education,
    blog_items: blog,
    learning_items: learning
  };

})();