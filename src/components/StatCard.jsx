import React, { useEffect, useRef } from 'react';
import { Calendar, Code2, Users, Heart } from 'lucide-react';

const iconMap = {
  calendar: <Calendar className="w-6 h-6 text-accent-primary" />,
  code: <Code2 className="w-6 h-6 text-accent-primary" />,
  users: <Users className="w-6 h-6 text-accent-primary" />,
  heart: <Heart className="w-6 h-6 text-accent-primary" />,
};

const StatCard = ({ icon, value, label, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="glass p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 stagger-child"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4">
        {iconMap[icon] || <Code2 className="w-6 h-6 text-accent-primary" />}
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
    </div>
  );
};

export default StatCard;
