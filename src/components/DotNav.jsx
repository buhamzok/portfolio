import { useState, useEffect } from 'react';

const DotNav = ({ activeSection }) => {
  const sections = ['hero', 'about', 'work', 'skills', 'experience', 'contact'];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === section
              ? 'bg-accent-primary scale-125 shadow-glow'
              : 'bg-text-muted/30 hover:bg-text-muted'
          }`}
          aria-label={`Scroll to ${section}`}
        />
      ))}
    </div>
  );
};

export default DotNav;
