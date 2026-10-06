import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  TrendingDown,
  Bike,
  Smartphone,
  Laptop,
  Percent,
  ShieldCheck,
  Landmark,
  ArrowLeft,
  Activity,
  CheckCircle,
  Clock3,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const EmiPayments = ({ onOpenAddModal }) => {
  const {
    emis,
    payEmiInstallment,
    deleteEmi,
    currency,
    totalLoan,
    paidEMI,
    remainingEMI,
    monthlyEmiTotal,
    triggerCelebration,
    lenderApps,
    deleteLenderApp,
  } = useApp();

  const [selectedLenderId, setSelectedLenderId] = useState(null);

  // Progress percentage
  const overallRepaidPercent = totalLoan > 0 ? Math.round((paidEMI / totalLoan) * 100) : 0;

  const getLoanIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('bike') || lower.includes('motorcycle') || lower.includes('scooter')) {
      return <Bike className="w-5 h-5 text-purple-500" />;
    }
    if (lower.includes('phone') || lower.includes('mobile')) {
      return <Smartphone className="w-5 h-5 text-sky-500" />;
    }
    if (lower.includes('laptop') || lower.includes('mac') || lower.includes('pc')) {
      return <Laptop className="w-5 h-5 text-amber-500" />;
    }
    return <CreditCard className="w-5 h-5 text-indigo-500" />;
  };

  const getLenderIcon = (iconName) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-5 h-5 text-white" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-white" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-white" />;
      default: return <CreditCard className="w-5 h-5 text-white" />;
    }
  };

  const handlePayInstallment = (id) => {
    payEmiInstallment(id);
    triggerCelebration();
  };

  // Dashboard Stats
  const pendingEmis = emis.filter(e => e.status === 'Pending' || e.status === 'Upcoming' || !e.status);
  const advanceEmis = emis.filter(e => e.status === 'Advance Payment');
  const completedEmis = emis.filter(e => e.status === 'Completed' || (e.paidAmount >= e.totalLoan && e.totalLoan > 0));

  const totalPortfolioAmount = emis.reduce((sum, e) => sum + Number(e.totalLoan || 0), 0);
  const pendingAmount = pendingEmis.reduce((sum, e) => sum + Math.max(0, Number(e.totalLoan) - Number(e.paidAmount)), 0);
  const advanceAmount = advanceEmis.reduce((sum, e) => sum + Number(e.paidAmount || 0), 0);
  const completedAmount = completedEmis.reduce((sum, e) => sum + Number(e.paidAmount || 0), 0);

  // View 1: Lender Apps Grid
  if (!selectedLenderId) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Landmark className="w-6 h-6 stroke-[2.2]" />
              </span>
              EMI & Loan Portfolio Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Create an account for your loan provider to manage your EMIs inside it
            </p>
          </div>

          <button
            onClick={() => onOpenAddModal('lenderApp')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>Create Loan Account</span>
          </button>
        </div>

        {/* Live Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Portfolio */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-24 h-24 text-indigo-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Portfolio
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-slate-900 dark:text-white mb-1">
                {currency}{totalPortfolioAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {emis.length} Active Loans
              </p>
            </div>
          </div>

          {/* Pending EMIs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock3 className="w-24 h-24 text-amber-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending EMIs
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-amber-600 dark:text-amber-400 mb-1">
                {currency}{pendingAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {pendingEmis.length} Needs Attention
              </p>
            </div>
          </div>

          {/* Advance Payments */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-sky-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Advance Paid
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-sky-600 dark:text-sky-400 mb-1">
                {currency}{advanceAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {advanceEmis.length} Loans Pre-paid
              </p>
            </div>
          </div>

          {/* Completed Loans */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Completed
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                {currency}{completedAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs font-semibold text-slate-400">
                {completedEmis.length} Loans Cleared
              </p>
            </div>
          </div>
        </div>

        {lenderApps.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No Loan Accounts created"
            description="Create your first account (e.g. Bajaj Finserv, HDFC) to start tracking EMIs."
            actionLabel="+ Create Loan Account"
            onAction={() => onOpenAddModal('lenderApp')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {lenderApps.map((app) => {
                // Calculate stats for this specific app
                const appEmis = emis.filter(e => e.lenderId === app.id);
                const appTotalLoan = appEmis.reduce((sum, e) => sum + Number(e.totalLoan || 0), 0);
                const appPaid = appEmis.reduce((sum, e) => sum + Number(e.paidAmount || 0), 0);
                
                return (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    onClick={() => setSelectedLenderId(app.id)}
                    className={`p-6 rounded-3xl bg-gradient-to-br ${app.color || 'from-slate-700 to-slate-900'} shadow-lg cursor-pointer hover:scale-[1.02] transition-transform relative group flex flex-col justify-between`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLenderApp(app.id); }}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {getLenderIcon(app.icon)}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white leading-tight">
                          {app.name}
                        </h3>
                        <p className="text-white/70 text-xs font-medium">
                          {appEmis.length} Active Loans
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Total Loan</div>
                        <div className="text-white font-mono font-bold text-sm">{currency}{appTotalLoan.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Total Paid</div>
                        <div className="text-emerald-300 font-mono font-bold text-sm">{currency}{appPaid.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  // View 2: EMIs for selected Lender
  const selectedLender = lenderApps.find(app => app.id === selectedLenderId);
  const lenderEmis = emis.filter(e => e.lenderId === selectedLenderId);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setSelectedLenderId(null)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Accounts
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span className={`p-2.5 rounded-2xl bg-gradient-to-br ${selectedLender?.color} text-white`}>
                {getLenderIcon(selectedLender?.icon)}
              </span>
              {selectedLender?.name} - Loans & EMIs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage specific EMIs and loans for this account
            </p>
          </div>

          <button
            onClick={() => onOpenAddModal('emi')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>+ Add Loan / EMI</span>
          </button>
        </div>
      </div>

      {/* EMI Cards Grid */}
      {lenderEmis.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={`No active loans for ${selectedLender?.name}`}
          description="Add a loan specific to this account to track EMIs."
          actionLabel="+ Add Loan EMI"
          onAction={() => onOpenAddModal('emi')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {lenderEmis.map((item) => {
              const percent = Math.min(100, Math.round((item.paidAmount / item.totalLoan) * 100));
              const isCompleted = item.status === 'Completed' || percent >= 100;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 group-hover:scale-105 transition-transform">
                          {getLoanIcon(item.loanName)}
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold font-heading text-slate-900 dark:text-white leading-tight">
                            {item.loanName}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {item.status || 'Active'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}
                      >
                        {isCompleted ? 'Cleared' : 'Active'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between items-end text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="font-mono text-sm">
                          {currency}{item.paidAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400">
                          / {currency}{item.totalLoan.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta Details */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                          Monthly EMI
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                          {currency}{item.monthlyEmi.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                          Duration
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.paidMonths} / {item.tenorMonths} Mos
                        </span>
                      </div>
                      <div className="col-span-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/5 text-amber-700 dark:text-amber-500 flex items-center justify-between border border-amber-100 dark:border-amber-500/10">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Next Due Date</span>
                        </div>
                        <span className="font-bold">{item.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayInstallment(item.id)}
                      disabled={isCompleted}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all ${
                        isCompleted
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isCompleted ? 'Goal Achieved' : 'Pay EMI Now'}
                    </button>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => onOpenAddModal('emi', item)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors border border-slate-200 dark:border-slate-800"
                        title="Edit EMI"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEmi(item.id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-slate-200 dark:border-slate-800"
                        title="Delete EMI"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
