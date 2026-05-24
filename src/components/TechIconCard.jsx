import { Code2, Atom } from 'lucide-react';

const iconMap = {
  TypeScript: <Code2 className="w-5 h-5 text-accent-primary" />,
  React: <Atom className="w-5 h-5 text-accent-primary" />,
};

const TechIconCard = ({ icon, label, className = '' }) => {
  return (
    <div className={`glass w-10 h-10 rounded-xl flex items-center justify-center ${className}`}>
      {iconMap[icon] || <Code2 className="w-5 h-5 text-accent-primary" />}
      {label && (
        <span className="absolute -bottom-5 text-[10px] font-mono text-text-muted">{label}</span>
      )}
    </div>
  );
};

export default TechIconCard;
