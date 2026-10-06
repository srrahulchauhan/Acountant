import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  BookOpen,
  Users,
  CreditCard,
  Landmark,
  BarChart3,
  Settings,
  X,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    pendingUdhaar,
    upcomingEmis,
    totalBalance,
    currency,
    isMasked,
    toggleMask,
  } = useApp();

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-amber-500',
    },
    {
      id: 'expenses',
      label: 'Daily Expenses',
      icon: Receipt,
      badge: null,
      color: 'text-rose-500',
    },
    {
      id: 'udhaar',
      label: 'Udhaar Khata',
      icon: BookOpen,
      badge: pendingUdhaar > 0 ? `₹${(pendingUdhaar / 1000).toFixed(0)}k` : null,
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      color: 'text-pink-500',
    },
    {
      id: 'customers',
      label: 'Customers Ledger',
      icon: Users,
      badge: null,
      color: 'text-sky-500',
    },
    {
      id: 'emi',
      label: 'EMI Loan Tracker',
      icon: CreditCard,
      badge: upcomingEmis.length > 0 ? `${upcomingEmis.length} due` : null,
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20',
      color: 'text-purple-500',
    },
  ];

  const secondaryNavItems = [
    {
      id: 'statements',
      label: 'Statements',
      icon: Landmark,
      badge: null,
      color: 'text-emerald-500',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
      color: 'text-indigo-500',
    },
    {
      id: 'settings',
      label: 'Settings & Backup',
      icon: Settings,
      badge: null,
      color: 'text-slate-400',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white/95 dark:bg-[#0A0F1D]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header Brand */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/20 group-hover:scale-105 transition-transform duration-300">
                  <Wallet className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0F1D]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold tracking-tight font-heading text-slate-900 dark:text-white leading-tight">
                    Accountant
                  </h1>
                  <span className="text-[10px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">
                  Finance & Khata OS
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scrollable Area */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar">
            {/* Main Menu Section */}
            <div className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider uppercase text-slate-400/80">
                Core Workspace
              </div>
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-slate-950' : item.color
                        }`}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Analytics & Tools Section */}
            <div className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-extrabold tracking-wider uppercase text-slate-400/80">
                Data & Statements
              </div>
              {secondaryNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-slate-950' : item.color
                        }`}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom: Luxury Metallic Net Worth Card */}
        <div className="p-4 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl border border-white/10 relative overflow-hidden group">
            {/* Ambient gold glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Net Balance
              </span>

              <button
                onClick={toggleMask}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title={isMasked ? 'Reveal Balance' : 'Hide Balance'}
              >
                {isMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="text-xl font-black font-heading tracking-tight text-white flex items-baseline gap-1">
              <span className="text-amber-400 font-extrabold">{currency}</span>
              <span className="font-mono tabular-nums">
                {isMasked ? '••••••••' : totalBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <TrendingUp className="w-3 h-3" />
                Live Sync
              </span>

              <button
                onClick={() => {
                  setActiveTab('statements');
                  if (onClose) onClose();
                }}
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors"
              >
                <span>Accounts</span>
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
