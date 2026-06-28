import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-opinion-purple";
  
  const variants = {
    default: "bg-surface-light text-text-primary",
    verified: "bg-verified-green/20 text-verified-green border border-verified-green/30",
    misleading: "bg-misleading-amber/20 text-misleading-amber border border-misleading-amber/30",
    false: "bg-false-red/20 text-false-red border border-false-red/30",
    exaggerated: "bg-opinion-purple/20 text-opinion-purple border border-opinion-purple/30",
    aiGenerated: "bg-ai-generated-teal/20 text-ai-generated-teal border border-ai-generated-teal/30",
    neutral: "bg-neutral-gray/20 text-neutral-gray border border-neutral-gray/30",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";
