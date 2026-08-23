import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import { Bookmark, Building2, Trash2, ArrowRight, FileText, Sparkles } from 'lucide-react';

export const SavedReportsPage: React.FC = () => {
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.listSavedReports();
        setSavedReports(res.savedReports || []);
      } catch (err) {
        console.error('Error listing saved reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSavedReport(id);
      setSavedReports(savedReports.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#BAA88B] dark:border-dark-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill mb-2">
            <Bookmark className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Saved Dossiers Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            Saved Research Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] mt-1 font-mono font-bold">
            Access and manage previously synthesized opportunity research dossiers.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">
          Loading saved research dossiers...
        </div>
      ) : savedReports.length === 0 ? (
        <div className="p-12 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] text-center space-y-3 max-w-lg mx-auto shadow-sm">
          <Bookmark className="w-10 h-10 text-[#0D2B1D] dark:text-[#4EA36C] mx-auto" />
          <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">No Saved Reports Yet</h3>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] max-w-sm mx-auto font-mono">
            Research opportunities or company entities and bookmark them to keep an audit archive here.
          </p>
          <Link to="/research" className="btn-primary inline-flex text-xs font-mono font-extrabold mt-2">
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedReports.map((saved) => {
            const report = saved.report;
            return (
              <div
                key={saved.id}
                className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <RiskLevelBadge level={report.riskLevel} size="sm" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      {report.credibilityScore}/100 Score
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/report/${report.id}`)}
                    className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors cursor-pointer line-clamp-1 font-sans"
                  >
                    {report.title}
                  </h3>

                  <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] flex items-center gap-1.5 font-mono font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                    <span>{report.company?.name}</span>
                  </div>

                  <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] line-clamp-2 leading-relaxed font-normal">
                    {report.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#BAA88B]/40 dark:border-[#334438] flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(saved.id)}
                    className="text-[#2C3E33] dark:text-[#9FB3A2] hover:text-rose-700 p-1.5 rounded-lg transition-colors"
                    title="Delete Saved Dossier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/report/${report.id}`)}
                    className="btn-primary text-xs font-mono font-extrabold py-2 px-4"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
