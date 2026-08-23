import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { ShieldCheck, UserCheck, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickSwitchPersona } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setLoading(true);
    try {
      await quickSwitchPersona(demoEmail);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-6 shadow-xl relative">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] flex items-center justify-center font-mono font-extrabold text-base mx-auto shadow-md border border-[#BAA88B]/40">
            CR
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">Sign In to Credora</h1>
          <p className="text-xs text-[#2C3E33] dark:text-[#AFC4B2] font-mono font-bold">Access your research dossiers & opportunity matches</p>
        </div>

        {/* Demo Mode Quick Evaluator */}
        <div className="p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] space-y-2.5">
          <div className="text-[10px] font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] tracking-wider flex items-center gap-1.5 font-extrabold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>DEMO EVALUATION PERSONAS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleDemoSignIn('student@credora.io')}
              className="p-2.5 rounded-xl bg-[#F7EFE1] dark:bg-[#202D25] border border-[#BAA88B] dark:border-[#334438] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] text-left transition-all shadow-sm"
            >
              <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2] text-[11px]">Alex Chen</div>
              <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] font-bold">B.Tech CSE '26</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('priya.sharma@college.edu')}
              className="p-2.5 rounded-xl bg-[#F7EFE1] dark:bg-[#202D25] border border-[#BAA88B] dark:border-[#334438] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] text-left transition-all shadow-sm"
            >
              <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2] text-[11px]">Priya Sharma</div>
              <div className="text-[10px] text-[#2C3E33] dark:text-[#9FB3A2] font-bold">M.Sc AI '25</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-800/30 bg-rose-950/10 text-rose-800 dark:text-rose-300 text-xs font-mono font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@credora.io"
                required
                className="w-full p-3 pl-9 rounded-2xl bg-[#FAF4EA] dark:bg-[#1A251E] border-2 border-[#BAA88B] dark:border-dark-border text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] outline-none focus:border-[#0D2B1D] dark:focus:border-[#4EA36C]"
              />
              <Mail className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[#0A110D] dark:text-[#AFC4B2] font-extrabold block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 pl-9 rounded-2xl bg-[#FAF4EA] dark:bg-[#1A251E] border-2 border-[#BAA88B] dark:border-dark-border text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] outline-none focus:border-[#0D2B1D] dark:focus:border-[#4EA36C]"
              />
              <Lock className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-xs font-mono font-extrabold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In →</span>}
          </button>
        </form>

        <div className="text-center text-xs text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};
