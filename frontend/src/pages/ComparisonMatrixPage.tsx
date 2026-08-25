import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { ComparisonCandidate, Opportunity } from '../types/index.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import { InformationStatusBadge } from '../components/InformationStatusBadge.js';
import { CompanyLogo } from '../components/CompanyLogo.js';
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
  HelpCircle,
  Search,
  Filter,
  MapPin,
  Check,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  DollarSign,
  TrendingUp,
  Award,
  FileCheck
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const comparisonResultsRef = useRef<HTMLDivElement>(null);
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

  const handleRemoveOpportunity = (id: string) => {
    if (selectedIds.length <= 2) {
      alert('You must maintain at least 2 selected opportunities for side-by-side comparison.');
      return;
    }
    const updated = selectedIds.filter((item) => item !== id);
    setSelectedIds(updated);
    setSearchParams({ ids: updated.join(',') });
  };

  const scrollToComparison = () => {
    comparisonResultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter available opportunities for search & quick selection
  const filteredCatalog = useMemo(() => {
    return allOpportunities.filter((opp) => {
      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.requiredSkills?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (filterType === 'INTERNSHIP') {
        return opp.opportunityType === 'INTERNSHIP';
      }
      if (filterType === 'JOB') {
        return opp.opportunityType === 'FULL_TIME_JOB';
      }
      if (filterType === 'FELLOWSHIP') {
        return opp.opportunityType === 'TRAINING_PROGRAM' || opp.opportunityType === 'ONLINE_COURSE';
      }
      if (filterType === 'VERIFIED') {
        return opp.statusVerification === 'VERIFIED' || opp.company?.verificationLevel === 'VERIFIED';
      }
      if (filterType === 'REMOTE') {
        return opp.workMode === 'REMOTE';
      }

      return true;
    });
  }, [allOpportunities, searchQuery, filterType]);

  // Selected opportunities objects
  const selectedOpportunities = useMemo(() => {
    return selectedIds
      .map((id) => allOpportunities.find((o) => o.id === id))
      .filter(Boolean);
  }, [selectedIds, allOpportunities]);

  // Helper for evidence strength
  const getEvidenceStrength = (credScore: number = 75, sourceCount: number = 2) => {
    if (credScore >= 80 || sourceCount >= 3) {
      return {
        label: 'Strong Evidence',
        level: 'Strong',
        percentage: Math.min(100, credScore),
        badgeClass: 'bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-800/30',
        barClass: 'bg-emerald-700 dark:bg-emerald-400',
      };
    }
    if (credScore >= 60 || sourceCount >= 2) {
      return {
        label: 'Moderate Evidence',
        level: 'Moderate',
        percentage: Math.min(100, credScore),
        badgeClass: 'bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-800/30',
        barClass: 'bg-blue-600 dark:bg-blue-400',
      };
    }
    return {
      label: 'Limited Evidence',
      level: 'Limited',
      percentage: Math.max(30, credScore),
      badgeClass: 'bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-800/30',
      barClass: 'bg-amber-600 dark:bg-amber-400',
    };
  };

  // Helper for verification badge
  const getVerificationStatusConfig = (status?: string, hasUpfrontFee?: boolean) => {
    if (hasUpfrontFee) {
      return {
        label: 'High Risk',
        icon: AlertOctagon,
        badgeClass: 'bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-800/30',
        dotClass: 'bg-rose-600',
      };
    }
    if (status === 'VERIFIED') {
      return {
        label: 'Verified',
        icon: CheckCircle2,
        badgeClass: 'bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-800/30',
        dotClass: 'bg-emerald-600',
      };
    }
    if (status === 'POSSIBLY_OUTDATED' || status === 'INCOMPLETE') {
      return {
        label: 'Limited Evidence',
        icon: AlertTriangle,
        badgeClass: 'bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-800/30',
        dotClass: 'bg-amber-600',
      };
    }
    return {
      label: 'Insufficient Evidence',
      icon: HelpCircle,
      badgeClass: 'bg-stone-900/20 text-stone-700 dark:text-stone-300 border-stone-600/30',
      dotClass: 'bg-stone-400',
    };
  };

  // Top recommendation & why reasons
  const topRec = comparisonData?.topRecommendation;
  const whyReasons = useMemo(() => {
    if (!topRec) return [];
    const reasons: { type: 'positive' | 'warning'; text: string }[] = [];

    if (topRec.skillMatchScore >= 70) {
      reasons.push({
        type: 'positive',
        text: `Strong skill alignment (${topRec.skillMatchScore}%) with candidate profile`,
      });
    }
    if (topRec.careerFitScore >= 70) {
      reasons.push({
        type: 'positive',
        text: `High career relevance (${topRec.careerFitScore}%) and domain suitability`,
      });
    }
    if (topRec.credibilityScore >= 75) {
      reasons.push({
        type: 'positive',
        text: `Organization evidence verified with strong public credibility (${topRec.credibilityScore}/100)`,
      });
    }
    if (topRec.riskIndex === 'LOW_RISK' && !topRec.opportunity?.hasUpfrontFee) {
      reasons.push({
        type: 'positive',
        text: 'Low opportunity risk — zero upfront fees required',
      });
    }
    if (topRec.opportunity?.stipend && !topRec.opportunity?.stipend?.toLowerCase().includes('unpaid')) {
      reasons.push({
        type: 'positive',
        text: `Compensation explicitly disclosed: ${topRec.opportunity.stipend}`,
      });
    }

    // Add pros from backend evaluation
    const pros = Array.isArray(topRec.pros)
      ? topRec.pros
      : typeof topRec.pros === 'string'
      ? JSON.parse(topRec.pros || '[]')
      : [];
    pros.slice(0, 2).forEach((p: string) => {
      if (!reasons.some((r) => r.text.includes(p))) {
        reasons.push({ type: 'positive', text: p });
      }
    });

    // Add cons as honest caveats if present
    const cons = Array.isArray(topRec.cons)
      ? topRec.cons
      : typeof topRec.cons === 'string'
      ? JSON.parse(topRec.cons || '[]')
      : [];
    if (cons.length > 0) {
      cons.slice(0, 1).forEach((c: string) => {
        reasons.push({ type: 'warning', text: c });
      });
    } else if (!topRec.opportunity?.stipend) {
      reasons.push({
        type: 'warning',
        text: 'Compensation information not explicitly published',
      });
    }

    return reasons.slice(0, 5);
  }, [topRec]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* 1. Compact Header */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full editorial-pill">
            <Scale className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wide">Multi-Opportunity Decision Matrix</span>
          </div>
          <span className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono hidden sm:inline">
            Side-by-Side Research & Suitability Analysis
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              Compare Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] font-sans max-w-2xl leading-relaxed">
              Compare 2–5 opportunities based on career fit, skills, organization credibility, risk, and compensation.
            </p>
          </div>

          {/* Primary Compare Action Button Header Quick Trigger */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              onClick={scrollToComparison}
              disabled={selectedIds.length < 2 || loading}
              className={`btn-primary px-4 py-2 text-xs font-sans font-extrabold transition-all shadow-sm flex items-center gap-2 ${
                selectedIds.length < 2 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Matrix...</span>
                </>
              ) : (
                <>
                  <span>Compare {selectedIds.length} Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Opportunity Selection Section & Search/Filter Catalog */}
      <div className="p-4 sm:p-5 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
        {/* Selection Bar Header & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BAA88B]/40 dark:border-[#334438] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-sans font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
              Selected Opportunities:
            </span>

            {/* Counter with dot indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B]/50 dark:border-[#334438]">
              <span className="text-xs font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
                {selectedIds.length} / 5 Selected
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= selectedIds.length
                        ? 'bg-[#0D2B1D] dark:bg-[#4EA36C]'
                        : 'bg-[#BAA88B]/60 dark:bg-[#334438]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <span className="text-[11px] font-mono text-[#2C3E33] dark:text-[#AFC4B2] hidden md:inline">
              (Min: 2 · Max: 5)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="px-3 py-1.5 rounded-xl border border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
              <span>{isCatalogOpen ? 'Close Opportunity Browser' : '+ Add / Browse Opportunities'}</span>
              {isCatalogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Selected Opportunities Compact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {selectedOpportunities.map((opp) => {
            const vConfig = getVerificationStatusConfig(opp.statusVerification, opp.hasUpfrontFee);
            const VIcon = vConfig.icon;
            const cleanWorkMode = opp.workMode === 'REMOTE' ? 'Remote' : opp.workMode === 'HYBRID' ? 'Hybrid' : 'Onsite';

            return (
              <div
                key={opp.id}
                className="p-3.5 rounded-2xl border-2 border-[#0D2B1D]/70 dark:border-[#4EA36C]/70 bg-[#FAF4EA] dark:bg-[#1A251E] shadow-sm flex flex-col justify-between group transition-all hover:border-[#0D2B1D] dark:hover:border-[#4EA36C]"
              >
                <div className="space-y-2.5">
                  {/* Card Top: Logo + Remove Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CompanyLogo
                        name={opp.company?.name || 'Company'}
                        domain={opp.company?.officialDomain}
                        logoUrl={opp.company?.logoUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] font-sans font-bold text-[#2C3E33] dark:text-[#AFC4B2] truncate block leading-tight">
                          {opp.company?.name || 'Unknown Entity'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold block leading-tight">
                          {opp.opportunityType?.replace(/_/g, ' ') || 'Opportunity'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOpportunity(opp.id)}
                      className="p-1 rounded-lg text-[#2C3E33] dark:text-[#AFC4B2] hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-950/10 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Opportunity Title */}
                  <h3 className="text-xs font-sans font-extrabold text-[#0A110D] dark:text-[#E2EDE2] line-clamp-2 leading-snug">
                    {opp.title}
                  </h3>

                  {/* Metadata Chips: Verification & Location */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${vConfig.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${vConfig.dotClass}`} />
                      <span>{vConfig.label}</span>
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EFE3CF] dark:bg-[#202D25] text-[#2C3E33] dark:text-[#AFC4B2] font-semibold">
                      {cleanWorkMode}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-2 mt-2 border-t border-[#BAA88B]/30 dark:border-[#334438] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2] truncate">
                    {opp.stipend || 'Compensation verified'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOpportunity(opp.id)}
                    className="text-[10px] font-sans font-extrabold text-rose-800 dark:text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Placeholder Slots if < 5 */}
          {selectedOpportunities.length < 5 && (
            <button
              type="button"
              onClick={() => setIsCatalogOpen(true)}
              className="p-3.5 rounded-2xl border-2 border-dashed border-[#BAA88B] dark:border-[#334438] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] bg-[#FAF4EA]/50 dark:bg-[#1A251E]/50 flex flex-col items-center justify-center text-center gap-2 group transition-all min-h-[140px]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EFE3CF] dark:bg-[#202D25] flex items-center justify-center text-[#0D2B1D] dark:text-[#4EA36C] group-hover:scale-110 transition-transform shadow-sm">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-sans font-bold text-[#2C3E33] dark:text-[#AFC4B2] group-hover:text-[#0A110D] dark:group-hover:text-[#E2EDE2]">
                + Add Opportunity
              </span>
              <span className="text-[10px] font-mono text-[#2C3E33]/70 dark:text-[#AFC4B2]/70">
                ({5 - selectedOpportunities.length} slot{5 - selectedOpportunities.length > 1 ? 's' : ''} available)
              </span>
            </button>
          )}
        </div>

        {/* 7. Opportunity Search & Lightweight Filter Drawer */}
        {isCatalogOpen && (
          <div className="pt-3 border-t border-[#BAA88B]/40 dark:border-[#334438] space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Search input with icon */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0D2B1D] dark:text-[#4EA36C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-sans border border-[#BAA88B] dark:border-[#334438] bg-[#FAF4EA] dark:bg-[#1A251E] focus:border-[#0D2B1D] dark:focus:border-[#4EA36C]"
                />
              </div>

              {/* Lightweight Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'INTERNSHIP', label: 'Internships' },
                  { id: 'JOB', label: 'Jobs' },
                  { id: 'FELLOWSHIP', label: 'Fellowships' },
                  { id: 'VERIFIED', label: 'Verified' },
                  { id: 'REMOTE', label: 'Remote' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
                      filterType === f.id
                        ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm'
                        : 'bg-[#EFE3CF] dark:bg-[#1A251E] text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#E2D2B8] dark:hover:bg-[#25362B] font-semibold border border-[#BAA88B]/40 dark:border-[#334438]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Opportunities List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="p-4 text-center text-xs font-sans text-[#2C3E33] dark:text-[#AFC4B2]">
                  No matching opportunities found for current search/filter.
                </div>
              ) : (
                filteredCatalog.map((opp) => {
                  const isSelected = selectedIds.includes(opp.id);
                  const vConfig = getVerificationStatusConfig(opp.statusVerification, opp.hasUpfrontFee);

                  return (
                    <div
                      key={opp.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-[#0D2B1D]/10 dark:bg-[#4EA36C]/10 border-[#0D2B1D]/50 dark:border-[#4EA36C]/50'
                          : 'bg-[#FAF4EA] dark:bg-[#1A251E] border-[#BAA88B]/40 dark:border-[#334438] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <CompanyLogo
                          name={opp.company?.name || 'Company'}
                          domain={opp.company?.officialDomain}
                          logoUrl={opp.company?.logoUrl}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2] truncate">
                              {opp.title}
                            </span>
                            <span className="text-[10px] font-sans text-[#2C3E33] dark:text-[#AFC4B2]">
                              · {opp.company?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                            <span className="uppercase">{opp.opportunityType?.replace(/_/g, ' ')}</span>
                            <span>•</span>
                            <span>{opp.workMode}</span>
                            <span>•</span>
                            <span className={vConfig.badgeClass}>{vConfig.label}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleOpportunity(opp.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-sans font-extrabold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-rose-900/10 text-rose-800 dark:text-rose-300 border border-rose-800/30 hover:bg-rose-900/20'
                            : 'btn-primary py-1 px-3 text-xs'
                        }`}
                      >
                        {isSelected ? 'Remove' : '+ Add to Compare'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 8. Large Primary Action Button */}
      <div className="flex justify-center pt-1">
        <button
          onClick={scrollToComparison}
          disabled={selectedIds.length < 2 || loading}
          className={`btn-primary px-8 py-3.5 text-sm font-sans font-extrabold transition-all shadow-md flex items-center gap-2.5 ${
            selectedIds.length < 2 || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Opportunities...</span>
            </>
          ) : (
            <>
              <span>Compare {selectedIds.length} Opportunities →</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 text-center space-y-3 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
          <div className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] dark:border-[#4EA36C] border-t-transparent animate-spin mx-auto" />
          <div className="text-xs font-mono font-bold text-[#0D2B1D] dark:text-[#4EA36C]">
            Executing Multi-Opportunity Decision Matrix & Career Alignment Model...
          </div>
        </div>
      )}

      {/* 9 & 11. BEST MATCH / RECOMMENDED FOR YOU BANNER & WHY THIS SCORE */}
      {topRec && !loading && (
        <div
          ref={comparisonResultsRef}
          className="p-6 sm:p-7 rounded-3xl editorial-card border-2 border-[#0D2B1D] dark:border-[#4EA36C] bg-[#FAF4EA] dark:bg-[#202D25] shadow-xl relative overflow-hidden space-y-5"
        >
          {/* Top Banner Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-[#BAA88B]/50 dark:border-[#334438] pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] text-xs font-mono font-extrabold shadow-sm">
                <Trophy className="w-4 h-4 text-amber-300 dark:text-[#0F1511]" />
                <span>🏆 RECOMMENDED FOR YOU · BEST OVERALL MATCH</span>
              </div>

              <div className="flex items-start gap-3.5 pt-1">
                <CompanyLogo
                  name={topRec.opportunity?.company?.name || 'Company'}
                  domain={topRec.opportunity?.company?.officialDomain}
                  logoUrl={topRec.opportunity?.company?.logoUrl}
                  size="md"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
                    {topRec.opportunity?.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-[#2C3E33] dark:text-[#AFC4B2] font-bold mt-0.5">
                    <span className="font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
                      {topRec.opportunity?.company?.name}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-emerald-800 dark:text-emerald-300 font-extrabold">
                      {topRec.suitabilityScore}% Career Match
                    </span>
                    <span>·</span>
                    <span className="font-mono">{topRec.opportunity?.workMode} ({topRec.opportunity?.location || 'Remote'})</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] font-sans leading-relaxed max-w-3xl pt-1">
                {comparisonData.recommendationWhy ||
                  'Best overall opportunity based on career fit, skill alignment, organization credibility, and opportunity risk.'}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
              <button
                onClick={() =>
                  navigate(
                    `/opportunity/${topRec.opportunity?.slug || topRec.opportunity?.id}`
                  )
                }
                className="btn-primary text-xs font-sans font-extrabold px-5 py-3 shadow-md"
              >
                <span>Inspect Winning Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 12. "Why this recommendation?" Section */}
          <div className="p-4 rounded-2xl bg-[#EFE3CF]/80 dark:bg-[#1A251E] border border-[#BAA88B]/50 dark:border-[#334438] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-sans font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
              <Sparkles className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
              <span>Why this recommendation?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {whyReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs font-sans ${
                    reason.type === 'positive'
                      ? 'bg-emerald-950/10 text-emerald-900 dark:text-emerald-300 border-emerald-800/30'
                      : 'bg-amber-950/10 text-amber-900 dark:text-amber-300 border-amber-800/30'
                  }`}
                >
                  <span className="font-extrabold shrink-0">
                    {reason.type === 'positive' ? '✓' : '⚠'}
                  </span>
                  <span className="leading-tight font-medium">{reason.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10, 13 & 14. Redesigned Detailed Comparison Matrix */}
      {comparisonData?.items && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-extrabold font-sans text-[#0A110D] dark:text-[#E2EDE2] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
              <span>Side-by-Side Comparison Matrix ({comparisonData.items.length} Opportunities)</span>
            </h3>

            <span className="text-xs font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
              Swipe or scroll horizontally on smaller screens
            </span>
          </div>

          <div className="overflow-x-auto pb-4">
            <div
              className="min-w-[840px] editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] rounded-3xl shadow-sm overflow-hidden divide-y divide-[#BAA88B]/50 dark:divide-[#334438]"
              style={{
                display: 'grid',
                gridTemplateColumns: `240px repeat(${comparisonData.items.length}, minmax(200px, 1fr))`,
              }}
            >
              {/* Row 1: Header / Opportunity Candidate Info */}
              <div className="p-4 bg-[#EFE3CF] dark:bg-[#1A251E] font-sans text-xs font-extrabold uppercase tracking-wider text-[#0D2B1D] dark:text-[#4EA36C] flex items-center">
                <span>Evaluation Candidate</span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                const vConfig = getVerificationStatusConfig(
                  item.opportunity?.statusVerification,
                  item.opportunity?.hasUpfrontFee
                );

                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-2 text-center flex flex-col justify-between ${
                      isWinner
                        ? 'bg-[#FAF4EA] dark:bg-[#1C2A20] ring-2 ring-inset ring-[#0D2B1D] dark:ring-[#4EA36C]'
                        : 'bg-[#EFE3CF] dark:bg-[#1A251E]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                            isWinner
                              ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511]'
                              : 'bg-[#BAA88B]/50 dark:bg-[#334438] text-[#0A110D] dark:text-[#E2EDE2]'
                          }`}
                        >
                          {isWinner ? '🏆 #1 Best Match' : `Rank #${item.ranking}`}
                        </span>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${vConfig.badgeClass}`}>
                          {vConfig.label}
                        </span>
                      </div>

                      <div className="flex justify-center pt-1">
                        <CompanyLogo
                          name={item.opportunity?.company?.name || 'Company'}
                          domain={item.opportunity?.company?.officialDomain}
                          logoUrl={item.opportunity?.company?.logoUrl}
                          size="md"
                        />
                      </div>

                      <div>
                        <h4 className="font-sans font-extrabold text-xs text-[#0A110D] dark:text-[#E2EDE2] line-clamp-2 leading-snug">
                          {item.opportunity?.title}
                        </h4>
                        <div className="text-[11px] font-sans font-bold text-[#2C3E33] dark:text-[#AFC4B2] mt-0.5">
                          {item.opportunity?.company?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Row 2: Overall Suitability Score (Large + Score Bar) */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
                  Overall Suitability
                </span>
                <span className="text-[11px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Weighted multi-factor score
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 text-center space-y-1.5 flex flex-col justify-center ${
                      isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''
                    }`}
                  >
                    <span className="text-2xl font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
                      {item.suitabilityScore}%
                    </span>
                    {/* Visual Score Bar */}
                    <div className="w-full bg-[#BAA88B]/30 dark:bg-[#334438] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#0D2B1D] dark:bg-[#4EA36C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.suitabilityScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Row 3: Career Alignment Fit Score Bar */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Career Fit Alignment
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Domain & role trajectory
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1 ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
                      <span>Fit Score</span>
                      <span className="text-emerald-800 dark:text-emerald-300">{item.careerFitScore}%</span>
                    </div>
                    <div className="w-full bg-[#BAA88B]/30 dark:bg-[#334438] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.careerFitScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Row 4: Skill Match Score Bar */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Skill Overlap Match
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Declared skills compatibility
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1 ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
                      <span>Skill Match</span>
                      <span className="text-emerald-800 dark:text-emerald-300">{item.skillMatchScore}%</span>
                    </div>
                    <div className="w-full bg-[#BAA88B]/30 dark:bg-[#334438] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.skillMatchScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Row 5: Organization Credibility Score Bar */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Organization Credibility
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Public entity verification index
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1 ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
                      <span>Credibility</span>
                      <span className="text-[#0D2B1D] dark:text-[#4EA36C]">{item.credibilityScore}/100</span>
                    </div>
                    <div className="w-full bg-[#BAA88B]/30 dark:bg-[#334438] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0D2B1D] dark:bg-[#4EA36C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.credibilityScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Row 6: Risk Assessment Index */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Risk Assessment Index
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Financial & security risk
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 text-center ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <RiskLevelBadge level={item.riskIndex} size="sm" />
                  </div>
                );
              })}

              {/* Row 7: Evidence Strength & Provenance */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Evidence Strength
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Verifiable sources backing
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                const eStrength = getEvidenceStrength(
                  item.credibilityScore,
                  item.opportunity?.company?.sources?.length || 2
                );

                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1.5 text-center ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className={eStrength.badgeClass}>{eStrength.label}</span>
                      <span className="text-[11px] text-[#2C3E33] dark:text-[#AFC4B2]">
                        {eStrength.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#BAA88B]/30 dark:bg-[#334438] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${eStrength.barClass} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${eStrength.percentage}%` }}
                      />
                    </div>
                    <Link
                      to={`/company/${item.opportunity?.company?.slug || item.opportunity?.company?.id}`}
                      className="text-[10px] font-sans font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] hover:underline inline-flex items-center gap-1 pt-0.5"
                    >
                      <span>View Evidence</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}

              {/* Row 8: Compensation & Terms */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Compensation / Stipend
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Financial remuneration terms
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 text-center ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    <span className="text-xs font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                      {item.opportunity?.stipend || 'Disclosed upon review'}
                    </span>
                  </div>
                );
              })}

              {/* Row 9: Work Mode & Base */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-center">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Work Mode & Location
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Office location & logistics
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 text-center text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2] ${
                      isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''
                    }`}
                  >
                    {item.opportunity?.workMode} ({item.opportunity?.location || 'Remote'})
                  </div>
                );
              })}

              {/* Row 10: Key Advantages (Pros) */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-start">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Key Advantages (Pros)
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Verified strong points
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                const pros: string[] = Array.isArray(item.pros)
                  ? item.pros
                  : typeof item.pros === 'string'
                  ? JSON.parse(item.pros || '[]')
                  : [];

                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1.5 ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    {pros.length === 0 ? (
                      <span className="text-xs font-sans text-[#2C3E33] dark:text-[#AFC4B2]">
                        Standard baseline parameters
                      </span>
                    ) : (
                      pros.map((p, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5 font-sans font-medium"
                        >
                          <span className="font-bold shrink-0">✓</span>
                          <span className="leading-tight">{p}</span>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}

              {/* Row 11: Considerations / Gaps (Cons) */}
              <div className="p-4 bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-start">
                <span className="text-xs font-sans font-bold text-[#0A110D] dark:text-[#E2EDE2]">
                  Considerations (Cons)
                </span>
                <span className="text-[10px] font-mono text-[#2C3E33] dark:text-[#AFC4B2]">
                  Gaps & caution factors
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                const cons: string[] = Array.isArray(item.cons)
                  ? item.cons
                  : typeof item.cons === 'string'
                  ? JSON.parse(item.cons || '[]')
                  : [];

                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 space-y-1.5 ${isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : ''}`}
                  >
                    {cons.length === 0 ? (
                      <div className="text-[11px] text-[#2C3E33] dark:text-[#AFC4B2] font-sans">
                        None identified
                      </div>
                    ) : (
                      cons.map((c, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5 font-sans font-medium"
                        >
                          <span className="shrink-0">•</span>
                          <span className="leading-tight">{c}</span>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}

              {/* Row 12: Action Footer Buttons */}
              <div className="p-4 bg-[#EFE3CF] dark:bg-[#1A251E] flex items-center">
                <span className="text-xs font-sans font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
                  Direct Verification
                </span>
              </div>
              {comparisonData.items.map((item: ComparisonCandidate, idx: number) => {
                const isWinner = item.ranking === 1;
                return (
                  <div
                    key={item.opportunity?.id || idx}
                    className={`p-4 text-center ${
                      isWinner ? 'bg-[#FAF4EA] dark:bg-[#1C2A20]' : 'bg-[#EFE3CF] dark:bg-[#1A251E]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/opportunity/${item.opportunity?.slug || item.opportunity?.id}`
                        )
                      }
                      className={`w-full py-2 px-3 rounded-xl text-xs font-sans font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                        isWinner
                          ? 'btn-primary shadow-sm'
                          : 'btn-secondary'
                      }`}
                    >
                      <span>Inspect Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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

