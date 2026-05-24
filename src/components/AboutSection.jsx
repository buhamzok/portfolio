import React, { useEffect, useRef } from 'react';
import StatCard from './StatCard';
import content from '../data/content.json';

const AboutSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 150);
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: 'calendar', value: content.stats.years, label: 'Years Experience' },
    { icon: 'code', value: content.stats.projects, label: 'Projects Completed' },
    { icon: 'users', value: content.stats.clients, label: 'Happy Clients' },
    { icon: 'heart', value: content.stats.commitment, label: 'Commitment' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 section-fade">
        <span className="stagger-child text-accent-primary text-sm font-medium tracking-widest mb-4 block">
          01
        </span>
        <h2 className="stagger-child text-3xl lg:text-5xl font-bold text-text-primary mb-8">
          About me
        </h2>
        <p className="stagger-child text-text-secondary text-base lg:text-lg max-w-2xl leading-relaxed mb-12">
          {content.personal.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} icon={stat.icon} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
