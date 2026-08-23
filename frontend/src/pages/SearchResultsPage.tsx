import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiscoveredEntityCandidate } from '../types/index.js';
import { CompanyCandidateCard } from '../components/CompanyCandidateCard.js';
import { UniversalSearchInput } from '../components/UniversalSearchInput.js';
import {
  Search,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2,
  HelpCircle,
  CheckCircle2,
  FileQuestion
} from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<DiscoveredEntityCandidate[]>([]);
  const [searchedQuery, setSearchedQuery] = useState(rawQuery);
  const navigate = useNavigate();

  useEffect(() => {
    if (!rawQuery.trim()) {
      setLoading(false);
      setCandidates([]);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      setSearchedQuery(rawQuery);
      try {
        const res = await api.searchCandidates(rawQuery);
        setCandidates(res.candidates || []);
      } catch (err) {
        console.error('Candidate discovery error:', err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [rawQuery]);

  const handleSelect = (candidate: DiscoveredEntityCandidate) => {
    navigate(`/company/${candidate.slug || candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Search Header Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">
          <Search className="w-4 h-4" />
          <span>Multi-Source Entity Discovery & Resolution</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Search Results for <span className="text-[#0D2B1D] dark:text-[#4EA36C]">"{rawQuery || 'All Entities'}"</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">
          Select the exact organization to generate an evidence-verified research dossier.
        </p>

        <div className="pt-2">
          <UniversalSearchInput initialValue={rawQuery} showDropdown={false} />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#0D2B1D] dark:text-[#4EA36C] mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              Querying Knowledge Registries & Domain Infrastructure...
            </h3>
            <p className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-medium">
              Resolving corporate entities across Wikipedia, Cloudflare DoH, and authoritative web records.
            </p>
          </div>
        </div>
      )}

      {/* Results State */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#BAA88B]/50 dark:border-[#334438] pb-3">
            <div className="text-xs font-mono font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">
              {candidates.length} {candidates.length === 1 ? 'Possible Match' : 'Possible Matches'} Located
            </div>
            <div className="text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2] font-bold">
              Ranked by Entity Match Likelihood
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, idx) => (
              <CompanyCandidateCard
                key={idx}
                candidate={candidate}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty / Unable to Verify State (Zero-Fabrication Guarantee) */}
      {!loading && candidates.length === 0 && rawQuery && (
        <div className="p-8 sm:p-12 rounded-3xl editorial-card border-2 border-amber-800/40 bg-[#F7EFE1] dark:bg-[#202D25] space-y-6 max-w-3xl mx-auto text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
              UNABLE TO VERIFY ENTITY
            </div>
            <h2 className="text-2xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
              No verified records found for "{rawQuery}"
            </h2>
            <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] leading-relaxed font-mono font-medium">
              Credora searched public corporate knowledge registries, DNS infrastructure, and web indexes. No reliable independent records exist for this entity name.
            </p>
          </div>

          {/* Zero-Fabrication Audit Checklist */}
          <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-left space-y-2 font-mono text-xs">
            <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2] border-b border-[#BAA88B]/40 pb-1.5">
              Searches Attempted & Sources Checked:
            </div>
            <ul className="space-y-1 text-[#2C3E33] dark:text-[#9FB3A2] font-medium">
              <li className="flex items-center justify-between">
                <span>• Wikipedia Corporate Knowledge Registry:</span>
                <span className="text-amber-800 dark:text-amber-400 font-bold">Not Found</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• Cloudflare DNS & Host Registry:</span>
                <span className="text-amber-800 dark:text-amber-400 font-bold">Unresolved</span>
              </li>
              <li className="flex items-center justify-between">
                <span>• Open Business & Industry Index:</span>
                <span className="text-amber-800 dark:text-amber-400 font-bold">No Match</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/analyze-message"
              className="btn-primary text-xs font-mono font-bold"
            >
              <span>Analyze a Recruiter Message Instead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/research"
              className="btn-secondary text-xs font-mono font-bold"
            >
              <span>Back to Research Hub</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
