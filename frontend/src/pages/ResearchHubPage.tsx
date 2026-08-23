import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { UniversalSearchInput } from '../components/UniversalSearchInput.js';
import { ComparisonDrawer } from '../components/ComparisonDrawer.js';
import {
  Search,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Scale,
  ArrowRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  Plus,
  Check,
  ShieldCheck
} from 'lucide-react';

export const ResearchHubPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [companies, setCompanies] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [compareList, setCompareList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, oppRes] = await Promise.all([
          api.listCompanies(),
          api.listOpportunities()
        ]);
        setCompanies(compRes.companies || []);
        setOpportunities(oppRes.opportunities || []);
      } catch (err) {
        console.error('Error fetching research data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCompare = (opp: any) => {
    if (compareList.some(item => item.id === opp.id)) {
      setCompareList(compareList.filter(item => item.id !== opp.id));
    } else {
      if (compareList.length >= 5) {
        alert('You can compare a maximum of 5 opportunities at once.');
        return;
      }
      setCompareList([...compareList, opp]);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedType === 'ALL') return true;
    return opp.opportunityType === selectedType;
  });

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Top Header & Universal Research Box */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <Search className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Universal Career Intelligence & Decision Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0C120E] dark:text-[#E2EDE2] font-sans">
          What are you researching?
        </h1>

        <p className="text-xs sm:text-sm text-[#36483C] dark:text-[#AFC4B2] font-mono">
          Search an organization, paste an opportunity URL, or submit raw forwarded message text.
        </p>

        <div className="pt-2">
          <UniversalSearchInput initialValue={initialQuery} autoFocus={!initialQuery} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#BFAD91]/60 dark:border-[#334438] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Opportunities', icon: Sparkles },
            { id: 'INTERNSHIP', label: 'Internships', icon: Briefcase },
            { id: 'FULL_TIME_JOB', label: 'Full-Time Jobs', icon: Building2 },
            { id: 'TRAINING_PROGRAM', label: 'Training Programs', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  active
                    ? 'bg-[#0D2B1D] text-[#F6EFE3] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm'
                    : 'border border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25] text-[#15231B] dark:text-[#AFC4B2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] font-bold'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#36483C] dark:text-[#9FB3A2] font-bold">
          Showing {filteredOpportunities.length} Audited Records
        </span>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => {
          const isSelected = compareList.some(item => item.id === opp.id);
          return (
            <div
              key={opp.id}
              className={`p-6 rounded-3xl editorial-card border-2 bg-[#F6EFE3] dark:bg-[#202D25] transition-all flex flex-col justify-between group shadow-sm ${
                isSelected
                  ? 'border-[#0D2B1D] dark:border-[#4EA36C] ring-2 ring-[#0D2B1D]/20 dark:ring-[#4EA36C]/20'
                  : 'border-[#BFAD91] dark:border-[#334438]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#E2EDE2] font-extrabold">
                    {opp.opportunityType}
                  </span>
                  <div className="text-xs font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                    {opp.company?.credibilityScore || 85}/100 Credibility
                  </div>
                </div>

                <h3
                  onClick={() => navigate(`/opportunity/${opp.slug || opp.id}`)}
                  className="text-base font-extrabold text-[#0C120E] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors cursor-pointer mb-1 line-clamp-1 font-sans"
                >
                  {opp.title}
                </h3>

                <div
                  onClick={() => navigate(`/company/${opp.company?.slug || opp.company?.id}`)}
                  className="text-xs text-[#36483C] dark:text-[#9FB3A2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors cursor-pointer flex items-center gap-1.5 mb-3 font-mono font-bold"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                  <span>{opp.company?.name}</span>
                </div>

                <p className="text-xs text-[#36483C] dark:text-[#AFC4B2] line-clamp-2 mb-4 leading-relaxed font-normal">
                  {opp.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {JSON.parse(opp.requiredSkills || '[]').slice(0, 3).map((sk: string) => (
                    <span key={sk} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BFAD91] dark:border-[#334438] text-[#0C120E] dark:text-[#E2EDE2]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFAD91]/50 dark:border-[#334438] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-[#36483C] dark:text-[#9FB3A2] uppercase font-bold">Stipend / Comp</div>
                  <div className="text-xs font-extrabold font-mono text-emerald-800 dark:text-emerald-300">
                    {opp.stipend || 'Disclosed during review'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCompare(opp)}
                    className={`p-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0D2B1D] text-[#F6EFE3] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-md border-2 border-[#0D2B1D] dark:border-[#4EA36C]'
                        : 'border-2 border-[#BFAD91] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-[#0C120E] dark:text-[#E2EDE2] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] font-bold'
                    }`}
                    title="Add to Compare Matrix"
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Compare</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/opportunity/${opp.slug || opp.id}`)}
                    className="p-2 rounded-xl bg-[#0D2B1D] text-[#F6EFE3] dark:bg-[#4EA36C] dark:text-[#0F1511] hover:bg-[#164630] transition-all"
                    title="Open Full Dossier"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Compare Drawer */}
      <ComparisonDrawer
        selectedOpportunities={compareList}
        onRemove={(id) => setCompareList(compareList.filter(o => o.id !== id))}
        onClear={() => setCompareList([])}
      />
    </div>
  );
};
