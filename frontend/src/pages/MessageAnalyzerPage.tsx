import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import { ExtractedMessageAttributes } from '../types/index.js';
import {
  MessageSquareCode,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Link2,
  CheckCircle2,
  Info,
  HelpCircle,
  Copy
} from 'lucide-react';

export const MessageAnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialText = searchParams.get('text') || '';
  const messageId = searchParams.get('id');

  const [rawText, setRawText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ExtractedMessageAttributes | null>(null);

  useEffect(() => {
    if (messageId) {
      api.getMessage(messageId).then(res => {
        if (res) {
          setRawText(res.rawText);
          setAnalysis(res);
        }
      }).catch(console.error);
    } else if (initialText) {
      handleAnalyze(initialText);
    }
  }, [messageId, initialText]);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || rawText).trim();
    if (!text || loading) return;

    setLoading(true);
    try {
      const res = await api.analyzeMessage(text);
      setAnalysis(res);
    } catch (err) {
      console.error('Error analyzing message:', err);
    } finally {
      setLoading(false);
    }
  };

  const samplePresets = [
    {
      label: 'Sample 1: Upfront Deposit & Webmail (High Risk)',
      text: `🔥 URGENT HIRING FOR FRESHERS 2025/2026 BATCH 🔥\nCompany: Global Career Boosters India\nRole: Python & Full Stack Developer Trainee\nStipend: ₹20,000/mo (Guaranteed Placement 8 LPA)\nRegistration / Security Deposit Fee: ₹2,500 (Refundable upon first stipend)\nSelection: 100% Direct selection without interview.\nApply Immediately (Only 5 spots left): https://tinyurl.com/fast-join-job2026\nSend screenshot of payment to HR: careerboosters.hr.recruitment@gmail.com / WhatsApp +919876543210`
    },
    {
      label: 'Sample 2: Legitimate Tech Opportunity (Low Risk)',
      text: `Microsoft India is inviting applications for our Software Engineering Internship (2026 Batch). Stipend: ₹1,25,000/month. Location: Hyderabad / Bangalore (Hybrid). Required skills: Python, C++, Data Structures, Algorithms. Apply directly at our official career portal: https://careers.microsoft.com. Zero application fee.`
    }
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill">
          <MessageSquareCode className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Smart Raw Message & Indicator Extractor</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Analyze Opportunity Message
        </h1>

        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] max-w-xl mx-auto font-mono font-bold">
          Paste any opportunity forward from WhatsApp, Telegram, LinkedIn InMail, or email to extract 18+ parameters and audit domain mismatches.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
        <label className="text-xs font-mono uppercase text-[#2C3E33] dark:text-[#9FB3A2] tracking-wider flex items-center justify-between font-extrabold">
          <span>Raw Message Text</span>
          <span className="text-[#0D2B1D] dark:text-[#4EA36C]">Zero-Fabrication Parser</span>
        </label>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the complete internship, job, online course message, or forwarded email here..."
          rows={6}
          className="w-full p-4 rounded-2xl bg-[#FAF4EA] dark:bg-[#1A251E] border-2 border-[#BAA88B] dark:border-dark-border outline-none focus:border-[#0D2B1D] dark:focus:border-[#4EA36C] text-xs sm:text-sm text-[#0A110D] dark:text-[#E2EDE2] font-sans leading-relaxed resize-y shadow-inner"
        />

        {/* Sample Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Try Demo Presets:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setRawText(preset.text);
                handleAnalyze(preset.text);
              }}
              className="text-[11px] font-mono px-3 py-1.5 rounded-xl border border-[#BAA88B] dark:border-dark-border bg-[#EFE3CF] dark:bg-[#1A251E] text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#0D2B1D] hover:text-[#F7EFE1] dark:hover:bg-[#4EA36C] dark:hover:text-[#0F1511] font-bold transition-all shadow-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#BAA88B]/40 dark:border-[#334438]">
          <button
            type="button"
            onClick={() => setRawText('')}
            className="text-xs font-mono font-bold text-[#2C3E33] dark:text-[#9FB3A2] hover:text-[#0A110D]"
          >
            Clear Text
          </button>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={loading || !rawText.trim()}
            className="btn-primary disabled:opacity-40 text-xs font-mono font-extrabold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Message Indicators...</span>
              </>
            ) : (
              <>
                <span>Extract & Audit Message</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Risk Level Banner */}
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <RiskLevelBadge level={analysis.riskLevel} size="lg" />
                <span className="text-xs font-mono font-extrabold text-[#2C3E33] dark:text-[#9FB3A2]">
                  Risk Score: {analysis.riskScore}/100
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed max-w-2xl font-mono font-medium">
                {analysis.riskReasoning}
              </p>
            </div>

            {analysis.company && (
              <Link
                to={`/company/${analysis.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="btn-secondary text-xs font-mono font-extrabold shrink-0"
              >
                <span>Research "{analysis.company}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Extracted 18+ Attributes Grid */}
          <div className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
            <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider">
              Extracted Opportunity Attributes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Company</div>
                <div className="font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">{analysis.company || 'Not stated'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Role / Title</div>
                <div className="font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">{analysis.role || 'Not stated'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Opportunity Type</div>
                <div className="font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] mt-0.5">{analysis.type}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Stipend / Salary</div>
                <div className="font-extrabold text-emerald-800 dark:text-emerald-300 mt-0.5">{analysis.stipend || analysis.salary || 'Not stated'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Fee / Security Deposit</div>
                <div className={`font-extrabold mt-0.5 ${analysis.hasUpfrontFee ? 'text-rose-800 dark:text-rose-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
                  {analysis.fee || 'None / Not stated'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Duration</div>
                <div className="font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">{analysis.duration || 'Not stated'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Location / Mode</div>
                <div className="font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5">{analysis.location || 'Not stated'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438]">
                <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] uppercase font-bold">Recruiter Contact</div>
                <div className="font-bold text-[#0A110D] dark:text-[#E2EDE2] mt-0.5 truncate">{analysis.email || analysis.phone || 'Not stated'}</div>
              </div>
            </div>

            {analysis.skills.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-mono text-[#2C3E33] dark:text-[#9FB3A2] mb-1.5 font-bold">Extracted Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.skills.map((sk) => (
                    <span key={sk} className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-[#D8C7AC] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-[#0D2B1D] dark:text-[#4EA36C]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detected Warning Indicators vs Positive Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warning Indicators */}
            <div className="p-6 rounded-3xl border-2 border-amber-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-300 uppercase font-extrabold">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Warning Triggers ({analysis.detectedIndicators.length})</span>
              </div>
              {analysis.detectedIndicators.length === 0 ? (
                <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono">No severe warning indicators were detected in the text.</p>
              ) : (
                <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200 font-mono">
                  {analysis.detectedIndicators.map((ind, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-amber-950/10 border border-amber-800/30 flex items-start gap-2 font-medium">
                      <span>⚠️</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Positive Signals */}
            <div className="p-6 rounded-3xl border-2 border-emerald-800/30 bg-[#F7EFE1] dark:bg-[#202D25] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 uppercase font-extrabold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Positive Authenticity Signals ({analysis.positiveSignals.length})</span>
              </div>
              {analysis.positiveSignals.length === 0 ? (
                <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono">No distinct positive signals identified from the text provided.</p>
              ) : (
                <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-200 font-mono">
                  {analysis.positiveSignals.map((sig, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-emerald-950/10 border border-emerald-800/30 flex items-start gap-2 font-medium">
                      <span>✓</span>
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
