import React, { useState, useEffect } from 'react';
import Monogram from './Monogram';
import { ArrowUpRight, Menu, X, Sparkles, Cpu, Shield } from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolioData';

export default function Navigation({ onTriggerTransition, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky global nav when scrolled past hero opening
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '[01] MESSAGE', href: '#about', title: 'A MESSAGE FROM ME' },
    { label: '[02] BUILD', href: '#build-explore', title: 'BUILD & EXPLORE' },
    { label: '[03] MASK', href: '#mask-collection', title: 'THE MASK COLLECTION' },
    { label: '[04] HALL OF FAME', href: '#hall-of-fame', title: 'PROJECT HALL OF FAME' },
    { label: '[05] JOURNEY', href: '#journey', title: 'JOURNEY & ACHIEVEMENTS' },
    { label: '[06] CONNECT', href: '#connect', title: 'CONNECT WITH ME' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onTriggerTransition) {
      onTriggerTransition(link.title);
    }
    setTimeout(() => {
      const target = document.querySelector(link.href);
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { offset: -40, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 500);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-md border-b border-paper-border/60 transition-all duration-300 shadow-xs ${
      scrolled ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand & Monogram */}
        <div className="nav-item flex items-center gap-4">
          <a 
            href="#hero" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-volt"
            aria-label="Mayuresh Sonawane - Home"
          >
            <div className="p-1.5 bg-paper-ink text-paper rounded transition-transform group-hover:scale-105 duration-300">
              <Monogram className="w-5 h-5 text-paper" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-display font-bold text-sm tracking-tight uppercase leading-none">
                {personalInfo.name}
              </span>
              <span className="font-mono text-[10px] text-paper-secondary tracking-widest uppercase mt-0.5">
                {personalInfo.title}
              </span>
            </div>
          </a>

          {/* Telemetry Availability Beacon (No Location) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-paper-tint border border-paper-border text-paper-ink whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-volt border border-volt-deep animate-volt-pulse shrink-0"></span>
            <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
              <span className="hidden 2xl:inline">{personalInfo.statusBadge}</span>
              <span className="inline 2xl:hidden">AVAILABLE 2026</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-item hidden xl:flex items-center gap-4 2xl:gap-6 font-mono text-[11px] 2xl:text-xs tracking-wider whitespace-nowrap shrink-0" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-paper-ink/80 hover:text-paper-ink hover:underline decoration-volt decoration-2 underline-offset-8 transition-colors duration-200 whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="nav-item flex items-center gap-2.5 sm:gap-3">
          {/* Admin Dashboard Pill */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-charcoal text-white hover:text-volt border border-charcoal-border hover:border-volt font-mono text-[11px] font-semibold tracking-wider uppercase transition-all shadow-sm"
              title="Open protected project management dashboard"
            >
              <Cpu className="w-3.5 h-3.5 text-volt" />
              <span className="hidden sm:inline">ADMIN</span>
            </button>
          )}

          {/* Transition Demo Pill */}
          <button
            onClick={() => onTriggerTransition && onTriggerTransition('INSPECTING ARCHITECTURE')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-volt text-paper-ink font-mono text-[11px] font-semibold tracking-wider uppercase hover:brightness-105 active:scale-95 transition-all shadow-sm"
            title="Preview signature lime page transition panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-paper-ink" />
            <span>TRANSITION WIPE</span>
          </button>

          {/* Direct Contact Button */}
          <a
            href={socialLinks.email.url}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-paper-ink text-paper font-mono text-xs uppercase tracking-wider hover:bg-paper-ink/90 active:scale-95 transition-all"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-paper-ink hover:bg-paper-tint rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated thin hairline border */}
      <div className="nav-hairline absolute bottom-0 left-0 right-0 h-[1px] bg-paper-border origin-left" />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-paper border-b border-paper-border px-6 py-6 font-mono text-sm tracking-wider flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-paper-border text-xs text-paper-secondary">
            <span className="w-2 h-2 rounded-full bg-volt"></span>
            <span>INDEX & DIRECTORY</span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="py-1 text-paper-ink hover:text-volt-deep font-semibold"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-paper-border flex gap-2">
            {onOpenAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="flex-1 py-2.5 bg-charcoal text-volt border border-volt/30 font-semibold text-center rounded uppercase text-xs tracking-wider"
              >
                ADMIN DASHBOARD
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerTransition && onTriggerTransition('SYSTEM READY');
              }}
              className="flex-1 py-2.5 bg-volt text-paper-ink font-semibold text-center rounded uppercase text-xs tracking-wider"
            >
              LIME TRANSITION
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
