import { Briefcase } from 'lucide-react';

const ExperienceCard = ({ role, company, date, bullets, side, index }) => {
  const isLeft = side === 'left';

  return (
    <div className={`relative stagger-child flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
      {/* Timeline node */}
      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent-primary hidden md:block z-10" />

      {/* Card */}
      <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
        <div className="glass p-6">
          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{role}</h3>
              <p className="text-sm text-accent-primary">{company}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted mb-3 font-mono">{date}</p>
          <ul className={`space-y-2 ${isLeft ? 'md:items-end' : ''}`}>
            {bullets.map((bullet, i) => (
              <li key={i} className={`text-sm text-text-secondary flex gap-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                <span className="text-accent-primary mt-1 flex-shrink-0">•</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Spacer for timeline alignment */}
      <div className="flex-1 hidden md:block" />
    </div>
  );
};

export default ExperienceCard;
