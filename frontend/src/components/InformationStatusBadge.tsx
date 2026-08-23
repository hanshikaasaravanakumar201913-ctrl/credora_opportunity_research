import React from 'react';
import { VerificationStatus } from '../types/index.js';
import { CheckCircle2, AlertCircle, Clock, Shuffle, XCircle } from 'lucide-react';

interface InformationStatusBadgeProps {
  status: VerificationStatus | string;
  size?: 'sm' | 'md';
}

export const InformationStatusBadge: React.FC<InformationStatusBadgeProps> = ({
  status,
  size = 'md'
}) => {
  const getConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle2,
          label: 'Verified Source',
          classes: 'bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-700/30'
        };
      case 'POSSIBLY_OUTDATED':
        return {
          icon: Clock,
          label: 'Possibly Outdated',
          classes: 'bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-700/30'
        };
      case 'INCOMPLETE':
        return {
          icon: AlertCircle,
          label: 'Incomplete Evidence',
          classes: 'bg-stone-900/20 text-stone-700 dark:text-stone-300 border-stone-600/30'
        };
      case 'CONFLICTING':
        return {
          icon: Shuffle,
          label: 'Conflicting Information',
          classes: 'bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-700/30'
        };
      case 'NOT_VERIFIED':
      default:
        return {
          icon: XCircle,
          label: 'Unverified',
          classes: 'bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-700/30'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-mono border ${config.classes} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
