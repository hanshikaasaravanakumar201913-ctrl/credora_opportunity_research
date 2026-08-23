import React from 'react';
import { ShieldCheck, Building2, Search, Scale, FileText, CheckCircle2, Globe } from 'lucide-react';

export const SurrealHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[320px] sm:h-[380px] flex items-center justify-center my-8 select-none pointer-events-none">
      {/* Subtle Circular Orbit Lines in Warm Gold and Forest Green */}
      <div className="absolute w-80 sm:w-[420px] h-80 sm:h-[420px] rounded-full border border-[#0D2B1D]/20 dark:border-[#4EA36C]/30 border-dashed animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-56 sm:w-80 h-56 sm:h-80 rounded-full border border-[#0D2B1D]/15 dark:border-[#4EA36C]/20" />

      {/* Central Verified Intelligence Hub */}
      <div className="relative z-10 p-6 rounded-3xl editorial-card flex flex-col items-center justify-center shadow-xl border-2 border-[#0D2B1D]/40 dark:border-[#4EA36C]/40 bg-[#F6EFE3] dark:bg-[#202D25]">
        <div className="w-14 h-14 rounded-2xl bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F6EFE3] dark:text-[#0F1511] flex items-center justify-center font-mono font-extrabold text-xl shadow-lg border border-[#A47432]/40">
          CR
        </div>
        <div className="text-sm font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans mt-3">
          Credora Decision Engine
        </div>
        <div className="text-xs font-mono font-bold text-[#A47432] dark:text-[#D4B370] mt-0.5">
          Evidence Synthesized (0–100)
        </div>
      </div>

      {/* Satellite Node 1: Corporate Registry (Top Left) */}
      <div className="absolute top-2 left-2 sm:left-12 p-3.5 rounded-2xl editorial-card shadow-lg flex items-center gap-3 animate-bounce-slow border border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25]">
        <div className="w-9 h-9 rounded-xl bg-[#0D2B1D] dark:bg-[#1A251E] text-[#F6EFE3] dark:text-[#4EA36C] flex items-center justify-center shadow-sm">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans">Entity Registry</div>
          <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">✓ Verified Records</div>
        </div>
      </div>

      {/* Satellite Node 2: Authoritative DNS & WHOIS (Top Right) */}
      <div className="absolute top-6 right-2 sm:right-12 p-3.5 rounded-2xl editorial-card shadow-lg flex items-center gap-3 animate-bounce-slow border border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25]" style={{ animationDelay: '1.2s' }}>
        <div className="w-9 h-9 rounded-xl bg-[#0D2B1D] dark:bg-[#1A251E] text-[#F6EFE3] dark:text-[#4EA36C] flex items-center justify-center shadow-sm">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans">DNS & SSL Audit</div>
          <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">✓ Active Infrastructure</div>
        </div>
      </div>

      {/* Satellite Node 3: Multi-Opportunity Fit (Bottom Left) */}
      <div className="absolute bottom-4 left-4 sm:left-14 p-3.5 rounded-2xl editorial-card shadow-lg flex items-center gap-3 animate-bounce-slow border border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25]" style={{ animationDelay: '2.4s' }}>
        <div className="w-9 h-9 rounded-xl bg-[#0D2B1D] dark:bg-[#1A251E] text-[#A47432] dark:text-[#D4B370] flex items-center justify-center shadow-sm">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans">Career Fit Index</div>
          <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">92% Skill Alignment</div>
        </div>
      </div>

      {/* Satellite Node 4: 13-Section Dossier (Bottom Right) */}
      <div className="absolute bottom-6 right-4 sm:right-14 p-3.5 rounded-2xl editorial-card shadow-lg flex items-center gap-3 animate-bounce-slow border border-[#BFAD91] dark:border-[#334438] bg-[#F6EFE3] dark:bg-[#202D25]" style={{ animationDelay: '3.6s' }}>
        <div className="w-9 h-9 rounded-xl bg-[#0D2B1D] dark:bg-[#1A251E] text-[#F6EFE3] dark:text-[#4EA36C] flex items-center justify-center shadow-sm">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#0C120E] dark:text-[#E2EDE2] font-sans">Structured Dossier</div>
          <div className="text-[11px] text-[#0D2B1D] dark:text-[#4EA36C] font-mono font-bold">13-Section Audit</div>
        </div>
      </div>
    </div>
  );
};
