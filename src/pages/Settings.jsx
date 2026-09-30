import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const {
    profile,
    setProfile,
    theme,
    toggleTheme,
    resetToDemoData,
    clearAllData,
    showToast,
    accounts,
    expenses,
    udhaar,
    customers,
    emis,
    transactions,
  } = useApp();

  const [formData, setFormData] = useState({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsSaved(true);
    showToast('Profile preferences updated!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Export full JSON backup
  const exportBackupJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      accounts,
      expenses,
      udhaar,
      customers,
      emis,
      transactions,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accountant_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON Backup downloaded successfully!');
  };

  // Import JSON backup
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.accounts) localStorage.setItem('accountant_accounts', JSON.stringify(parsed.accounts));
        if (parsed.expenses) localStorage.setItem('accountant_expenses', JSON.stringify(parsed.expenses));
        if (parsed.udhaar) localStorage.setItem('accountant_udhaar', JSON.stringify(parsed.udhaar));
        if (parsed.customers) localStorage.setItem('accountant_customers', JSON.stringify(parsed.customers));
        if (parsed.emis) localStorage.setItem('accountant_emis', JSON.stringify(parsed.emis));
        if (parsed.transactions) localStorage.setItem('accountant_transactions', JSON.stringify(parsed.transactions));

        showToast('Backup restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <span className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            <SettingsIcon className="w-6 h-6 stroke-[2.2]" />
          </span>
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize profile, monthly budgets, themes, and manage local storage backups
        </p>
      </div>

      {/* User Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-500" />
          Personal Profile & Budget
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Currency Symbol
              </label>
              <select
                value={formData.currency || '₹'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 cursor-pointer transition-colors"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD - Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Monthly Expense Budget Target (₹)
              </label>
              <input
                type="number"
                value={formData.monthlyBudget || 25000}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyBudget: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 font-mono transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Used to compute budget progress and warning indicators on your dashboard
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              {isSaved ? 'Preferences Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Appearance / Theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Select between light and sleek obsidian dark mode designed for luxury fintech interfaces
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 sm:p-5 rounded-3xl border-2 flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-amber-400 bg-amber-500/10 text-slate-900 font-bold shadow-soft'
                : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <div className="text-sm font-bold font-heading">Light Mode</div>
              <div className="text-[11px] text-slate-400">Clean & high contrast</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 sm:p-5 rounded-3xl border-2 flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-amber-400 bg-white/[0.06] text-white font-bold shadow-soft'
                : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-sm font-bold font-heading">Dark Mode</div>
              <div className="text-[11px] text-slate-400">Deep obsidian & gold glow</div>
            </div>
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white mb-1">
            Data Backup & Reset
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your accounts data to JSON or reset to default demo records
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportBackupJSON}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-500" />
                Export JSON Backup
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Download all your expenses, udhaar & loans
              </div>
            </div>
          </button>

          <label className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-left transition-colors flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-sky-500" />
                Import JSON Backup
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Restore previously saved JSON file
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={resetToDemoData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold border border-amber-500/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Demo Dataset</span>
          </button>

          <button
            onClick={clearAllData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
