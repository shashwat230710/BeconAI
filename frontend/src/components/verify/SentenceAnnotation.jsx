import React from 'react';
import { cn } from '../../utils/helpers';

export const SentenceAnnotation = ({ claim, onClick, isActive }) => {
  const verdictColors = {
    verified: 'bg-verified-green/20 border-verified-green/50 text-verified-green',
    misleading: 'bg-misleading-amber/20 border-misleading-amber/50 text-misleading-amber',
    false: 'bg-false-red/20 border-false-red/50 text-false-red',
    exaggerated: 'bg-opinion-purple/20 border-opinion-purple/50 text-opinion-purple',
  };

  const colorClass = verdictColors[claim.verdict] || 'bg-white/5 border-white/20';

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline text-text-inverse leading-relaxed cursor-pointer transition-all border-b-2",
        colorClass,
        isActive ? "bg-opacity-40 ring-2 ring-white/20 rounded px-1" : "hover:bg-opacity-30"
      )}
      title={`Click to view evidence: ${claim.verdict}`}
    >
      {claim.original_sentence}{' '}
    </span>
  );
};
