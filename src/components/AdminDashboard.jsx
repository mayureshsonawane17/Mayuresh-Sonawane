import React, { useState, useEffect } from 'react';
import {
  X, Lock, Key, Plus, Github, Upload, Check, Trash2, Edit3, ArrowUp, ArrowDown,
  Eye, EyeOff, Sparkles, AlertCircle, RefreshCw, Layers, FolderKanban, LogOut,
  ExternalLink, FileCode, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose, onProjectsUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ms_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatus, setAuthStatus] = useState({ isSetup: true, requiresInitialPassword: false });
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create' | 'import'

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'SOFTWARE ARCHITECTURE',
    description: '',
    longDescription: '',
    status: 'DRAFT', // 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
    tags: '',
    liveUrl: '',
    githubUrl: '',
    primaryImage: '',
    revealImage: '',
    featured: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // GitHub Import State
  const [githubUrlInput, setGithubUrlInput] = useState('');
  const [importingGithub, setImportingGithub] = useState(false);
  const [githubError, setGithubError] = useState('');

  // 1. Check Auth Status on Mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/auth/status', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setAuthStatus(data);
        }
      } catch (err) {
        console.warn('Could not check auth status:', err);
      }
    }
    checkStatus();
  }, [isOpen]);

  // 2. Verify Existing Session (via HttpOnly Cookie or Bearer fallback)
  useEffect(() => {
    async function verify() {
      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            fetchAdminProjects();
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('ms_admin_token');
            setToken('');
          }
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    if (isOpen) {
      verify();
    }
  }, [token, isOpen]);

  // Fetch all projects (including DRAFT and HIDDEN)
  async function fetchAdminProjects() {
    setLoadingProjects(true);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/projects', {
        credentials: 'include',
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.warn('Failed to fetch admin projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  }

  // Handle Login or Initial Password Setup
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (authStatus.requiresInitialPassword) {
      if (passwordInput !== confirmPassword) {
        setLoginError('Passwords do not match.');
        return;
      }
      if (passwordInput.length < 8) {
        setLoginError('Password must be at least 8 characters (NIST standard).');
        return;
      }
      try {
        const res = await fetch('/api/auth/setup', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passwordInput }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.token) {
            localStorage.setItem('ms_admin_token', data.token);
            setToken(data.token);
          }
          setIsAuthenticated(true);
          setAuthStatus({ isSetup: true, requiresInitialPassword: false });
          fetchAdminProjects();
        } else {
          setLoginError(data.error || 'Failed to setup master password.');
        }
      } catch (err) {
        setLoginError('Network error during setup.');
      }
    } else {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: passwordInput }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.token) {
            localStorage.setItem('ms_admin_token', data.token);
            setToken(data.token);
          }
          setIsAuthenticated(true);
          setPasswordInput('');
          fetchAdminProjects();
        } else {
          setLoginError(data.error || 'Incorrect master password.');
        }
      } catch (err) {
        setLoginError('Network error during login.');
      }
    }
  };

  const handleLogout = async () => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers,
      });
    } catch (e) {
      // Ignored
    }

    localStorage.removeItem('ms_admin_token');
    setToken('');
    setIsAuthenticated(false);
    setPasswordInput('');
    setProjects([]);
  };

  // Image Upload Handler
  const handleImageUpload = async (e, field = 'primaryImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB security limit.');
      return;
    }

    setUploadingImage(true);
    const data = new FormData();
    data.append('image', file);

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: data,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setFormData(prev => ({
          ...prev,
          [field]: result.url,
          revealImage: prev.revealImage || result.url,
        }));
      } else {
        alert(result.error || 'Upload failed.');
      }
    } catch (err) {
      alert('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save / Update Project
  const handleSaveProject = async (e, targetStatus) => {
    if (e) e.preventDefault();
    setFormMessage({ type: '', text: '' });

    if (!formData.title.trim()) {
      setFormMessage({ type: 'error', text: 'Project title is required.' });
      return;
    }

    const payload = {
      ...formData,
      status: targetStatus || formData.status,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags,
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFormMessage({
          type: 'success',
          text: editingProject ? 'Project updated successfully.' : 'Project created successfully.',
        });
        resetForm();
        fetchAdminProjects();
        if (onProjectsUpdated) onProjectsUpdated();
        setTimeout(() => setActiveTab('list'), 800);
      } else {
        setFormMessage({ type: 'error', text: data.error || 'Failed to save project.' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'Network error saving project.' });
    }
  };

  // Delete Project
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      });
      if (res.ok) {
        fetchAdminProjects();
        if (onProjectsUpdated) onProjectsUpdated();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete project.');
      }
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  // Reorder Projects (Move Up / Down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    setProjects(reordered);

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const orderedIds = reordered.map(p => p.id);
      await fetch('/api/projects/reorder', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ orderedIds }),
      });
      if (onProjectsUpdated) onProjectsUpdated();
    } catch (err) {
      fetchAdminProjects();
    }
  };

  // Quick Status Toggle (DRAFT -> PUBLISHED -> HIDDEN)
  const handleQuickStatusChange = async (project, newStatus) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAdminProjects();
        if (onProjectsUpdated) onProjectsUpdated();
      }
    } catch (err) {
      alert('Could not update status.');
    }
  };

  // GitHub Import Handler
  const handleFetchGithub = async (e) => {
    e.preventDefault();
    setGithubError('');
    if (!githubUrlInput.trim()) {
      setGithubError('Please enter a GitHub repository URL.');
      return;
    }

    setImportingGithub(true);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/github-import', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ repoUrl: githubUrlInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.data) {
        setFormData({
          title: data.data.title || '',
          subtitle: data.data.subtitle || '',
          category: data.data.category || 'OPEN SOURCE PROJECT',
          description: data.data.description || '',
          longDescription: data.data.longDescription || '',
          status: 'DRAFT', // Always DRAFT until explicitly published
          tags: Array.isArray(data.data.tags) ? data.data.tags.join(', ') : '',
          liveUrl: data.data.liveUrl || '',
          githubUrl: data.data.githubUrl || '',
          primaryImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
          revealImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
          featured: false,
        });
        setEditingProject(null);
        setActiveTab('create');
        setFormMessage({
          type: 'success',
          text: 'Repository metadata imported! Review and edit fields before saving.',
        });
      } else {
        setGithubError(data.error || 'Failed to fetch repository.');
      }
    } catch (err) {
      setGithubError('Network error connecting to GitHub importer.');
    } finally {
      setImportingGithub(false);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      subtitle: project.subtitle || '',
      category: project.category || 'SOFTWARE ARCHITECTURE',
      description: project.description || '',
      longDescription: project.longDescription || '',
      status: project.status || 'DRAFT',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      primaryImage: project.primaryImage || '',
      revealImage: project.revealImage || '',
      featured: Boolean(project.featured),
    });
    setActiveTab('create');
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'SOFTWARE ARCHITECTURE',
      description: '',
      longDescription: '',
      status: 'DRAFT',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      primaryImage: '',
      revealImage: '',
      featured: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="Admin Project Management Dashboard"
    >
      <div 
        className="relative w-full max-w-5xl h-[92vh] bg-charcoal text-charcoal-text border border-volt/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Header */}
        <div className="flex items-center justify-between p-5 border-b border-charcoal-border bg-charcoal-surface">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded bg-volt text-charcoal font-bold font-mono text-xs">
              ADMIN
            </span>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
                PROJECT MANAGEMENT SYSTEM
              </h2>
              <div className="flex items-center gap-2 font-mono text-[10px] text-charcoal-secondary uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-volt"></span>
                <span>PROTECTED ACCESS // HTTPONLY SAME-SITE AUTH ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal border border-charcoal-border hover:border-red-400 text-charcoal-secondary hover:text-red-300 font-mono text-xs transition-colors"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-charcoal-secondary hover:text-white transition-colors"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* AUTHENTICATION VIEW */
            <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-charcoal-surface border border-charcoal-border shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-charcoal border border-volt/50 text-volt mx-auto mb-6 flex items-center justify-center shadow-[0_0_25px_rgba(210,253,82,0.15)]">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight mb-2">
                {authStatus.requiresInitialPassword ? 'INITIALIZE MASTER PASSWORD' : 'ADMIN AUTHENTICATION'}
              </h3>
              
              <p className="font-body text-xs text-charcoal-secondary mb-6 leading-relaxed">
                {authStatus.requiresInitialPassword
                  ? 'First-time setup: establish your master password (210,000-iteration PBKDF2 with SHA-512) to control public portfolio projects.'
                  : 'Enter your master admin password to manage, import, and publish projects.'}
              </p>

              {loginError && (
                <div className="mb-5 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs text-left flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                    MASTER PASSWORD {authStatus.requiresInitialPassword && '(MIN 8 CHARS)'}
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter master password..."
                    className="w-full px-4 py-3 rounded-lg bg-black border border-charcoal-border focus:border-volt text-white font-mono text-sm outline-none transition-colors"
                    required
                    autoFocus
                  />
                </div>

                {authStatus.requiresInitialPassword && (
                  <div>
                    <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password..."
                      className="w-full px-4 py-3 rounded-lg bg-black border border-charcoal-border focus:border-volt text-white font-mono text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-volt text-charcoal font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg mt-2"
                >
                  {authStatus.requiresInitialPassword ? 'INITIALIZE & SECURE' : 'AUTHENTICATE SESSION'}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-charcoal-border/50 font-mono text-[10px] text-charcoal-muted text-center">
                <span>SECURITY: HTTPONLY COOKIE • RATE LIMITING • ZERO FRONTEND SECRETS</span>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED MANAGEMENT WORKSPACE */
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Navigation Tabs Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-charcoal-border pb-4 gap-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setActiveTab('list'); resetForm(); }}
                    className={`px-4 py-2 rounded font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                      activeTab === 'list' ? 'bg-volt text-charcoal' : 'text-charcoal-secondary hover:text-white'
                    }`}
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>PROJECTS ({projects.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('create'); resetForm(); }}
                    className={`px-4 py-2 rounded font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                      activeTab === 'create' && !editingProject ? 'bg-volt text-charcoal' : 'text-charcoal-secondary hover:text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD PROJECT</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('import')}
                    className={`px-4 py-2 rounded font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                      activeTab === 'import' ? 'bg-volt text-charcoal' : 'text-charcoal-secondary hover:text-white'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    <span>GITHUB IMPORT</span>
                  </button>
                </div>

                {/* Status Telemetry Stats */}
                <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-charcoal-muted">
                  <span className="text-volt font-semibold">
                    PUBLISHED: {projects.filter(p => p.status === 'PUBLISHED').length}
                  </span>
                  <span>•</span>
                  <span>DRAFTS: {projects.filter(p => p.status === 'DRAFT').length}</span>
                  <span>•</span>
                  <span>HIDDEN: {projects.filter(p => p.status === 'HIDDEN').length}</span>
                </div>
              </div>

              {/* TAB 1: ALL PROJECTS LIST & ORDERING */}
              {activeTab === 'list' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs text-charcoal-secondary">
                    <span>REORDER AND MANAGE PUBLISHING STATES</span>
                    <button
                      onClick={fetchAdminProjects}
                      className="flex items-center gap-1.5 text-volt hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>REFRESH</span>
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="p-12 text-center rounded-xl border border-dashed border-charcoal-border text-charcoal-muted">
                      <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-40 text-volt" />
                      <p className="font-display font-bold text-lg text-white uppercase">NO PROJECTS CREATED YET</p>
                      <p className="font-mono text-xs mt-1">Use "ADD PROJECT" or "GITHUB IMPORT" to create your first portfolio entry.</p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="mt-4 px-4 py-2 bg-volt text-charcoal font-mono text-xs font-bold rounded uppercase"
                      >
                        CREATE NEW PROJECT
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((proj, idx) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl bg-charcoal-surface border border-charcoal-border hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Left: Reorder controls & Title */}
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleMoveOrder(idx, -1)}
                                disabled={idx === 0}
                                className="p-1 text-charcoal-secondary hover:text-volt disabled:opacity-20"
                                title="Move up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveOrder(idx, 1)}
                                disabled={idx === projects.length - 1}
                                className="p-1 text-charcoal-secondary hover:text-volt disabled:opacity-20"
                                title="Move down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-charcoal-border">
                              <img src={proj.primaryImage} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-base text-white uppercase">
                                  {proj.title}
                                </span>
                                {proj.featured && (
                                  <span className="px-1.5 py-0.5 rounded bg-volt text-charcoal font-mono text-[9px] font-bold">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-xs text-charcoal-secondary">
                                {proj.category} • {proj.tags?.slice(0, 3).join(', ')}
                              </div>
                            </div>
                          </div>

                          {/* Right: Status Toggle & Actions */}
                          <div className="flex items-center gap-3">
                            {/* Publishing State Dropdown */}
                            <select
                              value={proj.status}
                              onChange={(e) => handleQuickStatusChange(proj, e.target.value)}
                              className={`px-3 py-1.5 rounded font-mono text-xs font-bold uppercase outline-none cursor-pointer border ${
                                proj.status === 'PUBLISHED'
                                  ? 'bg-volt/15 text-volt border-volt/40'
                                  : proj.status === 'DRAFT'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                  : 'bg-black/50 text-charcoal-muted border-white/10'
                              }`}
                            >
                              <option value="DRAFT">DRAFT (PRIVATE)</option>
                              <option value="PUBLISHED">PUBLISHED (PUBLIC)</option>
                              <option value="HIDDEN">HIDDEN</option>
                            </select>

                            <button
                              onClick={() => startEdit(proj)}
                              className="p-2 rounded bg-charcoal border border-charcoal-border hover:border-volt text-charcoal-secondary hover:text-white transition-colors"
                              title="Edit project"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="p-2 rounded bg-charcoal border border-charcoal-border hover:border-red-400 text-charcoal-secondary hover:text-red-300 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CREATE / EDIT PROJECT FORM */}
              {activeTab === 'create' && (
                <div className="p-6 rounded-2xl bg-charcoal-surface border border-charcoal-border">
                  <div className="flex items-center justify-between border-b border-charcoal-border pb-4 mb-6">
                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                      {editingProject ? `EDIT: ${editingProject.title}` : 'CREATE NEW PROJECT'}
                    </h3>
                    {editingProject && (
                      <button
                        onClick={resetForm}
                        className="font-mono text-xs text-volt hover:underline"
                      >
                        CANCEL EDIT
                      </button>
                    )}
                  </div>

                  {formMessage.text && (
                    <div className={`mb-6 p-4 rounded font-mono text-xs flex items-center gap-2 ${
                      formMessage.type === 'success' ? 'bg-volt/15 border border-volt/40 text-volt' : 'bg-red-500/15 border border-red-500/40 text-red-300'
                    }`}>
                      {formMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{formMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={(e) => handleSaveProject(e, formData.status)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          PROJECT TITLE * (MAX 100 CHARS)
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g. ORIGIN / NEURAL CORE"
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                          required
                          maxLength={100}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          CATEGORY / DISCIPLINE (MAX 60 CHARS)
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. 2D GAME ENGINE / WEB PLATFORM"
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                          maxLength={60}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                        SUBTITLE / TAGLINE (MAX 120 CHARS)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Short one-line narrative..."
                        className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        maxLength={120}
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                        SHORT DESCRIPTION (MAX 500 CHARS)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Overview displayed on project card..."
                        className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-body text-xs outline-none"
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                        DETAILED SPECIFICATIONS (MODAL INSPECTION VIEW)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.longDescription}
                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        placeholder="In-depth architectural breakdown..."
                        className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-body text-xs outline-none"
                        maxLength={3000}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          PUBLISHING STATUS
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        >
                          <option value="DRAFT">DRAFT (Dashboard Only)</option>
                          <option value="PUBLISHED">PUBLISHED (Live Public)</option>
                          <option value="HIDDEN">HIDDEN (Archived)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          TECHNOLOGY TAGS (COMMA-SEPARATED)
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="e.g. GODOT 4.7, REACT, TYPESCRIPT, GLSL"
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* URLs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          GITHUB REPOSITORY URL
                        </label>
                        <input
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          LIVE DEPLOYMENT URL
                        </label>
                        <input
                          type="url"
                          value={formData.liveUrl}
                          onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-4 py-2.5 rounded bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Image Upload / URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-black/40 border border-charcoal-border">
                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          COVER IMAGE (UPLOAD OR URL)
                        </label>
                        <input
                          type="text"
                          value={formData.primaryImage}
                          onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                          placeholder="Paste image URL..."
                          className="w-full px-4 py-2 rounded bg-black border border-charcoal-border text-white font-mono text-xs outline-none mb-2"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-elevated border border-charcoal-border hover:border-volt text-white font-mono text-xs cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-volt" />
                          <span>{uploadingImage ? 'UPLOADING...' : 'UPLOAD IMAGE FILE (MAX 5MB)'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleImageUpload(e, 'primaryImage')}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                          HOVER REVEAL / SCHEMATIC IMAGE
                        </label>
                        <input
                          type="text"
                          value={formData.revealImage}
                          onChange={(e) => setFormData({ ...formData, revealImage: e.target.value })}
                          placeholder="Paste reveal schematic URL..."
                          className="w-full px-4 py-2 rounded bg-black border border-charcoal-border text-white font-mono text-xs outline-none mb-2"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-charcoal-elevated border border-charcoal-border hover:border-volt text-white font-mono text-xs cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-volt" />
                          <span>UPLOAD REVEAL FILE (MAX 5MB)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleImageUpload(e, 'revealImage')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-charcoal-border">
                      <button
                        type="button"
                        onClick={(e) => handleSaveProject(e, 'DRAFT')}
                        className="px-5 py-2.5 rounded bg-charcoal border border-charcoal-border hover:border-amber-400 text-amber-300 font-mono text-xs uppercase font-semibold"
                      >
                        SAVE AS DRAFT (PRIVATE)
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleSaveProject(e, 'PUBLISHED')}
                        className="px-6 py-2.5 rounded bg-volt text-charcoal font-mono text-xs uppercase font-bold hover:brightness-110 active:scale-95 shadow-md"
                      >
                        PUBLISH TO PORTFOLIO
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: GITHUB IMPORT */}
              {activeTab === 'import' && (
                <div className="p-8 rounded-2xl bg-charcoal-surface border border-charcoal-border max-w-2xl mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-charcoal border border-volt/40 text-volt mb-4 flex items-center justify-center">
                    <Github className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight mb-2">
                    IMPORT PUBLIC GITHUB REPOSITORY
                  </h3>
                  
                  <p className="font-body text-xs text-charcoal-secondary leading-relaxed mb-6">
                    Enter the URL of any public GitHub repository. The metadata (title, description, language, and topics) will be retrieved and prefilled in the editor. You can review and edit before deciding whether to save as draft or publish.
                  </p>

                  {githubError && (
                    <div className="mb-5 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{githubError}</span>
                    </div>
                  )}

                  <form onSubmit={handleFetchGithub} className="space-y-4">
                    <div>
                      <label className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-1.5">
                        GITHUB REPOSITORY URL
                      </label>
                      <input
                        type="text"
                        value={githubUrlInput}
                        onChange={(e) => setGithubUrlInput(e.target.value)}
                        placeholder="https://github.com/owner/repository"
                        className="w-full px-4 py-3 rounded-lg bg-black border border-charcoal-border focus:border-volt text-white font-mono text-xs outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={importingGithub}
                      className="w-full py-3 rounded-lg bg-volt text-charcoal font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {importingGithub ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>FETCHING REPOSITORY DATA...</span>
                        </>
                      ) : (
                        <>
                          <Github className="w-4 h-4" />
                          <span>FETCH & PREFILL PROJECT</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-charcoal-border/60 text-[11px] font-mono text-charcoal-muted">
                    <span className="text-volt font-semibold block mb-1">SAFETY & CONTROL NOTE:</span>
                    Repositories are never automatically published. They require your explicit approval and are prefilled in the editor for thorough review.
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
