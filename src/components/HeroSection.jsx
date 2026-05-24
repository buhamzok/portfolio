import { useEffect, useRef } from 'react';
import ThreeCanvas from './ThreeCanvas';
import StatWidget from './StatWidget';
import TechIconCard from './TechIconCard';
import ScrollIndicator from './ScrollIndicator';
import content from '../data/content.json';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Text Content */}
        <div className="z-10">
          <span className="text-accent-primary font-mono text-sm tracking-widest uppercase mb-4 block">
            {content.personal.role}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
            Crafting digital products with{' '}
            <span className="text-gradient glow-sm">purpose.</span>
          </h1>
          <p className="text-text-secondary text-base lg:text-lg max-w-lg mb-8 leading-relaxed">
            {content.personal.bio}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#work"
              className="px-6 py-3 rounded-full bg-gradient-orange text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              View My Work
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 rounded-full border border-accent-primary/50 text-accent-primary font-semibold hover:bg-accent-primary/10 transition-all"
            >
              Download CV
            </a>
          </div>
        </div>

        {/* Right 3D Canvas */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
          <ThreeCanvas />
          <StatWidget
            value="25+"
            label="Projects"
            className="absolute top-8 left-8 animate-float"
          />
          <StatWidget
            value="15+"
            label="Happy Clients"
            className="absolute bottom-8 right-8 animate-float"
            style={{ animationDelay: '1.5s' }}
          />
          <TechIconCard
            icon="TypeScript"
            label="TS"
            className="absolute top-12 right-16"
          />
          <TechIconCard
            icon="React"
            label="React"
            className="absolute bottom-16 left-12"
          />
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
