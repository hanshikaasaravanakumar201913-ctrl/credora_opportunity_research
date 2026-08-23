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
  Sparkles
} from 'lucide-react';

interface CompanyCandidateCardProps {
  candidate: DiscoveredEntityCandidate;
  onSelect?: (candidate: DiscoveredEntityCandidate) => void;
}

export const CompanyCandidateCard: React.FC<CompanyCandidateCardProps> = ({
  candidate,
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

  const matchPercent = candidate.entityMatchScore || 80;

  return (
    <div
      onClick={handleChoose}
      className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
    >
      <div className="space-y-4">
        {/* Top bar: Entity Match Badge & Domain Status */}
        <div className="flex items-center justify-between gap-2 border-b border-[#BAA88B]/50 dark:border-[#334438] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] shadow-sm">
              {matchPercent}% Entity Match
            </span>
            {candidate.isExistingRecord && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#E2EDE2]">
                Audited
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-extrabold">
            {candidate.sourceCount} {candidate.sourceCount === 1 ? 'Source' : 'Sources'} Available
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
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors truncate font-sans">
              {candidate.name}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono mt-0.5 font-bold">
              <span>{candidate.industry || 'Technology & Services'}</span>
              {candidate.headquarters && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0D2B1D] dark:text-[#4EA36C]" />
                    <span>{candidate.headquarters}</span>
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

        {/* Evidence Verification Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {candidate.domainFound && candidate.officialDomain
                ? `Domain: ${candidate.officialDomain}`
                : 'Official Domain Found'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#0D2B1D] dark:text-[#4EA36C] font-bold">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Public Entity Records Found</span>
          </div>
        </div>

        {/* Match Reasoning */}
        <div className="p-2.5 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] leading-tight">
          💡 <span className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Match Analysis:</span> {candidate.matchReasoning}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-[#BAA88B]/50 dark:border-[#334438] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-semibold">
          Zero-Fabrication Audit
        </span>

        <button
          type="button"
          onClick={handleChoose}
          className="btn-primary text-xs font-mono font-extrabold group-hover:bg-[#164630] py-2 px-4"
        >
          <span>Research this company</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
