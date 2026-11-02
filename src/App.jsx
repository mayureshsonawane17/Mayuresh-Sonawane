import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';

import Navigation from './components/Navigation';
import TransitionPanel from './components/TransitionPanel';
import Hero from './components/Hero';
import HomeMarquee from './components/HomeMarquee';
import About from './components/About';
import BuildExploreSplit from './components/BuildExploreSplit';
import MaskCollection from './components/MaskCollection';
import ProjectHallOfFame from './components/ProjectHallOfFame';
import Journey from './components/Journey';
import SocialSection from './components/SocialSection';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [transitionTitle, setTransitionTitle] = useState('SYSTEM INITIALIZING');
  const [inspectedProject, setInspectedProject] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);

  // Check URL hash for direct #admin route access
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setAdminOpen(true);
    }
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize smooth scrolling with Lenis (respects reduced motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const handleTriggerTransition = (title = 'TRANSFERRING VIEWPORT') => {
    setTransitionTitle(title);
    setTransitionOpen(true);
  };

  const handleSelectCategory = (category) => {
    handleTriggerTransition(`${category} TRAJECTORY`);
    setTimeout(() => {
      const el = document.getElementById('hall-of-fame');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  const handleProjectsUpdated = () => {
    setProjectsRefreshKey(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-paper text-paper-ink selection:bg-volt selection:text-paper-ink">
      
      {/* Signature Geometric Lime Page Transition Panel */}
      <TransitionPanel 
        isOpen={transitionOpen} 
        onClose={() => setTransitionOpen(false)} 
        destinationTitle={transitionTitle}
      />

      {/* Global Editorial Navigation */}
      <Navigation 
        onTriggerTransition={handleTriggerTransition} 
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Narrative Landmark */}
      <main>
        {/* 00. Hero: Cinematic Portrait-Led Opening */}
        <Hero 
          onExploreClick={() => handleTriggerTransition('PORTRAIT-TO-CARD DOCK')} 
        />

        {/* Continuous Kinetic Marquee Ribbon (Directly adapted from landonorris.com) */}
        <HomeMarquee />

        {/* 01. About: "A Message from Me" with Docked Card & Handwritten Signature */}
        <About />

        {/* 02. Dual Editorial Storytelling: BUILD & EXPLORE */}
        <BuildExploreSplit onSelectCategory={handleSelectCategory} />

        {/* 03. The Mask Collection: Spider-Man Mask Editorial Showcase */}
        <MaskCollection />

        {/* 04. Project Hall of Fame: Interactive Collectible Grid (Initially Empty State) */}
        <ProjectHallOfFame 
          onInspectProject={(project) => setInspectedProject(project)} 
          onOpenAdmin={() => setAdminOpen(true)}
          refreshTrigger={projectsRefreshKey}
        />

        {/* 05. Journey: Horizontally Moving Documentary Photo Strip */}
        <Journey />

        {/* 06. Dedicated Social & Contact Channels Section */}
        <SocialSection />
      </main>

      {/* Editorial Footer with Live System Clock */}
      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* Interactive Project Inspection Modal */}
      <ProjectModal 
        project={inspectedProject} 
        onClose={() => setInspectedProject(null)} 
      />

      {/* Protected Admin Project Management Dashboard */}
      <AdminDashboard 
        isOpen={adminOpen} 
        onClose={() => setAdminOpen(false)} 
        onProjectsUpdated={handleProjectsUpdated}
      />

    </div>
  );
}
