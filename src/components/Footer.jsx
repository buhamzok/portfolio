const Footer = () => {
  return (
    <footer className="py-8 border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Elijah Buhamizo. All rights reserved.
        </p>
        <p className="text-sm text-text-muted">
          Built with React, Tailwind & Three.js
        </p>
      </div>
    </footer>
  );
};

export default Footer;
