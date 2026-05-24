import { Layers } from 'lucide-react';

const StatWidget = ({ value, label, className = '' }) => {
  return (
    <div className={`glass px-5 py-4 flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-gradient-orange flex items-center justify-center">
        <Layers className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-lg font-bold text-text-primary">{value}</div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
    </div>
  );
};

export default StatWidget;
