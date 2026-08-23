import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { CredibilityScoreGauge } from '../components/CredibilityScoreGauge.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import { InformationStatusBadge } from '../components/InformationStatusBadge.js';
import {
  FileCheck2,
  Printer,
  Bookmark,
  Building2,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Layers,
  Mail,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';

export const ResearchReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunity' | 'credibility' | 'sources' | 'contacts'>('overview');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const res = await api.getReport(id);
        if (res.report) {
          setReport(res.report);
        }
      } catch (err) {
        console.error('Error fetching research report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!report?.id) return;
    try {
      await api.saveReport(report.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving report:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D2B1D] dark:border-[#4EA36C] border-t-transparent animate-spin mx-auto" />
        <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">Formatting 13-section research dossier...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center space-y-4 max-w-lg mx-auto p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
        <h2 className="text-xl font-bold text-[#0A110D] dark:text-[#E2EDE2] font-sans">Research Report Not Found</h2>
        <Link to="/research" className="btn-primary inline-flex text-xs font-mono font-extrabold">
          Back to Research Hub
        </Link>
      </div>
    );
  }

  const informationGaps: string[] = typeof report.informationGaps === 'string'
    ? JSON.parse(report.informationGaps || '[]')
    : report.informationGaps || [];

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Action Header Bar (Hidden in Print) */}
      <div className="flex items-center justify-between no-print pt-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-bold">
          <Link to="/research" className="hover:text-[#0D2B1D] dark:hover:text-[#4EA36C]">Research</Link>
          <span>/</span>
          <span className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">Dossier #{report.id?.slice(0, 8)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="btn-secondary text-xs font-mono font-bold"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-300" /> : <Bookmark className="w-4 h-4 text-[#A47432] dark:text-[#D4B370]" />}
            <span>{saved ? 'Saved to Profile' : 'Save Report'}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="btn-primary text-xs font-mono font-extrabold"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-6 relative shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#BAA88B]/40 dark:border-[#334438] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0D2B1D] dark:text-[#4EA36C] uppercase tracking-widest mb-1 font-extrabold">
              <FileCheck2 className="w-4 h-4" />
              <span>Official Credora Research Dossier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              {report.company?.name}
            </h1>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] mt-0.5 font-mono font-bold">
              {report.opportunity?.title || 'General Corporate Intelligence Audit'} · Generated {new Date(report.lastChecked || report.createdAt).toLocaleDateString()}
            </p>
          </div>

          <RiskLevelBadge level={report.riskLevel || 'LOW_RISK'} size="lg" />
        </div>

        {/* 4 Core Score Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-center">
            <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Career Match</div>
            <div className="text-2xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C] mt-0.5">
              {report.careerMatchPercentage}%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-center">
            <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Credibility Score</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-800 dark:text-emerald-300 mt-0.5">
              {report.credibilityScore}/100
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-center">
            <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Info Quality</div>
            <div className="text-2xl font-extrabold font-mono text-[#A47432] dark:text-[#D4B370] mt-0.5">
              {report.infoQualityScore}%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-center">
            <div className="text-[10px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Risk Level</div>
            <div className="text-xs font-extrabold font-mono text-[#0A110D] dark:text-[#E2EDE2] mt-2">
              {report.riskLevel === 'HIGH_RISK' ? '⚠️ High Risk' : '✓ Low Risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector (Hidden in Print) */}
      <div className="flex items-center gap-2 border-b border-[#BAA88B]/40 dark:border-[#334438] pb-3 no-print">
        {[
          { id: 'overview', label: 'Executive Summary', icon: Layers },
          { id: 'opportunity', label: 'Opportunity Scope', icon: Briefcase },
          { id: 'credibility', label: 'Credibility Breakdown', icon: ShieldCheck },
          { id: 'sources', label: 'Source Provenance', icon: FileCheck2 },
          { id: 'contacts', label: 'Verified Contacts', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                active
                  ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold border border-[#0D2B1D] dark:border-[#4EA36C]'
                  : 'text-[#2C3E33] dark:text-[#9FB3A2] hover:text-[#0A110D] font-bold'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY */}
      {(activeTab === 'overview' || window.matchMedia('print').matches) && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
              01. Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-[#0A110D] dark:text-[#E2EDE2] leading-relaxed font-normal">
              {report.executiveSummary || report.summary}
            </p>
          </div>

          <div className="p-6 rounded-3xl editorial-card border-2 border-[#0D2B1D]/40 dark:border-[#4EA36C]/40 bg-[#F7EFE1] dark:bg-[#202D25] space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
              02. Tailored Recommendation Narrative
            </h3>
            <p className="text-xs sm:text-sm text-[#0A110D] dark:text-[#E2EDE2] leading-relaxed font-mono font-medium">
              {report.recommendationNarrative}
            </p>
          </div>

          {informationGaps.length > 0 && (
            <div className="p-6 rounded-3xl border-2 border-amber-800/30 bg-amber-950/10 space-y-3">
              <h3 className="text-xs font-mono uppercase text-amber-800 dark:text-amber-300 font-extrabold tracking-wider">
                03. Identified Information Gaps & Unverified Details
              </h3>
              <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200 font-mono">
                {informationGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 font-medium">
                    <span>•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OPPORTUNITY SCOPE */}
      {activeTab === 'opportunity' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
              Opportunity Structure & Compensation
            </h3>
            <p className="text-xs sm:text-sm text-[#0A110D] dark:text-[#E2EDE2] leading-relaxed font-normal">
              {report.opportunityOverview}
            </p>
            {report.careerRelevance && (
              <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs text-[#0A110D] dark:text-[#E2EDE2] font-mono">
                💡 <span className="font-extrabold">Career Fit Evaluation:</span> {report.careerRelevance}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CREDIBILITY BREAKDOWN */}
      {activeTab === 'credibility' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
              Audited Credibility Factor Breakdown
            </h3>
            <p className="text-xs text-[#0A110D] dark:text-[#E2EDE2] leading-relaxed font-mono font-medium">
              {report.riskIndicatorsSummary}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SOURCES */}
      {activeTab === 'sources' && (
        <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
            Primary Knowledge & Public Sources
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="border-b-2 border-[#BAA88B] dark:border-[#334438] text-[#0D2B1D] dark:text-[#4EA36C] uppercase text-[11px] font-extrabold">
                <tr>
                  <th className="py-2.5 px-3">Data Key</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Verified Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAA88B]/40 dark:divide-dark-border/40">
                {report.company?.sources?.map((src: any) => (
                  <tr key={src.id} className="hover:bg-[#EFE3CF] dark:hover:bg-[#1A251E]/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#0A110D] dark:text-[#E2EDE2]">{src.attributeKey}</td>
                    <td className="py-2.5 px-3 text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">{src.attributeValue}</td>
                    <td className="py-2.5 px-3 text-[#2C3E33] dark:text-[#9FB3A2]">{src.sourceName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.company?.contacts?.map((c: any) => (
            <div key={c.id} className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex items-center justify-between text-xs font-mono shadow-sm">
              <div>
                <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">{c.contactValue}</div>
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] font-bold">{c.label || c.contactType}</div>
              </div>
              <InformationStatusBadge status={c.verificationStatus} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
