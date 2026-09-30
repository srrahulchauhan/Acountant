import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  User,
  Filter,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const UdhaarKhata = ({ onOpenAddModal }) => {
  const {
    udhaar,
    updateUdhaarStatus,
    deleteUdhaar,
    currency,
    totalUdhaarGiven,
    totalUdhaarReceived,
    pendingUdhaar,
    searchQuery,
    triggerCelebration,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'given' | 'received' | 'pending' | 'paid'

  // Net position
  const netPosition = totalUdhaarGiven - totalUdhaarReceived;

  // Filtered items
  const filteredList = useMemo(() => {
    return udhaar.filter((item) => {
      // Search matching
      const matchesSearch =
        !searchQuery ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reason && item.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeTab === 'given') return item.type === 'Given';
      if (activeTab === 'received') return item.type === 'Received';
      if (activeTab === 'pending') return item.status === 'Pending' || item.status === 'Overdue';
      if (activeTab === 'paid') return item.status === 'Paid';

      return true;
    });
  }, [udhaar, searchQuery, activeTab]);

  // Helper to send WhatsApp reminder
  const sendWhatsAppReminder = (item) => {
    const isGiven = item.type === 'Given';
    const text = encodeURIComponent(
      isGiven
        ? `Hi ${item.customerName}, gentle reminder regarding the pending balance of ₹${item.amount.toLocaleString(
            'en-IN'
          )} for "${item.reason || 'personal advance'}". Please settle when convenient. Thanks!`
        : `Hi ${item.customerName}, regarding the ₹${item.amount.toLocaleString(
            'en-IN'
          )} I owe you for "${item.reason || 'expense'}". Let me know your UPI ID so I can clear it!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleMarkPaid = (id) => {
    updateUdhaarStatus(id, 'Paid');
    triggerCelebration();
  };

  const exportCSV = () => {
    const headers = 'ID,Customer,Type,Amount,DueDate,Status,Reason\n';
    const rows = filteredList
      .map(
        (u) =>
          `"${u.id}","${u.customerName}","${u.type}","${u.amount}","${u.dueDate}","${u.status}","${u.reason || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `udhaar_khata_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </span>
            Udhaar Khata & Credit Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track money lent to friends and money you owe to others with 1-click WhatsApp reminders
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-white/10 shadow-soft transition-all"
            title="Export Khata as CSV"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => onOpenAddModal('udhaar')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>+ Add Udhaar Entry</span>
          </button>
        </div>
      </div>

      {/* 📊 Udhaar Summary Stat Cards (Given, Received, Pending & Net Position) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>You'll Get (Lent)</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-pink-600 dark:text-pink-400">
            {currency}{totalUdhaarGiven.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Receivable from friends & colleagues
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>You'll Give (Borrowed)</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading font-mono text-sky-600 dark:text-sky-400">
            {currency}{totalUdhaarReceived.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Payable to friends or local vendors
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Net Balance Position</span>
            <div className={`p-2 rounded-xl border ${netPosition >= 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-heading font-mono ${netPosition >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {netPosition >= 0 ? '+' : ''}{currency}{netPosition.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {netPosition >= 0 ? 'You are a net lender (+)' : 'You have a net debt position (-)'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        {[
          { id: 'all', label: `All Entries (${udhaar.length})` },
          { id: 'given', label: "You'll Get (Given)" },
          { id: 'received', label: "You'll Give (Borrowed)" },
          { id: 'pending', label: 'Pending Collection' },
          { id: 'paid', label: 'Settled & Cleared' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Udhaar Khata Table */}
      {filteredList.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No udhaar records in this view"
          description="Maintain friendly records for money lent or borrowed so you never lose track."
          actionLabel="+ Add Udhaar Record"
          onAction={() => onOpenAddModal('udhaar')}
        />
      ) : (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Customer / Friend</th>
                  <th className="pb-3.5">Type</th>
                  <th className="pb-3.5">Reason / Note</th>
                  <th className="pb-3.5">Due Date</th>
                  <th className="pb-3.5">Amount</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                <AnimatePresence>
                  {filteredList.map((item) => {
                    const isGiven = item.type === 'Given';
                    const isPaid = item.status === 'Paid';
                    return (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-black flex items-center justify-center text-xs shadow-sm">
                              {item.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {item.customerName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Recorded: {item.createdAt || 'Recent'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isGiven
                                ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20'
                                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                            }`}
                          >
                            {isGiven ? <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />}
                            <span>{isGiven ? "You'll Get" : "You'll Give"}</span>
                          </span>
                        </td>
                        <td className="py-4 text-slate-600 dark:text-slate-300 font-medium">
                          {item.reason || 'General friendship loan'}
                        </td>
                        <td className="py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {item.dueDate}
                        </td>
                        <td className="py-4 font-black font-mono text-slate-900 dark:text-white text-sm whitespace-nowrap">
                          {currency}{Number(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold ${
                              isPaid
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                : item.status === 'Overdue'
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 animate-pulse'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {isPaid ? <CheckCircle className="w-3 h-3 stroke-[2.5]" /> : <Clock className="w-3 h-3 stroke-[2.5]" />}
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Friendly Reminder */}
                            {!isPaid && (
                              <button
                                onClick={() => sendWhatsAppReminder(item)}
                                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all active:scale-95"
                                title="Send reminder via WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                            )}

                            {!isPaid && (
                              <button
                                onClick={() => handleMarkPaid(item.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                                title="Mark as settled"
                              >
                                Settle
                              </button>
                            )}

                            {isPaid && (
                              <button
                                onClick={() => updateUdhaarStatus(item.id, 'Pending')}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
                                title="Re-open record"
                              >
                                Reopen
                              </button>
                            )}

                            <button
                              onClick={() => deleteUdhaar(item.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
