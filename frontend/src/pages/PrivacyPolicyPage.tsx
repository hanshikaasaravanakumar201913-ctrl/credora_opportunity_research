import React from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <Lock className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Data Governance & Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Privacy & Research Charter
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] max-w-xl mx-auto font-mono font-bold">
          Credora uses public corporate records and student-provided inputs strictly to deliver decision-support intelligence.
        </p>
      </div>

      <div className="p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-6 text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed shadow-sm font-medium">
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold font-mono uppercase text-[#0A110D] dark:text-[#E2EDE2]">01. Public Business Contacts Only</h2>
          <p>
            Credora aggregates and presents only publicly intended business contact information (official corporate talent desks, verified switchboards, and registered domain webmasters). We do not collect, expose, or scrape private personal numbers or private home addresses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold font-mono uppercase text-[#0A110D] dark:text-[#E2EDE2]">02. Student Profile Confidentiality</h2>
          <p>
            Your declared academic background, verified skills, and target career preferences are stored in encrypted form and used solely to calculate suitability matching scores for your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold font-mono uppercase text-[#0A110D] dark:text-[#E2EDE2]">03. Message Text Processing</h2>
          <p>
            When you paste raw opportunity texts from messaging applications, the text is audited via automated heuristic parsers to detect financial risk triggers. Credora does not sell or share message bodies with third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
};
