import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

const ProjectCard = ({ title, description, tags, image, link, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group glass overflow-hidden stagger-child hover:scale-[1.03] transition-transform duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="flex items-center gap-2 text-accent-primary font-semibold">
            View Project <ExternalLink className="w-4 h-4" />
          </span>
        </a>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-accent-primary/10 text-accent-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
