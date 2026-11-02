# PROJECT MANAGEMENT SYSTEM ARCHITECTURE & USER GUIDE

A comprehensive technical and operational specification for the **Mayuresh Sonawane** portfolio project management system, protected authentication, and public gallery synchronization.

---

## 1. System Overview

The Project Management System gives Mayuresh complete, sovereign control over what projects appear on the public portfolio. It decouples administrative management from public presentation and guarantees that **the public gallery remains empty until Mayuresh explicitly chooses to publish an entry**.

```
┌─────────────────────────────────┐        ┌─────────────────────────────────┐
│       ADMIN DASHBOARD           │        │         PUBLIC PORTFOLIO        │
│   (Protected Route / Modal)     │        │    (Project Hall of Fame)       │
├─────────────────────────────────┤        ├─────────────────────────────────┤
│ • Master Password Auth          │        │ • Starts in Polished Empty      │
│ • Manual Project Creation       │        │   State                         │
│ • GitHub Repository Importer    │        │ • Displays ONLY projects marked │
│ • Cover & Schematic Uploader    │        │   as "PUBLISHED"                │
│ • Reorder / Move Up & Down      │───────►│ • Real-time synchronization     │
│ • Lifecycle: DRAFT | PUBLISHED  │        │ • Interactive Inspection Modal  │
└─────────────────────────────────┘        └─────────────────────────────────┘
                 │                                          ▲
                 ▼                                          │
┌───────────────────────────────────────────────────────────┴────────────────┐
│                        PERSISTENT BACKEND STORAGE                          │
│ • Projects Database: data/projects-db.json                                 │
│ • Authentication Database: data/auth-db.json (Salted PBKDF2/SHA-512)       │
│ • Uploaded Assets: public/uploads/                                         │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hardened Security & Authentication Architecture

1. **OWASP-Compliant PBKDF2 Configuration:**
   * **Hash Function:** HMAC-SHA512
   * **Iterations:** `210,000` (NIST / OWASP 2023 modern benchmark)
   * **Salt:** `32 bytes` (256-bit cryptographically secure random bytes generated via `crypto.randomBytes(32)`)
   * **Key Length:** `64 bytes`
   * **Timing-Safe Comparison:** `crypto.timingSafeEqual` prevents side-channel timing attacks.

2. **Single-Use Master Password Setup:**
   * When `auth.isSetup` is false, `/api/auth/setup` allows initialization.
   * Once initialized, all subsequent calls to `/api/auth/setup` are strictly rejected with `403 Forbidden`.

3. **Brute-Force Rate Limiting & Lockout:**
   * Failed login attempts are tracked per client IP.
   * Exceeding 5 failed attempts locks the IP for 15 minutes (`900 seconds`), returning `429 Too Many Requests`.
   * Successful authentication clears the attempt counter.

4. **HttpOnly, SameSite Session Cookies:**
   * Tokens are 48-byte cryptographically random hex strings (384-bit entropy).
   * Stored in cookies with:
     * `httpOnly: true` (prevents JavaScript access & XSS token theft)
     * `sameSite: 'strict'` (mitigates CSRF vulnerabilities)
     * `path: '/api'` (restricted exclusively to API endpoints)
     * `secure: process.env.NODE_ENV === 'production'`
     * `maxAge: 7 * 24 * 60 * 60 * 1000` (7 days)
   * Dual fallback to `Authorization: Bearer <token>` for API/headless testing.

5. **Static File Blocking:**
   * Direct requests to `/data/*`, `/server/*`, `projects-db.json`, or `auth-db.json` are intercepted by middleware and return `403 Forbidden`.

---

## 3. Storage Environments & Deployment Architecture

### 3.1 Local Development & Self-Hosted Node (Current Active Configuration)
* **Storage Medium:** Local persistent filesystem (`data/projects-db.json`, `data/auth-db.json`, `public/uploads/`).
* **Persistence:** 100% persistent across server reboots, page refreshes, and browser sessions.
* **Hosting Targets:** Dedicated VPS, Docker container, local workstation, or VM with persistent block storage.

### 3.2 Production Cloud & Serverless Deployment Requirements
* **Limitation Notice:** Static hosting services (e.g. standard GitHub Pages) or serverless functions with ephemeral filesystems (e.g. Vercel, Netlify Functions, Cloudflare Pages) **do not have writeable persistent disk storage**.
* **Production Cloud Stack Required:**
  1. **Database:** Supabase Postgres or AWS RDS with Row Level Security (RLS).
  2. **Storage:** Supabase Storage bucket or AWS S3 for uploaded cover images and schematics.
  3. **Auth:** Supabase Auth or stateless JWT with Redis session store.
* **Production Readiness Statement:** The portfolio is production-ready for Node.js container environments (Docker, AWS ECS, Railway, Render with persistent disks). For serverless deployments, external database migration (Supabase) is required prior to deployment.
