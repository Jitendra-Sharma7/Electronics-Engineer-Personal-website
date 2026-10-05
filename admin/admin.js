/**
 * Admin Command Center Controller (2026 Edition)
 * Architecture: SHA-256 Cryptographic Authentication, declarative CRUD
 * collections, dual persistence (localStorage + Cloud Firestore), Projects
 * case-study management, and a Messages inbox.
 *
 * Every editable collection is described once in COLLECTIONS below. The engine
 * renders the list, wires Add / Edit / Delete, and persists changes twice:
 *   1. localStorage  -> instant, survives reloads in this browser
 *   2. Firestore     -> shared with the public site and every other device
 * Public site readers (script.js) prefer localStorage, then Firestore, then the
 * built-in defaults in site-defaults.js.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Cryptographic Authentication (SHA-256 with Salt)
  // ==========================================================================
  // Credentials are never stored in plain text: the login form hashes
  // "<value> + AUTH_SALT" and compares it with the two hashes below.
  //
  // To change the administrator username or password, regenerate the hashes
  // with the same salt and paste them here:
  //
  //   node -e "const c=require('crypto');const s='js_portfolio_2026_salt';
  //     const h=v=>c.createHash('sha256').update(v+s,'utf8').digest('hex');
  //     console.log('user:',h('NEW_USERNAME'),'\npass:',h('NEW_PASSWORD'));"
  //
  // Remember to bump AUTH_SALT as well if you want old hashes invalidated.
  const AUTH_SALT = "js_portfolio_2026_salt";

  // SHA-256('jitendra.route2uni@gmail.com' + AUTH_SALT)
  const VALID_USER_HASH = "b3fb3807dc67a0cdb639613d2e6df041af63bf2260cd66434a0e2f6638e46971";

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message + AUTH_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // SHA-256('Jitendra@83' + AUTH_SALT)
  const VALID_PASSWORD_HASH = "f6c5f593d976942639afb36863269ec2c6e289211ba129b92d1a3eb7b6e204f5";

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
  // 2. Small DOM / data helpers
  // ==========================================================================
  const $ = id => document.getElementById(id);

  function esc(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slug(value, fallback) {
    const s = String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s || fallback;
  }

  function makeId(prefix, seed) {
    return `${prefix}-${slug(seed, 'item')}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function splitTags(raw) {
    if (Array.isArray(raw)) return raw.map(t => String(t).trim()).filter(Boolean);
    return String(raw || '').split(',').map(t => t.trim()).filter(Boolean);
  }

  let toastTimer = null;

  function toast(message, type = 'success') {
    const el = $('admin-toast');
    if (!el) return;
    el.textContent = message;
    el.className = `admin-toast show ${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.className = 'admin-toast';
    }, 3200);
  }

  function confirmDelete(label) {
    return window.confirm(`Delete this ${label}? This change is saved permanently.`);
  }

  // ==========================================================================
  // 3. Dual persistence layer (localStorage + Cloud Firestore)
  // ==========================================================================
  const DEFAULTS = window.PORTFOLIO_DEFAULTS || {};

  // storageKey -> Firestore document + field names
  const CLOUD_MAP = {
    custom_projects: { doc: 'projectsList', field: 'projects' },
    experience_items: { doc: 'experienceItems', field: 'items' },
    skill_pillars: { doc: 'skillPillars', field: 'pillars' },
    certification_items: { doc: 'certifications', field: 'items' },
    education_items: { doc: 'educationItems', field: 'items' },
    blog_items: { doc: 'blogItems', field: 'items' },
    learning_items: { doc: 'learningCourses', field: 'courses' }
  };

  function defaultsFor(key, fallback) {
    if (Array.isArray(fallback)) return clone(fallback);
    if (Array.isArray(DEFAULTS[key])) return clone(DEFAULTS[key]);
    return [];
  }

  function readItems(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultsFor(key, fallback);
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaultsFor(key, fallback);
    } catch (e) {
      console.warn(`Corrupt local record for ${key}; using defaults.`, e);
      return defaultsFor(key, fallback);
    }
  }

  function hasLocalRecord(key) {
    return localStorage.getItem(key) !== null;
  }

  function serverTimestamp() {
    try {
      return firebase.firestore.FieldValue.serverTimestamp();
    } catch (e) {
      return new Date().toISOString();
    }
  }

  /**
   * Mirror a collection to Firestore. Resolves to true when the cloud write
   * succeeded (or was not required); never throws so saving always works
   * offline via localStorage.
   */
  function syncToCloud(key, items) {
    const map = CLOUD_MAP[key];
    if (!map || !window.db) return Promise.resolve(false);

    const payload = { [map.field]: items, updatedAt: serverTimestamp() };

    return window.db.collection('portfolioData').doc(map.doc).set(payload)
      .then(() => true)
      .catch(err => {
        console.warn(`Firestore sync failed for ${map.doc}:`, err);
        return false;
      });
  }

  function persist(key, items, options = {}) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      toast('Browser storage is full — changes could not be cached locally.', 'error');
      console.warn('localStorage write failed:', e);
    }

    return syncToCloud(key, items).then(cloudOk => {
      if (!cloudOk && CLOUD_MAP[key]) {
        toast('Saved in this browser only. Cloud sync unavailable (check Firestore rules).', 'warning');
      } else if (options.successMessage) {
        toast(options.successMessage, 'success');
      }
      return cloudOk;
    });
  }

  /** Pull one collection from Firestore (used for cross-device hydration). */
  function fetchFromCloud(key) {
    const map = CLOUD_MAP[key];
    if (!map || !window.db) return Promise.resolve(null);

    return window.db.collection('portfolioData').doc(map.doc).get()
      .then(doc => {
        if (!doc.exists) return null;
        const value = doc.data()[map.field];
        return Array.isArray(value) ? value : null;
      })
      .catch(err => {
        console.warn(`Firestore read failed for ${map.doc}:`, err);
        return null;
      });
  }

  /**
   * Fill in collections this browser has never seen (saved from another device).
   * Local records always win unless `force` is set by the manual cloud refresh.
   */
  function hydrateFromCloud(force = false) {
    const keys = Object.keys(CLOUD_MAP);
    if (!window.db) return Promise.resolve(0);

    return Promise.all(keys.map(key => {
      if (!force && hasLocalRecord(key)) return Promise.resolve(0);
      return fetchFromCloud(key).then(cloud => {
        if (!cloud) return 0;
        try {
          localStorage.setItem(key, JSON.stringify(cloud));
        } catch (e) {
          console.warn('Could not cache cloud record:', e);
        }
        return 1;
      });
    })).then(results => results.reduce((a, b) => a + b, 0));
  }

  // ==========================================================================
  // 4. Declarative CRUD engine
  // ==========================================================================
  const collections = {};

  /**
   * @param {object} cfg
   *  key        localStorage key (must exist in CLOUD_MAP to sync)
   *  label      human label used in confirmations/toasts
   *  listId     container that receives the item cards
   *  formId     collapsible editor container
   *  addBtnId / saveBtnId / cancelBtnId / indexId / titleId
   *  idPrefix   prefix for generated record ids
   *  fields     [{ el, prop, type: 'text'|'tags', required }]
   *  fallback   optional default dataset
   *  summary(item) -> { title, badges:[], subtitle, meta:[] }
   *  normalize(item) optional post-processing before save
   */
  function registerCollection(cfg) {
    collections[cfg.key] = cfg;
    initCollection(cfg);
  }

  function initCollection(cfg) {
    const addBtn = $(cfg.addBtnId);
    const form = $(cfg.formId);
    const saveBtn = $(cfg.saveBtnId);
    const cancelBtn = $(cfg.cancelBtnId);

    if (addBtn && form) {
      addBtn.addEventListener('click', () => openEditor(cfg, -1));
    }
    if (cancelBtn && form) {
      cancelBtn.addEventListener('click', () => closeEditor(cfg));
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', () => saveFromEditor(cfg));
    }
    if (form) {
      form.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'hidden') return;
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter' && input.tagName !== 'TEXTAREA' && input.tagName !== 'SELECT') {
            e.preventDefault();
            saveFromEditor(cfg);
          }
        });
      });
    }
  }

  function scrollToForm(form) {
    if (form && typeof form.scrollIntoView === 'function') {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openEditor(cfg, index) {
    const form = $(cfg.formId);
    if (!form) return;

    const items = readItems(cfg.key, cfg.fallback);
    const item = index >= 0 ? items[index] : null;

    if (cfg.beforeOpen) cfg.beforeOpen(cfg, index);

    if ($(cfg.indexId)) $(cfg.indexId).value = index;
    if ($(cfg.titleId)) {
      $(cfg.titleId).textContent = item
        ? `Edit ${cfg.label}`
        : `Add ${cfg.label}`;
    }

    cfg.fields.forEach(f => {
      const input = $(f.el);
      if (!input) return;
      if (f.type === 'tags') {
        const raw = item ? item[f.prop] : '';
        input.value = Array.isArray(raw) ? raw.join(', ') : (raw || '');
      } else {
        input.value = item && item[f.prop] !== undefined ? item[f.prop] : '';
      }
    });

    form.style.display = 'block';
    scrollToForm(form);

    const first = cfg.fields.map(f => $(f.el)).find(el => el && el.type !== 'hidden');
    if (first) setTimeout(() => first.focus(), 120);
  }

  function closeEditor(cfg) {
    const form = $(cfg.formId);
    if (!form) return;
    form.style.display = 'none';
    if ($(cfg.indexId)) $(cfg.indexId).value = '-1';
  }

  function readEditorValues(cfg, items, index) {
    const record = {};

    cfg.fields.forEach(f => {
      const input = $(f.el);
      if (!input) return;
      let value = input.value;
      if (f.type === 'tags') {
        record[f.prop] = splitTags(value);
      } else if (f.type === 'number') {
        record[f.prop] = Number(value) || 0;
      } else {
        record[f.prop] = value.trim();
      }
    });

    const existing = index >= 0 ? items[index] : null;
    const seed = record[cfg.titleProp || cfg.fields[0].prop] || (existing && existing[cfg.fields[0].prop]) || 'item';
    record.id = existing && existing.id ? existing.id : makeId(cfg.idPrefix, seed);

    if (cfg.normalize) cfg.normalize(record, existing);
    return record;
  }

  function saveFromEditor(cfg) {
    const items = readItems(cfg.key, cfg.fallback);
    const indexField = $(cfg.indexId);
    const index = indexField ? parseInt(indexField.value, 10) : -1;

    const missing = cfg.fields
      .filter(f => f.required)
      .find(f => {
        const input = $(f.el);
        return input && !input.value.trim();
      });

    if (missing) {
      const input = $(missing.el);
      toast(`${labelForField(missing.prop)} is required.`, 'error');
      if (input) input.focus();
      return;
    }

    const record = readEditorValues(cfg, items, index);

    if (index >= 0 && index < items.length) {
      items[index] = record;
    } else {
      items.unshift(record);
    }

    // Persist first so the re-render below reads the new records back.
    persist(cfg.key, items, { successMessage: `${cfg.label} ${index >= 0 ? 'updated' : 'added'}.` });

    renderCollection(cfg);
    updateStats();
    closeEditor(cfg);
  }

  function labelForField(prop) {
    const names = {
      role: 'Position title', duration: 'Duration', company: 'Company',
      title: 'Title', name: 'Name', issuer: 'Issuing organization',
      institution: 'Institution', degree: 'Degree', content: 'Content'
    };
    return names[prop] || 'This field';
  }

  function renderCollection(cfg) {
    const list = $(cfg.listId);
    if (!list) return;

    const items = readItems(cfg.key, cfg.fallback);

    if (items.length === 0) {
      list.innerHTML = `<p class="admin-empty-note">No ${cfg.label.toLowerCase()} entries yet. Use the “Add” button to create your first record.</p>`;
      return;
    }

    list.innerHTML = items.map((item, idx) => {
      const view = cfg.summary(item);
      const badges = (view.badges || []).filter(Boolean)
        .map(b => `<span class="item-tag">${esc(b)}</span>`).join('');
      const meta = (view.meta || []).filter(Boolean)
        .map(m => `<span class="item-meta">${esc(m)}</span>`).join('');

      return `
        <div class="admin-item-card">
          <div class="admin-item-info">
            <h4>${esc(view.title)}${(view.badge) ? ` <span class="badge" style="font-size:0.75rem; margin-left:8px;">${esc(view.badge)}</span>` : ''}</h4>
            ${view.subtitle ? `<p>${esc(view.subtitle)}</p>` : ''}
            ${(badges || meta) ? `<div class="admin-item-tags">${badges}${meta}</div>` : ''}
          </div>
          <div class="admin-item-actions">
            <button type="button" class="btn-icon-edit" data-edit="${idx}" title="Edit"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn-icon-delete" data-delete="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openEditor(cfg, parseInt(btn.getAttribute('data-edit'), 10)));
    });

    list.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-delete'), 10);
        if (!confirmDelete(cfg.label.toLowerCase())) return;
        const current = readItems(cfg.key, cfg.fallback);
        if (idx < 0 || idx >= current.length) return;
        current.splice(idx, 1);
        persist(cfg.key, current, { successMessage: `${cfg.label} deleted.` });
        renderCollection(cfg);
        updateStats();
      });
    });
  }

  // ==========================================================================
  // 5. Collection registrations
  // ==========================================================================
  // Fallback dataset for Projects (the richer public dataset lives in script.js
  // and is only replaced once the admin saves from this panel).
  const defaultProjects = [
    {
      id: "dreams-care-home-crm",
      title: "Dreams Care Home CRM",
      category: "software",
      overview: "Enterprise-grade CRM and resident health management system with billing and scheduling.",
      problem: "Healthcare residential homes frequently suffer from scattered paperwork and uncoordinated care.",
      role: "Lead Software Developer & Architect.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
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
      techStack: ["JavaScript", "React", "REST APIs", "MySQL"],
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
      techStack: ["e-HMIS", "EHR", "Linux", "Database Management"],
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
      techStack: ["Python", "Pandas", "NumPy", "Scikit-Learn"],
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
      techStack: ["ESP32", "C/C++", "MQTT", "Sensors"],
      github: "https://github.com/Jitendra83-coder",
      demo: "https://www.jitendra-sharma.com.np/"
    }
  ];

  function registerAllCollections() {
    registerCollection({
      key: 'experience_items',
      label: 'Experience',
      listId: 'experience-list',
      formId: 'experience-form-container',
      addBtnId: 'btn-add-experience',
      saveBtnId: 'btn-save-experience-item',
      cancelBtnId: 'btn-cancel-experience-item',
      indexId: 'experience-item-index',
      titleId: 'experience-form-title',
      idPrefix: 'exp',
      titleProp: 'role',
      fields: [
        { el: 'experience-title-input', prop: 'role', required: true },
        { el: 'experience-duration-input', prop: 'duration', required: true },
        { el: 'experience-company-input', prop: 'company', required: true },
        { el: 'experience-description-input', prop: 'description' },
        { el: 'experience-tags-input', prop: 'tags', type: 'tags' },
        { el: 'experience-icon-input', prop: 'icon' }
      ],
      normalize(record) {
        if (!record.icon) record.icon = 'fas fa-building';
      },
      summary(item) {
        return {
          title: item.role,
          subtitle: `${item.company || ''}${item.duration ? ' · ' + item.duration : ''}`,
          badges: Array.isArray(item.tags) ? item.tags : splitTags(item.tags)
        };
      }
    });

    registerCollection({
      key: 'certification_items',
      label: 'Certificate',
      listId: 'certificates-list',
      formId: 'certificate-form-container',
      addBtnId: 'btn-add-certificate',
      saveBtnId: 'btn-save-certificate-item',
      cancelBtnId: 'btn-cancel-certificate-item',
      indexId: 'certificate-item-index',
      titleId: 'certificate-form-title',
      idPrefix: 'cert',
      titleProp: 'name',
      fields: [
        { el: 'certificate-name-input', prop: 'name', required: true },
        { el: 'certificate-issuer-input', prop: 'issuer', required: true },
        { el: 'certificate-category-input', prop: 'category' },
        { el: 'certificate-year-input', prop: 'year' },
        { el: 'certificate-status-select', prop: 'status' },
        { el: 'certificate-link-input', prop: 'link' }
      ],
      normalize(record) {
        if (!record.status) record.status = 'Active';
        if (!record.category) record.category = 'General';
      },
      summary(item) {
        return {
          title: item.name,
          badge: item.category,
          subtitle: item.issuer,
          meta: [item.year, item.status]
        };
      }
    });

    registerCollection({
      key: 'education_items',
      label: 'Qualification',
      listId: 'education-list',
      formId: 'education-form-container',
      addBtnId: 'btn-add-education',
      saveBtnId: 'btn-save-education-item',
      cancelBtnId: 'btn-cancel-education-item',
      indexId: 'education-item-index',
      titleId: 'education-form-title',
      idPrefix: 'edu',
      titleProp: 'degree',
      fields: [
        { el: 'education-degree-input', prop: 'degree', required: true },
        { el: 'education-level-input', prop: 'level' },
        { el: 'education-institution-input', prop: 'institution', required: true },
        { el: 'education-period-input', prop: 'period' },
        { el: 'education-description-input', prop: 'description' },
        { el: 'education-icon-input', prop: 'icon' },
        { el: 'education-accent-select', prop: 'accent' }
      ],
      normalize(record) {
        if (!record.icon) record.icon = 'fas fa-graduation-cap';
        if (!record.accent) record.accent = 'primary';
      },
      summary(item) {
        return {
          title: item.degree,
          badge: item.level,
          subtitle: item.institution,
          meta: [item.period]
        };
      }
    });

    registerCollection({
      key: 'blog_items',
      label: 'Article',
      listId: 'blog-list',
      formId: 'blog-form-container',
      addBtnId: 'btn-add-blog-post',
      saveBtnId: 'btn-save-blog-item',
      cancelBtnId: 'btn-cancel-blog-item',
      indexId: 'blog-item-index',
      titleId: 'blog-form-title',
      idPrefix: 'post',
      titleProp: 'title',
      fields: [
        { el: 'blog-title-input', prop: 'title', required: true },
        { el: 'blog-category-input', prop: 'category' },
        { el: 'blog-date-input', prop: 'date' },
        { el: 'blog-readtime-input', prop: 'readTime' },
        { el: 'blog-excerpt-input', prop: 'excerpt' },
        { el: 'blog-content-input', prop: 'content' }
      ],
      normalize(record) {
        if (!record.date) record.date = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        if (!record.readTime) record.readTime = estimateReadTime(record.content);
        if (!record.category) record.category = 'Engineering';
        record.updatedAt = new Date().toISOString();
      },
      summary(item) {
        const preview = (item.excerpt || item.content || '').slice(0, 140);
        return {
          title: item.title,
          badge: item.category,
          subtitle: preview,
          meta: [item.date, item.readTime]
        };
      }
    });

    registerCollection({
      key: 'learning_items',
      label: 'Learning Topic',
      listId: 'learning-list',
      formId: 'learning-form-container',
      addBtnId: 'btn-add-learning',
      saveBtnId: 'btn-save-learning-item',
      cancelBtnId: 'btn-cancel-learning-item',
      indexId: 'learning-item-index',
      titleId: 'learning-form-title',
      idPrefix: 'learn',
      titleProp: 'title',
      fields: [
        { el: 'learning-title-input', prop: 'title', required: true },
        { el: 'learning-category-input', prop: 'category' },
        { el: 'learning-progress-select', prop: 'progress' },
        { el: 'learning-icon-input', prop: 'icon' },
        { el: 'learning-description-input', prop: 'description' },
        { el: 'learning-link-input', prop: 'link' }
      ],
      normalize(record) {
        if (!record.icon) record.icon = 'fas fa-graduation-cap';
        if (!record.progress) record.progress = 'Active Study';
        if (!record.category) record.category = 'Technology';
      },
      summary(item) {
        return {
          title: item.title,
          badge: item.category,
          subtitle: item.description,
          meta: [item.progress]
        };
      }
    });

    registerCollection({
      key: 'custom_projects',
      label: 'Project',
      fallback: defaultProjects,
      listId: 'projects-list',
      formId: 'project-form-container',
      addBtnId: 'btn-add-project',
      saveBtnId: 'btn-save-project-item',
      cancelBtnId: 'btn-cancel-project-item',
      indexId: 'project-item-index',
      titleId: 'project-form-title',
      idPrefix: 'project',
      titleProp: 'title',
      fields: [
        { el: 'project-title-input', prop: 'title', required: true },
        { el: 'project-category-select', prop: 'category' },
        { el: 'project-description-input', prop: 'overview' },
        { el: 'project-problem-input', prop: 'problem' },
        { el: 'project-role-input', prop: 'role' },
        { el: 'project-tags-input', prop: 'techStack', type: 'tags' },
        { el: 'project-github-input', prop: 'github' },
        { el: 'project-demo-input', prop: 'demo' }
      ],
      normalize(record) {
        if (!record.category) record.category = 'software';
      },
      summary(item) {
        return {
          title: item.title,
          badge: item.category,
          subtitle: item.overview,
          badges: Array.isArray(item.techStack) ? item.techStack : splitTags(item.techStack)
        };
      }
    });
  }

  function estimateReadTime(content) {
    const words = String(content || '').trim().split(/\s+/).filter(Boolean).length;
    if (!words) return '1 min read';
    return `${Math.max(1, Math.round(words / 200))} min read`;
  }

  // ==========================================================================
  // 6. Skills Ecosystem (nested pillars -> skills)
  // ==========================================================================
  function readPillars() {
    return readItems('skill_pillars');
  }

  function refreshPillarSelect(selectedId) {
    const select = $('skill-pillar-select');
    if (!select) return;
    const pillars = readPillars();
    select.innerHTML = '<option value="">-- Select a pillar --</option>' +
      pillars.map(p => `<option value="${esc(p.id)}"${p.id === selectedId ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  }

  function renderSkillsAdmin() {
    const list = $('skills-list');
    if (!list) return;

    const pillars = readPillars();

    if (pillars.length === 0) {
      list.innerHTML = '<p class="admin-empty-note">No skill pillars yet. Add a pillar (for example “Software Development”) and then attach skills to it.</p>';
      return;
    }

    list.innerHTML = pillars.map((pillar, pIdx) => {
      const skills = Array.isArray(pillar.skills) ? pillar.skills : [];
      const skillRows = skills.length
        ? skills.map((s, sIdx) => `
            <div class="skill-row">
              <div class="skill-row-icon"><i class="${esc(s.icon || 'fas fa-code')}"></i></div>
              <div class="skill-row-body">
                <strong>${esc(s.name)}</strong>
                <span>${esc(s.description || '')}</span>
              </div>
              <div class="admin-item-actions">
                <button type="button" class="btn-icon-edit" data-skill-edit="${pIdx}:${sIdx}" title="Edit"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn-icon-delete" data-skill-delete="${pIdx}:${sIdx}" title="Delete"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          `).join('')
        : '<p class="admin-empty-note" style="padding:12px;">No skills in this pillar yet.</p>';

      return `
        <div class="admin-item-card skill-pillar-card">
          <div class="admin-item-info">
            <h4><i class="${esc(pillar.icon || 'fas fa-layer-group')}" style="color:var(--primary-color); margin-right:8px;"></i>${esc(pillar.name)}
              <span class="badge" style="font-size:0.75rem; margin-left:8px;">${skills.length} skill${skills.length === 1 ? '' : 's'}</span>
            </h4>
            <div class="skill-subgrid">${skillRows}</div>
          </div>
          <div class="admin-item-actions" style="flex-direction:column; gap:8px;">
            <button type="button" class="btn-add" data-skill-add-to="${pIdx}" style="padding:7px 12px; font-size:0.8rem;"><i class="fas fa-plus"></i> Skill</button>
            <button type="button" class="btn-icon-edit" data-pillar-edit="${pIdx}" title="Edit pillar"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn-icon-delete" data-pillar-delete="${pIdx}" title="Delete pillar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-pillar-edit]').forEach(btn => {
      btn.addEventListener('click', () => openPillarEditor(parseInt(btn.getAttribute('data-pillar-edit'), 10)));
    });

    list.querySelectorAll('[data-pillar-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-pillar-delete'), 10);
        const pillarsNow = readPillars();
        const pillar = pillarsNow[idx];
        if (!pillar) return;
        if (!window.confirm(`Delete the “${pillar.name}” pillar and its ${(pillar.skills || []).length} skill(s)?`)) return;
        pillarsNow.splice(idx, 1);
        persist('skill_pillars', pillarsNow, { successMessage: 'Skill pillar deleted.' });
        renderSkillsAdmin();
        refreshPillarSelect();
      });
    });

    list.querySelectorAll('[data-skill-add-to]').forEach(btn => {
      btn.addEventListener('click', () => openSkillEditor(-1, readPillars()[parseInt(btn.getAttribute('data-skill-add-to'), 10)]?.id || ''));
    });

    list.querySelectorAll('[data-skill-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [pIdx, sIdx] = btn.getAttribute('data-skill-edit').split(':').map(Number);
        openSkillEditor(sIdx, readPillars()[pIdx]?.id || '');
      });
    });

    list.querySelectorAll('[data-skill-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [pIdx, sIdx] = btn.getAttribute('data-skill-delete').split(':').map(Number);
        const pillarsNow = readPillars();
        const pillar = pillarsNow[pIdx];
        const skill = pillar && (pillar.skills || [])[sIdx];
        if (!skill) return;
        if (!window.confirm(`Delete the skill “${skill.name}”?`)) return;
        pillar.skills.splice(sIdx, 1);
        persist('skill_pillars', pillarsNow, { successMessage: 'Skill deleted.' });
        renderSkillsAdmin();
      });
    });
  }

  function openPillarEditor(index) {
    const form = $('pillar-form-container');
    if (!form) return;
    const pillars = readPillars();
    const pillar = index >= 0 ? pillars[index] : null;

    $('pillar-item-index').value = index;
    $('pillar-form-title').textContent = pillar ? 'Edit Skill Pillar' : 'Add Skill Pillar';
    $('pillar-name-input').value = pillar ? pillar.name : '';
    $('pillar-icon-input').value = pillar ? (pillar.icon || '') : '';

    form.style.display = 'block';
    scrollToForm(form);
    setTimeout(() => $('pillar-name-input').focus(), 120);
  }

  function savePillarFromEditor() {
    const name = $('pillar-name-input').value.trim();
    if (!name) {
      toast('Pillar name is required.', 'error');
      $('pillar-name-input').focus();
      return;
    }

    const pillars = readPillars();
    const index = parseInt($('pillar-item-index').value, 10);
    const icon = $('pillar-icon-input').value.trim() || 'fas fa-layer-group';

    if (index >= 0 && index < pillars.length) {
      pillars[index].name = name;
      pillars[index].icon = icon;
    } else {
      pillars.push({ id: makeId('pillar', name), name, icon, skills: [] });
    }

    persist('skill_pillars', pillars, { successMessage: index >= 0 ? 'Skill pillar updated.' : 'Skill pillar added.' });
    renderSkillsAdmin();
    refreshPillarSelect();
    $('pillar-form-container').style.display = 'none';
    $('pillar-item-index').value = '-1';
  }

  function openSkillEditor(index, pillarId) {
    const form = $('skill-form-container');
    if (!form) return;

    const pillars = readPillars();
    if (pillars.length === 0) {
      toast('Create a skill pillar first.', 'warning');
      openPillarEditor(-1);
      return;
    }

    const pillar = pillarId || pillars[0].id;
    const owner = pillars.find(p => p.id === pillar);
    const skill = index >= 0 && owner ? (owner.skills || [])[index] : null;

    refreshPillarSelect(pillar);
    $('skill-item-index').value = index;
    $('skill-item-pillar').value = pillar;
    $('skill-form-title').textContent = skill ? 'Edit Skill' : 'Add Skill';
    $('skill-name-input').value = skill ? skill.name : '';
    $('skill-desc-input').value = skill ? (skill.description || '') : '';
    $('skill-icon-input').value = skill ? (skill.icon || '') : '';

    form.style.display = 'block';
    scrollToForm(form);
    setTimeout(() => $('skill-name-input').focus(), 120);
  }

  function saveSkillFromEditor() {
    const name = $('skill-name-input').value.trim();
    if (!name) {
      toast('Skill name is required.', 'error');
      $('skill-name-input').focus();
      return;
    }

    const targetPillarId = $('skill-pillar-select').value;
    if (!targetPillarId) {
      toast('Select the pillar this skill belongs to.', 'error');
      return;
    }

    const pillars = readPillars();
    const originalPillarId = $('skill-item-pillar').value;
    const index = parseInt($('skill-item-index').value, 10);

    const target = pillars.find(p => p.id === targetPillarId);
    if (!target) {
      toast('Selected pillar no longer exists.', 'error');
      return;
    }
    if (!Array.isArray(target.skills)) target.skills = [];

    const record = {
      id: makeId('skill', name),
      name,
      description: $('skill-desc-input').value.trim(),
      icon: $('skill-icon-input').value.trim() || 'fas fa-code'
    };

    if (index >= 0 && originalPillarId) {
      const source = pillars.find(p => p.id === originalPillarId);
      if (source && Array.isArray(source.skills) && source.skills[index]) {
        record.id = source.skills[index].id || record.id;
        source.skills.splice(index, 1);
      }
      target.skills.push(record);
    } else {
      target.skills.push(record);
    }

    persist('skill_pillars', pillars, { successMessage: index >= 0 ? 'Skill updated.' : 'Skill added.' });
    renderSkillsAdmin();
    $('skill-form-container').style.display = 'none';
    $('skill-item-index').value = '-1';
  }

  function initSkillsManager() {
    const addPillarBtn = $('btn-add-skill-pillar');
    const cancelPillarBtn = $('btn-cancel-pillar-item');
    const savePillarBtn = $('btn-save-pillar-item');
    const addSkillBtn = $('btn-add-skill');
    const cancelSkillBtn = $('btn-cancel-skill-item');
    const saveSkillBtn = $('btn-save-skill-item');

    if (addPillarBtn) addPillarBtn.addEventListener('click', () => openPillarEditor(-1));
    if (cancelPillarBtn) cancelPillarBtn.addEventListener('click', () => {
      $('pillar-form-container').style.display = 'none';
      $('pillar-item-index').value = '-1';
    });
    if (savePillarBtn) savePillarBtn.addEventListener('click', savePillarFromEditor);

    if (addSkillBtn) addSkillBtn.addEventListener('click', () => openSkillEditor(-1, readPillars()[0]?.id || ''));
    if (cancelSkillBtn) cancelSkillBtn.addEventListener('click', () => {
      $('skill-form-container').style.display = 'none';
      $('skill-item-index').value = '-1';
    });
    if (saveSkillBtn) saveSkillBtn.addEventListener('click', saveSkillFromEditor);
  }

  // ==========================================================================
  // 7. Inquiries / Messages Inbox Module
  // ==========================================================================
  function renderMessagesInbox() {
    const list = $('messages-inbox-list');
    const badge = $('sidebarMsgBadge');
    if (!list) return;

    let messages = [];
    try {
      messages = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      if (!Array.isArray(messages)) messages = [];
    } catch (e) {
      messages = [];
    }

    if (badge) {
      if (messages.length > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = messages.length;
      } else {
        badge.style.display = 'none';
      }
    }

    if (messages.length === 0) {
      list.innerHTML = '<p class="admin-empty-note">No messages received yet.</p>';
      return;
    }

    list.innerHTML = messages.map((m, idx) => `
      <div class="admin-item-card" style="align-items:flex-start; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
          <div>
            <strong style="color:var(--primary-color); font-size:1.05rem;">${esc(m.name)}</strong>
            <span style="font-size:0.85rem; color:var(--text-muted); margin-left:8px;">&lt;${esc(m.email)}&gt;</span>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">${m.date ? esc(new Date(m.date).toLocaleString()) : ''}</span>
        </div>
        <div style="font-weight:600; font-size:0.95rem; color:var(--text-primary);">${esc(m.subject || 'No Subject')}</div>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px; width:100%;">
          ${esc(m.message)}
        </p>
        <div style="display:flex; gap:10px; margin-top:6px; align-self:flex-end;">
          <a href="mailto:${esc(m.email)}?subject=Re: ${encodeURIComponent(m.subject || 'Portfolio Inquiry')}" class="btn-save" style="padding:6px 14px; font-size:0.82rem; text-decoration:none;">
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
        const current = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        if (idx < 0 || idx >= current.length) return;
        current.splice(idx, 1);
        localStorage.setItem('contact_submissions', JSON.stringify(current));
        renderMessagesInbox();
        updateStats();
        if (window.db) {
          window.db.collection('portfolioData').doc('contactMessages')
            .set({ messages: current }).catch(() => { });
        }
      });
    });

    const clearAllBtn = $('btn-clear-messages');
    if (clearAllBtn) {
      clearAllBtn.onclick = () => {
        if (window.confirm('Clear all visitor messages?')) {
          localStorage.removeItem('contact_submissions');
          renderMessagesInbox();
          updateStats();
          if (window.db) {
            window.db.collection('portfolioData').doc('contactMessages')
              .set({ messages: [] }).catch(() => { });
          }
          toast('All inquiries cleared.');
        }
      };
    }
  }

  // ==========================================================================
  // 8. Personal Info, About Text & Contact Details
  // ==========================================================================
  const SIMPLE_FIELDS = [
    { id: 'hero-name-input', key: 'heroName' },
    { id: 'hero-title-input', key: 'heroTitle' },
    { id: 'hero-headline-input', key: 'heroHeadline' },
    { id: 'hero-tagline-input', key: 'heroTagline' },
    { id: 'about-heading-input', key: 'aboutHeading' },
    { id: 'about-primary-text', key: 'aboutPrimary' },
    { id: 'about-secondary-text', key: 'aboutSecondary' },
    { id: 'contact-email', key: 'contactEmail' },
    { id: 'contact-phone', key: 'contactPhone' },
    { id: 'contact-location', key: 'contactLocation' }
  ];

  function hydrateSimpleFields() {
    SIMPLE_FIELDS.forEach(f => {
      const el = $(f.id);
      if (el && !el.value) {
        const stored = localStorage.getItem(f.key);
        if (stored) el.value = stored;
      }
    });
  }

  function saveSimpleFields(message) {
    const payload = {};
    SIMPLE_FIELDS.forEach(f => {
      const el = $(f.id);
      if (!el) return;
      const value = el.value.trim();
      localStorage.setItem(f.key, value);
      payload[f.key] = value;
    });

    if (window.db) {
      window.db.collection('portfolioData').doc('siteProfile')
        .set({ ...payload, updatedAt: serverTimestamp() })
        .catch(err => console.warn('Firestore profile sync:', err));
    }
    toast(message, 'success');
  }

  function initPersonalInfo() {
    hydrateSimpleFields();

    const saveHeroBtn = $('btn-save-hero');
    if (saveHeroBtn) {
      saveHeroBtn.addEventListener('click', () => saveSimpleFields('Personal branding saved successfully!'));
    }

    const aboutBtn = $('btn-save-about-custom');
    if (aboutBtn) {
      aboutBtn.addEventListener('click', () => saveSimpleFields('About narrative saved successfully!'));
    }

    const contactForm = $('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSimpleFields('Contact information updated!');
      });
    }
  }

  // ==========================================================================
  // 9. Backup, Restore, Cloud Pull & Reset
  // ==========================================================================
  function buildSnapshot() {
    const snapshot = {
      projects: readItems('custom_projects', defaultProjects),
      experience: readItems('experience_items'),
      skillPillars: readItems('skill_pillars'),
      certifications: readItems('certification_items'),
      education: readItems('education_items'),
      blog: readItems('blog_items'),
      learning: readItems('learning_items'),
      submissions: JSON.parse(localStorage.getItem('contact_submissions') || '[]'),
      exportDate: new Date().toISOString()
    };

    SIMPLE_FIELDS.forEach(f => {
      snapshot[f.key] = localStorage.getItem(f.key) || '';
    });

    return snapshot;
  }

  function applySnapshot(data) {
    const assignments = [
      ['custom_projects', data.projects, defaultProjects],
      ['experience_items', data.experience],
      ['skill_pillars', data.skillPillars],
      ['certification_items', data.certifications],
      ['education_items', data.education],
      ['blog_items', data.blog],
      ['learning_items', data.learning]
    ];

    assignments.forEach(([key, value, fallback]) => {
      if (Array.isArray(value)) localStorage.setItem(key, JSON.stringify(value));
      else if (!hasLocalRecord(key)) localStorage.setItem(key, JSON.stringify(defaultsFor(key, fallback)));
    });

    if (Array.isArray(data.submissions)) {
      localStorage.setItem('contact_submissions', JSON.stringify(data.submissions));
    }

    SIMPLE_FIELDS.forEach(f => {
      if (typeof data[f.key] === 'string') localStorage.setItem(f.key, data[f.key]);
    });

    return Promise.all(assignments.map(([key]) => syncToCloud(key, readItems(key))))
      .then(() => true);
  }

  function initBackupRestore() {
    const downloadBtn = $('btn-backup-download');
    const triggerBtn = $('btn-backup-restore-trigger');
    const fileInput = $('backup-restore-input');
    const statusMsg = $('backup-status-msg');
    const refreshBtn = $('btn-cloud-refresh');
    const resetBtn = $('btn-reset-defaults');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const snapshot = buildSnapshot();
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jitendra-sharma-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast('Snapshot exported.');
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
            if (statusMsg) {
              statusMsg.style.display = 'block';
              statusMsg.style.color = '#f59e0b';
              statusMsg.textContent = 'Restoring snapshot and syncing to cloud...';
            }
            applySnapshot(data).then(() => {
              refreshAllModules();
              if (statusMsg) {
                statusMsg.style.color = '#10b981';
                statusMsg.textContent = 'Snapshot restored and synced successfully!';
              }
              toast('Snapshot restored.');
              setTimeout(() => location.reload(), 1200);
            });
          } catch (err) {
            if (statusMsg) {
              statusMsg.style.display = 'block';
              statusMsg.style.color = '#ef4444';
              statusMsg.textContent = 'Invalid JSON backup file.';
            }
          }
        };
        reader.readAsText(file);
        fileInput.value = '';
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (!window.db) {
          toast('Firebase is not initialised — showing local data only.', 'warning');
          return;
        }
        refreshBtn.disabled = true;
        hydrateFromCloud(true).then(count => {
          refreshBtn.disabled = false;
          refreshAllModules();
          toast(count
            ? `${count} collection(s) updated from the cloud.`
            : 'Cloud had no stored records — your local data is unchanged.', count ? 'success' : 'warning');
        });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!window.confirm('Reset Experience, Skills, Certifications, Education, Blog and Learning Hub back to the built-in defaults? Projects are not touched.')) return;
        const keys = ['experience_items', 'skill_pillars', 'certification_items', 'education_items', 'blog_items', 'learning_items'];
        keys.forEach(key => localStorage.setItem(key, JSON.stringify(defaultsFor(key))));
        Promise.all(keys.map(key => syncToCloud(key, defaultsFor(key)))).then(() => {
          refreshAllModules();
          toast('Modules reset to default content.', 'success');
        });
      });
    }
  }

  // ==========================================================================
  // 10. Dashboard Metrics
  // ==========================================================================
  function updateStats() {
    const pCount = $('statTotalProjects');
    if (pCount) pCount.textContent = readItems('custom_projects', defaultProjects).length;

    const expCount = $('statTotalExp');
    if (expCount) expCount.textContent = readItems('experience_items').length;

    const certCount = $('statTotalCerts');
    if (certCount) certCount.textContent = readItems('certification_items').length;

    const mCount = $('statTotalMessages');
    if (mCount) {
      let messages = [];
      try {
        messages = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      } catch (e) {
        messages = [];
      }
      mCount.textContent = Array.isArray(messages) ? messages.length : 0;
    }
  }

  function refreshAllModules() {
    updateStats();
    Object.values(collections).forEach(renderCollection);
    renderSkillsAdmin();
    refreshPillarSelect();
    renderMessagesInbox();
  }

  // ==========================================================================
  // 11. Navigation, Authentication & Bootstrap
  // ==========================================================================
  function initTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-menu li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const topbarTitle = document.querySelector('.topbar-title');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = $('menu-toggle');
    const overlay = $('sidebar-overlay');

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

  function initLogin() {
    const loginForm = $('login-form');
    const loginError = $('login-error');
    const logoutBtn = $('logout-btn');

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = $('username').value.trim();
        const pass = $('password').value;
        const loginBtn = loginForm.querySelector('button[type="submit"]');

        if (!user || !pass) return;

        if (loginBtn) loginBtn.disabled = true;

        const [computedUserHash, computedPassHash] = await Promise.all([sha256(user), sha256(pass)]);
        const authenticated = computedUserHash === VALID_USER_HASH && computedPassHash === VALID_PASSWORD_HASH;

        if (loginBtn) loginBtn.disabled = false;

        if (authenticated) {
          sessionStorage.setItem('admin_authenticated', 'true');
          if (loginError) {
            loginError.style.display = 'none';
            loginError.textContent = 'Invalid administrator credentials.';
          }
          $('password').value = '';
          showDashboard();
          hydrateFromCloud(false).then(count => {
            if (count) refreshAllModules();
          });
        } else {
          if (loginError) loginError.style.display = 'block';
          $('password').value = '';
          $('password').focus();
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_authenticated');
        hideDashboard();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    registerAllCollections();
    initSkillsManager();
    initPersonalInfo();
    initBackupRestore();
    initLogin();
    hydrateSimpleFields();

    if (checkSession()) {
      showDashboard();
      hydrateFromCloud(false).then(count => {
        if (count) refreshAllModules();
      });
    } else {
      hideDashboard();
    }
  });

})();