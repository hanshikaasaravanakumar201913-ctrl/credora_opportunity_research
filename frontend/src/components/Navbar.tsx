import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import {
  Compass,
  Search,
  Scale,
  Sparkles,
  MessageSquareCode,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Bookmark,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, quickSwitchPersona } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Research Hub', path: '/research', icon: Search },
    { name: 'Analyze Message', path: '/analyze-message', icon: MessageSquareCode },
    { name: 'Compare Matrix', path: '/compare', icon: Scale },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'DARK' ? 'LIGHT' : 'DARK');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b border-[#BAA88B] dark:border-dark-border bg-[#E8DAC2]/95 dark:bg-dark-bg/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] flex items-center justify-center font-mono font-extrabold text-sm tracking-tighter transition-transform group-hover:scale-105 shadow-md border border-[#BAA88B]/40">
                CR
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[#0A110D] dark:text-[#E2EDE2] font-sans leading-none">
                  CREDORA
                </span>
                <span className="text-[10px] font-mono tracking-wide text-[#2C3E33] dark:text-[#AFC4B2] font-bold leading-tight mt-0.5">
                  Research · Compare · Verify
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 ml-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                      active
                        ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm'
                        : 'text-[#2C3E33] dark:text-[#AFC4B2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] font-semibold hover:bg-[#D8C7AC]/50 dark:hover:bg-dark-surface/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#F7EFE1] dark:text-[#0F1511]' : 'text-[#0D2B1D] dark:text-[#4EA36C]'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools: Theme, Persona Switcher, Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface text-[#0D2B1D] dark:text-[#4EA36C] hover:bg-[#D8C7AC] dark:hover:bg-dark-card transition-all shadow-sm"
              title={theme === 'DARK' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'DARK' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Candidate / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface text-xs font-mono font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0D2B1D] dark:bg-[#4EA36C] text-[#F7EFE1] dark:text-[#0F1511] flex items-center justify-center font-mono font-extrabold text-[10px]">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-extrabold">{user?.name?.split(' ')[0] || 'Candidate'}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border-2 border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface shadow-2xl p-2 z-50 space-y-1 divide-y divide-[#BAA88B]/40 dark:divide-dark-border">
                    <div className="p-2">
                      <div className="text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2]">{user?.name}</div>
                      <div className="text-[10px] text-[#2C3E33] dark:text-dark-muted font-mono truncate">{user?.email}</div>
                    </div>

                    <div className="pt-1 space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#D8C7AC] dark:hover:bg-dark-card transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                        <span>Workspace Dashboard</span>
                      </Link>

                      <Link
                        to="/saved-reports"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#D8C7AC] dark:hover:bg-dark-card transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                        <span>Saved Dossiers</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#D8C7AC] dark:hover:bg-dark-card transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
                        <span>Candidate Profile</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-800 dark:text-rose-400 hover:bg-rose-950/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-[#BAA88B] dark:border-dark-border text-xs font-mono font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:border-[#0D2B1D] dark:hover:border-[#4EA36C] bg-[#F7EFE1] dark:bg-dark-surface transition-all shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs font-mono font-extrabold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface text-[#0D2B1D] dark:text-[#4EA36C]"
              title={theme === 'DARK' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'DARK' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface text-[#0A110D] dark:text-[#E2EDE2]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-surface p-4 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#0A110D] dark:text-[#E2EDE2] hover:bg-[#D8C7AC] dark:hover:bg-dark-card"
                >
                  <Icon className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#BAA88B]/40 dark:border-dark-border flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full btn-secondary text-xs font-mono font-bold"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-secondary text-xs font-mono font-bold text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-primary text-xs font-mono font-bold text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
