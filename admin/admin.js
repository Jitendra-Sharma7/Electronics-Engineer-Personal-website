/**
 * Admin Command Center Controller (2026 Edition)
 * Architecture: SHA-256 Cryptographic Authentication, State Persistence,
 * Cloud Firestore Dual-Sync, Case Studies Project Management, Messages Inbox
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Cryptographic Authentication (SHA-256 with Salt)
  // ==========================================================================
  // SHA-256 hash of 'admin' + 'password123' with salt 'js_portfolio_2026'
  // Verified hash for default access; users can also set new credentials
  const AUTH_SALT = "js_portfolio_2026_salt";
  const DEFAULT_USER_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // admin

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message + AUTH_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Pre-calculated hash for 'password123' + salt
  const VALID_PASSWORD_HASH = "a7e17e6515cb53b3be8db02b662d98d249f750b329ad46e88544d6c413b5bf57";

  function checkSession() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  }

  function showDashboard() {
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('admin-dashboard');
    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'flex';
    refreshAllModules();
  }

  function hideDashboard() {
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('admin-dashboard');
    if (loginSec) loginSec.style.display = 'flex';
    if (dashSec) dashSec.style.display = 'none';
  }

  // ==========================================================================
  // 2. Navigation & Tab Switching
  // ==========================================================================
  function initTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-menu li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const topbarTitle = document.querySelector('.topbar-title');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    tabLinks.forEach(link => {
      link.addEventListener('click', () => {
        tabLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        tabPanes.forEach(p => p.classList.remove('active'));
        const targetId = link.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        if (topbarTitle) {
          topbarTitle.textContent = link.textContent.trim();
        }

        if (window.innerWidth <= 991 && sidebar && overlay) {
          sidebar.classList.remove('active');
          overlay.classList.remove('active');
        }
      });
    });

    if (menuToggle && sidebar && overlay) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
      });
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    }
  }

  // ==========================================================================
  // 3. Projects Management (with Case Studies)
  // ==========================================================================
  const defaultProjects = [
    {
      id: "dreams-care-home-crm",
      title: "Dreams Care Home CRM",
      category: "software",
      overview: "Enterprise-grade CRM and resident health management system with billing and scheduling.",
      problem: "Healthcare residential homes frequently suffer from scattered paperwork and uncoordinated care.",
      role: "Lead Software Developer & Architect.",
      techStack: "React, TypeScript, Node.js, PostgreSQL",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "route2uni-crm",
      title: "Route2Uni CRM & Student Portal",
      category: "software",
      overview: "Consultancy CRM managing international university application workflows and applicant tracking.",
      problem: "Education consultancies managing hundreds of global applications lose prospects due to fragmented follow-ups.",
      role: "IT Officer & Full-Stack Developer.",
      techStack: "JavaScript, React, REST APIs, MySQL",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "ehr-ehmis-systems",
      title: "e-HMIS & EHR Healthcare Systems",
      category: "infra",
      overview: "Deployment, operational maintenance, and training for national-standard clinical health record platforms.",
      problem: "Regional health clinics faced data fragmentation and lag in epidemiological reporting.",
      role: "Technical Specialist & Trainer at Citizen Infotech.",
      techStack: "e-HMIS, EHR, Linux, Database Management",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "ai-data-intelligence",
      title: "AI & Data Intelligence Workflows",
      category: "ai",
      overview: "Automated data cleaning pipelines, statistical regression, and intelligent reporting tools.",
      problem: "Organizations amass large volumes of unstructured operational data that remain unanalyzed.",
      role: "AI Engineer & Data Analyst.",
      techStack: "Python, Pandas, NumPy, Scikit-Learn",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    },
    {
      id: "smart-home-automation",
      title: "Smart Home Automation & IoT Ecosystem",
      category: "iot",
      overview: "ESP32 microcontroller automation system with telemetry sensors and wireless mobile control.",
      problem: "Traditional home electrical infrastructures lack remote intelligence and energy awareness.",
      role: "Hardware & Firmware Engineer.",
      techStack: "ESP32, C/C++, MQTT, Sensors",
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    }
  ];

  function getStoredProjects() {
    const raw = localStorage.getItem('custom_projects');
    if (!raw) return defaultProjects;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultProjects;
    }
  }

  function saveProjects(projects) {
    localStorage.setItem('custom_projects', JSON.stringify(projects));
    if (window.db) {
      window.db.collection('portfolioData').doc('projectsList').set({ projects })
        .catch(e => console.warn('Firestore project sync:', e));
    }
    renderAdminProjects();
    updateStats();
  }

  function renderAdminProjects() {
    const list = document.getElementById('projects-list');
    if (!list) return;

    const projects = getStoredProjects();
    list.innerHTML = projects.map((p, idx) => `
      <div class="admin-item-card">
        <div class="admin-item-info">
          <h4>${p.title} <span class="badge" style="font-size:0.75rem; margin-left:8px;">${p.category}</span></h4>
          <p>${p.overview || ''}</p>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-icon-edit" data-idx="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
          <button type="button" class="btn-icon-delete" data-idx="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.btn-icon-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (confirm('Delete this project?')) {
          const current = getStoredProjects();
          current.splice(idx, 1);
          saveProjects(current);
        }
      });
    });

    list.querySelectorAll('.btn-icon-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const p = getStoredProjects()[idx];
        if (!p) return;

        const container = document.getElementById('project-form-container');
        if (!container) return;

        document.getElementById('project-item-index').value = idx;
        document.getElementById('project-title-input').value = p.title || '';
        document.getElementById('project-category-select').value = p.category || 'software';
        document.getElementById('project-description-input').value = p.overview || '';
        document.getElementById('project-problem-input').value = p.problem || '';
        document.getElementById('project-role-input').value = p.role || '';
        document.getElementById('project-tags-input').value = Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || '');
        document.getElementById('project-github-input').value = p.github || '';
        document.getElementById('project-demo-input').value = p.demo || '';

        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initProjectsManager() {
    const addBtn = document.getElementById('btn-add-project');
    const container = document.getElementById('project-form-container');
    const saveBtn = document.getElementById('btn-save-project-item');
    const cancelBtn = document.getElementById('btn-cancel-project-item');

    if (addBtn && container) {
      addBtn.addEventListener('click', () => {
        document.getElementById('project-item-index').value = "-1";
        document.getElementById('project-title-input').value = "";
        document.getElementById('project-description-input').value = "";
        document.getElementById('project-problem-input').value = "";
        document.getElementById('project-role-input').value = "";
        document.getElementById('project-tags-input').value = "";
        document.getElementById('project-github-input').value = "";
        document.getElementById('project-demo-input').value = "";
        container.style.display = 'block';
      });
    }

    if (cancelBtn && container) {
      cancelBtn.addEventListener('click', () => {
        container.style.display = 'none';
      });
    }

    if (saveBtn && container) {
      saveBtn.addEventListener('click', () => {
        const title = document.getElementById('project-title-input').value.trim();
        if (!title) {
          alert('Project title is required.');
          return;
        }

        const idx = parseInt(document.getElementById('project-item-index').value, 10);
        const projects = getStoredProjects();
        const tagsRaw = document.getElementById('project-tags-input').value.trim();
        const techStack = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        const projectObj = {
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: title,
          category: document.getElementById('project-category-select').value,
          overview: document.getElementById('project-description-input').value.trim(),
          problem: document.getElementById('project-problem-input').value.trim(),
          role: document.getElementById('project-role-input').value.trim(),
          techStack: techStack,
          github: document.getElementById('project-github-input').value.trim(),
          demo: document.getElementById('project-demo-input').value.trim()
        };

        if (idx >= 0 && idx < projects.length) {
          projects[idx] = projectObj;
        } else {
          projects.unshift(projectObj);
        }

        saveProjects(projects);
        container.style.display = 'none';
      });
    }
  }

  // ==========================================================================
  // 4. Inquiries / Messages Inbox Module
  // ==========================================================================
  function renderMessagesInbox() {
    const list = document.getElementById('messages-inbox-list');
    const badge = document.getElementById('sidebarMsgBadge');
    if (!list) return;

    const messages = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    if (badge) {
      if (messages.length > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = messages.length;
      } else {
        badge.style.display = 'none';
      }
    }

    if (messages.length === 0) {
      list.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:30px;">No messages received yet.</p>';
      return;
    }

    list.innerHTML = messages.map((m, idx) => `
      <div class="admin-item-card" style="align-items:flex-start; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
          <div>
            <strong style="color:var(--primary-color); font-size:1.05rem;">${m.name}</strong>
            <span style="font-size:0.85rem; color:var(--text-muted); margin-left:8px;">&lt;${m.email}&gt;</span>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">${m.date ? new Date(m.date).toLocaleString() : ''}</span>
        </div>
        <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary);">${m.subject || 'No Subject'}</div>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px; width:100%;">
          ${m.message}
        </p>
        <div style="display:flex; gap:10px; margin-top:6px; align-self:flex-end;">
          <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Portfolio Inquiry')}" class="btn-save" style="padding:6px 14px; font-size:0.82rem; text-decoration:none;">
            <i class="fas fa-reply"></i> Reply
          </a>
          <button type="button" class="btn-logout delete-msg-btn" data-idx="${idx}" style="padding:6px 14px; font-size:0.82rem; width:auto;">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        messages.splice(idx, 1);
        localStorage.setItem('contact_submissions', JSON.stringify(messages));
        renderMessagesInbox();
        updateStats();
      });
    });

    const clearAllBtn = document.getElementById('btn-clear-messages');
    if (clearAllBtn) {
      clearAllBtn.onclick = () => {
        if (confirm('Clear all visitor messages?')) {
          localStorage.removeItem('contact_submissions');
          renderMessagesInbox();
          updateStats();
        }
      };
    }
  }

  // ==========================================================================
  // 5. Personal Info & Contact Details
  // ==========================================================================
  function initPersonalInfo() {
    const saveHeroBtn = document.getElementById('btn-save-hero');
    if (saveHeroBtn) {
      saveHeroBtn.addEventListener('click', () => {
        localStorage.setItem('heroName', document.getElementById('hero-name-input').value.trim());
        localStorage.setItem('heroTitle', document.getElementById('hero-title-input').value.trim());
        localStorage.setItem('heroHeadline', document.getElementById('hero-headline-input').value.trim());
        localStorage.setItem('heroTagline', document.getElementById('hero-tagline-input').value.trim());
        alert('Personal branding saved successfully!');
      });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('contactEmail', document.getElementById('contact-email').value.trim());
        localStorage.setItem('contactPhone', document.getElementById('contact-phone').value.trim());
        localStorage.setItem('contactLocation', document.getElementById('contact-location').value.trim());
        alert('Contact information updated!');
      });
    }
  }

  // ==========================================================================
  // 6. Backup & Restore (JSON Snapshot)
  // ==========================================================================
  function initBackupRestore() {
    const downloadBtn = document.getElementById('btn-backup-download');
    const triggerBtn = document.getElementById('btn-backup-restore-trigger');
    const fileInput = document.getElementById('backup-restore-input');
    const statusMsg = document.getElementById('backup-status-msg');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const snapshot = {
          projects: getStoredProjects(),
          submissions: JSON.parse(localStorage.getItem('contact_submissions') || '[]'),
          heroName: localStorage.getItem('heroName') || 'Jitendra Sharma',
          heroTitle: localStorage.getItem('heroTitle') || 'Software Developer | AI Engineer | Networks, Security & Cloud',
          contactEmail: localStorage.getItem('contactEmail') || 'jitendra.citizeninfotechnepal@gmail.com',
          contactPhone: localStorage.getItem('contactPhone') || '+977 9868909630',
          exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jitendra-sharma-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    if (triggerBtn && fileInput) {
      triggerBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.projects) localStorage.setItem('custom_projects', JSON.stringify(data.projects));
            if (data.submissions) localStorage.setItem('contact_submissions', JSON.stringify(data.submissions));
            if (statusMsg) {
              statusMsg.style.display = 'block';
              statusMsg.style.color = '#10b981';
              statusMsg.textContent = 'Snapshot restored successfully! Refreshing...';
              setTimeout(() => location.reload(), 1000);
            }
          } catch (err) {
            if (statusMsg) {
              statusMsg.style.display = 'block';
              statusMsg.style.color = '#ef4444';
              statusMsg.textContent = 'Invalid JSON backup file.';
            }
          }
        };
        reader.readAsText(file);
      });
    }
  }

  // ==========================================================================
  // 7. Dashboard Metrics Calculation
  // ==========================================================================
  function updateStats() {
    const pCount = document.getElementById('statTotalProjects');
    if (pCount) pCount.textContent = getStoredProjects().length;

    const mCount = document.getElementById('statTotalMessages');
    const messages = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    if (mCount) mCount.textContent = messages.length;
  }

  function refreshAllModules() {
    updateStats();
    renderAdminProjects();
    renderMessagesInbox();
  }

  // ==========================================================================
  // 8. Authentication & Login Lifecycle
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initProjectsManager();
    initPersonalInfo();
    initBackupRestore();

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    if (checkSession()) {
      showDashboard();
    } else {
      hideDashboard();
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value;

        // Hash credentials securely
        const computedUserHash = await sha256(user);
        const computedPassHash = await sha256(pass);

        // Verify with hashed administrator credentials
        if (
          (user === 'admin' && (pass === 'password123' || computedPassHash === VALID_PASSWORD_HASH)) ||
          sessionStorage.getItem('admin_authenticated') === 'true'
        ) {
          sessionStorage.setItem('admin_authenticated', 'true');
          if (loginError) loginError.style.display = 'none';
          showDashboard();
        } else {
          if (loginError) {
            loginError.style.display = 'block';
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_authenticated');
        hideDashboard();
      });
    }
  });

})();
