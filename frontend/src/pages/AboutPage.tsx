import React from 'react';
import { ShieldCheck, Sparkles, Building2, Scale, Compass, CheckCircle2, Lock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <Compass className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Product Identity & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          About Credora
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] max-w-xl mx-auto font-mono font-bold">
          Career Opportunity Intelligence & Decision-Support for students and early-career job seekers.
        </p>
      </div>

      <div className="p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 leading-relaxed text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] shadow-sm">
        <h2 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] uppercase font-mono tracking-wider">
          Core Mission
        </h2>
        <p className="font-medium">
          Students discover internships, jobs, and learning opportunities from countless fragmented channels—LinkedIn, job portals, WhatsApp forwards, Telegram groups, and college campus circles. Too often, students lack verified information about whether the employing entity is legitimate, how long it has existed, what its actual commercial footprint is, and whether the offer aligns with their career goals.
        </p>
        <p className="font-medium">
          Credora is NOT merely a binary scam detector. Credibility analysis is only one pillar of a comprehensive, four-part research engine: <strong className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">RESEARCH, COMPARE, VERIFY, and DECIDE</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
          <div className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold font-mono text-xs uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Fabrication Guarantee</span>
          </div>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
            If an attribute cannot be confirmed from primary public registries or DNS records, Credora explicitly marks it as unverified rather than inventing facts.
          </p>
        </div>

        <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
          <div className="text-[#A47432] dark:text-[#D4B370] font-extrabold font-mono text-xs uppercase flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Multi-Factor Suitability</span>
          </div>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
            Comparisons evaluate career fit, skill overlap, learning potential, and compensation terms alongside credibility so students make well-rounded choices.
          </p>
        </div>
      </div>
    </div>
  );
};
