import React, { useState, useEffect } from 'react';
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
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    setImageError(false);
    setFaviconError(false);
  }, [logoUrl, domain, name]);

  // Compute initials fallback
  const getInitials = (str: string) => {
    if (!str) return 'CR';
    const clean = str.replace(/\b(the|inc|ltd|pvt|llc|co)\b/gi, '').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (clean.slice(0, 2) || str.slice(0, 2)).toUpperCase();
  };

  const initials = getInitials(name);

  // Compute clean domain
  const cleanDomain = domain ? domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : null;

  // Determine current image to try: direct logoUrl first, then domain favicon
  let currentSrc: string | null = null;
  if (logoUrl && !imageError) {
    currentSrc = logoUrl;
  } else if (cleanDomain && cleanDomain.includes('.') && !faviconError) {
    currentSrc = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`;
  }

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-lg rounded-2xl',
    xl: 'w-18 h-18 text-2xl rounded-3xl'
  }[size];

  const handleImageError = () => {
    if (logoUrl && !imageError) {
      setImageError(true);
    } else {
      setFaviconError(true);
    }
  };

  if (!currentSrc || (imageError && faviconError)) {
    return (
      <div
        className={`${sizeClasses} bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] font-mono font-extrabold flex items-center justify-center border border-[#BAA88B] dark:border-[#334438] shadow-sm shrink-0 select-none ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-[#F7EFE1] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] flex items-center justify-center overflow-hidden p-1.5 shadow-sm shrink-0 ${className}`}
    >
      <img
        src={currentSrc}
        alt={`${name} official logo`}
        onError={handleImageError}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

