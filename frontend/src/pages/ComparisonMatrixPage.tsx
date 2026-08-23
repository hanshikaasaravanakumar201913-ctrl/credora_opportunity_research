import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { ComparisonCandidate } from '../types/index.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import {
  Scale,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Layers,
  X,
  Plus,
  HelpCircle
} from 'lucide-react';

export const ComparisonMatrixPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawIds = searchParams.get('ids');
  const [allOpportunities, setAllOpportunities] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    rawIds ? rawIds.split(',').filter(Boolean) : []
  );
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load all opportunities to populate the selector tray
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.listOpportunities();
        const opps = res.opportunities || [];
        setAllOpportunities(opps);

        // If no ids in URL, default select first 3
        if (selectedIds.length === 0 && opps.length >= 2) {
          const defaultIds = opps.slice(0, 3).map((o: any) => o.id);
          setSelectedIds(defaultIds);
          setSearchParams({ ids: defaultIds.join(',') });
        }
      } catch (err) {
        console.error('Error fetching opportunities for comparison:', err);
      }
    };
    fetchOpportunities();
  }, []);

  // Fetch comparison matrix whenever selectedIds change
  useEffect(() => {
    if (selectedIds.length < 2) {
      setComparisonData(null);
      return;
    }

    const runComparison = async () => {
      setLoading(true);
      try {
        const res = await api.compareOpportunities(selectedIds);
        setComparisonData(res);
      } catch (err) {
        console.error('Error running comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    runComparison();
  }, [selectedIds]);

  const handleToggleOpportunity = (id: string) => {
    let updated: string[];
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        alert('You must select at least 2 opportunities to compare.');
        return;
      }
      updated = selectedIds.filter((item) => item !== id);
    } else {
      if (selectedIds.length >= 5) {
        alert('You can compare a maximum of 5 opportunities at once.');
        return;
      }
      updated = [...selectedIds, id];
    }
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(',') });
  };

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <Scale className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Multi-Opportunity Decision Matrix</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C120E] dark:text-[#E2EDE2] font-sans">
          Opportunity Comparison Matrix
        </h1>

        <p className="text-xs sm:text-sm text-[#36483C] dark:text-[#AFC4B2] max-w-xl mx-auto font-mono">
          Evaluate 2 to 5 opportunities side-by-side based on weighted career fit, skill overlap, organizational credibility, risk factor, and compensation.
        </p>
      </div>

      {/* Opportunity Selector Tray with High Contrast */}
      <div className="p-5 rounded-3xl editorial-card border-2 border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25] space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono font-extrabold text-[#0C120E] dark:text-[#E2EDE2] border-b border-[#BFAD91]/50 dark:border-[#334438] pb-2.5">
          <span>Select Opportunities to Compare (2 to 5):</span>
          <span className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">{selectedIds.length} Selected</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {allOpportunities.map((opp) => {
            const isSelected = selectedIds.includes(opp.id);
            return (
              <button
                key={opp.id}
                type="button"
                onClick={() => handleToggleOpportunity(opp.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-[#0D2B1D] text-[#F6EFE3] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-md border-2 border-[#0D2B1D] dark:border-[#4EA36C]'
                    : 'border-2 border-[#BFAD91] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-[#0C120E] dark:text-[#E2EDE2] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] hover:bg-[#E5D7BF] font-bold'
                }`}
              >
                <span>{opp.title}</span>
                <span className={`text-[11px] ${isSelected ? 'text-[#F6EFE3]/80 dark:text-[#0F1511]/80 font-bold' : 'text-[#36483C] dark:text-[#9FB3A2] font-semibold'}`}>
                  ({opp.company?.name})
                </span>
                {isSelected ? (
                  <X className="w-3.5 h-3.5 shrink-0 text-[#F6EFE3] dark:text-[#0F1511]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 shrink-0 text-[#0D2B1D] dark:text-[#4EA36C]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BEST MATCH FOR YOU Explainable Recommendation Banner */}
      {comparisonData?.topRecommendation && (
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#0D2B1D] dark:border-[#4EA36C] bg-[#F6EFE3] dark:bg-[#202D25] shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/10 border border-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-extrabold">
                <Trophy className="w-4 h-4 text-emerald-800 dark:text-emerald-300" />
                <span>TOP MATCH RECOMMENDATION FOR YOUR PROFILE</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans">
                {comparisonData.topRecommendation.opportunity?.title}
              </h2>
              <div className="text-xs font-mono text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">
                {comparisonData.topRecommendation.opportunity?.company?.name} · {comparisonData.topRecommendation.suitabilityScore}% Overall Suitability Match
              </div>

              <p className="text-xs sm:text-sm text-[#36483C] dark:text-[#AFC4B2] leading-relaxed max-w-3xl pt-1 font-mono font-medium">
                {comparisonData.recommendationWhy}
              </p>
            </div>

            <button
              onClick={() => navigate(`/opportunity/${comparisonData.topRecommendation.opportunity?.slug || comparisonData.topRecommendation.opportunity?.id}`)}
              className="btn-primary shrink-0 text-xs font-mono font-extrabold px-5 py-3"
            >
              <span>Inspect Winning Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multi-Column Comparison Grid */}
      {comparisonData?.items && (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px] grid grid-cols-1 divide-y divide-[#BFAD91]/50 dark:divide-[#334438] editorial-card border-2 border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25] rounded-3xl shadow-sm overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 p-5 gap-4 bg-[#EFE3CF] dark:bg-[#1A251E] font-mono text-xs text-[#36483C] dark:text-[#9FB3A2] border-b border-[#BFAD91]/60 dark:border-[#334438]">
              <div className="font-extrabold uppercase tracking-wider text-[#0D2B1D] dark:text-[#4EA36C]">Comparison Metric</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center font-extrabold text-[#0C120E] dark:text-[#E2EDE2]">
                  <div className="text-[#0D2B1D] dark:text-[#4EA36C] text-[10px] uppercase font-mono font-extrabold">Rank #{item.ranking}</div>
                  <div className="truncate font-sans font-extrabold text-xs">{item.opportunity?.title}</div>
                  <div className="text-[11px] text-[#36483C] dark:text-[#9FB3A2] font-mono font-semibold">{item.opportunity?.company?.name}</div>
                </div>
              ))}
            </div>

            {/* Suitability Score Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-extrabold font-mono text-[#0C120E] dark:text-[#E2EDE2]">Overall Suitability Score</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center">
                  <span className="text-xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">
                    {item.suitabilityScore}%
                  </span>
                </div>
              ))}
            </div>

            {/* Career Fit Score Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Career Alignment Fit</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center font-mono font-extrabold text-[#0C120E] dark:text-[#E2EDE2]">
                  {item.careerFitScore}%
                </div>
              ))}
            </div>

            {/* Skill Match Score Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Skill Overlap Match</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                  {item.skillMatchScore}%
                </div>
              ))}
            </div>

            {/* Credibility Score Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Organization Credibility</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center font-mono font-extrabold text-[#0C120E] dark:text-[#E2EDE2]">
                  {item.credibilityScore}/100
                </div>
              ))}
            </div>

            {/* Risk Index Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Risk Assessment Index</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center">
                  <RiskLevelBadge level={item.riskIndex} size="sm" />
                </div>
              ))}
            </div>

            {/* Compensation Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Stipend / Compensation</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center font-mono font-extrabold text-emerald-800 dark:text-emerald-300 text-xs">
                  {item.opportunity?.stipend || 'Disclosed upon review'}
                </div>
              ))}
            </div>

            {/* Work Mode & Base Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-center">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Work Mode & Base</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => (
                <div key={item.opportunity?.id || idx} className="text-center text-xs font-mono font-bold text-[#0C120E] dark:text-[#E2EDE2]">
                  {item.opportunity?.workMode} ({item.opportunity?.location || 'Remote'})
                </div>
              ))}
            </div>

            {/* Pros Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-start">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Key Advantages (Pros)</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const pros: string[] = typeof item.pros === 'string' ? JSON.parse(item.pros) : item.pros;
                return (
                  <div key={item.opportunity?.id || idx} className="space-y-1">
                    {pros.map((p, i) => (
                      <div key={i} className="text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1 font-mono font-medium">
                        <span className="font-bold">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Cons / Gaps Row */}
            <div className="grid grid-cols-4 p-4 gap-4 items-start">
              <div className="text-xs font-mono font-bold text-[#36483C] dark:text-[#9FB3A2]">Considerations (Cons)</div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const cons: string[] = typeof item.cons === 'string' ? JSON.parse(item.cons) : item.cons;
                return (
                  <div key={item.opportunity?.id || idx} className="space-y-1">
                    {cons.length === 0 ? (
                      <div className="text-[11px] text-[#36483C] dark:text-[#9FB3A2] font-mono">None identified</div>
                    ) : (
                      cons.map((c, i) => (
                        <div key={i} className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1 font-mono font-medium">
                          <span>•</span>
                          <span>{c}</span>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
