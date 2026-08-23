import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { api } from '../services/api.js';
import { User, Sparkles, Check, Plus, X, GraduationCap, Briefcase, MapPin } from 'lucide-react';

export const ProfileOnboardingPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [education, setEducation] = useState(user?.profile?.education || 'B.Tech Computer Science & Engineering');
  const [degree, setDegree] = useState(user?.profile?.degree || 'B.Tech');
  const [department, setDepartment] = useState(user?.profile?.department || 'Computer Science');
  const [college, setCollege] = useState(user?.profile?.college || 'National Institute of Technology');
  const [graduationYear, setGraduationYear] = useState(user?.profile?.graduationYear || 2026);
  const [careerGoal, setCareerGoal] = useState(user?.profile?.careerGoal || 'Full-Stack Software Engineer');
  const [workMode, setWorkMode] = useState(user?.profile?.workMode || 'HYBRID');
  const [skills, setSkills] = useState<string[]>(
    user?.profile?.skills ? JSON.parse(user.profile.skills) : ['Python', 'React', 'Node.js', 'SQL', 'Docker']
  );
  const [newSkill, setNewSkill] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<string[]>(
    user?.profile?.preferredRoles ? JSON.parse(user.profile.preferredRoles) : ['Software Engineer Intern', 'Backend Developer']
  );
  const [newRole, setNewRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.profile) {
        setEducation(user.profile.education || '');
        setDegree(user.profile.degree || '');
        setDepartment(user.profile.department || '');
        setCollege(user.profile.college || '');
        setGraduationYear(user.profile.graduationYear || 2026);
        setCareerGoal(user.profile.careerGoal || '');
        setWorkMode(user.profile.workMode || 'HYBRID');
        if (user.profile.skills) setSkills(JSON.parse(user.profile.skills));
        if (user.profile.preferredRoles) setPreferredRoles(JSON.parse(user.profile.preferredRoles));
      }
    }
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.trim() && !preferredRoles.includes(newRole.trim())) {
      setPreferredRoles([...preferredRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        name,
        education,
        degree,
        department,
        college,
        graduationYear,
        careerGoal,
        workMode,
        skills,
        preferredRoles
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="border-b border-[#BAA88B] dark:border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill mb-2">
          <User className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Student Candidate Profile</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Career Profile & Skills Engine
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] mt-1 font-mono font-bold">
          Credora uses your verified skills and target ambitions to calibrate opportunity matches and comparison rankings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-5 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>01. Academic & Identity Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3.5 rounded-2xl text-xs font-bold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
                Graduation Year
              </label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value) || 2026)}
                className="w-full p-3.5 rounded-2xl text-xs font-mono font-extrabold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
                Degree & Branch
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full p-3.5 rounded-2xl text-xs font-bold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
                College / Institute
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full p-3.5 rounded-2xl text-xs font-bold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
              />
            </div>
          </div>
        </div>

        {/* Skills Tagging */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-5 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>02. Technical Skills Inventory</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D8C7AC] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] text-xs font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C] shadow-sm"
              >
                <span>{sk}</span>
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter(s => s !== sk))}
                  className="text-[#2C3E33] dark:text-[#889E8B] hover:text-rose-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Docker, PyTorch, Go)..."
              className="flex-1 p-3.5 rounded-2xl text-xs font-mono font-bold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn-secondary px-5 shrink-0 text-xs font-mono font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Career Ambition & Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-5 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>03. Career Ambitions & Preferences</span>
          </h3>

          <div>
            <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
              Primary Career Ambition
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Cloud Infrastructure Engineer / ML Scientist"
              className="w-full p-3.5 rounded-2xl text-xs font-bold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1.5">
                Preferred Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full p-3.5 rounded-2xl text-xs font-mono font-extrabold border-2 border-[#BAA88B] bg-[#FAF4EA] dark:bg-[#1A251E]"
              >
                <option value="ANY">Any Work Mode</option>
                <option value="REMOTE">Remote Only</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite Office</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
            {saved && '✓ Candidate career profile successfully updated!'}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-8 py-3.5 text-xs font-mono font-extrabold"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
