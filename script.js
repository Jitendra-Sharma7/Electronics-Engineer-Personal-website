/**
 * Jitendra Sharma — Premium 2026 Portfolio Core Script
 * Architecture: ES6+ Modular, Theme Controller, i18n Engine, Canvas Tech Ecosystem,
 * Projects Case Study Engine, GitHub Activity Fetcher, Cloud Database Sync
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Multi-Language Dictionary (English & Nepali)
  // ==========================================================================
  const translations = {
    en: {
      nav_about: "About",
      nav_projects: "Projects",
      nav_experience: "Experience",
      nav_skills: "Skills",
      nav_certifications: "Certifications",
      nav_blog: "Blog",
      nav_learning: "Learning",
      nav_contact: "Contact",
      download_cv: "Download CV",
      status_badge: "Available for technical roles & high-impact projects",
      hero_headline: "Building secure, scalable, and intelligent digital solutions.",
      hero_desc: "Multidisciplinary technology professional bridging enterprise software development, resilient IT infrastructure, cloud fundamentals, cybersecurity, and AI-enabled operations.",
      view_projects: "View Projects",
      connect_cta: "Let's Connect",
      about_kicker: "Multidisciplinary Professional",
      about_title: "Bridging Software, Infrastructure & Artificial Intelligence",
      about_desc1: "I specialize in architecting and supporting end-to-end digital ecosystems. From designing customer-facing enterprise CRM platforms to administering high-availability Linux networks, securing critical financial data, and deploying AI-driven pipelines.",
      about_desc2: "With a strong background in Electronics & Communication Engineering paired with 5+ years of practical IT operations, I bring rare cross-functional agility to modern engineering teams.",
      stat_exp: "5+ Years",
      stat_exp_desc: "Enterprise IT, full-stack development, and network infrastructure.",
      stat_trained: "400+",
      stat_trained_desc: "IT professionals, engineers, and students trained in technology.",
      projects_kicker: "Featured Work",
      projects_title: "Production Systems & Engineering Showcase",
      projects_subtitle: "Curated selection of enterprise CRMs, healthcare systems, AI pipelines, and IoT solutions.",
      filter_all: "All",
      filter_software: "Software / CRM",
      filter_ai: "AI & Data",
      filter_infra: "Infrastructure",
      filter_iot: "Electronics / IoT",
      exp_kicker: "Career Trajectory",
      exp_title: "Professional Experience",
      exp_subtitle: "Verified chronological history from enterprise IT management to software engineering.",
      skills_kicker: "Technical Ecosystem",
      skills_title: "Capabilities & Tooling",
      skills_subtitle: "An interactive overview of core competencies across modern technology domains.",
      contact_kicker: "Get In Touch",
      contact_title: "Let's Build Something Meaningful",
      contact_subtitle: "Open to software development opportunities, IT infrastructure roles, cloud/networking projects, and technical consulting.",
      send_message: "Send Message",
      msg_success: "Thank you! Your message has been sent successfully.",
      msg_error: "Please fill all required fields correctly."
    },
    ne: {
      nav_about: "बारेमा",
      nav_projects: "परियोजनाहरू",
      nav_experience: "अनुभव",
      nav_skills: "दक्षता",
      nav_certifications: "प्रमाणपत्र",
      nav_blog: "ब्लग",
      nav_learning: "सिकाइ",
      nav_contact: "सम्पर्क",
      download_cv: "सीभी डाउनलोड",
      status_badge: "नयाँ प्राविधिक अवसर तथा परियोजनाका लागि उपलब्ध",
      hero_headline: "सुरक्षित, भरपर्दो र आधुनिक डिजिटल प्रणाली निर्माण।",
      hero_desc: "सफ्टवेयर विकास, सूचना प्रविधि पूर्वाधार, क्लाउड, साइबर सुरक्षा, र एआई प्रणालीमा काम गर्ने बहुआयामिक प्रविधि इन्जिनियर।",
      view_projects: "परियोजनाहरू हेर्नुहोस्",
      connect_cta: "सम्पर्क गरौं",
      about_kicker: "व्यावसायिक परिचय",
      about_title: "सफ्टवेयर, पूर्वाधार र एआई प्रविधिको संयोजन",
      about_desc1: "म आधुनिक डिजिटल प्रणालीहरूको विकास र व्यवस्थापनमा विशेषज्ञता राख्छु—जसमा इन्टरप्राइज सीआरएम, लिनक्स सर्भर पूर्वाधार, डाटा सुरक्षा र एआई-सञ्चालित कार्यप्रवाहहरू पर्दछन्।",
      about_desc2: "इलेक्ट्रोनिक्स तथा सञ्चार इन्जिनियरिङ पृष्ठभूमि र ५+ वर्षको व्यावहारिक अनुभवका साथ, म जटिल प्राविधिक चुनौतीहरू समाधान गर्न सक्षम छु।",
      stat_exp: "५+ वर्ष",
      stat_exp_desc: "इन्टरप्राइज आईटी, सफ्टवेयर विकास र नेटवर्क पूर्वाधार।",
      stat_trained: "४००+",
      stat_trained_desc: "प्रविधि क्षेत्रमा तालिम प्राप्त विद्यार्थी तथा इन्जिनियरहरू।",
      projects_kicker: "प्रमुख कार्यहरू",
      projects_title: "उत्पादन प्रणाली र परियोजना प्रदर्शन",
      projects_subtitle: "सीआरएम सफ्टवेयर, स्वास्थ्य सूचना प्रणाली, एआई र आईओटी कार्यहरूको संग्रह।",
      filter_all: "सबै",
      filter_software: "सफ्टवेयर / सीआरएम",
      filter_ai: "एआई तथा डाटा",
      filter_infra: "पूर्वाधार",
      filter_iot: "इलेक्ट्रोनिक्स / आईओटी",
      exp_kicker: "कार्य अनुभव",
      exp_title: "व्यावसायिक अनुभव",
      exp_subtitle: "आईटी व्यवस्थापनदेखि सफ्टवेयर विकाससम्मको प्रमाणित कार्य अनुभव।",
      skills_kicker: "प्राविधिक दक्षता",
      skills_title: "क्षमता तथा उपकरणहरू",
      skills_subtitle: "आधुनिक प्रविधि क्षेत्रहरूमा मेरा मुख्य सीप तथा ज्ञानको अवलोकन।",
      contact_kicker: "सम्पर्क",
      contact_title: "आउनुहोस्, सँगै केही नयाँ निर्माण गरौं",
      contact_subtitle: "सफ्टवेयर विकास, पूर्वाधार व्यवस्थापन, क्लाउड/नेटवर्किङ र प्राविधिक सल्लाहका लागि म सधैं तयार छु।",
      send_message: "सन्देश पठाउनुहोस्",
      msg_success: "धन्यवाद! तपाईंको सन्देश सफलतापूर्वक पठाइयो।",
      msg_error: "कृपया सबै आवश्यक विवरणहरू सही भर्नुहोस्।"
    }
  };

  let currentLang = localStorage.getItem('site_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    const langBtnText = document.getElementById('langBtnText');
    if (langBtnText) {
      langBtnText.textContent = lang === 'ne' ? 'नेपाली' : 'EN';
    }
  }

  // ==========================================================================
  // 2. Comprehensive Projects Dataset (With Rich Case Studies)
  // ==========================================================================
  const projectsData = [
    {
      id: "dreams-care-home-crm",
      title: "Dreams Care Home CRM",
      category: "software",
      categoryDisplay: "Software / CRM / Enterprise",
      featured: true,
      overview: "An enterprise-grade CRM and care management platform built to streamline patient logs, caregiver scheduling, multi-tier billing, and role-based auditing.",
      problem: "Healthcare residential homes frequently suffer from scattered paperwork, compliance oversights, and asynchronous staff communication that delay urgent care coordination.",
      role: "Lead Software Developer & System Architect. Responsible for database architecture, workflow automation, secure authentication, and frontend integration.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Tailwind CSS"],
      features: [
        "Patient intake, automated health telemetry logs, and dietary trackers.",
        "Role-Based Access Control (Admin, Nurse, Family Representative, Auditor).",
        "Automated recurring invoicing and financial ledger reporting.",
        "Real-time shift notifications and medication dispense reminders."
      ],
      process: "Conducted stakeholder interviews with care supervisors, modeled normalized relational schemas in PostgreSQL, built modular React frontend components with strict TypeScript safety, and established automated audit trail logs for medical data compliance.",
      results: "Reduced administrative operational overhead by 40%, eliminated manual charting errors, and provided an auditable digital trail for care audits.",
      challenges: "Ensuring sensitive resident health records met stringent privacy constraints while maintaining sub-second query speeds across historical medical records.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "route2uni-crm",
      title: "Route2Uni CRM & Student Portal",
      category: "software",
      categoryDisplay: "Software / CRM / EdTech",
      featured: true,
      overview: "Comprehensive international education consultancy CRM handling university admissions, course catalogues, multi-country visa pipelines, and applicant tracking.",
      problem: "Education consultancies managing hundreds of global applications lose high-value prospects due to fragmented follow-ups and uncoordinated document reviews.",
      role: "Information Technology Officer & Full-Stack Developer. Designed end-to-end applicant tracking, automated milestone notifications, and secure credential storage.",
      techStack: ["JavaScript (ES6+)", "React", "REST APIs", "MySQL", "Cloud Document Storage", "CSS Modules"],
      features: [
        "Interactive applicant pipeline Kanban with status progression.",
        "University search database indexing requirements across US, UK, Australia, and Canada.",
        "Document verification checklist with automated applicant alert emails.",
        "Counselor performance metrics and conversion analytics."
      ],
      process: "Designed a centralized workflow engine that maps every stage from initial IELTS counseling to final visa issuance. Built REST endpoints with input validation and indexed search queries for rapid university retrieval.",
      results: "Accelerated application submission turnaround by 35% and centralized documentation for multi-branch counseling teams.",
      challenges: "Handling heterogeneous university requirements and dynamic visa checklist rules across multiple international jurisdictions.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "ehr-ehmis-systems",
      title: "e-HMIS & EHR Healthcare Systems",
      category: "infra",
      categoryDisplay: "Healthcare Technology / Infrastructure",
      featured: false,
      overview: "Implementation, testing, end-user training, and infrastructure support for national-standard Electronic Health Records (EHR) and Health Management Information Systems (e-HMIS).",
      problem: "Primary healthcare clinics and hospitals in regional hubs faced severe data fragmentation and manual reporting lag for essential medical statistics and epidemiological reporting.",
      role: "Technical Specialist & Trainer at Citizen Infotech. Deployed system configurations, validated data integrity, trained medical staff, and resolved live operational issues.",
      techStack: ["e-HMIS", "EHR Frameworks", "Database Management", "Linux Server Admin", "Healthcare Telemetry"],
      features: [
        "Electronic patient registration, outpatient/inpatient management, and diagnostic records.",
        "Standardized medical coding, pharmacy inventory tracking, and billing.",
        "Automated epidemiological aggregate report generation for health ministries.",
        "High-reliability local database synchronization and backup protocols."
      ],
      process: "Conducted on-site implementations across clinical environments, configured server instances, resolved network latency bottlenecks, and conducted comprehensive hands-on workshops for clinical personnel.",
      results: "Successfully trained dozens of healthcare administrators and ensured flawless reporting continuity across clinical deployments.",
      challenges: "Managing reliable data synchronization in environments with intermittent broadband connectivity.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "ai-data-intelligence",
      title: "AI & Data Intelligence Workflows",
      category: "ai",
      categoryDisplay: "AI / Data Science / Automation",
      featured: false,
      overview: "Automated data pipelines, machine learning evaluation scripts, and intelligent reporting tools designed for high-accuracy analytics and operational decision-making.",
      problem: "Organizations amass large volumes of unstructured operational data that remain unanalyzed, leading to delayed decision cycles and manual spreadsheet bottlenecks.",
      role: "AI Engineer & Data Analyst. Formulated data cleaning pipelines, exploratory models, statistical evaluations, and API integration for predictive metrics.",
      techStack: ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "LLM APIs", "Data Visualization"],
      features: [
        "Automated data extraction, anomaly detection, and schema reconciliation.",
        "Predictive classification models for customer churn and demand estimation.",
        "Automated text summarization and categorization via modern AI APIs.",
        "Interactive KPI dashboards highlighting actionable trends."
      ],
      process: "Developed reproducible Python pipelines utilizing vectorization, established data validation rules, benchmarked regression and classification models, and deployed scheduled batch jobs.",
      results: "Cut repetitive reporting cycles from days to minutes while revealing operational efficiencies through statistical insights.",
      challenges: "Preventing data leakage and optimizing ETL memory footprints when processing large tabular datasets.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "smart-home-automation",
      title: "Smart Home Automation & IoT Ecosystem",
      category: "iot",
      categoryDisplay: "Electronics / Embedded Systems",
      featured: false,
      overview: "An IoT-based automation and telemetry platform utilizing ESP32 microcontrollers, environmental sensors, and mobile dashboards for intelligent appliance control.",
      problem: "Traditional home electrical infrastructures lack remote intelligence, energy consumption awareness, and proactive safety shutoffs.",
      role: "Hardware & Firmware Engineer. Designed relay switching circuits, programmed ESP32 firmware, and integrated MQTT wireless protocol.",
      techStack: ["ESP32", "C/C++", "Arduino IDE", "MQTT Protocol", "IoT Sensors", "Circuit Design"],
      features: [
        "Low-latency wireless control of lighting, ventilation, and power relays.",
        "Live temperature, humidity, and atmospheric telemetry reporting.",
        "Safety triggers for automatic cutoff upon abnormal heat or current spikes.",
        "Mobile dashboard interface with low bandwidth footprint."
      ],
      process: "Breadboard prototyping followed by custom PCB layout, firmware state-machine optimization for power efficiency, and MQTT broker setup with lightweight payloads.",
      results: "Delivered responsive, ultra-reliable hardware control with 99.8% wireless packet delivery over standard Wi-Fi.",
      challenges: "Mitigating electrical interference and voltage back-EMF from inductive relay coils.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "rfid-attendance-system",
      title: "RFID-Based Enterprise Attendance System",
      category: "iot",
      categoryDisplay: "Electronics / IoT / Database",
      featured: false,
      overview: "Automated contact-free identification and attendance tracking system integrating RC522 RFID readers, Arduino microcontrollers, and central MySQL logging.",
      problem: "Manual attendance registers and optical scanners cause entrance congestion and suffer from clock-in inaccuracies or buddy-punching.",
      role: "Embedded Developer & Systems Integrator. Developed serial communication protocols between reader hardware and backend database scripts.",
      techStack: ["Arduino", "RFID (RC522)", "C++", "Python Serial Sync", "MySQL Database"],
      features: [
        "Sub-second contactless card authentication with auditory and visual confirmation.",
        "Automatic timestamping and shift allocation in a centralized database.",
        "Daily automated summary reports and absence flagging.",
        "Tamper-proof local buffer storing offline swipes during network drops."
      ],
      process: "Configured SPI communication between the RC522 and MCU, authored Python listener service to parse serial datagrams, and implemented database transactions with uniqueness constraints.",
      results: "Streamlined personnel check-in with instantaneous verification and zero manual transcription errors.",
      challenges: "Ensuring offline card scans were buffered securely in EEPROM during power or network hiccups and synced upon reconnection.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "dsp-audio-processing",
      title: "Digital Signal Processing Suite",
      category: "iot",
      categoryDisplay: "Electronics / DSP / Audio",
      featured: false,
      overview: "Computational signal processing suite implementing digital filters (FIR/IIR), FFT spectral analysis, noise cancellation, and equalization.",
      problem: "Analog audio capture in noisy environments introduces broadband static and harmonics that degrade speech intelligibility.",
      role: "Algorithm Developer. Programmed MATLAB and Python algorithms for signal decomposition and frequency transformation.",
      techStack: ["MATLAB", "Python (SciPy)", "FFT Algorithms", "Filter Design", "Signal Simulation"],
      features: [
        "Band-pass and notch filtering targeting 50/60 Hz electrical hum.",
        "Fast Fourier Transform (FFT) real-time spectral visualization.",
        "Adaptive noise suppression using least-mean-squares (LMS) filtering.",
        "Audio dynamic range compression and harmonic enhancement."
      ],
      process: "Designed filter transfer functions in MATLAB Filter Designer, benchmarked impulse response stability in frequency domain, and ported algorithms to Python for batch processing.",
      results: "Achieved a 16 dB signal-to-noise ratio (SNR) improvement on degraded voice recordings.",
      challenges: "Balancing filter transition steepness with phase distortion and computational delay.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "wireless-power-transfer",
      title: "Wireless Power Transfer System",
      category: "iot",
      categoryDisplay: "Electronics / Power Engineering",
      featured: false,
      overview: "Resonant inductive coupling system engineered to transmit electrical energy across air gaps without physical wire connections.",
      problem: "Mechanical charging ports in wearable and medical devices suffer from corrosion, dirt accumulation, and mechanical wear over repetitive cycles.",
      role: "Circuit & Simulation Designer. Modeled resonance tanks, simulated magnetic flux linkage, and verified thermal dissipation.",
      techStack: ["Proteus VSM", "Circuit Design", "Resonant Inductive Coupling", "Power Electronics"],
      features: [
        "High-frequency LC tank oscillation producing resonant electromagnetic fields.",
        "Receiver rectification and smoothing circuitry for 5V regulated output.",
        "Thermal protection and over-current shutdown.",
        "Optimal distance and alignment calibration."
      ],
      process: "Calculated primary and secondary coil inductance ratios, simulated sinusoidal waveforms in Proteus, constructed physical coil prototypes, and tested coupling efficiencies.",
      results: "Demonstrated efficient contactless power delivery capable of powering sensors and charging lithium-ion battery modules across a 15mm gap.",
      challenges: "Minimizing eddy current heat losses in surrounding conductive surfaces.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "voice-controlled-robot",
      title: "Voice-Controlled Robotic Platform",
      category: "iot",
      categoryDisplay: "Electronics / Robotics / Embedded",
      featured: false,
      overview: "Autonomous mobile robotic chassis driven by real-time speech commands, ultrasonic obstacle avoidance, and dual H-bridge motor controllers.",
      problem: "Industrial and service environments often require hands-free navigation in hazardous or remote inspection quarters.",
      role: "Robotics Engineer. Programmed speech recognition modules, motor control PWM routines, and safety override interrupts.",
      techStack: ["Arduino", "Speech Recognition Module", "L298N Motor Driver", "Ultrasonic Sensors", "Embedded C"],
      features: [
        "Real-time voice parsing for multi-directional motion (Forward, Reverse, Turn, Halt).",
        "Hardware interrupt safety override preventing collisions via ultrasonic distance sensor.",
        "Pulse-Width Modulation (PWM) variable speed governor.",
        "Autonomous obstacle avoidance fallback mode."
      ],
      process: "Trained voice acoustic models for specific operator commands, built microcontroller interrupt routines for collision safety, and calibrated motor PWM curves for smooth acceleration.",
      results: "Achieved over 92% speech command accuracy in moderate ambient noise with zero wall collisions.",
      challenges: "Eliminating sensor false positives generated by motor electrical noise.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "heart-rate-monitoring",
      title: "Portable Heart Rate Monitoring Device",
      category: "iot",
      categoryDisplay: "Biomedical / Embedded Systems",
      featured: false,
      overview: "Wearable biomedical sensor telemetry unit measuring photoplethysmogram (PPG) pulses and calculating real-time BPM with abnormal rhythm alerts.",
      problem: "Conventional clinical ECG equipment is bulky and inaccessible for continuous, mobile patient vital sign monitoring.",
      role: "Biomedical Firmware Developer. Formulated peak-detection algorithms, calibrated optical noise rejection, and integrated display drivers.",
      techStack: ["Optical Pulse Sensor", "Arduino", "Embedded C", "OLED Display", "I2C Protocol"],
      features: [
        "Optical pulse detection via infrared absorption changes in capillary tissue.",
        "Dynamic moving average peak calculation for accurate BPM filtering.",
        "Live waveform plotting on OLED display via I2C interface.",
        "Audible and visual threshold warnings for tachycardia and bradycardia."
      ],
      process: "Designed moving average and noise rejection filters in firmware, implemented battery-saving sleep cycles, and verified pulse readings against calibrated medical finger pulse oximeters.",
      results: "Delivered reliable heart rate measurements within +/- 2 BPM of hospital-grade benchmark equipment.",
      challenges: "Filtering out motion artifacts during patient movement.",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    }
  ];

  // ==========================================================================
  // 3. Theme Controller (Dark / Light) with Zero-FOUC & Persistence
  // ==========================================================================
  function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('site_theme') || 'dark';

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem('site_theme', theme);
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#07090e' : '#f8fafc');
      }
    }

    setTheme(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }

    // System preference change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('site_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================================================
  // 4. Interactive Hero Canvas (Subtle Particle & Network Visualization)
  // ==========================================================================
  function initHeroCanvas() {
    const canvas = document.getElementById('heroTechCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      createParticles();
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.2,
          color: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#3b82f6' : '#6366f1'
        });
      }
    }

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach(p => {
        // Subtle mouse pull
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          p.x += (mdx / mdist) * 0.8;
          p.y += (mdy / mdist) * 0.8;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  // ==========================================================================
  // 5. Projects Rendering & Filter Controller
  // ==========================================================================
  function renderProjects(category = 'all') {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    // Check if projects are overridden in localStorage or Firestore
    let allProjects = projectsData;
    const stored = localStorage.getItem('custom_projects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allProjects = parsed;
        }
      } catch (e) {
        console.warn('Using default projects data:', e);
      }
    }

    const filtered = category === 'all'
      ? allProjects
      : allProjects.filter(p => p.category === category);

    grid.innerHTML = '';

    filtered.forEach((p, idx) => {
      const card = document.createElement('div');
      // Assign featured sizing to top items or items explicitly marked featured
      const isLarge = (category === 'all' && (idx === 0 || idx === 1)) || p.featured;
      card.className = `bento-card ${isLarge ? 'project-card-featured' : 'project-card-standard'}`;
      card.setAttribute('data-id', p.id);

      const techBadges = p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

      card.innerHTML = `
        <div>
          <div class="project-header-meta">
            <span class="project-category-tag">${p.categoryDisplay || p.category}</span>
            <div class="project-links">
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" style="width:34px; height:34px; font-size:0.9rem;" title="View Source"><i class="fab fa-github"></i></a>` : ''}
              ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" style="width:34px; height:34px; font-size:0.9rem;" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-overview">${p.overview}</p>
        </div>
        <div>
          <div class="project-tech-tags">${techBadges}</div>
          <div class="project-footer-actions">
            <button type="button" class="project-action-link view-case-study-btn" data-project-id="${p.id}">
              <span>View Case Study</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Attach click handlers to open case study modal
    grid.querySelectorAll('.view-case-study-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-project-id');
        openCaseStudyModal(id);
      });
    });
  }

  function initProjectFilters() {
    const buttons = document.querySelectorAll('.project-filter-bar .filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProjects(filter);
      });
    });
  }

  // ==========================================================================
  // 6. Case Study Modal Engine
  // ==========================================================================
  function openCaseStudyModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCategory').textContent = project.categoryDisplay || project.category;
    document.getElementById('modalOverview').textContent = project.overview;
    document.getElementById('modalProblem').textContent = project.problem || "Information detailed in case study.";
    document.getElementById('modalRole').textContent = project.role || "Lead technical execution & development.";
    document.getElementById('modalProcess').textContent = project.process || "Agile sprints, architecture modeling, code implementation, and integration testing.";
    document.getElementById('modalResults').textContent = project.results || "Production-grade operational stability and measurable efficiency gains.";
    document.getElementById('modalChallenges').textContent = project.challenges || "Managing distributed latency and edge-case failure tolerance.";

    // Tech Tags
    const tagsContainer = document.getElementById('modalTechTags');
    if (tagsContainer) {
      tagsContainer.innerHTML = project.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');
    }

    // Features List
    const featuresList = document.getElementById('modalFeaturesList');
    if (featuresList) {
      featuresList.innerHTML = (project.features || []).map(f => `<li style="margin-bottom:8px; display:flex; align-items:flex-start; gap:8px;"><i class="fas fa-check-circle" style="color:var(--accent-primary); margin-top:4px;"></i><span>${f}</span></li>`).join('');
    }

    // Links
    const githubLink = document.getElementById('modalGithubLink');
    if (githubLink) {
      githubLink.href = project.github || 'https://github.com/Jitendra83-coder';
    }
    const demoLink = document.getElementById('modalDemoLink');
    if (demoLink) {
      demoLink.href = project.demo || '#';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function initCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.case-study-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCaseStudyModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCaseStudyModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeCaseStudyModal();
      }
    });
  }

  // ==========================================================================
  // 7. GitHub Activity API Integration with Graceful Fallback
  // ==========================================================================
  async function fetchGitHubData() {
    const username = 'Jitendra83-coder';
    const reposContainer = document.getElementById('githubFeaturedRepos');
    const repoCountEl = document.getElementById('githubTotalRepos');
    const starCountEl = document.getElementById('githubTotalStars');

    // Default verified fallback data
    const fallbackRepos = [
      { name: "Electronics-Engineer-Personal-website", desc: "Production portfolio and personal brand website with cloud synchronization.", lang: "JavaScript", stars: 1 },
      { name: "smart-home-esp32", desc: "IoT home automation system using ESP32, sensor telemetry, and MQTT.", lang: "C++", stars: 2 },
      { name: "rfid-attendance-system", desc: "Hardware RFID badge attendance tracking with MySQL database logging.", lang: "C++", stars: 1 },
      { name: "dsp-audio-processing", desc: "Digital signal processing audio analysis algorithms in MATLAB and Python.", lang: "Python", stars: 1 }
    ];

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });

      if (!response.ok) throw new Error('Rate limit or API issue');
      const repos = await response.json();

      if (Array.isArray(repos) && repos.length > 0) {
        if (repoCountEl) repoCountEl.textContent = repos.length;
        let totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
        if (starCountEl) starCountEl.textContent = totalStars;

        if (reposContainer) {
          reposContainer.innerHTML = repos.slice(0, 4).map(r => `
            <div class="tech-ecosystem-card">
              <div class="tech-eco-head">
                <i class="fas fa-code-branch tech-eco-icon"></i>
                <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="tech-eco-name" style="text-decoration:underline;">${r.name}</a>
              </div>
              <p class="tech-eco-desc">${r.description || 'Public technical repository.'}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:0.78rem; color:var(--text-muted);">
                <span><i class="fas fa-circle" style="color:var(--accent-cyan); font-size:0.6rem; margin-right:4px;"></i>${r.language || 'Code'}</span>
                <span><i class="fas fa-star" style="margin-right:3px;"></i>${r.stargazers_count}</span>
              </div>
            </div>
          `).join('');
        }
        return;
      }
    } catch (err) {
      console.log('GitHub API offline or rate-limited; using cached verified data.');
    }

    // Render fallback data
    if (reposContainer) {
      reposContainer.innerHTML = fallbackRepos.map(r => `
        <div class="tech-ecosystem-card">
          <div class="tech-eco-head">
            <i class="fas fa-code-branch tech-eco-icon"></i>
            <span class="tech-eco-name">${r.name}</span>
          </div>
          <p class="tech-eco-desc">${r.desc}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:0.78rem; color:var(--text-muted);">
            <span><i class="fas fa-circle" style="color:var(--accent-cyan); font-size:0.6rem; margin-right:4px;"></i>${r.lang}</span>
            <span><i class="fas fa-star" style="margin-right:3px;"></i>${r.stars}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // ==========================================================================
  // 8. Contact Form Handler (Validation + Spam Shield + Notifications)
  // ==========================================================================
  function initContactForm() {
    const form = document.getElementById('portfolioContactForm');
    const statusMsg = document.getElementById('contactStatusMsg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot spam protection
      const honeypot = form.querySelector('input[name="website_shield"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected and blocked.');
        return;
      }

      const name = form.querySelector('#contactName').value.trim();
      const email = form.querySelector('#contactEmail').value.trim();
      const subject = form.querySelector('#contactSubject').value.trim();
      const message = form.querySelector('#contactMessage').value.trim();

      if (!name || !email || !message) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.textContent = translations[currentLang]?.msg_error || 'Please fill in all required fields.';
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Save to local submission ledger for admin review
      const submission = {
        name,
        email,
        subject: subject || 'Portfolio Inquiry',
        message,
        date: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      existing.unshift(submission);
      localStorage.setItem('contact_submissions', JSON.stringify(existing));

      // If Firebase Firestore is active, save to cloud
      if (window.db) {
        window.db.collection('portfolioData').doc('contactMessages').set({
          messages: existing
        }).catch(err => console.warn('Firestore message sync notice:', err));
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();

        if (statusMsg) {
          statusMsg.className = 'form-status-msg success';
          statusMsg.textContent = translations[currentLang]?.msg_success || 'Thank you! Your message has been sent successfully.';
        }

        // Direct mailto fallback link for instant contact
        window.location.href = `mailto:jitendra.citizeninfotechnepal@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
      }, 700);
    });
  }

  // ==========================================================================
  // 9. Navbar Scroll & Mobile Navigation
  // ==========================================================================
  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    if (hamburger && mobileOverlay) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
      });

      mobileOverlay.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Highlight active section on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    });
  }

  // ==========================================================================
  // 10. Dynamic Blog & Learning Hub Cloud Sync (Firebase Firestore)
  // ==========================================================================
  function loadCloudContent() {
    const blogGrid = document.getElementById('blogPostsGrid');
    const learningContainer = document.getElementById('learningCoursesList');

    if (window.db) {
      // Sync Blog Posts
      window.db.collection('portfolioData').doc('blogItems').get().then(doc => {
        if (doc.exists && doc.data().items && doc.data().items.length > 0) {
          renderBlogPosts(doc.data().items);
        }
      }).catch(err => console.log('Firestore Blog Read Note:', err));

      // Sync Learning Hub
      window.db.collection('portfolioData').doc('learningCourses').get().then(doc => {
        if (doc.exists && doc.data().courses && doc.data().courses.length > 0) {
          renderLearningCourses(doc.data().courses);
        }
      }).catch(err => console.log('Firestore Learning Read Note:', err));
    }
  }

  function renderBlogPosts(posts) {
    const blogGrid = document.getElementById('blogPostsGrid');
    if (!blogGrid || !posts || posts.length === 0) return;

    blogGrid.innerHTML = posts.map(p => `
      <article class="blog-card">
        <div>
          <span class="badge" style="margin-bottom:12px;">${p.category || 'Engineering'}</span>
          <h3 style="font-family:var(--font-heading); font-size:1.25rem; margin-bottom:10px; color:var(--text-primary);">${p.title}</h3>
          <p style="font-size:0.92rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px;">${p.excerpt || (p.content ? p.content.slice(0, 120) + '...' : '')}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:14px; font-size:0.82rem; color:var(--text-muted);">
          <span>${p.date || 'Recent Article'}</span>
          <span style="color:var(--accent-primary); font-weight:600;"><i class="fas fa-book-reader" style="margin-right:4px;"></i>${p.readTime || '5 min read'}</span>
        </div>
      </article>
    `).join('');
  }

  function renderLearningCourses(courses) {
    const container = document.getElementById('learningCoursesList');
    if (!container || !courses || courses.length === 0) return;

    container.innerHTML = courses.map(c => `
      <div class="tech-ecosystem-card">
        <div class="tech-eco-head">
          <i class="fas fa-graduation-cap tech-eco-icon"></i>
          <span class="tech-eco-name">${c.title}</span>
        </div>
        <p class="tech-eco-desc">${c.description || 'Curriculum notes, practice labs, and study material.'}</p>
        <div style="margin-top:10px; display:flex; align-items:center; gap:8px;">
          <span class="badge" style="font-size:0.75rem;">${c.category || 'Technology'}</span>
          <span style="font-size:0.8rem; color:var(--text-muted);">${c.progress || 'Completed'}</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // 11. Initialization Entrypoint
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initHeroCanvas();
    renderProjects('all');
    initProjectFilters();
    initCaseStudyModal();
    fetchGitHubData();
    initContactForm();
    loadCloudContent();

    // Language switcher toggle
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'ne' : 'en';
        applyLanguage(nextLang);
      });
    }

    // Apply saved language
    applyLanguage(currentLang);

    // Dynamic current year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  });

})();
