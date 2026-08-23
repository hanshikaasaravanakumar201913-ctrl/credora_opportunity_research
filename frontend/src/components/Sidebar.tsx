import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Search,
  MessageSquareCode,
  Scale,
  Sparkles,
  Bookmark,
  History,
  User,
  Settings,
  ShieldCheck,
  Layers,
  FolderLock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const primaryNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Research Hub', path: '/research', icon: Search },
    { name: 'Analyze Message', path: '/analyze-message', icon: MessageSquareCode },
    { name: 'Compare Matrix', path: '/compare', icon: Scale },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  const secondaryNav = [
    { name: 'Saved Reports', path: '/saved-reports', icon: Bookmark },
    { name: 'Search History', path: '/history', icon: History },
    { name: 'Candidate Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-[#BAA88B] dark:border-dark-border bg-[#EFE3CE] dark:bg-dark-surface/60 p-4 flex flex-col justify-between transition-colors duration-200">
      <div className="space-y-7">
        {/* Intelligence Tools Section */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#0D2B1D] dark:text-[#4EA36C] px-3 mb-2.5 font-extrabold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Intelligence Tools</span>
          </div>
          <nav className="space-y-1.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm border border-[#0D2B1D] dark:border-[#4EA36C]'
                        : 'text-[#0A110D] dark:text-[#AFC4B2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] font-bold hover:bg-[#D8C7AC] dark:hover:bg-dark-card/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F7EFE1] dark:text-[#0F1511]' : 'text-[#0D2B1D] dark:text-[#4EA36C]'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Personal Workspace Section */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#0D2B1D] dark:text-[#4EA36C] px-3 mb-2.5 font-extrabold flex items-center gap-1.5">
            <FolderLock className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Personal Workspace</span>
          </div>
          <nav className="space-y-1.5">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm border border-[#0D2B1D] dark:border-[#4EA36C]'
                        : 'text-[#0A110D] dark:text-[#AFC4B2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] font-bold hover:bg-[#D8C7AC] dark:hover:bg-dark-card/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F7EFE1] dark:text-[#0F1511]' : 'text-[#0D2B1D] dark:text-[#4EA36C]'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Trust Guarantee Charter */}
      <div className="p-3.5 rounded-2xl border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-card space-y-1.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
          <ShieldCheck className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Zero-Fabrication Charter</span>
        </div>
        <p className="text-[11px] text-[#2C3E33] dark:text-dark-muted leading-relaxed font-medium">
          Credora reports verifiable public records and flags missing evidence without inventing facts.
        </p>
      </div>
    </aside>
  );
};
