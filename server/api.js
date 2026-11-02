import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_DIR = path.join(rootDir, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects-db.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth-db.json');
const UPLOADS_DIR = path.join(rootDir, 'public', 'uploads');

// Ensure directories exist with restrictive permissions
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true, mode: 0o755 });

// Ensure DB files exist
if (!fs.existsSync(PROJECTS_FILE)) fs.writeFileSync(PROJECTS_FILE, '[]', 'utf8');
if (!fs.existsSync(AUTH_FILE)) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify({
    isSetup: false,
    passwordHash: null,
    salt: null,
    sessions: {},
  }, null, 2), 'utf8');
}

// ----------------------------------------------------------------------------
// SECURITY: OWASP-COMPLIANT PBKDF2 CONFIGURATION
// 210,000 iterations of HMAC-SHA512 with 32-byte cryptographically secure salt
// ----------------------------------------------------------------------------
const PBKDF2_ITERATIONS = 210000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = 'sha512';
const SALT_BYTES = 32;

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST).toString('hex');
}

// ----------------------------------------------------------------------------
// SECURITY: IN-MEMORY BRUTE-FORCE RATE LIMITER
// Limits failed login attempts per IP: max 5 failed attempts in 15 minutes
// ----------------------------------------------------------------------------
const loginAttempts = new Map(); // ip -> { count: number, lockedUntil: number }
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSecs = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSecs };
  }

  // Lockout expired; reset record
  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  loginAttempts.set(ip, record);
}

function recordSuccessfulAttempt(ip) {
  loginAttempts.delete(ip);
}

// ----------------------------------------------------------------------------
// SECURITY: HARDENED FILE UPLOAD WITH STRICT VALIDATION & RANDOMIZED FILENAMES
// ----------------------------------------------------------------------------
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error('Disallowed file extension.'));
    }
    // Purely random UUID filename to prevent path traversal and shell injection
    const randomName = `asset-${crypto.randomBytes(16).toString('hex')}${ext}`;
    cb(null, randomName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Strict 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIMES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.'));
    }
  },
});

// Database helper functions
function readProjects() {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf8');
}

function readAuth() {
  try {
    const data = fs.readFileSync(AUTH_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { isSetup: false, passwordHash: null, salt: null, sessions: {} };
  }
}

function writeAuth(auth) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), 'utf8');
}

// ----------------------------------------------------------------------------
// SANITIZATION HELPERS
// ----------------------------------------------------------------------------
function sanitizeText(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip HTML tags
    .trim()
    .slice(0, maxLength);
}

function validateUrl(url) {
  if (!url) return null;
  const clean = String(url).trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/uploads/')) {
    return clean.slice(0, 500);
  }
  return null;
}

// ----------------------------------------------------------------------------
// SECURITY: SESSION AUTHENTICATION MIDDLEWARE
// Checks HttpOnly Cookie first, with Authorization Header fallback
// ----------------------------------------------------------------------------
function requireAuth(req, res, next) {
  let token = req.cookies?.ms_admin_session;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session cookie or token provided.' });
  }

  const auth = readAuth();
  const session = auth.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    // Revoke expired session
    if (session) {
      delete auth.sessions[token];
      writeAuth(auth);
    }
    res.clearCookie('ms_admin_session', { path: '/api' });
    return res.status(401).json({ error: 'Session expired or revoked. Please re-authenticate.' });
  }

  req.adminSession = session;
  req.sessionToken = token;
  next();
}

