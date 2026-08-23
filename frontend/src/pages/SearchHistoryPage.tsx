import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { History, Search, ArrowRight, MessageSquareCode, Building2, Clock } from 'lucide-react';

export const SearchHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getSearchHistory();
        setHistory(res.history || []);
      } catch (err) {
        console.error('Error fetching search history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleReplaySearch = async (item: any) => {
    if (item.inputType === 'MESSAGE_TEXT') {
      navigate(`/analyze-message?text=${encodeURIComponent(item.searchQuery)}`);
    } else {
      navigate(`/research?q=${encodeURIComponent(item.searchQuery)}`);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-[#BAA88B] dark:border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill mb-2">
          <History className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Activity Log</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Search & Research History
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] mt-1 font-mono font-bold">
          Chronological timeline of all audited organizations and analyzed opportunity messages.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">
          Loading search history...
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] text-center space-y-3 max-w-lg mx-auto shadow-sm">
          <History className="w-10 h-10 text-[#0D2B1D] dark:text-[#4EA36C] mx-auto" />
          <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">No Search History Recorded</h3>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] max-w-sm mx-auto font-mono">
            Your universal searches and message audits will be recorded here for instant replay.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleReplaySearch(item)}
              className="p-4 rounded-2xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#D8C7AC] dark:bg-[#1A251E] flex items-center justify-center text-[#0D2B1D] dark:text-[#4EA36C] border border-[#BAA88B]/50">
                  {item.inputType === 'MESSAGE_TEXT' ? (
                    <MessageSquareCode className="w-5 h-5" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans line-clamp-1">
                    {item.searchQuery}
                  </div>
                  <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono mt-0.5 font-bold">
                    {item.inputType === 'MESSAGE_TEXT' ? 'Forwarded Message Analysis' : 'Universal Search'} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary py-2 px-3 text-xs font-mono font-bold"
              >
                <span>Replay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
