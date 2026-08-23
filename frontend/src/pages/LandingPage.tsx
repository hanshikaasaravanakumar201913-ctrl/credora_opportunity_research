import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UniversalSearchInput } from '../components/UniversalSearchInput.js';
import { InteractiveDossierShowcase } from '../components/InteractiveDossierShowcase.js';
import {
  Search,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  Compass,
  FileCheck2,
  Lock,
  ChevronRight,
  ChevronDown,
  Globe,
  Mail,
  Zap,
  HelpCircle,
  Award,
  Users,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  const faqs = [
    {
      q: 'How does Credora verify company existence without making assumptions?',
      a: 'Credora connects directly to real-time public knowledge registries (such as the Wikipedia Corporate REST API) and Cloudflare DNS-over-HTTPS (DoH). We inspect authoritative A/AAAA host records, domain SSL infrastructure, founding milestones, and operating headquarters. If an organization cannot be found across these sources, Credora explicitly returns an unverified status with 0 fabricated details.'
    },
    {
      q: 'How does the 8-Factor Credibility Score work?',
      a: 'The credibility score is an evidence-weighted composite score from 0 to 100 points. Points are awarded across 8 distinct dimensions: Entity Existence (20 pts), Source Corroboration (15 pts), Official Web Presence & DNS Security (15 pts), Opportunity Consistency (15 pts), Contact Channels (10 pts), Information Completeness (10 pts), Entity Longevity (5 pts), and Deductions for Risk Indicators (up to 10 pts penalty).'
    },
    {
      q: 'What is Domain Mismatch Detection in the message analyzer?',
      a: 'When recruiters reach out via WhatsApp, Telegram, or LinkedIn, scammers frequently claim to represent global firms like Google or Microsoft while instructing candidates to send resumes or payments to free personal webmail accounts (such as @gmail.com or @outlook.com). Credora compares the claimed company against its authoritative domain and instantly flags the mismatch.'
    },
    {
      q: 'How does the Multi-Opportunity Comparison Matrix work?',
      a: 'You can select 2 to 5 opportunities side-by-side. Credora compares suitability match percentage, career trajectory, skill overlap with your candidate profile, credibility ratings, risk levels, and compensation terms to deliver an explainable "Top Match For You" recommendation.'
    },
    {
      q: 'Is Credora free for students and early-career job seekers?',
      a: 'Yes. Credora was designed specifically as an independent, transparent decision-support platform for students, new graduates, and early-career professionals to protect their time, money, and career choices.'
    }
  ];

  return (
    <div className="relative overflow-hidden space-y-24 pb-20 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full editorial-pill">
          <ShieldCheck className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>INDEPENDENT CAREER INTELLIGENCE · RESEARCH · COMPARE · VERIFY</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            KNOW MORE.{' '}
            <span className="text-[#0D2B1D] dark:text-[#4EA36C] underline decoration-[#A47432] dark:decoration-[#D4B370] decoration-wavy underline-offset-8">
              DECIDE BETTER.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#2C3E33] dark:text-[#AFC4B2] max-w-2xl mx-auto leading-relaxed font-normal">
            Research companies, internships, jobs, and learning opportunities before you commit your time, money, or trust.
          </p>
        </div>

        {/* Universal Search Box on Hero */}
        <div className="pt-2 max-w-3xl mx-auto">
          <UniversalSearchInput autoFocus={false} />
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/research"
            className="btn-primary px-8 py-3.5 text-xs font-mono font-extrabold"
          >
            <span>Launch Intelligence Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#live-dossier"
            className="btn-secondary px-8 py-3.5 text-xs font-mono font-bold"
          >
            <span>Inspect Live Case Studies</span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </a>
        </div>

        {/* Interactive Live Case Studies Showcase */}
        <div id="live-dossier" className="pt-8">
          <InteractiveDossierShowcase />
        </div>
      </section>

      {/* 2. TRUST MANIFESTO BAR */}
      <section className="border-y border-[#BAA88B] dark:border-dark-border bg-[#DFD0B8]/80 dark:bg-dark-surface/50 py-10 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">0</div>
              <div className="text-xs font-mono font-extrabold uppercase text-[#0A110D] dark:text-[#E2EDE2]">Fake Fallbacks</div>
              <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">Zero-fabrication guarantee on unverified entities</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">100%</div>
              <div className="text-xs font-mono font-extrabold uppercase text-[#0A110D] dark:text-[#E2EDE2]">Corroborated Records</div>
              <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">Wikipedia REST APIs + Cloudflare DoH</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#A47432] dark:text-[#D4B370]">8-Factor</div>
              <div className="text-xs font-mono font-extrabold uppercase text-[#0A110D] dark:text-[#E2EDE2]">Evidence Scoring</div>
              <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">Transparent mathematical point breakdown</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">13</div>
              <div className="text-xs font-mono font-extrabold uppercase text-[#0A110D] dark:text-[#E2EDE2]">Section Dossiers</div>
              <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">One-click PDF print and audit export</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR-STAGE WORKFLOW (01 - 04) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
            <Compass className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Structured Intelligence Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            How Credora Works: The Four-Stage Workflow
          </h2>
          <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
            A comprehensive pipeline turning ambiguous postings and recruiter claims into verified career clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl editorial-card relative space-y-3 group border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="text-3xl font-extrabold font-mono text-[#0D2B1D]/40 dark:text-[#4EA36C]/40 group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors">
              01
            </div>
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">DISCOVER</h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] leading-relaxed font-medium">
              Submit a company name, website link, job posting URL, or paste the raw forwarded WhatsApp/Telegram message.
            </p>
          </div>

          <div className="p-6 rounded-3xl editorial-card relative space-y-3 group border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="text-3xl font-extrabold font-mono text-[#0D2B1D]/40 dark:text-[#4EA36C]/40 group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors">
              02
            </div>
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">RESEARCH</h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] leading-relaxed font-medium">
              Credora queries live Wikipedia indices and Cloudflare DNS infrastructure to corroborate corporate headquarters and active SSL hosts.
            </p>
          </div>

          <div className="p-6 rounded-3xl editorial-card relative space-y-3 group border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="text-3xl font-extrabold font-mono text-[#A47432]/60 dark:text-[#D4B370]/60 group-hover:text-[#A47432] dark:group-hover:text-[#D4B370] transition-colors">
              03
            </div>
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">COMPARE</h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] leading-relaxed font-medium">
              Evaluate 2 to 5 opportunities side-by-side on skill overlap, learning curve, compensation, and personalized career alignment.
            </p>
          </div>

          <div className="p-6 rounded-3xl editorial-card relative space-y-3 group border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="text-3xl font-extrabold font-mono text-[#0D2B1D]/40 dark:text-[#4EA36C]/40 group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors">
              04
            </div>
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">DECIDE</h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] leading-relaxed font-medium">
              Review full 13-section evidence, audit warning indicators, copy formal HR verification inquiries, and decide with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOUR THREATS CREDORA PROTECTS AGAINST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
            <span>Real Student Protection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            Common Traps Credora Flags Instantly
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl border-2 border-rose-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
            <div className="text-xs font-mono font-extrabold text-rose-800 dark:text-rose-300 uppercase">
              01. Pay-to-Work Traps
            </div>
            <h4 className="text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2]">Upfront "Security" Fees</h4>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              Demands for ₹1,500–₹5,000 "registration fees" or "laptop security deposits" before starting.
            </p>
          </div>

          <div className="p-5 rounded-3xl border-2 border-rose-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
            <div className="text-xs font-mono font-extrabold text-rose-800 dark:text-rose-300 uppercase">
              02. Ghost Recruiters
            </div>
            <h4 className="text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2]">Domain Mismatches</h4>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              Recruiters claiming to be from Microsoft or TCS while using generic free @gmail.com mailboxes.
            </p>
          </div>

          <div className="p-5 rounded-3xl border-2 border-amber-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
            <div className="text-xs font-mono font-extrabold text-amber-800 dark:text-amber-300 uppercase">
              03. Ambition Misalignment
            </div>
            <h4 className="text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2]">Course Disguised as Job</h4>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              Postings promising full-time engineering that secretly divert applicants into costly bootcamps.
            </p>
          </div>

          <div className="p-5 rounded-3xl border-2 border-amber-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-2 shadow-sm">
            <div className="text-xs font-mono font-extrabold text-amber-800 dark:text-amber-300 uppercase">
              04. Paper Shells
            </div>
            <h4 className="text-sm font-bold text-[#0A110D] dark:text-[#E2EDE2]">Unresolvable Infrastructure</h4>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              Companies without public registrar records, active domain DNS, or physical operating hubs.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CANDIDATE DECISION STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
            <Award className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Real Candidate Case Scenarios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            How Students Decide With Credora
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl editorial-card space-y-4 border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="flex items-center justify-between border-b border-[#BAA88B]/50 dark:border-[#334438] pb-3">
              <div>
                <div className="text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Alex Chen</div>
                <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">B.Tech Computer Science '26</div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-950/10 text-rose-800 dark:text-rose-300 border border-rose-800/30">
                Prevented ₹2,500 Scam
              </span>
            </div>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              "I received a WhatsApp forward for a 'Full-Stack Developer Internship' offering ₹20,000/month but asking for a ₹2,500 security deposit. Pasting the message into Credora immediately flagged the upfront fee trigger and revealed the recruiter was using an unverified webmail domain. Credora saved my money."
            </p>
          </div>

          <div className="p-6 rounded-3xl editorial-card space-y-4 border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25]">
            <div className="flex items-center justify-between border-b border-[#BAA88B]/50 dark:border-[#334438] pb-3">
              <div>
                <div className="text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Priya Sharma</div>
                <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">M.Sc AI & Machine Learning '25</div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-950/10 text-emerald-800 dark:text-emerald-300 border border-emerald-800/30">
                Multi-Offer Comparison
              </span>
            </div>
            <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              "I had two internship offers—one from a fast-growing startup and one from a traditional corporate. Running both through the Credora Comparison Matrix gave me an objective breakdown of skill match, mentorship quality, and credibility. It made my choice clear and stress-free."
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
            <HelpCircle className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            Independent Research Methodology
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono border-t border-[#BAA88B]/40 dark:border-[#334438] font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl editorial-card border-2 border-[#0D2B1D] dark:border-[#4EA36C] bg-[#F7EFE1] dark:bg-[#202D25] shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] flex items-center justify-center font-mono font-extrabold text-lg mx-auto shadow-md">
            CR
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              Make decisions with information, not assumptions.
            </h2>
            <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] max-w-xl mx-auto font-mono font-medium">
              Join thousands of students and early career researchers making transparent, verified, and career-aligned opportunity choices.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/research"
              className="btn-primary px-8 py-3.5 text-xs font-mono font-extrabold"
            >
              <span>Start Researching Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="btn-secondary px-8 py-3.5 text-xs font-mono font-bold"
            >
              <span>Launch Compare Matrix</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
