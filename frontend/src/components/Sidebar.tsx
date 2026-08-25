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
  FolderKanban,
  Sliders
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const intelligenceNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass },
    { name: 'Research Hub', path: '/research', icon: Search },
    { name: 'Analyze Message', path: '/analyze-message', icon: MessageSquareCode },
    { name: 'Compare Matrix', path: '/compare', icon: Scale },
    { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  ];

  const workspaceNav = [
    { name: 'Saved Reports', path: '/saved-reports', icon: Bookmark },
    { name: 'Search History', path: '/history', icon: History },
    { name: 'Candidate Profile', path: '/profile', icon: User },
  ];

  const systemNav = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof intelligenceNav, GroupIcon: React.ElementType) => (
    <div className="space-y-1.5">
      <div className="text-[10px] font-mono uppercase tracking-widest text-[#0D2B1D]/80 dark:text-[#4EA36C]/90 px-3 mb-1 font-extrabold flex items-center gap-1.5">
        <GroupIcon className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
        <span>{title}</span>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans transition-all ${
                  isActive
                    ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] font-extrabold shadow-sm border border-[#0D2B1D] dark:border-[#4EA36C]'
                    : 'text-[#0A110D] dark:text-[#AFC4B2] hover:text-[#0D2B1D] dark:hover:text-[#E2EDE2] font-semibold hover:bg-[#D8C7AC]/70 dark:hover:bg-dark-card/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F7EFE1] dark:text-[#0F1511]' : 'text-[#0D2B1D] dark:text-[#4EA36C]'}`} />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-60 min-h-[calc(100vh-4rem)] border-r border-[#BAA88B] dark:border-dark-border bg-[#EFE3CE] dark:bg-dark-surface/60 p-3.5 flex flex-col justify-between transition-colors duration-200 shrink-0">
      <div className="space-y-5">
        {/* INTELLIGENCE */}
        {renderNavGroup('INTELLIGENCE', intelligenceNav, Layers)}

        {/* WORKSPACE */}
        {renderNavGroup('WORKSPACE', workspaceNav, FolderKanban)}

        {/* SYSTEM */}
        {renderNavGroup('SYSTEM', systemNav, Sliders)}
      </div>

      {/* Zero-Fabrication Trust Guarantee */}
      <div className="p-3 rounded-xl border border-[#BAA88B] dark:border-dark-border bg-[#F7EFE1] dark:bg-dark-card space-y-1 shadow-sm mt-4">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-[#0D2B1D] dark:text-[#4EA36C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>Zero-Fabrication Charter</span>
        </div>
        <p className="text-[10px] text-[#2C3E33] dark:text-dark-muted leading-relaxed font-sans font-normal">
          Credora reports verifiable public records and flags missing evidence without inventing facts.
        </p>
      </div>
    </aside>
  );
};
