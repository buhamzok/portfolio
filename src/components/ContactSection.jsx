import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import ContactForm from './ContactForm';
import content from '../data/content.json';

const ContactSection = () => {
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

  const socials = [
    { icon: <Github className="w-5 h-5" />, link: content.social.github, label: 'GitHub' },
    { icon: <Linkedin className="w-5 h-5" />, link: content.social.linkedin, label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, link: content.social.twitter, label: 'Twitter' },
    { icon: <Mail className="w-5 h-5" />, link: `mailto:${content.personal.email}`, label: 'Email' },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 section-fade">
        <span className="stagger-child text-accent-primary text-sm font-medium tracking-widest mb-4 block">
          05
        </span>
        <h2 className="stagger-child text-3xl lg:text-5xl font-bold text-text-primary mb-12">
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Info */}
          <div>
            <p className="stagger-child text-text-secondary text-lg mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>

            <div className="stagger-child flex gap-4 mb-8">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass rounded-xl flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {content.badges.length > 0 && (
              <div className="stagger-child">
                <h3 className="text-sm text-text-muted mb-3 font-mono">Certifications</h3>
                {content.badges.map((badge, i) => (
                  <a
                    key={i}
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass px-4 py-3 flex items-center gap-3 hover:border-accent-primary transition-all inline-flex"
                  >
                    <span className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary text-xs font-bold">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{badge.title}</p>
                      <p className="text-xs text-text-muted">{badge.issuer}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right — Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
