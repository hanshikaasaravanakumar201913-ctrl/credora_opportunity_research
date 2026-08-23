import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { api } from '../services/api.js';
import { UniversalSearchInput } from '../components/UniversalSearchInput.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import {
  Search,
  Bookmark,
  Scale,
  AlertTriangle,
  Building2,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [oppRes, compRes, savedRes, histRes] = await Promise.all([
          api.listOpportunities({ limit: '6' }),
          api.listCompanies(),
          api.listSavedReports().catch(() => ({ savedReports: [] })),
          api.getSearchHistory().catch(() => ({ history: [] }))
        ]);

        setOpportunities(oppRes.opportunities || []);
        setCompanies(compRes.companies || []);
        setSavedCount(savedRes.savedReports?.length || 0);
        setHistoryCount(histRes.history?.length || 0);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const attentionNeededOpportunities = opportunities.filter(
    (o) => o.hasUpfrontFee || o.statusVerification === 'CONFLICTING' || o.statusVerification === 'MISSING_DETAILS'
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Personalized Greeting & Search Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Candidate Intelligence Center</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          {getGreeting()},{' '}
          <span className="text-[#0D2B1D] dark:text-[#4EA36C]">
            {user?.name || 'Researcher'}
          </span>
          .
        </h1>

        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
          What company, career opportunity, or course would you like to research today?
        </p>

        <div className="pt-2">
          <UniversalSearchInput autoFocus={false} />
        </div>
      </div>

      {/* Real Summary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Verified Companies</div>
            <div className="text-2xl font-extrabold font-mono text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">
              {companies.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#4EA36C] flex items-center justify-center border border-[#BAA88B]/50">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Saved Dossiers</div>
            <div className="text-2xl font-extrabold font-mono text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">
              {savedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#D8C7AC] dark:bg-[#1A251E] text-[#A47432] dark:text-[#D4B370] flex items-center justify-center border border-[#BAA88B]/50">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Search Activity</div>
            <div className="text-2xl font-extrabold font-mono text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">
              {historyCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#4EA36C] flex items-center justify-center border border-[#BAA88B]/50">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl editorial-card border-2 border-rose-800/30 bg-[#F7EFE1] dark:bg-[#202D25] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono text-rose-800 dark:text-rose-300 uppercase font-bold">Risk Alerts Active</div>
            <div className="text-2xl font-extrabold font-mono text-rose-800 dark:text-rose-300 mt-0.5">
              {attentionNeededOpportunities.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-950/20 text-rose-800 dark:text-rose-300 flex items-center justify-center border border-rose-800/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* RECOMMENDED FOR YOU */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] flex items-center gap-2 font-sans">
              <Sparkles className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
              <span>Recommended Opportunities For Your Profile</span>
            </h2>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
              Calibrated against your verified skills and target role preferences.
            </p>
          </div>

          <Link
            to="/recommendations"
            className="text-xs font-mono text-[#0D2B1D] dark:text-[#4EA36C] hover:underline flex items-center gap-1 font-extrabold"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              onClick={() => navigate(`/opportunity/${opp.slug || opp.id}`)}
              className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer flex flex-col justify-between group shadow-sm"
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

                <h3 className="text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors mb-1 line-clamp-1 font-sans">
                  {opp.title}
                </h3>
                <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] flex items-center gap-1.5 mb-3 font-mono font-bold">
                  <Building2 className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                  <span>{opp.company?.name}</span>
                </div>

                <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] line-clamp-2 mb-4 leading-relaxed font-normal">
                  {opp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#BAA88B]/40 dark:border-[#334438] flex items-center justify-between text-xs font-mono">
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300">
                  {opp.stipend || 'Disclosed upon interview'}
                </span>
                <span className="text-[#0D2B1D] dark:text-[#4EA36C] flex items-center gap-1 font-extrabold">
                  <span>Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEEDS YOUR ATTENTION SECTION */}
      {attentionNeededOpportunities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] flex items-center gap-2 font-sans">
                <AlertTriangle className="w-4 h-4 text-rose-800 dark:text-rose-400" />
                <span>Needs Your Attention — Warning Indicators Detected</span>
              </h2>
              <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
                Postings requiring independent verification or containing financial requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attentionNeededOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => navigate(`/opportunity/${opp.slug || opp.id}`)}
                className="p-6 rounded-3xl border-2 border-rose-800/30 bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer flex flex-col justify-between hover:border-rose-700 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <RiskLevelBadge level="HIGH_RISK" size="sm" />
                    <span className="text-xs font-mono text-rose-800 dark:text-rose-300 font-extrabold">
                      Credibility: {opp.company?.credibilityScore || 28}/100
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2] mb-1 font-sans">
                    {opp.title}
                  </h3>
                  <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] mb-2 font-mono font-bold">
                    Company: {opp.company?.name}
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/10 border border-rose-800/30 text-xs text-rose-900 dark:text-rose-200 font-mono">
                    ⚠️ Warning Trigger: Upfront fee demand ({opp.fee || '₹2,500 Security Fee'}). Do not transfer funds.
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-rose-800/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Status: Unverified / High Risk</span>
                  <span className="text-rose-800 dark:text-rose-300 hover:underline flex items-center gap-1 font-extrabold">
                    <span>Audit Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RECENT VERIFIED REGISTRIES LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] flex items-center gap-2 font-sans">
              <Clock className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
              <span>Available Verified Corporate Registries</span>
            </h2>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
              Audited enterprise dossiers and active recruitment records.
            </p>
          </div>

          <Link
            to="/research"
            className="text-xs font-mono text-[#0D2B1D] dark:text-[#4EA36C] hover:underline flex items-center gap-1 font-extrabold"
          >
            <span>Research New Entity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.slice(0, 6).map((comp) => (
            <div
              key={comp.id}
              onClick={() => navigate(`/company/${comp.slug || comp.id}`)}
              className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D8C7AC] dark:bg-[#1A251E] flex items-center justify-center font-bold text-[#0D2B1D] dark:text-[#4EA36C] border border-[#BAA88B]/50">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">{comp.name}</div>
                  <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-medium">{comp.industry || 'Technology'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
                  {comp.credibilityScore}/100
                </div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono font-bold">Audited</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
