import React from 'react';
import {
  Wallet,
  TrendingDown,
  BookOpen,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  MessageCircle,
  PieChart as PieIcon,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';

export const Dashboard = ({ onOpenQuickAdd: _onOpenQuickAdd }) => {
  const {
    profile,
    currency,
    totalBalance,
    todayExpense,
    monthlyExpense,
    totalUdhaarGiven,
    totalUdhaarReceived,
    pendingUdhaar,
    totalLoan,
    paidEMI,
    remainingEMI,
    upcomingEmis,
    dailyExpenseData,
    categoryExpenses,
    transactions,
    udhaar,
    payEmiInstallment,
    setActiveTab,
    deleteTransaction,
  } = useApp();

  const COLORS = ['#F59E0B', '#0284C7', '#EC4899', '#8B5CF6', '#10B981', '#F43F5E', '#3B82F6', '#64748B'];

  // Budget progress
  const monthlyBudget = profile.monthlyBudget || 25000;
  const budgetSpentPercent = Math.min(100, Math.round((monthlyExpense / monthlyBudget) * 100));

  // Next upcoming EMI
  const nextEmi = upcomingEmis[0];

  // Helper to send WhatsApp reminder
  const sendWhatsAppReminder = (item) => {
    const text = encodeURIComponent(
      `Hi ${item.customerName}, gentle reminder regarding the pending balance of ₹${item.amount.toLocaleString(
        'en-IN'
      )} (${item.reason || 'Khata entry'}). Please let me know when you can settle it. Thanks!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Real-time ticking clock
  const [liveTime, setLiveTime] = React.useState(() => new Date().toLocaleTimeString('en-IN'));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('en-IN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ⚡ Live Telemetry Ticker Ribbon */}
      <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-white dark:bg-[#0E1526]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden select-none">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-white/10 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-extrabold font-heading text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            Live Telemetry
          </span>
        </div>

        {/* Marquee ticker feed */}
        <div className="overflow-hidden whitespace-nowrap flex-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <div className="animate-ticker flex items-center gap-8">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500">●</span>
              <span>HDFC Bank: Active & Verified</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ({currency}{totalBalance.toLocaleString('en-IN')})
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-500">●</span>
              <span>Today's Outflow:</span>
              <span className="font-mono font-bold text-rose-500">
                {currency}{todayExpense.toLocaleString('en-IN')}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-pink-500">●</span>
              <span>Pending Udhaar:</span>
              <span className="font-mono font-bold text-pink-500">
                {currency}{pendingUdhaar.toLocaleString('en-IN')}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-purple-500">●</span>
              <span>Next EMI:</span>
              <span className="font-mono font-bold text-purple-400">
                {nextEmi ? `${nextEmi.loanName} (${currency}${nextEmi.monthlyEmi.toLocaleString('en-IN')})` : 'All clear'}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-mono">
              <span>Sync Time: {liveTime} IST</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10 shrink-0 font-mono text-[11px] text-slate-400">
          <span>{liveTime}</span>
        </div>
      </div>



      {/* 📊 Main Stat Cards Row (Live Animated Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Balance Card */}
        <StatCard
          title="Total Net Balance"
          value={totalBalance}
          subtext="Bank, Wallets & Cash"
          change="+12.5%"
          isPositive={true}
          icon={Wallet}
          color="yellow"
          progress={budgetSpentPercent}
          progressLabel={`Monthly Budget: ${currency}${monthlyBudget.toLocaleString('en-IN')}`}
          onClick={() => setActiveTab('statements')}
        />

        {/* Today's Expense Card */}
        <StatCard
          title="Today's Expense"
          value={todayExpense}
          subtext={`This Month: ${currency}${monthlyExpense.toLocaleString('en-IN')}`}
          change={todayExpense > 1000 ? '+24%' : '-8.2%'}
          isPositive={todayExpense <= 1000}
          icon={TrendingDown}
          color="red"
          badgeText={todayExpense > 1500 ? 'Limit Exceeded' : 'Within Budget'}
          onClick={() => setActiveTab('expenses')}
        />

        {/* Udhaar Khata Summary Card */}
        <StatCard
          title="Udhaar Khata"
          value={pendingUdhaar}
          subtext={`Lent: ${currency}${totalUdhaarGiven.toLocaleString('en-IN')} | Borrowed: ${currency}${totalUdhaarReceived.toLocaleString('en-IN')}`}
          icon={BookOpen}
          color="pink"
          badgeText={pendingUdhaar > 0 ? 'Pending Collection' : 'All Settled'}
          progress={
            totalUdhaarGiven > 0
              ? ((totalUdhaarGiven - pendingUdhaar) / totalUdhaarGiven) * 100
              : 100
          }
          progressLabel="Collection Rate"
          onClick={() => setActiveTab('udhaar')}
        />

        {/* EMI & Loan Status Card */}
        <StatCard
          title="Remaining Loans & EMI"
          value={remainingEMI}
          subtext={`Principal: ${currency}${totalLoan.toLocaleString('en-IN')} | Paid: ${currency}${paidEMI.toLocaleString('en-IN')}`}
          icon={CreditCard}
          color="purple"
          progress={totalLoan > 0 ? (paidEMI / totalLoan) * 100 : 100}
          progressLabel="Loan Repaid"
          badgeText={nextEmi ? `Next: ${currency}${nextEmi.monthlyEmi.toLocaleString('en-IN')}` : 'No active EMIs'}
          onClick={() => setActiveTab('emi')}
        />
      </div>

      {/* 📈 Charts Section: Daily Expense Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Expense Area Trend Chart (2 columns) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Expense Analytics (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual spend volume and daily cash burn velocity
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-400/15 border border-amber-400/25 px-3 py-1 rounded-full font-mono">
                7 Days: {currency}{dailyExpenseData.reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Recharts Area Container with rock-solid dimensions */}
          <div className="h-64 sm:h-72 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height={260} minWidth={100} minHeight={260}>
              <AreaChart data={dailyExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value) => [`${currency}${Number(value).toLocaleString('en-IN')}`, 'Spent']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (1 column) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-sky-500" />
                Category Share
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                This Month
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Where your money is allocated
            </p>

            {categoryExpenses.length > 0 ? (
              <div className="space-y-3.5">
                {categoryExpenses.slice(0, 5).map((cat, idx) => {
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {cat.name}
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">
                            {currency}{cat.value.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({cat.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Micro Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No expense data recorded yet.
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('reports')}
            className="mt-6 w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Full Category Analytics</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ⚡ Two Column Grid: Upcoming EMI Reminder & Udhaar Khata Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming EMI Reminder Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <CreditCard className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                  EMI Loan Schedule
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stay ahead of credit score penalties
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('emi')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({upcomingEmis.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextEmi ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent border border-purple-500/25 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-black font-heading text-slate-900 dark:text-white">
                    {nextEmi.loanName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Financed by {nextEmi.lender}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-heading text-purple-600 dark:text-purple-400 font-mono">
                    {currency}{nextEmi.monthlyEmi.toLocaleString('en-IN')}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Clock className="w-3 h-3" />
                    <span>Due: {nextEmi.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar of Loan */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Tenor Progress: {nextEmi.paidMonths} of {nextEmi.tenorMonths} months</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {Math.round((nextEmi.paidAmount / nextEmi.totalLoan) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${(nextEmi.paidAmount / nextEmi.totalLoan) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Remaining: {currency}{(nextEmi.totalLoan - nextEmi.paidAmount).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => payEmiInstallment(nextEmi.id)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark EMI Paid</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              🎉 No upcoming EMI loans pending! All clear.
            </div>
          )}
        </div>

        {/* Udhaar Khata Pending Snapshot */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                  Udhaar Khata Collection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Friends & contacts pending settlements
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('udhaar')}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Open Khata</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {udhaar.filter(u => u.status === 'Pending' || u.status === 'Overdue').slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] hover:border-pink-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {item.customerName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.customerName}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.reason || 'Personal loan'} • Due: {item.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-black text-pink-600 dark:text-pink-400 font-mono">
                      {currency}{item.amount.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.status === 'Overdue'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <button
                    onClick={() => sendWhatsAppReminder(item)}
                    title="Send WhatsApp Reminder"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {udhaar.filter(u => u.status === 'Pending' || u.status === 'Overdue').length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                ✨ No pending udhaar records to collect. All caught up!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📜 Recent Transactions Ledger */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trail of your expenses, salary, and loan deductions
            </p>
          </div>
          <button
            onClick={() => setActiveTab('statements')}
            className="text-xs font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1"
          >
            <span>View Statements</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="pb-3 pl-1">Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Account / Mode</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right pr-1">Amount</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {transactions.slice(0, 5).map((tx) => {
                const isIncome = tx.type === 'Income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 pl-1 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-xl ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isIncome ? <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                        <span className="font-bold">{tx.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300">
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {tx.account}
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-3.5 text-right pr-1 font-black font-mono">
                      <span
                        className={
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {isIncome ? '+' : '-'}{currency}{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => _onOpenQuickAdd('editTransaction', tx)}
                          title="Modify Transaction"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete Transaction"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
