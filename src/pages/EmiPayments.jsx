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
    loans,
    updateEmiStatus,
    deleteLoan,
    currency,
    triggerCelebration,
    lenderApps,
  } = useApp();

  const [selectedLoanId, setSelectedLoanId] = useState(null);

  // Derived overall stats
  const totalLoanAmount = loans.reduce((sum, l) => sum + Number(l.totalAmount), 0);
  const pendingEMIs = loans.flatMap(l => l.schedule.filter(e => e.status === 'Pending'));
  const advanceEMIs = loans.flatMap(l => l.schedule.filter(e => e.status === 'Advance Paid'));
  const completedEMIs = loans.flatMap(l => l.schedule.filter(e => e.status === 'Completed'));

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

  const handlePayEmi = (loanId, emiId) => {
    const confirmMsg = "Do you want to mark this EMI as paid today?";
    if (window.confirm(confirmMsg)) {
      updateEmiStatus(loanId, emiId, 'Completed', { 
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI' // default
      });
      triggerCelebration();
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: LOAN DASHBOARD (List of Loans)
  // -------------------------------------------------------------
  if (!selectedLoanId) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Landmark className="w-6 h-6 stroke-[2.2]" />
              </span>
              EMI & Loan Portfolio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage all your active loans and track EMI payments
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenAddModal('lenderApp')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#0A0F1D] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm shadow-soft transition-all"
            >
              <Landmark className="w-4 h-4" />
              <span>Add Bank</span>
            </button>
            <button
              onClick={() => {
                if (lenderApps.length === 0) {
                  alert("Please add a Financier/Bank first!");
                  return;
                }
                onOpenAddModal('emi');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span>Create Loan</span>
            </button>
          </div>
        </div>

        {/* Live Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24 text-indigo-500" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Activity className="w-5 h-5" /></div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Portfolio</span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mb-1">{currency}{totalLoanAmount.toLocaleString('en-IN')}</div>
              <p className="text-xs font-semibold text-slate-400">{loans.length} Active Loans</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Clock3 className="w-24 h-24 text-amber-500" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"><Clock3 className="w-5 h-5" /></div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending EMIs</span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mb-1">{pendingEMIs.length}</div>
              <p className="text-xs font-semibold text-slate-400">To be paid</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-24 h-24 text-sky-500" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"><Zap className="w-5 h-5" /></div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advance Paid</span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mb-1">{advanceEMIs.length}</div>
              <p className="text-xs font-semibold text-slate-400">Paid before due</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle className="w-24 h-24 text-emerald-500" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-5 h-5" /></div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed EMIs</span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mb-1">{completedEMIs.length}</div>
              <p className="text-xs font-semibold text-slate-400">Successfully paid</p>
            </div>
          </div>
        </div>

        {/* Loans List */}
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            Active Loans <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs">{loans.length}</span>
          </h3>

          {loans.length === 0 ? (
            <EmptyState 
              icon={Landmark}
              title="No Loans Found"
              description="Create a loan to automatically generate an EMI schedule."
              actionLabel="Create Loan"
              onAction={() => {
                if (lenderApps.length === 0) {
                  alert("Please add a Financier/Bank first!");
                  return;
                }
                onOpenAddModal('emi');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map(loan => {
                const completedCount = loan.schedule.filter(e => e.status === 'Completed').length;
                const advanceCount = loan.schedule.filter(e => e.status === 'Advance Paid').length;
                const pendingCount = loan.schedule.filter(e => e.status === 'Pending').length;
                
                const progress = loan.totalEMIs > 0 ? Math.round(((completedCount + advanceCount) / loan.totalEMIs) * 100) : 0;
                
                const nextEmi = loan.schedule.find(e => e.status === 'Pending');

                return (
                  <div 
                    key={loan.id}
                    className="flex flex-col bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 rounded-3xl shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all"
                  >
                    <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-start justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                          {getLoanIcon(loan.loanName)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{loan.loanName}</h4>
                          <p className="text-xs font-semibold text-slate-500">{loan.lender}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this entire loan and schedule?")) {
                            deleteLoan(loan.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1">Total Loan</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{currency}{loan.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1">Monthly EMI</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{currency}{loan.emiAmount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-emerald-600 dark:text-emerald-400">{completedCount} Completed</span>
                          <span className="text-sky-600 dark:text-sky-400">{advanceCount} Advance</span>
                          <span className="text-amber-600 dark:text-amber-400">{pendingCount} Pending</span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-bold">
                            <span className="text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="text-slate-900 dark:text-white">{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden rounded-full flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${(completedCount / loan.totalEMIs) * 100}%` }} />
                            <div className="h-full bg-sky-500" style={{ width: `${(advanceCount / loan.totalEMIs) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      {nextEmi && (
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl">
                          <Clock3 className="w-4 h-4" />
                          Next Due: {new Date(nextEmi.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-white/5">
                      <button
                        onClick={() => setSelectedLoanId(loan.id)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                      >
                        View EMI Schedule
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: EMI SCHEDULE (For a specific Loan)
  // -------------------------------------------------------------
  const loan = loans.find(l => l.id === selectedLoanId);
  
  if (!loan) {
    setSelectedLoanId(null);
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => setSelectedLoanId(null)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Loans
          </button>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {getLoanIcon(loan.loanName)}
            </span>
            {loan.loanName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {loan.lender} • {currency}{loan.totalAmount.toLocaleString('en-IN')} Total
          </p>
        </div>
        
        <button
          onClick={() => onOpenAddModal('emi', loan)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm shadow-soft transition-all"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Loan Info</span>
        </button>
      </div>

      {/* Schedule List */}
      <div className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/10 rounded-3xl shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-white/5">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Complete EMI Schedule
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {loan.schedule.map((emi) => {
            const isCompleted = emi.status === 'Completed';
            const isAdvance = emi.status === 'Advance Paid';
            const isPending = emi.status === 'Pending';
            
            return (
              <div key={emi.emiId} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg ${
                    isCompleted ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 
                    isAdvance ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {emi.emiNumber}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {currency}{emi.amount.toLocaleString('en-IN')}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        Due: {new Date(emi.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      
                      {(isCompleted || isAdvance) && emi.paymentDate && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid: {new Date(emi.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                    isAdvance ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {emi.status}
                  </span>

                  {isPending && (
                    <button
                      onClick={() => handlePayEmi(loan.id, emi.emiId)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}

                  <button
                    onClick={() => onOpenAddModal('editEmi', { emiData: emi, loanId: loan.id })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
