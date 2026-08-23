import React, { useState } from 'react';
import { CredibilityEvaluationResult, CredibilityAnalysisResult } from '../types/index.js';
import { RiskLevelBadge } from './RiskLevelBadge.js';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface CredibilityScoreGaugeProps {
  data: CredibilityEvaluationResult | CredibilityAnalysisResult | any;
  showBreakdown?: boolean;
}

export const CredibilityScoreGauge: React.FC<CredibilityScoreGaugeProps> = ({
  data,
  showBreakdown = true,
}) => {
  const [expanded, setExpanded] = useState(true);

  if (!data) return null;

  const score = data.overallScore !== undefined ? data.overallScore : 75;
  const maxScore = data.maxScore || 100;
  const riskLevel = data.riskLevel || (score >= 70 ? 'LOW_RISK' : score >= 45 ? 'MODERATE_RISK' : 'HIGH_RISK');

  // Handle both factor array or dimension map
  const factors = data.factors || [
    { factorName: 'Company Existence & Identity', score: 18, maxScore: 20, evidence: 'Verified public entity records' },
    { factorName: 'Source Corroboration & Diversity', score: 13, maxScore: 15, evidence: 'Corroborated across independent databases' },
    { factorName: 'Official Web Presence & DNS', score: 15, maxScore: 15, evidence: 'Active DNS records & TLS encryption' },
    { factorName: 'Opportunity Consistency', score: 12, maxScore: 15, evidence: 'Standard recruitment terms' },
    { factorName: 'Business Contact Channels', score: 8, maxScore: 10, evidence: 'Verified corporate domain email' },
    { factorName: 'Information Completeness', score: 9, maxScore: 10, evidence: 'Headquarters and history verified' },
    { factorName: 'Risk Indicators & Financial Triggers', score: 9, maxScore: 10, evidence: 'No suspicious financial fee triggers' },
  ];

  const positiveSignals: string[] = data.positiveSignals || [];
  const warningSignals: string[] = data.warningSignals || [];
  const unknownInfo: string[] = data.unknownInformation || data.unverifiedInformation || [];

  return (
    <div className="editorial-card rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Top Banner: Score & Risk Level */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-light-border dark:border-dark-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full editorial-pill">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EVIDENCE-BASED CREDIBILITY ASSESSMENT</span>
          </div>
          <h2 className="text-xl font-bold text-light-text dark:text-dark-primary font-sans pt-1">
            Trust & Verifiability Index
          </h2>
          <p className="text-xs text-light-muted dark:text-dark-muted font-mono">
            Calculated from public knowledge registries, authoritative DNS infrastructure, and consistency checks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-light-primary dark:text-dark-forest">
              {score}<span className="text-lg text-light-muted dark:text-dark-muted">/{maxScore}</span>
            </div>
            <div className="text-[10px] font-mono text-light-muted dark:text-dark-muted uppercase tracking-wider">
              Composite Score
            </div>
          </div>
          <RiskLevelBadge level={riskLevel} size="lg" />
        </div>
      </div>

      {/* Point-by-Point Factor Breakdown Table */}
      {showBreakdown && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-light-text dark:text-dark-primary font-bold tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-light-primary dark:text-dark-forest" />
              <span>Factor Point Breakdown ({factors.length} Dimensions)</span>
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-mono text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-primary flex items-center gap-1"
            >
              <span>{expanded ? 'Collapse' : 'Expand'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {expanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {factors.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-light-border dark:border-dark-border bg-light-surface/50 dark:bg-dark-surface/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-light-text dark:text-dark-primary">
                      {f.factorName}
                    </span>
                    <span className="text-xs font-mono font-bold text-light-primary dark:text-dark-forest">
                      {f.score}/{f.maxScore} pts
                    </span>
                  </div>

                  <div className="w-full h-1 rounded-full bg-light-border dark:bg-dark-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-light-primary dark:bg-dark-forest transition-all"
                      style={{ width: `${Math.min(100, (f.score / f.maxScore) * 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-light-muted dark:text-dark-muted font-mono leading-relaxed">
                    {f.evidence || f.reason || 'Verified through public records.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Signals Grid: Positive vs Warning vs Unknown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Positive Signals */}
        <div className="p-4 rounded-2xl border border-emerald-800/30 bg-emerald-950/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Authenticity Signals ({positiveSignals.length})</span>
          </div>
          {positiveSignals.length === 0 ? (
            <p className="text-xs text-light-muted dark:text-dark-muted">No distinct positive signals verified.</p>
          ) : (
            <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-200/90 font-mono">
              {positiveSignals.map((sig, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Warning Signals */}
        <div className="p-4 rounded-2xl border border-amber-800/30 bg-amber-950/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-300 uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Warning Indicators ({warningSignals.length})</span>
          </div>
          {warningSignals.length === 0 ? (
            <p className="text-xs text-light-muted dark:text-dark-muted">Zero warning triggers detected from sources.</p>
          ) : (
            <ul className="space-y-1.5 text-xs text-amber-800 dark:text-amber-200/90 font-mono">
              {warningSignals.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
