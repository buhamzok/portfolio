import React, { useEffect, useRef } from 'react';
import { Link } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass bg-opacity-80' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-text-primary flex items-center gap-3">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          buhamzok<span className="text-accent-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['about', 'work', 'skills', 'experience', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-sm text-text-secondary hover:text-accent-primary transition-colors capitalize"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full glass hover:bg-accent-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-orange text-white hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            Let's Talk
            <Link className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
