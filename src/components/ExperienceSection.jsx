import React, { useEffect, useRef } from 'react';
import ExperienceCard from './ExperienceCard';
import content from '../data/content.json';

const ExperienceSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 200);
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div ref={sectionRef} className="max-w-5xl mx-auto px-6 section-fade">
        <span className="stagger-child text-accent-primary text-sm font-medium tracking-widest mb-4 block">
          04
        </span>
        <h2 className="stagger-child text-3xl lg:text-5xl font-bold text-text-primary mb-16">
          Experience
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent hidden md:block" />

          <div className="space-y-12">
            {content.experience.map((exp, i) => (
              <ExperienceCard key={i} {...exp} side={i % 2 === 0 ? 'left' : 'right'} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
