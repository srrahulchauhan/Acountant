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
  } = useApp();

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

  const handlePayInstallment = (id) => {
    payEmiInstallment(id);
    triggerCelebration();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <CreditCard className="w-6 h-6 stroke-[2.2]" />
            </span>
            EMI & Loan Portfolio Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay ahead of credit score penalties for bike, smartphone, and personal loan tenors
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

      {/* 📊 EMI Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Total Loan Portfolio
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-slate-900 dark:text-white">
            {currency}{totalLoan.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cumulative principal borrowed
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Total Paid So Far
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-emerald-600 dark:text-emerald-400">
            {currency}{paidEMI.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {overallRepaidPercent}% cleared to date
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Remaining Outstanding
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-rose-500 dark:text-rose-400">
            {currency}{remainingEMI.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active debt obligation
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Monthly Commitment
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-purple-600 dark:text-purple-400">
            {currency}{monthlyEmiTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total monthly debit amount
          </p>
        </div>
      </div>

      {/* Global Debt Paydown Bar */}
      {totalLoan > 0 && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-slate-800 dark:text-slate-200 font-heading">
              Total Debt Clearance Progress
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono font-bold text-sm">
              {overallRepaidPercent}% Cleared
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/[0.06] h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallRepaidPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      )}

      {/* EMI Cards Grid */}
      {emis.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No active loans or EMIs"
          description="Track your smartphone, two-wheeler, or appliance EMIs to avoid missed payments."
          actionLabel="+ Add First Loan EMI"
          onAction={() => onOpenAddModal('emi')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {emis.map((item) => {
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
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {item.lender || 'Finance Provider'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {isCompleted ? 'Cleared' : item.status || 'Active'}
                      </span>
                    </div>

                    {/* EMI Amount & Due Date */}
                    <div className="bg-slate-50 dark:bg-white/[0.04] p-4 rounded-2xl mb-4 border border-slate-100 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Monthly Installment
                          </span>
                          <span className="text-xl font-black font-heading font-mono text-purple-600 dark:text-purple-400">
                            {currency}{item.monthlyEmi.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            Next Due Date
                          </span>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {item.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar of this loan */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span>Tenor: {item.paidMonths} of {item.tenorMonths} months</span>
                        <span className="font-mono font-bold">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                        <span>Paid: {currency}{item.paidAmount.toLocaleString('en-IN')}</span>
                        <span>Left: {currency}{(item.totalLoan - item.paidAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteEmi(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Loan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenAddModal('emi', item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        title="Edit Loan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() => handlePayInstallment(item.id)}
                        className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pay {currency}{item.monthlyEmi.toLocaleString('en-IN')}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Loan Completed
                      </span>
                    )}
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
