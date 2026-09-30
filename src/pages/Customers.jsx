import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  Search,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const Customers = ({ onOpenAddModal }) => {
  const { customers, deleteCustomer, currency, searchQuery, setActiveTab } = useApp();

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery]);

  const openWhatsApp = (cust) => {
    const text = encodeURIComponent(`Hi ${cust.name}, hope you are doing well!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </span>
            Contacts & Friends Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain your friends, flatmates, and vendor contacts for quick udhaar and split bills
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('customer')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          <span>+ Add Contact</span>
        </button>
      </div>

      {/* Customers Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts found"
          description="Add friends, flatmates, or vendors to keep track of their udhaar balance."
          actionLabel="+ Add First Contact"
          onAction={() => onOpenAddModal('customer')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCustomers.map((cust) => (
              <motion.div
                key={cust.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-3xl bg-white dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name, Role */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          cust.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cust.name)}`
                        }
                        alt={cust.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-400/40 shadow-sm"
                      />
                      <div>
                        <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                          {cust.name}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {cust.role || 'Contact'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        cust.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 border-transparent'
                      }`}
                    >
                      {cust.status || 'Active'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-5">
                    {cust.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{cust.phone}</span>
                      </div>
                    )}
                    {cust.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{cust.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Trust Rating: {cust.trustScore || 'High'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Balance & Action Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                      Udhaar Balance
                    </span>
                    <span
                      className={`text-base font-black font-heading font-mono ${
                        cust.totalUdhaar > 0
                          ? 'text-pink-600 dark:text-pink-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {currency}{Number(cust.totalUdhaar || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openWhatsApp(cust)}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all active:scale-95"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveTab('udhaar')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                      <span>Khata</span>
                    </button>

                    <button
                      onClick={() => deleteCustomer(cust.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
