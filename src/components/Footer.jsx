import React, { useState, useEffect } from 'react';
import Monogram from './Monogram';
import { ArrowUp, ArrowUpRight, Clock, Terminal, Mail, Github, Instagram, Linkedin, Cpu } from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolioData';

export default function Footer({ onOpenAdmin }) {
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toTimeString().split(' ')[0]);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-paper text-paper-ink border-t border-paper-border pt-20 pb-12 overflow-hidden">
      
      {/* Decorative hairline grid & registration crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-[1600px] h-full mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="col-span-1 border-r border-paper-border/40 h-full"></div>
          <div className="col-span-10 border-r border-paper-border/40 h-full hidden md:block"></div>
          <div className="col-span-1 h-full"></div>
        </div>
        <div className="absolute top-8 left-6 text-paper-ink/20 font-mono text-xs">+</div>
        <div className="absolute top-8 right-6 text-paper-ink/20 font-mono text-xs">+</div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* Giant Editorial Statement */}
        <div className="border-b border-paper-border pb-16">
          <div className="flex items-center gap-2 font-mono text-xs text-volt-deep uppercase tracking-widest mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>CONNECT & COLLABORATE</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] max-w-5xl">
            LET'S ARCHITECT THE NEXT BREAKTHROUGH.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={socialLinks.email.url}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-paper-ink text-paper font-mono text-xs uppercase tracking-widest font-semibold hover:bg-volt hover:text-paper-ink transition-all shadow-md active:scale-95"
            >
              <span>INITIATE CONVERSATION</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="px-4 py-3 rounded border border-paper-border font-mono text-xs text-paper-secondary flex items-center gap-2 bg-paper-pure">
              <Clock className="w-3.5 h-3.5 text-volt-deep" />
              <span>SYSTEM CLOCK: {systemTime || '12:00:00'}</span>
            </div>

            {/* Admin Console Entry Pill */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-4 py-3 rounded border border-paper-border font-mono text-xs text-paper-secondary hover:text-paper-ink hover:border-volt flex items-center gap-1.5 bg-paper-pure transition-colors"
                title="Open project management dashboard"
              >
                <Cpu className="w-3.5 h-3.5 text-volt-deep" />
                <span>ADMIN CONSOLE</span>
              </button>
            )}
          </div>
        </div>

        {/* Asymmetric Footer Links Grid */}
        <div className="py-12 border-b border-paper-border grid grid-cols-1 md:grid-cols-4 gap-8 font-mono text-xs">
          
          {/* Col 1: Identity & Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-paper-ink text-paper rounded">
                <Monogram className="w-5 h-5 text-paper" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight uppercase">
                {personalInfo.name}
              </span>
            </div>
            <p className="text-paper-secondary text-[11px] leading-relaxed">
              {personalInfo.title} exploring websites, games, and interactive digital experiences.
            </p>
            <div className="p-2 rounded bg-paper-tint border border-paper-border text-[10px] text-paper-secondary">
              <span className="text-volt-deep font-semibold">{personalInfo.systemStatus}</span>
            </div>
          </div>

          {/* Col 2: Navigation Directory */}
          <div className="space-y-2">
            <span className="text-paper-muted uppercase tracking-widest text-[10px] block mb-2">DIRECTORY</span>
            <div><a href="#hero" className="hover:text-volt-deep transition-colors">00 // HOME</a></div>
            <div><a href="#about" className="hover:text-volt-deep transition-colors">01 // A MESSAGE FROM ME</a></div>
            <div><a href="#build-explore" className="hover:text-volt-deep transition-colors">02 // BUILD & EXPLORE</a></div>
            <div><a href="#mask-collection" className="hover:text-volt-deep transition-colors">03 // THE MASK COLLECTION</a></div>
            <div><a href="#hall-of-fame" className="hover:text-volt-deep transition-colors">04 // PROJECT HALL OF FAME</a></div>
            <div><a href="#journey" className="hover:text-volt-deep transition-colors">05 // JOURNEY & ACHIEVEMENTS</a></div>
            <div><a href="#connect" className="hover:text-volt-deep transition-colors">06 // CONNECT</a></div>
          </div>

          {/* Col 3: Social & External Channels (Only Verified Active Links) */}
          <div className="space-y-2">
            <span className="text-paper-muted uppercase tracking-widest text-[10px] block mb-2">CONFIRMED CHANNELS</span>
            
            {/* Instagram */}
            {socialLinks.instagram?.active && (
              <div>
                <a 
                  href={socialLinks.instagram.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-volt-deep transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Instagram className="w-3.5 h-3.5 text-paper-secondary group-hover:text-volt-deep" />
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3 h-3 text-paper-muted" />
                </a>
              </div>
            )}

            {/* GitHub */}
            {socialLinks.github?.active && (
              <div>
                <a 
                  href={socialLinks.github.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-volt-deep transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Github className="w-3.5 h-3.5 text-paper-secondary group-hover:text-volt-deep" />
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3 h-3 text-paper-muted" />
                </a>
              </div>
            )}

            {/* Email */}
            {socialLinks.email?.active && (
              <div>
                <a 
                  href={socialLinks.email.url} 
                  className="hover:text-volt-deep transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Mail className="w-3.5 h-3.5 text-paper-secondary group-hover:text-volt-deep" />
                  <span>EMAIL</span>
                  <ArrowUpRight className="w-3 h-3 text-paper-muted" />
                </a>
              </div>
            )}

            {/* LinkedIn: Strictly hidden when inactive */}
            {socialLinks.linkedin?.active && socialLinks.linkedin?.url && (
              <div>
                <a 
                  href={socialLinks.linkedin.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-volt-deep transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Linkedin className="w-3.5 h-3.5 text-paper-secondary group-hover:text-volt-deep" />
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3 h-3 text-paper-muted" />
                </a>
              </div>
            )}
          </div>

          {/* Col 4: Design & Technical Heritage */}
          <div className="space-y-3">
            <span className="text-paper-muted uppercase tracking-widest text-[10px] block mb-2">HERITAGE</span>
            <p className="text-paper-secondary text-[11px] leading-relaxed">
              Visual storytelling and interaction architecture adapted from the award-winning <span className="font-semibold text-paper-ink">landonorris.com</span> (OFF+BRAND).
            </p>
            <div className="p-2.5 rounded bg-paper-tint border border-paper-border text-[10px] text-paper-secondary">
              <span>STACK: REACT • THREE.JS • GLSL • GSAP • LENIS • RIVE</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-paper-muted">
          <div>
            © 2026 {personalInfo.name.toUpperCase()}. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-volt-deep font-semibold">PHASE 3 MASTER SPECIFICATION</span>
            
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1 rounded border border-paper-border hover:bg-paper-tint text-paper-ink transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
