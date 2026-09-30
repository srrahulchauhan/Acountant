import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  CreditCard,
  Search,
  Sparkles,
  Utensils,
  Navigation,
  ShoppingBag,
  HeartPulse,
  Film,
  GraduationCap,
  MoreHorizontal,
  Download,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { EXPENSE_CATEGORIES } from '../data/dummyData';

export const DailyExpenses = ({ onOpenAddModal }) => {
  const {
    expenses,
    deleteExpense,
    currency,
    todayExpense,
    monthlyExpense,
    searchQuery,
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'today' | 'month'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = todayStr.substring(0, 7);

  // Group today's expenses by category for top summary
  const todayCategoryBreakdown = useMemo(() => {
    const map = {};
    expenses
      .filter((e) => e.date === todayStr)
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + Number(e.amount);
      });
    return map;
  }, [expenses, todayStr]);

  // Filtered expense list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Search matching
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.paymentMode && item.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Time Filter
      if (selectedFilter === 'today' && item.date !== todayStr) return false;
      if (selectedFilter === 'month' && !item.date?.startsWith(currentMonth)) return false;

      // Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Payment Mode Filter
      if (selectedPaymentMode !== 'all' && item.paymentMode !== selectedPaymentMode) return false;

      return true;
    });
  }, [expenses, searchQuery, selectedFilter, selectedCategory, selectedPaymentMode, todayStr, currentMonth]);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Food':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'Travel':
        return <Navigation className="w-4 h-4 text-sky-500" />;
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'Bills':
        return <Receipt className="w-4 h-4 text-purple-500" />;
      case 'Entertainment':
        return <Film className="w-4 h-4 text-rose-500" />;
      case 'Health':
        return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      default:
        return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  const exportCSV = () => {
    const headers = 'ID,Date,Title,Category,PaymentMode,Amount,Notes\n';
    const rows = filteredExpenses
      .map(
        (e) =>
          `"${e.id}","${e.date}","${e.title}","${e.category}","${e.paymentMode}","${e.amount}","${e.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Receipt className="w-6 h-6 stroke-[2.2]" />
            </span>
            Daily Expenses Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log, categorize, and track your daily burn rate with automated insights
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-white/10 shadow-soft transition-all"
            title="Download Expenses as CSV"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* 🌟 Summary Banner: Today's Spend & Category Breakdown */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Today's Outflow
            </div>
            <div className="text-3xl font-black font-heading text-rose-500 dark:text-rose-400 mt-1 font-mono">
              {currency}{todayExpense.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-slate-500">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">This Month</span>
              <span className="text-sm font-black font-heading text-slate-900 dark:text-white font-mono">
                {currency}{monthlyExpense.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Recorded</span>
              <span className="text-sm font-black font-heading text-slate-900 dark:text-white font-mono">
                {expenses.length} Records
              </span>
            </div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="pt-5">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
            Today's Category Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Food', 'Travel', 'Shopping', 'Other'].map((cat) => {
              const amount = todayCategoryBreakdown[cat] || 0;
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-white dark:bg-white/10 shadow-sm">
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cat}
                    </span>
                  </div>
                  <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                    {currency}{amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0F172A]/90 p-4 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setSelectedFilter('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'today'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            Today Only
          </button>
          <button
            onClick={() => setSelectedFilter('month')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === 'month'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            This Month
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-bold py-2 px-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Mode selector */}
          <select
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            className="text-xs font-bold py-2 px-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
          >
            <option value="all">All Modes</option>
            <option value="HDFC Salary Account">HDFC Bank</option>
            <option value="Paytm / UPI">Paytm / UPI</option>
            <option value="Cash in Hand">Cash</option>
          </select>
        </div>
      </div>

      {/* Expense List Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description="Start tracking your expenses by adding what you spend on food, travel, shopping or other bills."
          actionLabel="+ Add First Expense"
          onAction={() => onOpenAddModal('expense')}
        />
      ) : (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Date</th>
                  <th className="pb-3.5">Expense / Title</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Payment Mode</th>
                  <th className="pb-3.5 text-right">Amount</th>
                  <th className="pb-3.5 text-center pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 pl-2 text-slate-400 font-mono text-[11px]">
                      {exp.date}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {exp.title}
                      </div>
                      {exp.notes && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">
                          {exp.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                        {getCategoryIcon(exp.category)}
                        <span>{exp.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100/70 dark:bg-white/[0.04] text-[11px]">
                        {exp.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-black font-mono text-rose-500 dark:text-rose-400 text-sm">
                      -{currency}{Number(exp.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 text-center pr-2">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
