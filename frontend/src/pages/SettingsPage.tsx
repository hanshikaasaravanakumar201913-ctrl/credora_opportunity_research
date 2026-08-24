import React from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { Settings, Moon, Sun, ShieldCheck, Bell, Lock, LogOut } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="border-b border-[#BAA88B] dark:border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full editorial-pill mb-2">
          <Settings className="w-3.5 h-3.5 text-[#0D2B1D] dark:text-[#4EA36C]" />
          <span>User Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A110D] dark:text-[#E2EDE2] font-sans">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#2C3E33] dark:text-[#AFC4B2] mt-1 font-mono font-bold">
          Manage your interface theme, risk notification alerts, and account session.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Appearance & Theme</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              { id: 'DARK', label: 'Dark Mode', icon: Moon },
              { id: 'LIGHT', label: 'Light Mode', icon: Sun },
            ].map((item) => {
              const Icon = item.icon;
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={`p-4 rounded-2xl border-2 text-xs font-mono flex flex-col items-center gap-2 transition-all ${
                    active
                      ? 'bg-[#0D2B1D] text-[#F7EFE1] dark:bg-[#4EA36C] dark:text-[#0F1511] border-[#0D2B1D] dark:border-[#4EA36C] font-extrabold shadow-md'
                      : 'border-[#BAA88B] dark:border-[#334438] bg-[#EFE3CF] dark:bg-[#1A251E] text-[#0A110D] dark:text-[#AFC4B2] hover:border-[#0D2B1D] font-bold'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications & Risk Alerts */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0D2B1D] dark:text-[#4EA36C]" />
            <span>Opportunity Safety Alerts</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] cursor-pointer">
              <div>
                <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Highlight Upfront Fee Demands</div>
                <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-medium">Display warning alerts when monetary deposits are detected in recruitment forwards</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#0D2B1D] dark:accent-[#4EA36C] w-4 h-4" />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#EFE3CF] dark:bg-[#1A251E] border border-[#BAA88B] dark:border-[#334438] cursor-pointer">
              <div>
                <div className="font-extrabold text-[#0A110D] dark:text-[#E2EDE2]">Flag Domain Mismatches</div>
                <div className="text-[11px] text-[#2C3E33] dark:text-[#9FB3A2] font-mono font-medium">Audit free personal webmail domains used for enterprise recruitment</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#0D2B1D] dark:accent-[#4EA36C] w-4 h-4" />
            </label>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 sm:p-8 rounded-3xl editorial-card border-2 border-[#BAA88B] dark:border-[#334438] bg-[#F7EFE1] dark:bg-[#202D25] space-y-4 shadow-sm">
          <h3 className="text-xs font-mono uppercase text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#A47432] dark:text-[#D4B370]" />
            <span>Account Security</span>
          </h3>

          <div className="text-xs space-y-2 font-mono">
            <div className="flex justify-between py-2 border-b border-[#BAA88B]/40 dark:border-dark-border">
              <span className="text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Registered Email</span>
              <span className="text-[#0A110D] dark:text-[#E2EDE2] font-extrabold">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#BAA88B]/40 dark:border-dark-border">
              <span className="text-[#2C3E33] dark:text-[#9FB3A2] font-bold">Account Role</span>
              <span className="text-[#0D2B1D] dark:text-[#4EA36C] font-extrabold">{user?.role}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-800 dark:text-rose-400 hover:bg-rose-950/10 border border-rose-800/30 text-xs font-mono transition-all font-extrabold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Credora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
