import React, { useState } from 'react';

const SkillOrb = ({ name, proficiency, years, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative stagger-child"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowTooltip(false); }}
      onClick={() => setShowTooltip(!showTooltip)}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`glass px-6 py-3 flex items-center gap-3 cursor-pointer transition-all duration-300 ${
          isHovered ? 'scale-110 glow-sm border-accent-primary/50' : ''
        }`}
      >
        <span className="text-sm font-medium text-text-primary">{name}</span>
        {isHovered && (
          <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500"
              style={{ width: `${proficiency}%` }}
            />
          </div>
        )}
      </div>
      {showTooltip && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-3 py-1 text-xs text-text-primary whitespace-nowrap z-10 animate-float">
          {years} years experience
        </div>
      )}
    </div>
  );
};

export default SkillOrb;
