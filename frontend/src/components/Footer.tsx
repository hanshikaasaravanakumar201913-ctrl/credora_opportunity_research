import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Github, Twitter, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#BAA88B] dark:border-dark-border bg-[#DFD0B8]/80 dark:bg-dark-bg/80 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0D2B1D] dark:bg-[#4EA36C] flex items-center justify-center text-[#F7EFE1] dark:text-[#0F1511] font-mono font-extrabold text-xs shadow-sm">
                CR
              </div>
              <span className="text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans tracking-tight">
                CREDORA
              </span>
            </div>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-medium">
              Career opportunity intelligence and decision-support for students and early-career job seekers.
            </p>
            <div className="text-[11px] font-mono font-bold text-[#A47432] dark:text-[#D4B370]">
              "Know more before you decide."
            </div>
          </div>

          {/* Col 2: Research Modules */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold mb-3">
              Research Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-medium">
              <li>
                <Link to="/research" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Universal Entity Search
                </Link>
              </li>
              <li>
                <Link to="/analyze-message" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Raw Message Analyzer
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Opportunity Compare Matrix
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Career Match Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Methodology */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold mb-3">
              Methodology
            </h4>
            <ul className="space-y-2 text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-medium">
              <li>
                <span className="text-[#2C3E33] dark:text-[#AFC4B2]">Wikipedia Corporate Registries</span>
              </li>
              <li>
                <span className="text-[#2C3E33] dark:text-[#AFC4B2]">Cloudflare DNS-over-HTTPS (DoH)</span>
              </li>
              <li>
                <span className="text-[#2C3E33] dark:text-[#AFC4B2]">8-Factor Evidence Scoring Engine</span>
              </li>
              <li>
                <span className="text-[#2C3E33] dark:text-[#AFC4B2]">Zero-Fabrication Truth Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Transparency */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold mb-3">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-medium">
              <li>
                <Link to="/about" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  About Credora
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Privacy & Data Charter
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] transition-colors">
                  Platform Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#BAA88B]/40 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-bold">
          <div>
            © {new Date().getFullYear()} Credora Intelligence. Independent decision-support.
          </div>
          <div className="flex items-center gap-4">
            <span>Zero-Fabrication Verified</span>
            <span>•</span>
            <span>All records corroborated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
