import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { InformationStatusBadge } from '../components/InformationStatusBadge.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import { VerificationEmailModal } from '../components/VerificationEmailModal.js';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  FileCheck,
  Scale,
  Mail,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Plus,
  Check
} from 'lucide-react';

export const OpportunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunityData = async () => {
      if (!id) return;
      try {
        const res = await api.getOpportunity(id);
        if (res.opportunity) {
          setOpportunity(res.opportunity);
          setMatchData(res.match);
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunityData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] dark:border-[#4EA36C] border-t-transparent animate-spin mx-auto" />
        <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">
          Evaluating opportunity parameters and skill alignment...
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="py-24 text-center space-y-4 max-w-lg mx-auto p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
        <h2 className="text-xl font-bold text-[#0A110D] dark:text-[#E2EDE2] font-sans">Opportunity Not Located</h2>
        <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono">
          Information could not be verified from the sources checked.
        </p>
        <Link to="/research" className="inline-flex items-center gap-2 btn-primary">
          Back to Research Hub
        </Link>
      </div>
    );
  }

  const requiredSkills: string[] = JSON.parse(opportunity.requiredSkills || '[]');
  const preferredSkills: string[] = JSON.parse(opportunity.preferredSkills || '[]');

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Opportunity Header */}
      <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] relative overflow-hidden shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#E2EDE2] font-extrabold">
                {opportunity.opportunityType}
              </span>
              <InformationStatusBadge status={opportunity.statusVerification} size="sm" />
              {opportunity.hasUpfrontFee && <RiskLevelBadge level="HIGH_RISK" size="sm" />}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans mb-2">
              {opportunity.title}
            </h1>

            <Link
              to={`/company/${opportunity.company?.slug || opportunity.company?.id}`}
              className="text-xs sm:text-sm font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] hover:underline flex items-center gap-1.5 font-mono"
            >
              <Building2 className="w-4 h-4" />
              <span>{opportunity.company?.name}</span>
              <span className="text-[#2C3E33] dark:text-[#9FB3A2]">({opportunity.company?.credibilityScore}/100 Credibility)</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEmailModalOpen(true)}
              className="btn-secondary text-xs font-mono font-bold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Verify With HR</span>
            </button>

            <button
              onClick={async () => {
                const rep = await api.generateReport(opportunity.companyId, opportunity.id);
                navigate(`/report/${rep.report?.reportId || rep.report?.id}`);
              }}
              className="btn-primary text-xs font-mono font-extrabold"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Generate 13-Section Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Details & Student Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Parameters Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Stipend / Comp</div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300 font-mono mt-0.5">
                {opportunity.stipend || 'Disclosed during review'}
              </div>
            </div>

            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Work Mode & Base</div>
              <div className="text-xs sm:text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5 font-mono">
                {opportunity.workMode} ({opportunity.location || 'Remote'})
              </div>
            </div>

            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Tenure / Duration</div>
              <div className="text-xs sm:text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5 font-mono">
                {opportunity.duration || '6 Months'}
              </div>
            </div>

            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Application Fee</div>
              <div className={`text-xs sm:text-sm font-extrabold font-mono mt-0.5 ${opportunity.hasUpfrontFee ? 'text-rose-800 dark:text-rose-400' : 'text-emerald-800 dark:text-emerald-300'}`}>
                {opportunity.fee || 'None / ₹0'}
              </div>
            </div>

            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Application Deadline</div>
              <div className="text-xs sm:text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5 font-mono">
                {opportunity.deadline || 'Rolling basis'}
              </div>
            </div>

            <div className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
              <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Application Method</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] mt-0.5 truncate font-mono">
                {opportunity.applicationMethod || 'Official Portal'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] tracking-wider">
              Role Responsibilities & Scope
            </h3>
            <p className="text-xs sm:text-sm text-[#0A110D] dark:text-[#E2EDE2] leading-relaxed whitespace-pre-line font-normal">
              {opportunity.description}
            </p>
          </div>

          {/* Eligibility & Skills */}
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] tracking-wider">
              Requirements & Skillsets
            </h3>

            {opportunity.eligibility && (
              <div>
                <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] mb-1 font-bold">Academic & Batch Eligibility:</div>
                <div className="p-3.5 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs text-[#0A110D] dark:text-[#E2EDE2] font-mono font-medium">
                  {opportunity.eligibility}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] mb-2 font-bold">Required Core Skills:</div>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((sk) => (
                  <span key={sk} className="px-3 py-1 rounded-xl bg-[#D8C7AC] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs font-mono text-[#0D2B1D] dark:text-[#E2EDE2] font-bold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {preferredSkills.length > 0 && (
              <div>
                <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] mb-2 font-bold">Preferred / Good-to-Have Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {preferredSkills.map((sk) => (
                    <span key={sk} className="px-3 py-1 rounded-xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Career Alignment Radar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0D2B1D] dark:text-[#4EA36C] uppercase tracking-wider font-extrabold">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Match Index</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#D8C7AC] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-center">
              <div className="text-3xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">
                {matchData?.careerMatchPercentage || 88}%
              </div>
              <div className="text-[11px] font-mono text-[#0D2B1D] dark:text-[#AFC4B2] uppercase mt-1 font-bold">
                Career Fit Score
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                <span className="text-[#2C3E33] dark:text-[#9FB3A2]">Skill Overlap</span>
                <span className="text-[#0A110D] dark:text-[#E2EDE2] font-extrabold">{matchData?.skillMatchPercentage || 80}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#DFCFB6] dark:bg-[#1A251E] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0D2B1D] dark:bg-[#4EA36C]"
                  style={{ width: `${matchData?.skillMatchPercentage || 80}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              {matchData?.explanation || 'Aligned with candidate profile skills and career goals.'}
            </p>

            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full btn-primary text-xs font-mono font-extrabold"
              >
                <span>Apply Via Verified Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <VerificationEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        companyName={opportunity.company?.name || 'Organization'}
        opportunityTitle={opportunity.title}
      />
    </div>
  );
};
