import React from 'react';
import { RiskLevel } from '../types/index.js';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface RiskLevelBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'LOW_RISK':
        return {
          icon: ShieldCheck,
          label: 'Low Risk',
          classes: 'bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-800/30',
        };
      case 'MODERATE_RISK':
        return {
          icon: AlertTriangle,
          label: 'Moderate Risk',
          classes: 'bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-800/30',
        };
      case 'HIGH_RISK':
        return {
          icon: AlertOctagon,
          label: 'High Risk',
          classes: 'bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-800/30',
        };
      case 'INSUFFICIENT_INFORMATION':
      default:
        return {
          icon: HelpCircle,
          label: 'Insufficient Information',
          classes: 'bg-stone-900/20 text-stone-700 dark:text-stone-300 border-stone-600/30',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono border ${config.classes} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
