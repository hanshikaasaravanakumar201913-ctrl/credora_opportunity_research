import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface ResearchLoadingStagesProps {
  query: string;
}

export const ResearchLoadingStages: React.FC<ResearchLoadingStagesProps> = ({ query }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const stages = [
    { label: 'Processing query & input classification', detail: `Analyzing "${query}"` },
    { label: 'Querying public entity knowledge registries', detail: 'Searching Wikipedia & corporate indices' },
    { label: 'Auditing live DNS-over-HTTPS infrastructure', detail: 'Verifying domain resolution & SSL status' },
    { label: 'Calculating 8-factor evidence credibility index', detail: 'Synthesizing verified signals & source provenance' },
    { label: 'Compiling structured research dossier', detail: 'Generating executive summary & recommendations' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-3xl editorial-card space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full editorial-pill">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>LIVE RESEARCH IN PROGRESS</span>
        </div>
        <h3 className="text-base font-bold text-light-text dark:text-dark-primary pt-1">
          Synthesizing Intelligence For "{query}"
        </h3>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-light-secondary dark:bg-dark-surface border border-light-primary/30 dark:border-dark-forest/40'
                  : isDone
                  ? 'opacity-80'
                  : 'opacity-40'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-light-primary dark:text-dark-forest animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-light-muted dark:text-dark-muted" />
                )}
              </div>

              <div>
                <div className={`text-xs font-semibold ${isCurrent ? 'text-light-primary dark:text-dark-forest font-bold' : 'text-light-text dark:text-dark-primary'}`}>
                  {stage.label}
                </div>
                <div className="text-[11px] font-mono text-light-muted dark:text-dark-muted">
                  {stage.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
