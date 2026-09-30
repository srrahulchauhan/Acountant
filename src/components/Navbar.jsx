import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Receipt,
  BookOpen,
  UserPlus,
  CreditCard,
  Menu,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onOpenSidebar, onOpenQuickAdd }) => {
  const {
    theme,
    toggleTheme,
    profile,
    searchQuery,
    setSearchQuery,
    upcomingEmis,
    pendingUdhaar,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Active notification alerts
  const notifications = [
    ...(upcomingEmis.length > 0
      ? [
          {
            id: 'n-emi',
            title: `EMI Due: ${upcomingEmis[0].loanName}`,
            desc: `₹${upcomingEmis[0].monthlyEmi.toLocaleString('en-IN')} due on ${upcomingEmis[0].dueDate}`,
            type: 'emi',
            urgent: true,
          },
        ]
      : []),
    ...(pendingUdhaar > 0
      ? [
          {
            id: 'n-udh',
            title: 'Pending Udhaar Receivable',
            desc: `Total ₹${pendingUdhaar.toLocaleString('en-IN')} pending collection from contacts`,
            type: 'udhaar',
            urgent: false,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-[#070B14]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu Button & System Live Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Personal Finance Live</span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses, friends, EMIs..."
              className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-amber-400/80 dark:focus:border-amber-500/80 focus:bg-white dark:focus:bg-[#0E1526] outline-none shadow-inner transition-all duration-200"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-white/10 rounded border border-slate-300 dark:border-white/10">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Right Side: Quick Add, Theme, Notification, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Button with Rich Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add New</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>

            {showAddMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowAddMenu(false)}
                />
                <div className="absolute right-0 mt-2.5 w-60 rounded-3xl bg-white dark:bg-[#101728] shadow-2xl border border-slate-200/90 dark:border-white/10 py-2.5 z-30 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Quick Record
                  </div>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenQuickAdd('expense');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Daily Expense</div>
                      <div className="text-[10px] text-slate-400 font-normal">Food, bills, travel & shopping</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenQuickAdd('udhaar');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-pink-500/15 text-pink-500">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Udhaar Khata</div>
                      <div className="text-[10px] text-slate-400 font-normal">Money lent or borrowed</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenQuickAdd('customer');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-sky-500/15 text-sky-500">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">New Contact</div>
                      <div className="text-[10px] text-slate-400 font-normal">Add friend or vendor to ledger</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenQuickAdd('emi');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-purple-500/15 text-purple-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">EMI Loan</div>
                      <div className="text-[10px] text-slate-400 font-normal">Bike, phone & gadget tenors</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenQuickAdd('transfer');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-500">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Transfer Money</div>
                      <div className="text-[10px] text-slate-400 font-normal">Move funds between accounts</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2.5 w-80 rounded-3xl bg-white dark:bg-[#101728] shadow-2xl border border-slate-200/90 dark:border-white/10 py-3.5 px-4 z-30 animate-in fade-in duration-150 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10">
                    <h4 className="text-sm font-extrabold font-heading text-slate-900 dark:text-white">
                      Notifications
                    </h4>
                    <span className="text-[11px] bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      {notifications.length} Actionable
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-white/[0.06] max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          All caught up!
                        </p>
                        <p className="text-[11px] text-slate-400">
                          No pending loan or udhaar alerts right now.
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div key={item.id} className="py-3 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.title}
                            </span>
                            {item.urgent && (
                              <span className="text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20">
                                Due Soon
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar & Name */}
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80 dark:border-white/10 hover:opacity-85 transition-opacity"
            title="Account Settings"
          >
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-9 h-9 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#070B14]" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold font-heading text-slate-900 dark:text-white leading-tight">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                {profile.occupation || 'Personal Account'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
