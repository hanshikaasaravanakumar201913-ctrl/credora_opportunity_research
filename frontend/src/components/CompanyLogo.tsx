import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  name: string;
  domain?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  domain,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute initials fallback
  const getInitials = (str: string) => {
    if (!str) return 'CR';
    const words = str.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // Compute source image
  const resolvedSrc = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0])}&sz=128` : null);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-lg rounded-2xl',
    xl: 'w-18 h-18 text-2xl rounded-3xl'
  }[size];

  if (!resolvedSrc || imageError) {
    return (
      <div
        className={`${sizeClasses} bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] font-mono font-extrabold flex items-center justify-center border border-[#BAA88B] dark:border-dark-border shadow-sm shrink-0 select-none ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-[#F7EFE1] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-dark-border flex items-center justify-center overflow-hidden p-1.5 shadow-sm shrink-0 ${className}`}
    >
      <img
        src={resolvedSrc}
        alt={`${name} logo`}
        onError={() => setImageError(true)}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
};
