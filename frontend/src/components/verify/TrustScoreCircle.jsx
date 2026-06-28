import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

export const TrustScoreCircle = ({ score, size = 'md' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple counter animation
    const target = Math.round(score * 100);
    const duration = 1500; // ms
    const stepTime = Math.abs(Math.floor(duration / target));
    
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setAnimatedScore(current);
      if (current >= target) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  const percentage = Math.round(score * 100);
  const colorClass = percentage >= 70 ? 'text-verified-green stroke-verified-green' : 
                     percentage >= 40 ? 'text-misleading-amber stroke-misleading-amber' : 
                     'text-false-red stroke-false-red';

  const sizes = {
    sm: { width: 64, stroke: 4, text: 'text-lg' },
    md: { width: 120, stroke: 8, text: 'text-3xl' },
    lg: { width: 160, stroke: 12, text: 'text-5xl' }
  };
  
  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width, height: width }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-white/10"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("transition-all duration-1000", colorClass.split(' ')[1])}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("font-display font-bold", text, colorClass.split(' ')[0])}>
          {animatedScore}%
        </span>
      </div>
    </div>
  );
};
