import React from 'react';
import { cn } from '../../utils/helpers';
import { CheckCircle, AlertTriangle, XCircle, Info, Bot } from 'lucide-react';

export const VerdictBadge = ({ verdict, className }) => {
  const configs = {
    verified: { icon: CheckCircle, label: 'Verified', classes: 'bg-verified-green/20 text-verified-green border-verified-green/30' },
    misleading: { icon: AlertTriangle, label: 'Misleading', classes: 'bg-misleading-amber/20 text-misleading-amber border-misleading-amber/30' },
    false: { icon: XCircle, label: 'False', classes: 'bg-false-red/20 text-false-red border-false-red/30' },
    exaggerated: { icon: Info, label: 'Exaggerated', classes: 'bg-opinion-purple/20 text-opinion-purple border-opinion-purple/30' },
    ai_generated: { icon: Bot, label: 'AI Generated', classes: 'bg-ai-generated-teal/20 text-ai-generated-teal border-ai-generated-teal/30' }
  };

  const config = configs[verdict] || configs.misleading;
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-lg", config.classes, className)}>
      <Icon className="w-5 h-5" />
      {config.label}
    </div>
  );
};
