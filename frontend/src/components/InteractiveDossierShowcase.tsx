import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Globe,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const InteractiveDossierShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'microsoft' | 'scam' | 'scaleup'>('microsoft');

  const cases = {
    microsoft: {
      title: 'Microsoft Corporation',
      subtitle: 'Global Cloud & Enterprise Infrastructure · Redmond, Washington',
      score: 94,
      status: 'VERIFIED',
      risk: 'LOW_RISK',
      careerFit: '95% Match',
      type: 'Software Engineering Internship (2026 Batch)',
      stipend: '₹1,25,000 / month',
      fee: '₹0 (Zero Application Fee)',
      domain: 'microsoft.com (Active TLS 1.3)',
      sources: ['Wikipedia Public Knowledge Registry', 'Cloudflare Authoritative DoH'],
      positiveSignals: [
        'Confirmed official enterprise domain registration',
        'Physical operating headquarters corroborated in public records',
        'No upfront monetary payment or security deposit required'
      ],
      warningSignals: [],
      link: '/company/microsoft'
    },
    scam: {
      title: 'Global Career Boosters India',
      subtitle: 'Unregistered Forwarded WhatsApp Recruitment · Mismatched Identity',
      score: 18,
      status: 'HIGH_RISK',
      risk: 'HIGH_RISK',
      careerFit: '12% Match',
      type: 'Python & Web Development Trainee',
      stipend: '₹20,000 / mo (Unverified)',
      fee: '⚠️ ₹2,500 Upfront Security Deposit (Refundable)',
      domain: 'No official domain (Recruiter using @gmail.com)',
      sources: ['Heuristic Heuristic NLP Parser', 'DNS Host Registry Audit'],
      positiveSignals: [],
      warningSignals: [
        'Monetary deposit demanded before work commencement (₹2,500)',
        'Recruiter uses personal free webmail (@gmail.com) for corporate hiring',
        'Entity not located in authoritative corporate knowledge registries'
      ],
      link: '/analyze-message'
    },
    scaleup: {
      title: 'BrandNest Innovations',
      subtitle: 'Digital Marketing & Growth Engineering · Bangalore, India',
      score: 82,
      status: 'VERIFIED',
      risk: 'LOW_RISK',
      careerFit: '88% Match',
      type: 'Full-Stack Developer Intern',
      stipend: '₹25,000 / month',
      fee: '₹0 (Legitimate Opportunity)',
      domain: 'brandnest.io (Active HTTPS)',
      sources: ['Public Business Index', 'Cloudflare DNS Infrastructure'],
      positiveSignals: [
        'Verified domain DNS resolution and SSL security',
        'Clear learning curve and modern technology stack (React, Node.js)',
        'Direct HR interview process disclosed upfront'
      ],
      warningSignals: [],
      link: '/company/brandnest'
    }
  };

  const current = cases[activeTab];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Case Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('microsoft')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'microsoft'
              ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-md border-2 border-[#0D2B1D] dark:border-[#4EA36C]'
              : 'border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] text-[#0A110D] dark:text-[#AFC4B2] hover:border-[#0D2B1D] font-bold'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Case 01: Enterprise Tech (Microsoft)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scam')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'scam'
              ? 'bg-rose-800 text-[#F7EFE1] font-extrabold shadow-md border-2 border-rose-900'
              : 'border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] text-rose-800 dark:text-rose-400 hover:border-rose-700 font-bold'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Case 02: High-Risk WhatsApp Message (₹2,500 Fee)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scaleup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'scaleup'
              ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-md border-2 border-[#0D2B1D] dark:border-[#4EA36C]'
              : 'border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] text-[#0A110D] dark:text-[#AFC4B2] hover:border-[#0D2B1D] font-bold'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Case 03: Fast-Growing Startup (BrandNest)</span>
        </button>
      </div>

      {/* Main Interactive Dossier Card */}
      <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] shadow-xl space-y-6 relative overflow-hidden bg-[#F7EFE1] dark:bg-[#202D25]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#BAA88B]/60 dark:border-[#334438] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Live Synthesized Research Dossier</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              {current.title}
            </h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] mt-0.5 font-mono font-bold">
              {current.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border text-center font-mono ${
              current.score >= 70
                ? 'bg-emerald-950/10 border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-950/10 border-rose-800/40 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="text-[10px] uppercase font-bold">Credibility Index</div>
              <div className="text-2xl font-extrabold">{current.score}/100</div>
            </div>

            <div className="px-4 py-2 rounded-2xl border border-[#BAA88B] dark:border-[#334438] bg-[#D8C7AC] dark:bg-[#1A251E] text-center font-mono text-[#0D2B1D] dark:text-[#E2EDE2]">
              <div className="text-[10px] uppercase font-bold">Career Alignment</div>
              <div className="text-2xl font-extrabold">{current.careerFit}</div>
            </div>
          </div>
        </div>

        {/* 3 Parameter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] space-y-1">
            <div className="text-[11px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Opportunity Type</div>
            <div className="text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2]">{current.type}</div>
            <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">{current.stipend}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] space-y-1">
            <div className="text-[11px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Monetary Terms</div>
            <div className={`text-xs font-bold ${current.score < 50 ? 'text-rose-800 dark:text-rose-400 font-mono font-extrabold' : 'text-emerald-800 dark:text-emerald-400 font-mono font-bold'}`}>
              {current.fee}
            </div>
            <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-medium">Verified Zero Deposit Policy</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] space-y-1">
            <div className="text-[11px] font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Infrastructure & Domain</div>
            <div className="text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] font-mono">{current.domain}</div>
            <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">Cloudflare DoH Verified</div>
          </div>
        </div>

        {/* Signals Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-emerald-800/30 bg-emerald-950/10 space-y-2">
            <div className="text-xs font-mono font-extrabold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Positive Authenticity Signals ({current.positiveSignals.length})</span>
            </div>
            {current.positiveSignals.length === 0 ? (
              <p className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">Zero verified positive signals identified.</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200 font-mono font-medium">
                {current.positiveSignals.map((sig, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 rounded-2xl border border-amber-800/30 bg-amber-950/10 space-y-2">
            <div className="text-xs font-mono font-extrabold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Detected Risk Indicators ({current.warningSignals.length})</span>
            </div>
            {current.warningSignals.length === 0 ? (
              <p className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">No warning triggers detected in public records.</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200 font-mono font-medium">
                {current.warningSignals.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 dark:text-amber-400 font-bold">⚠️</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#BAA88B]/60 dark:border-[#334438] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-semibold">
            Data Sources: {current.sources.join(' · ')}
          </div>

          <Link
            to={current.link}
            className="btn-primary text-xs font-mono font-extrabold"
          >
            <span>Explore Full {current.title} Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
