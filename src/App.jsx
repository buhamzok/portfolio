import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import DotNav from './components/DotNav';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WorkSection from './components/WorkSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const sectionsRef = useRef([]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'work', 'skills', 'experience', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <DotNav activeSection={activeSection} />

      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
