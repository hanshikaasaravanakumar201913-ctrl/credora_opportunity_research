import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';
import { Mail, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface VerificationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  opportunityTitle: string;
  recruiterName?: string;
}

export const VerificationEmailModal: React.FC<VerificationEmailModalProps> = ({
  isOpen,
  onClose,
  companyName,
  opportunityTitle,
  recruiterName
}) => {
  const { user } = useAuth();
  const [template, setTemplate] = useState<{ subject: string; body: string; recipientPlaceholder: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getEmailTemplate({
        companyName,
        opportunityTitle,
        studentName: user?.name || 'Candidate',
        recruiterName
      }).then(res => setTemplate(res)).catch(console.error);
    }
  }, [isOpen, companyName, opportunityTitle, recruiterName, user]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!template) return;
    const fullText = `Subject: ${template.subject}\nTo: ${template.recipientPlaceholder}\n\n${template.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl editorial-card p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-primary transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-light-secondary dark:bg-dark-surface text-light-primary dark:text-dark-forest flex items-center justify-center border border-light-border dark:border-dark-border">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-light-text dark:text-dark-primary font-sans">
              Formal Opportunity Verification Inquiry
            </h3>
            <p className="text-xs text-light-muted dark:text-dark-muted font-mono">
              Direct verification template to send to {companyName}'s official HR desk.
            </p>
          </div>
        </div>

        {template ? (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase text-light-muted dark:text-dark-muted block mb-1">
                Suggested Official Recipient:
              </label>
              <div className="p-2.5 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-mono text-light-primary dark:text-dark-forest">
                {template.recipientPlaceholder}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-light-muted dark:text-dark-muted block mb-1">
                Subject Line:
              </label>
              <div className="p-2.5 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-mono text-light-text dark:text-dark-primary">
                {template.subject}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-light-muted dark:text-dark-muted block mb-1">
                Inquiry Letter Body:
              </label>
              <pre className="p-3.5 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs font-sans text-light-text dark:text-dark-primary whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {template.body}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Professional Due Diligence Template</span>
              </div>

              <button
                onClick={handleCopy}
                className="btn-primary"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-mono text-light-muted dark:text-dark-muted">
            Generating verification inquiry template...
          </div>
        )}
      </div>
    </div>
  );
};
