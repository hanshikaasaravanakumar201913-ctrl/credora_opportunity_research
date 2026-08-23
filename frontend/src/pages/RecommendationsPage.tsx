import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';
import { RiskLevelBadge } from '../components/RiskLevelBadge.js';
import {
  Sparkles,
  Building2,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User,
  SlidersHorizontal
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.getRecommendations();
        setRecommendations(res.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const studentSkills: string[] = user?.profile?.skills ? JSON.parse(user.profile.skills) : [];

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#BAA88B] dark:border-dark-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Personalized Career Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
            Recommended Opportunities For You
          </h1>
          <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] mt-1 font-mono font-bold">
            Matched against your verified skills ({studentSkills.join(', ') || 'Declared Skills'}) and target preferences.
          </p>
        </div>

        <Link
          to="/profile"
          className="btn-secondary text-xs font-mono font-bold"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Tune Career Profile</span>
        </Link>
      </div>

      {/* Grid of Recommended Opportunities */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#2C3E33] dark:text-[#9FB3A2]">
          Computing multi-factor career matches against your candidate profile...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="py-16 text-center space-y-3 editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <Sparkles className="w-10 h-10 text-[#0D2B1D] dark:text-[#4EA36C] mx-auto" />
          <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">No personalized matches yet</h3>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono leading-relaxed font-medium">
            Declare your skills, graduation batch, and target role preferences to activate the recommendation engine.
          </p>
          <Link to="/profile" className="btn-primary mt-2 text-xs font-mono font-extrabold">
            Complete Profile Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const opp = rec.opportunity;
            return (
              <div
                key={opp.id}
                onClick={() => navigate(`/opportunity/${opp.slug || opp.id}`)}
                className="p-6 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-[#D8C7AC] dark:bg-[#1A251E] text-[#0D2B1D] dark:text-[#E2EDE2] font-extrabold">
                      {rec.careerFitCategory.replace(/_/g, ' ')}
                    </span>
                    <div className="text-sm font-extrabold font-mono text-[#0D2B1D] dark:text-[#4EA36C]">
                      {rec.matchPercentage}% Alignment
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0A110D] dark:text-[#E2EDE2] group-hover:text-[#0D2B1D] dark:group-hover:text-[#4EA36C] transition-colors mb-1 font-sans">
                    {opp.title}
                  </h3>

                  <div className="text-xs text-[#2C3E33] dark:text-[#9FB3A2] flex items-center gap-1.5 mb-3 font-mono font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                    <span>{opp.company?.name}</span>
                    <span>•</span>
                    <span className="text-emerald-800 dark:text-emerald-300 font-extrabold">{opp.company?.credibilityScore}/100 Credibility</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs text-[#2C3E33] dark:text-[#9FB3A2] leading-relaxed mb-4 font-mono">
                    💡 <span className="text-[#0A110D] dark:text-[#E2EDE2] font-extrabold">Why it matches:</span> {rec.matchReason}
                  </div>

                  {rec.matchedSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {rec.matchedSkills.map((sk: string) => (
                        <span key={sk} className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg bg-emerald-950/10 border border-emerald-800/30 text-emerald-800 dark:text-emerald-300">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#BAA88B]/40 dark:border-[#334438] flex items-center justify-between text-xs font-mono">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{opp.stipend || 'Disclosed during review'}</span>
                  <span className="text-[#0D2B1D] dark:text-[#4EA36C] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-extrabold">
                    <span>Inspect Opportunity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
