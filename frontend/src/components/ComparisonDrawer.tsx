import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../types/index.js';
import { Scale, X, ArrowRight } from 'lucide-react';

interface ComparisonDrawerProps {
  selectedOpportunities: Opportunity[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  selectedOpportunities,
  onRemove,
  onClear
}) => {
  const navigate = useNavigate();

  if (selectedOpportunities.length === 0) return null;

  const handleLaunchCompare = () => {
    const ids = selectedOpportunities.map(o => o.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-3xl editorial-card border-2 border-[#0D2B1D] dark:border-[#4EA36C] bg-[#F6EFE3] dark:bg-[#202D25] p-3.5 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="flex items-center gap-2 pl-1 pr-2 border-r border-[#BFAD91] dark:border-[#334438] shrink-0">
            <Scale className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span className="text-xs font-mono font-extrabold text-[#0C120E] dark:text-[#E2EDE2]">
              Compare ({selectedOpportunities.length}/5)
            </span>
          </div>

          {selectedOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BFAD91] dark:border-[#334438] text-xs shrink-0 max-w-[190px]"
            >
              <span className="truncate font-bold text-[#0C120E] dark:text-[#E2EDE2] text-[11px]">
                {opp.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(opp.id)}
                className="text-[#0D2B1D] dark:text-[#4EA36C] hover:text-rose-700 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2] hover:text-[#0C120E] px-2 py-1"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={selectedOpportunities.length < 2}
            onClick={handleLaunchCompare}
            className="btn-primary text-xs font-mono font-extrabold disabled:opacity-40"
          >
            <span>Launch Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
