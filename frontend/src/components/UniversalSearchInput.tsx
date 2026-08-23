import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiscoveredEntityCandidate } from '../types/index.js';
import { CompanyLogo } from './CompanyLogo.js';
import {
  Search,
  ArrowRight,
  Loader2,
  Building2,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface UniversalSearchInputProps {
  initialValue?: string;
  autoFocus?: boolean;
  onSearchComplete?: (result: any) => void;
  showDropdown?: boolean;
}

export const UniversalSearchInput: React.FC<UniversalSearchInputProps> = ({
  initialValue = '',
  autoFocus = false,
  onSearchComplete,
  showDropdown = true,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<DiscoveredEntityCandidate[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced Autocomplete Effect
  useEffect(() => {
    const clean = query.trim();
    if (!showDropdown || clean.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.autocomplete(clean);
        setSuggestions(res.candidates || []);
        setIsOpen((res.candidates || []).length > 0);
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, showDropdown]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCandidate = (candidate: DiscoveredEntityCandidate) => {
    setIsOpen(false);
    navigate(`/company/${candidate.slug || candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setIsOpen(false);

    // If forwarded message
    if (cleanQuery.length > 180 || cleanQuery.includes('\n') || /stipend|salary|congratulations|selected for|apply at/i.test(cleanQuery)) {
      navigate(`/analyze-message?text=${encodeURIComponent(cleanQuery)}`);
      return;
    }

    // Direct navigation to Candidate Search Results Page
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-3xl mx-auto space-y-4 relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            autoFocus={autoFocus}
            placeholder="Search a company, startup, opportunity, or paste message..."
            className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-[#BAA88B] dark:border-dark-border text-[#0A110D] dark:text-[#E2EDE2] placeholder:text-[#4A5F52] dark:placeholder:text-[#7D9281] font-sans text-sm focus:outline-none focus:border-[#0D2B1D] dark:focus:border-[#4EA36C] shadow-md transition-all bg-[#F7EFE1] dark:bg-[#1A251E]"
          />
          <Search className="w-5 h-5 text-[#0D2B1D] dark:text-[#4EA36C] absolute left-4 pointer-events-none" />

          <button
            type="submit"
            disabled={!query.trim() || searchLoading}
            className="absolute right-2.5 btn-primary disabled:opacity-40 disabled:pointer-events-none text-xs font-mono font-extrabold"
          >
            {loading || searchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-3xl border-2 border-[#0D2B1D] dark:border-[#4EA36C] bg-[#F7EFE1] dark:bg-[#202D25] shadow-2xl overflow-hidden divide-y divide-[#BAA88B]/40 dark:divide-[#334438] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3 bg-[#EFE3CE] dark:bg-[#1A251E] flex items-center justify-between text-[11px] font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] border-b border-[#BAA88B]/40">
            <span>Discovered Entity Matches ({suggestions.length})</span>
            <span>Select to inspect</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((cand, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectCandidate(cand)}
                className="p-3.5 hover:bg-[#EAE0CD] dark:hover:bg-[#1A251E] cursor-pointer flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo
                    name={cand.name}
                    domain={cand.officialDomain}
                    logoUrl={cand.logoUrl}
                    size="sm"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-[#0A110D] dark:text-[#E2EDE2] truncate font-sans">
                        {cand.name}
                      </h4>
                      {cand.officialDomain && (
                        <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                          ✓ {cand.officialDomain}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono truncate font-medium">
                      {cand.headquarters || cand.industry || 'Verified Corporate Entity'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511]">
                    {cand.entityMatchScore}% Match
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
                </div>
              </div>
            ))}
          </div>

          <div
            onClick={handleSearch}
            className="p-3 bg-[#EFE3CE] dark:bg-[#1A251E] hover:bg-[#E5D7BF] text-center text-xs font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] cursor-pointer transition-colors"
          >
            View all candidate results for "{query}" →
          </div>
        </div>
      )}

      {/* Suggested Quick Entities with High Contrast */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-xs font-mono text-[#0D2B1D] dark:text-[#E2EDE2] font-extrabold">Try Verified Entities:</span>
        {['Microsoft', 'Google', 'TCS', 'Infosys', 'RandomCompanyXYZ999'].map((demo) => (
          <button
            key={demo}
            type="button"
            onClick={() => {
              setQuery(demo);
              navigate(`/search?q=${encodeURIComponent(demo)}`);
            }}
            className="text-xs font-mono font-bold px-3 py-1 rounded-xl border border-[#BAA88B] dark:border-[#334438] bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#0D2B1D] hover:text-[#F7EFE1] dark:hover:bg-[#4EA36C] dark:hover:text-[#0F1511] transition-all shadow-sm"
          >
            {demo}
          </button>
        ))}
      </div>
    </div>
  );
};
