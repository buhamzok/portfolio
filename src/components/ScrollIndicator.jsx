import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
      <span className="text-xs text-text-muted font-mono">Scroll</span>
      <ChevronDown className="w-5 h-5 text-accent-primary" />
    </div>
  );
};

export default ScrollIndicator;
