import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoveredEntityCandidate } from '../types/index.js';
import { CompanyLogo } from './CompanyLogo.js';
import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface CompanyCandidateCardProps {
  candidate: DiscoveredEntityCandidate;
  isPrimaryExactMatch?: boolean;
  onSelect?: (candidate: DiscoveredEntityCandidate) => void;
}

export const CompanyCandidateCard: React.FC<CompanyCandidateCardProps> = ({
  candidate,
  isPrimaryExactMatch = false,
  onSelect,
}) => {
  const navigate = useNavigate();

  const handleChoose = () => {
    if (onSelect) {
      onSelect(candidate);
    } else {
      navigate(`/company/${candidate.slug || candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    }
  };

  const matchPercent = candidate.entityMatchScore || 85;
  const identityConfidence = candidate.identityConfidence || (matchPercent >= 90 ? 'VERY_HIGH' : matchPercent >= 75 ? 'HIGH' : 'MODERATE');
  const evidenceLevel = candidate.evidenceLevel || (candidate.sourceCount >= 3 ? 'STRONG_EVIDENCE' : 'MODERATE_EVIDENCE');
  const isExact = candidate.matchCategory === 'EXACT' || isPrimaryExactMatch;

  const getIdentityConfidenceBadge = () => {
    switch (identityConfidence) {
      case 'VERY_HIGH':
        return (
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-900/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-800/40 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Confidence: Very High</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-900/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-800/40 uppercase tracking-wider">
            Confidence: High
          </span>
        );
      case 'MODERATE':
        return (
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-blue-900/20 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-800/40 uppercase tracking-wider">
            Confidence: Moderate
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-amber-900/20 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-800/40 uppercase tracking-wider">
            Limited Evidence
          </span>
        );
    }
  };

  return (
    <div
      onClick={handleChoose}
      className={`p-6 rounded-3xl editorial-card border-2 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md cursor-pointer ${
        isExact
          ? 'border-[#0D2B1D] dark:border-[#4EA36C] bg-[#F7EFE1] dark:bg-[#202D25] ring-1 ring-[#0D2B1D]/20 dark:ring-[#4EA36C]/20'
          : 'border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C]'
      }`}
    >
      <div className="space-y-4">
        {/* Top bar: Match % & Identity Confidence Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-[#BAA88B]/50 dark:border-[#334438] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] shadow-sm">
              {matchPercent}% Match
            </span>
            {getIdentityConfidenceBadge()}
          </div>

          <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-extrabold">
            {candidate.sourceCount} {candidate.sourceCount === 1 ? 'Source' : 'Sources'}
          </div>
        </div>

        {/* Company Identity Header */}
        <div className="flex items-start gap-3.5">
          <CompanyLogo
            name={candidate.name}
            domain={candidate.officialDomain}
            logoUrl={candidate.logoUrl}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors truncate font-sans">
                {candidate.name}
              </h3>
              {isExact && (
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-emerald-700 text-white dark:bg-emerald-600 uppercase tracking-wider shrink-0">
                  Exact Match
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono mt-0.5 font-bold">
              <span>{candidate.industry || 'Technology & Services'}</span>
              {candidate.headquarters && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0D2B1D] dark:text-[#4EA36C]" />
                    <span className="truncate">{candidate.headquarters}</span>
                  </span>
                </>
              )}
              {candidate.foundedYear && (
                <>
                  <span>•</span>
                  <span>Est. {candidate.foundedYear}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Short Description */}
        {candidate.description && (
          <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] line-clamp-2 leading-relaxed font-normal">
            {candidate.description}
          </p>
        )}

        {/* Evidence / Sources Found Checkpoints */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#2C3E33] dark:text-[#9FB3A2] font-extrabold flex items-center justify-between">
            <span>Evidence Discovered:</span>
            {candidate.companyType && (
              <span className="text-emerald-800 dark:text-emerald-300 normal-case font-bold">
                {candidate.companyType}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
            {candidate.officialDomain && (
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold truncate">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{candidate.officialDomain}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[#0D2B1D] dark:text-[#4EA36C] font-bold">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>Public Entity Records</span>
            </div>
            {candidate.officialWebsite && (
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold truncate">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Official Web Portal</span>
              </div>
            )}
            {candidate.linkedinUrl && (
              <div className="flex items-center gap-1.5 text-[#0D2B1D] dark:text-[#4EA36C] font-bold truncate">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>LinkedIn Organization</span>
              </div>
            )}
            {candidate.careersUrl && (
              <div className="flex items-center gap-1.5 text-[#0D2B1D] dark:text-[#4EA36C] font-bold truncate">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Careers Portal</span>
              </div>
            )}
          </div>
        </div>

        {/* Match Reasoning */}
        {candidate.matchReasoning && (
          <div className="p-2.5 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] leading-tight border border-[#BAA88B]/40 dark:border-[#334438]">
            💡 <span className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Match Analysis:</span> {candidate.matchReasoning}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-[#BAA88B]/50 dark:border-[#334438] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-semibold">
          Evidence-Verified Dossier
        </span>

        <button
          type="button"
          onClick={handleChoose}
          className="btn-primary text-xs font-mono font-extrabold group-hover:bg-[#164630] py-2 px-4"
        >
          <span>Research Company</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