// ----------------------------------------------------------------------------
// API ROUTER FACTORY
// ----------------------------------------------------------------------------
export function createApiRouter() {
  const router = express.Router();
  router.use(express.json({ limit: '1mb' }));
  router.use(cookieParser());

  // --------------------------------------------------------------------------
  // AUTHENTICATION ENDPOINTS
  // --------------------------------------------------------------------------

  // Check auth setup status
  router.get('/auth/status', (req, res) => {
    const auth = readAuth();
    res.json({
      isSetup: Boolean(auth.isSetup),
      requiresInitialPassword: !auth.isSetup,
    });
  });

  // Initial Password Setup (Strictly single-use: rejected if already set up)
  router.post('/auth/setup', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const auth = readAuth();

    if (auth.isSetup) {
      return res.status(403).json({ error: 'Master password has already been configured. Setup is locked.' });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
    }

    // Generate secure 32-byte salt and compute 210,000-iteration PBKDF2 hash
    const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
    const hash = hashPassword(password, salt);

    auth.isSetup = true;
    auth.salt = salt;
    auth.passwordHash = hash;

    // Issue initial cryptographically secure session token (384-bit entropy)
    const token = crypto.randomBytes(48).toString('hex');
    auth.sessions[token] = {
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      ip: clientIp,
    };

    writeAuth(auth);

    // Set secure HttpOnly, SameSite cookie
    res.cookie('ms_admin_session', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/api',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Admin password successfully initialized with modern PBKDF2-SHA512 encryption.',
      token, // Also return for dual cookie/header fallback
    });
  });

  // Admin Login with Brute-Force Rate Limiting
  router.post('/auth/login', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(clientIp);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Too many failed login attempts. Locked out for security. Try again in ${rateCheck.remainingSecs} seconds.`,
        retryAfter: rateCheck.remainingSecs,
      });
    }

    const auth = readAuth();

    if (!auth.isSetup) {
      return res.status(400).json({
        error: 'Admin not initialized yet. Please complete initial setup.',
        requiresSetup: true,
      });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const testHash = hashPassword(password, auth.salt);
    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(testHash, 'hex'),
      Buffer.from(auth.passwordHash, 'hex')
    );

    if (!hashesMatch) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ error: 'Incorrect master password.' });
    }

    // Successful login: reset rate limiter
    recordSuccessfulAttempt(clientIp);

    // Issue session token
    const token = crypto.randomBytes(48).toString('hex');
    auth.sessions[token] = {
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      ip: clientIp,
    };

    writeAuth(auth);

    // Set HttpOnly, SameSite=Strict cookie
    res.cookie('ms_admin_session', token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/api',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Authenticated successfully.',
      token,
    });
  });

  // Verify Session
  router.get('/auth/verify', (req, res) => {
    let token = req.cookies?.ms_admin_session;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.json({ authenticated: false });
    }

    const auth = readAuth();
    const session = auth.sessions[token];

    if (session && session.expiresAt > Date.now()) {
      return res.json({ authenticated: true });
    }

    return res.json({ authenticated: false });
  });

  // Admin Logout & Revocation
  router.post('/auth/logout', (req, res) => {
    let token = req.cookies?.ms_admin_session;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (token) {
      const auth = readAuth();
      delete auth.sessions[token];
      writeAuth(auth);
    }

    res.clearCookie('ms_admin_session', { path: '/api' });
    res.json({ success: true, message: 'Logged out and session revoked.' });
  });

  // --------------------------------------------------------------------------
  // PROJECTS MANAGEMENT ENDPOINTS (PROTECTED & PUBLIC)
  // --------------------------------------------------------------------------

  // GET /api/projects
  // Public visitors receive ONLY published projects.
  // Authenticated administrators receive all projects.
  router.get('/projects', (req, res) => {
    let token = req.cookies?.ms_admin_session;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    let isAdmin = false;
    if (token) {
      const auth = readAuth();
      const session = auth.sessions[token];
      if (session && session.expiresAt > Date.now()) {
        isAdmin = true;
      }
    }

    const allProjects = readProjects();
    allProjects.sort((a, b) => (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999));

    if (isAdmin) {
      return res.json({ projects: allProjects, count: allProjects.length });
    }

    // Public visitor: ONLY published projects
    const published = allProjects.filter(p => p.status === 'PUBLISHED');
    return res.json({ projects: published, count: published.length });
  });

  // POST /api/projects — Add project (Requires Auth & Strict Input Validation)
  router.post('/projects', requireAuth, (req, res) => {
    const raw = req.body || {};
    const title = sanitizeText(raw.title, 100);

    if (!title) {
      return res.status(400).json({ error: 'Project title is required (max 100 characters).' });
    }

    const subtitle = sanitizeText(raw.subtitle, 120);
    const category = sanitizeText(raw.category || 'SOFTWARE ARCHITECTURE', 60).toUpperCase();
    const description = sanitizeText(raw.description, 500);
    const longDescription = sanitizeText(raw.longDescription, 3000);

    let status = 'DRAFT';
    if (['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(raw.status)) {
      status = raw.status;
    }

    let tags = [];
    if (Array.isArray(raw.tags)) {
      tags = raw.tags.map(t => sanitizeText(t, 30).toUpperCase()).filter(Boolean).slice(0, 10);
    }

    const liveUrl = validateUrl(raw.liveUrl);
    const githubUrl = validateUrl(raw.githubUrl);
    const primaryImage = validateUrl(raw.primaryImage) || '/uploads/placeholder-project.jpg';
    const revealImage = validateUrl(raw.revealImage) || primaryImage;
    const featured = Boolean(raw.featured);

    const projects = readProjects();
    const newId = `PROJ-${Date.now().toString().slice(-6)}`;
    const newOrder = projects.length;

    const newProject = {
      id: newId,
      title,
      subtitle,
      category,
      description,
      longDescription,
      status,
      tags,
      liveUrl,
      githubUrl,
      primaryImage,
      revealImage,
      featured,
      orderIndex: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    writeProjects(projects);

    res.status(201).json({ success: true, project: newProject });
  });

  // PUT /api/projects/:id — Update project (Requires Auth)
  router.put('/projects/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const existing = projects[index];
    const raw = req.body || {};

    const updated = {
      ...existing,
      title: raw.title !== undefined ? sanitizeText(raw.title, 100) : existing.title,
      subtitle: raw.subtitle !== undefined ? sanitizeText(raw.subtitle, 120) : existing.subtitle,
      category: raw.category !== undefined ? sanitizeText(raw.category, 60).toUpperCase() : existing.category,
      description: raw.description !== undefined ? sanitizeText(raw.description, 500) : existing.description,
      longDescription: raw.longDescription !== undefined ? sanitizeText(raw.longDescription, 3000) : existing.longDescription,
      status: ['DRAFT', 'PUBLISHED', 'HIDDEN'].includes(raw.status) ? raw.status : existing.status,
      tags: Array.isArray(raw.tags)
        ? raw.tags.map(t => sanitizeText(t, 30).toUpperCase()).filter(Boolean).slice(0, 10)
        : existing.tags,
      liveUrl: raw.liveUrl !== undefined ? validateUrl(raw.liveUrl) : existing.liveUrl,
      githubUrl: raw.githubUrl !== undefined ? validateUrl(raw.githubUrl) : existing.githubUrl,
      primaryImage: raw.primaryImage !== undefined ? validateUrl(raw.primaryImage) : existing.primaryImage,
      revealImage: raw.revealImage !== undefined ? validateUrl(raw.revealImage) : existing.revealImage,
      featured: raw.featured !== undefined ? Boolean(raw.featured) : existing.featured,
      id: existing.id,
      orderIndex: existing.orderIndex,
      updatedAt: new Date().toISOString(),
    };

    if (!updated.title) {
      return res.status(400).json({ error: 'Project title cannot be empty.' });
    }

    projects[index] = updated;
    writeProjects(projects);

    res.json({ success: true, project: updated });
  });

  // DELETE /api/projects/:id — Delete project (Requires Auth)
  router.delete('/api/projects/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    let projects = readProjects();
    const initialLen = projects.length;

    projects = projects.filter(p => p.id !== id);

    if (projects.length === initialLen) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Re-index remaining projects
    projects.forEach((p, idx) => { p.orderIndex = idx; });
    writeProjects(projects);

    res.json({ success: true, message: 'Project deleted successfully.' });
  });

  // Also match without /api prefix when mounted
  router.delete('/projects/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    let projects = readProjects();
    const initialLen = projects.length;

    projects = projects.filter(p => p.id !== id);

    if (projects.length === initialLen) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    projects.forEach((p, idx) => { p.orderIndex = idx; });
    writeProjects(projects);

    res.json({ success: true, message: 'Project deleted successfully.' });
  });

  // POST /api/projects/reorder — Reorder projects (Requires Auth)
  router.post('/projects/reorder', requireAuth, (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array required.' });
    }

    const projects = readProjects();
    const projectMap = new Map(projects.map(p => [p.id, p]));

    const reordered = [];
    orderedIds.forEach((id, idx) => {
      const p = projectMap.get(id);
      if (p) {
        p.orderIndex = idx;
        reordered.push(p);
        projectMap.delete(id);
      }
    });

    let nextIdx = reordered.length;
    projectMap.forEach(p => {
      p.orderIndex = nextIdx++;
      reordered.push(p);
    });

    writeProjects(reordered);
    res.json({ success: true, projects: reordered });
  });

  // --------------------------------------------------------------------------
  // GITHUB REPOSITORY IMPORT (Requires Auth & Strict Format Checking)
  // --------------------------------------------------------------------------
  router.post('/github-import', requireAuth, async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl || typeof repoUrl !== 'string') {
      return res.status(400).json({ error: 'Repository URL is required.' });
    }

    let owner = '';
    let repo = '';

    try {
      const cleanUrl = repoUrl.trim().replace(/\/$/, '');
      if (cleanUrl.includes('github.com/')) {
        const parts = cleanUrl.split('github.com/')[1].split('/');
        owner = parts[0];
        repo = parts[1];
      } else if (cleanUrl.includes('/')) {
        const parts = cleanUrl.split('/');
        owner = parts[0];
        repo = parts[1];
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid GitHub repository format.' });
    }

    // Sanitize owner and repo against shell/URL injection
    owner = owner.replace(/[^a-zA-Z0-9_.-]/g, '');
    repo = repo.replace(/[^a-zA-Z0-9_.-]/g, '');

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Could not extract repository owner and name. Format: https://github.com/owner/repo' });
    }

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mayuresh-Portfolio-Audited-Importer/2.0',
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ error: `Repository "${owner}/${repo}" was not found or is private.` });
        }
        if (response.status === 403) {
          return res.status(429).json({ error: 'GitHub API rate limit reached. Please try again shortly.' });
        }
        return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}` });
      }

      const data = await response.json();

      const extractedTags = [];
      if (data.language) extractedTags.push(data.language.toUpperCase());
      if (Array.isArray(data.topics)) {
        data.topics.slice(0, 4).forEach(t => extractedTags.push(String(t).toUpperCase()));
      }

      const importedData = {
        title: sanitizeText(data.name, 100),
        subtitle: sanitizeText(data.full_name, 120),
        description: sanitizeText(data.description || 'Open-source software repository.', 500),
        longDescription: sanitizeText(`${data.description || ''} Primary language: ${data.language || 'Software'}. Stargazers: ${data.stargazers_count}. Open issues: ${data.open_issues_count}.`, 3000),
        category: 'OPEN SOURCE DEVELOPER PROJECT',
        tags: extractedTags.length ? extractedTags : ['OPEN SOURCE', 'GITHUB'],
        githubUrl: validateUrl(data.html_url),
        liveUrl: validateUrl(data.homepage),
        status: 'DRAFT', // NEVER automatically published!
      };

      res.json({
        success: true,
        data: importedData,
        message: 'Repository metadata retrieved. Review and edit before saving.',
      });
    } catch (err) {
      res.status(500).json({ error: `Failed to fetch GitHub repository: ${err.message}` });
    }
  });

  // --------------------------------------------------------------------------
  // HARDENED FILE UPLOAD (Requires Auth, Mime & Path Validation)
  // --------------------------------------------------------------------------
  router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded or invalid file format.' });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });

  return router;
}
