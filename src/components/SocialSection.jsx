import React, { useState } from 'react';
import { socialLinks } from '../data/portfolioData';
import { Github, Mail, Instagram, Linkedin, ArrowUpRight, Check, Copy, Sparkles } from 'lucide-react';

/**
 * SocialSection — High-Impact Editorial Social & Contact Gateway
 * Displays active confirmed profiles (Instagram, GitHub, Email) with elegant hover physics.
 * LinkedIn remains configurable and hidden until profile URL is supplied.
 */
export default function SocialSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (socialLinks.email?.url) {
      const email = socialLinks.email.url.replace('mailto:', '');
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  // Only render active profiles. Inactive profiles (e.g. LinkedIn) remain strictly hidden.
  const activeProfiles = Object.values(socialLinks).filter(link => link.active && link.url);

  const getSocialIcon = (id) => {
    switch (id) {
      case 'instagram':
        return <Instagram className="w-6 h-6" />;
      case 'github':
        return <Github className="w-6 h-6" />;
      case 'email':
        return <Mail className="w-6 h-6" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section 
      id="connect" 
      className="relative py-24 md:py-36 bg-paper-tint text-paper-ink border-b border-paper-border overflow-hidden"
    >
      {/* Editorial Decorative Grid & Registration Crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-[1600px] h-full mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="col-span-1 border-r border-paper-border/60 h-full"></div>
          <div className="col-span-10 border-r border-paper-border/60 h-full hidden md:block"></div>
          <div className="col-span-1 h-full"></div>
        </div>
        <div className="absolute top-12 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute top-12 right-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-12 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-12 right-6 text-paper-ink/30 font-mono text-xs">+</div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-paper-border pb-8 mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-volt-deep uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-volt-deep animate-ping"></span>
              <span>[05] // NETWORK & CHANNELS</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-paper-ink uppercase tracking-tight leading-none">
              CONNECT WITH ME
            </h2>
          </div>

          <div className="max-w-md font-mono text-xs text-paper-secondary text-left md:text-right">
            <span>DIRECT SOCIAL PROFILES & COMMUNICATION CHANNELS. VERIFIED LINKS ONLY.</span>
            <div className="mt-2 text-volt-deep font-bold">[CLICKABLE CHANNELS • OPENS NEW TAB]</div>
          </div>
        </div>

        {/* Dynamic Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {activeProfiles.map((channel, index) => {
            const isEmail = channel.id === 'email';

            return (
              <a
                key={channel.id}
                href={channel.url}
                target={isEmail ? '_self' : '_blank'}
                rel={isEmail ? '' : 'noopener noreferrer'}
                className="relative p-8 rounded-2xl bg-paper-pure border border-paper-border hover:border-volt hover:shadow-[0_10px_35px_rgba(210,253,82,0.22)] transition-all duration-300 group flex flex-col justify-between min-h-[260px] cursor-pointer"
              >
                {/* Card Top Stamp */}
                <div className="flex items-center justify-between font-mono text-xs text-paper-secondary uppercase tracking-widest pb-4 border-b border-paper-border">
                  <span className="font-bold text-volt-deep">0{index + 1} // {channel.id.toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded bg-paper-tint border border-paper-border text-[10px] text-paper-ink">
                    VERIFIED
                  </span>
                </div>

                {/* Card Center: Icon & Handle */}
                <div className="my-6">
                  <div className="w-12 h-12 rounded-xl bg-paper-ink text-volt flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-volt group-hover:text-paper-ink transition-all duration-300 shadow-md">
                    {getSocialIcon(channel.id)}
                  </div>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-paper-ink group-hover:text-volt-deep transition-colors">
                    {channel.label}
                  </h3>
                  <div className="font-mono text-xs text-volt-deep font-semibold tracking-wider mt-1 break-all">
                    {channel.handle}
                  </div>
                  <p className="mt-3 font-body text-sm text-paper-secondary leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {/* Card Bottom Action */}
                <div className="pt-4 border-t border-paper-border flex items-center justify-between font-mono text-xs text-paper-ink">
                  <span className="font-semibold group-hover:underline decoration-volt underline-offset-4 flex items-center gap-1">
                    {isEmail ? 'SEND DIRECT EMAIL' : `OPEN ${channel.label.toUpperCase()}`}
                  </span>
                  
                  {isEmail ? (
                    <button
                      onClick={handleCopyEmail}
                      className="p-2 rounded hover:bg-paper-tint text-paper-secondary hover:text-paper-ink transition-colors flex items-center gap-1"
                      title="Copy email address"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-volt-deep" /> : <Copy className="w-4 h-4" />}
                      <span className="text-[10px]">{copiedEmail ? 'COPIED' : 'COPY'}</span>
                    </button>
                  ) : (
                    <span className="w-8 h-8 rounded-full border border-paper-border flex items-center justify-center group-hover:bg-volt group-hover:border-volt group-hover:text-paper-ink group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Informative Note for Reserved Profiles */}
        {!socialLinks.linkedin?.active && (
          <div className="mt-8 px-6 py-4 rounded-xl bg-paper-pure border border-paper-border/80 flex items-center justify-between font-mono text-xs text-paper-secondary">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-paper-muted"></span>
              <span>LINKEDIN: PROFILE RESERVED // COMING SOON</span>
            </span>
            <span className="text-[10px] text-paper-muted">[CONFIGURABLE IN PORTFOLIO_DATA.JS]</span>
          </div>
        )}

      </div>
    </section>
  );
}

