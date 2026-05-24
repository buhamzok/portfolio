import React, { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import content from '../data/content.json';

const WorkSection = () => {
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
    <section id="work" className="py-24 lg:py-32">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 section-fade">
        <span className="stagger-child text-accent-primary text-sm font-medium tracking-widest mb-4 block">
          02
        </span>
        <h2 className="stagger-child text-3xl lg:text-5xl font-bold text-text-primary mb-12">
          Featured Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.projects.map((project, i) => (
            <ProjectCard key={i} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
