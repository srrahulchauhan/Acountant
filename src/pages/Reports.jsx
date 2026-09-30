import React, { useState } from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const Reports = () => {
  const {
    expenses,
    categoryExpenses,
    dailyExpenseData,
    currency,
    monthlyExpense,
    totalBalance,
    totalLoan,
    pendingUdhaar,
  } = useApp();

  const COLORS = ['#F59E0B', '#0284C7', '#EC4899', '#8B5CF6', '#10B981', '#F43F5E', '#3B82F6', '#64748B'];

  // Financial Health calculation
  const healthScore = Math.min(
    95,
    Math.max(55, 78 + (totalBalance > 20000 ? 12 : 0) - (pendingUdhaar > 8000 ? 6 : 0) - (monthlyExpense > 25000 ? 8 : 0))
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-6 h-6 stroke-[2.2]" />
            </span>
            Reports & Financial Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data-driven insights into your monthly burn rate, category distribution, and solvency
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-soft">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-black font-heading font-mono">
              Health Score: {healthScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* 💡 Financial Health & Budget Advice Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              {healthScore >= 80 ? 'Strong Financial Resilience' : 'Budget Optimization Recommended'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {healthScore >= 80
                ? 'Your monthly savings cushion and liquidity are in a solid position. Keep monitoring high-discretionary expenses in dining and shopping.'
                : 'Your pending udhaar receivables or EMI debt ratio is impacting net liquidity. Focus on accelerating udhaar collections.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] text-slate-400 block uppercase">Monthly Burn</span>
            <span className="text-slate-900 dark:text-white font-black text-sm">
              {currency}{monthlyExpense.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10">
            <span className="text-[10px] text-slate-400 block uppercase">Net Liquidity</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
              {currency}{totalBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 Charts Section (ResponsiveContainer with robust heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share Donut / Pie Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-pink-500" />
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Percentage breakdown of your monthly expenditure
              </p>
            </div>
          </div>

          {categoryExpenses.length > 0 ? (
            <div className="h-72 w-full min-h-[270px]">
              <ResponsiveContainer width="100%" height={270} minWidth={100} minHeight={270}>
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${currency}${Number(val).toLocaleString('en-IN')}`, 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No expenses to chart
            </div>
          )}
        </div>

        {/* Daily Burn Bar Chart */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Daily Spend Volume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Amount spent per day for the last 7 days
              </p>
            </div>
          </div>

          <div className="h-72 w-full min-h-[270px]">
            <ResponsiveContainer width="100%" height={270} minWidth={100} minHeight={270}>
              <BarChart data={dailyExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [`${currency}${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Highest Spends Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">
          Top Highest Expenses
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Identifies major cash outflows to assist you with smarter budgeting
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Title</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Date</th>
                <th className="pb-3.5">Payment Mode</th>
                <th className="pb-3.5 text-right pr-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {[...expenses]
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 5)
                .map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">
                      {exp.title}
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">{exp.date}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {exp.paymentMode}
                    </td>
                    <td className="py-3.5 text-right pr-2 font-black font-mono text-rose-500 dark:text-rose-400 text-sm">
                      -{currency}{Number(exp.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
