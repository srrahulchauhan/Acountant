import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Plus,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Wallet,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const AccountStatements = ({ onOpenAddModal, onOpenTransferModal }) => {
  const {
    accounts,
    transactions,
    currency,
    totalBalance,
    searchQuery,
    isMasked,
    toggleMask,
    deleteAccount,
  } = useApp();

  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'Income' | 'Expense' | 'Transfer'

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          tx.title.toLowerCase().includes(q) ||
          (tx.category && tx.category.toLowerCase().includes(q)) ||
          (tx.account && tx.account.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedAccount !== 'all' && !tx.account?.toLowerCase().includes(selectedAccount.toLowerCase())) {
        return false;
      }

      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedAccount, selectedType]);

  const exportCSV = () => {
    const headers = 'ID,Date,Description,Type,Account,Category,Amount\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.title}","${t.type}","${t.account}","${t.category || ''}","${t.amount}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `account_statement_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Landmark className="w-6 h-6 stroke-[2.2]" />
            </span>
            Accounts & Treasury Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your bank accounts, digital wallets, and execute fast funds transfers
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <button
            onClick={onOpenTransferModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-white/10 shadow-soft transition-all"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-500" />
            <span>Transfer Funds</span>
          </button>

          <button
            onClick={() => onOpenAddModal('account')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>+ Add Account</span>
          </button>
        </div>
      </div>

      {/* 🏦 Accounts / Physical Card Style Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white shadow-xl border border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Ambient metallic sheen */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  {acc.type === 'Bank' ? (
                    <Landmark className="w-5 h-5 text-amber-400" />
                  ) : acc.type === 'UPI' ? (
                    <Smartphone className="w-5 h-5 text-sky-400" />
                  ) : (
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">{acc.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                    {acc.accountNumber || acc.type}
                  </div>
                </div>
              </div>

              {acc.isPrimary && (
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Primary
                </span>
              )}
              {!acc.isPrimary && (
                <button
                  onClick={() => deleteAccount(acc.id)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Smart Card Chip Graphic */}
            <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 mb-4 opacity-75 shadow-sm border border-amber-200/50 flex items-center justify-center">
              <div className="w-7 h-5 border border-slate-950/20 rounded-sm" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Available Liquidity
              </span>
              <div className="text-2xl font-black font-heading font-mono text-white tracking-tight">
                {isMasked ? '••••••••' : `${currency}${Number(acc.balance).toLocaleString('en-IN')}`}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified & Active
              </span>

              <button
                onClick={onOpenTransferModal}
                className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-0.5"
              >
                <span>Transfer</span>
                <ArrowRightLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statement Table Section */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              Ledger Statements & Audit Trail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredTransactions.length} recorded movements across all accounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Account selector */}
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="text-xs font-bold py-2 px-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="all">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-bold py-2 px-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="all">All Movements</option>
              <option value="Income">Credits (+)</option>
              <option value="Expense">Debits (-)</option>
              <option value="Transfer">Transfers (⇄)</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No transactions found"
            description="Your transaction statement is currently empty for the selected filters."
          />
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Date</th>
                  <th className="pb-3.5">Description</th>
                  <th className="pb-3.5">Category</th>
                  <th className="pb-3.5">Account / Channel</th>
                  <th className="pb-3.5">Type</th>
                  <th className="pb-3.5 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';
                  const isTransfer = tx.type === 'Transfer';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 pl-2 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {tx.title}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                          {tx.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        {tx.account}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : isTransfer
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2 font-black font-mono text-sm whitespace-nowrap">
                        <span
                          className={
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isTransfer
                              ? 'text-amber-500'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {isIncome ? '+' : isTransfer ? '⇄ ' : '-'}{currency}{Number(tx.amount).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
