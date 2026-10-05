# Firebase Setup — Admin Command Center

One-time setup in the Firebase console. Until step 1 is finished the admin panel
will refuse to log in, because the password is verified by Firebase rather than
by JavaScript in the browser.

Project: `jitendra-sharma-portfoli-945d6`

---

## 1. Enable Email/Password sign-in (required)

1. Open the [Firebase console](https://console.firebase.google.com/) and select
   the project `jitendra-sharma-portfoli-945d6`.
2. **Build → Authentication → Get started**.
3. **Sign-in method** tab → **Email/Password** → enable → **Save**.
4. **Users** tab → **Add user**:
   - Email: `jitendra.route2uni@gmail.com`
   - Password: `Jitendra@83`
   - Tick **Email verified** (optional but recommended).
5. Open `admin/` and log in with that address and password.

If the panel reports *"Email/Password sign-in is not enabled for this Firebase
project"*, step 2 or 3 was skipped, or the page was loaded before the change —
reload the page.

---

## 2. Publish the Firestore security rules (required)

Rules are the part the browser cannot bypass. Copy `firestore.rules` from the
repository root into **Firestore Database → Rules → Publish**.

What they enforce:

| Path | Read | Write |
| --- | --- | --- |
| `portfolioData/{experienceItems,skillPillars,certifications,educationItems,blogItems,learningCourses,projectsList,siteProfile}` | public | signed-in admin only |
| `portfolioData/contactMessages` | public | public (contact form, append-only) |

Changing the administrator address means editing `ADMIN_EMAIL` inside
`firestore.rules` and publishing again.

---

## 3. Restrict the API key (recommended)

The values in `admin/firebase-config.js` are a Firebase **web app
configuration**, not a password. Every browser must download them, so they
cannot be hidden from page source — Google only calls a key secret when it is
used server-side. What makes an exposed web key harmless is restriction:

1. [Google Cloud console](https://console.cloud.google.com/) →
   **APIs & Services → Credentials**.
2. Select the **Browser key** whose value starts `AIzaSyCeQMG9EKm7JhhXGcf9iVQazXKgEKKUN1M`.
3. **Edit key**:
   - **Application restrictions → HTTP referrers (web sites)**. Add:
     - `https://www.jitendra-sharma.com.np/*`
     - `https://jitendra-sharma.com.np/*`
     - `http://localhost:*/*` (local testing only — remove before going live
       if you never test locally)
   - **API restrictions → Restrict key**:
     - `Identity Toolkit API` (sign-in)
     - `Cloud Firestore API` (content read/write)
     - `Firebase Rules API` (rule evaluation)
4. Save. Requests from any other origin then fail, which is the point.

Never place a service account JSON, private key, or admin credential in
`firebase-config.js` or anywhere else in this repository.

---

## 4. Why the panel still needs host-level protection

Firestore rules protect the **database**: a visitor can read the portfolio but
cannot modify it. They do not hide `/admin/` itself, and `robots.txt` plus the
`noindex` meta tag only ask search engines to skip it — they are not access
control. The `admin/htaccess` template protects the folder on cPanel-style
hosts; GitHub Pages ignores it. If you deploy to GitHub Pages, the Firebase
sign-in is what stands between a stranger and your editing panel.

---

## Optional: multi-admin or extra hardening

- **Two-factor authentication** – enable it on the Google account behind the
  Firebase console, and consider adding an MFA provider for the panel later.
- **Email allow-list in rules** – swap the single address in `firestore.rules`
  for a list if more than one person edits the site.
- **Anonymous auth is not used** – the panel always signs in as the real
  administrator, so rules can key off `request.auth.token.email`.