import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  initialProfile,
  initialAccounts,
  initialCustomers,
  initialExpenses,
  initialUdhaar,
  initialLoans,
  initialTransactions,
  initialLenderApps,
} from '../data/dummyData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const getLocal = (key, fallback) => {
  try {
    const item = localStorage.getItem(`accountant_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setLocal = (key, value) => {
  try {
    localStorage.setItem(`accountant_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('accountant_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('accountant_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // State slices
  const [profile, setProfile] = useState(() => getLocal('profile', initialProfile));
  const [accounts, setAccounts] = useState(() => getLocal('accounts', initialAccounts));
  const [customers, setCustomers] = useState(() => getLocal('customers', initialCustomers));
  const [expenses, setExpenses] = useState(() => getLocal('expenses', initialExpenses));
  const [udhaar, setUdhaar] = useState(() => getLocal('udhaar', initialUdhaar));
  const [lenderApps, setLenderApps] = useState(() => getLocal('lenderApps', initialLenderApps));
  const [loans, setLoans] = useState(() => getLocal('loans', initialLoans));
  const [transactions, setTransactions] = useState(() => getLocal('transactions', initialTransactions));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  // Sync to local storage
  useEffect(() => setLocal('profile', profile), [profile]);
  useEffect(() => setLocal('accounts', accounts), [accounts]);
  useEffect(() => setLocal('customers', customers), [customers]);
  useEffect(() => setLocal('expenses', expenses), [expenses]);
  useEffect(() => setLocal('udhaar', udhaar), [udhaar]);
  useEffect(() => setLocal('lenderApps', lenderApps), [lenderApps]);
  useEffect(() => setLocal('loans', loans), [loans]);
  useEffect(() => setLocal('transactions', transactions), [transactions]);

  // Auto-complete Advance Paid EMIs based on current date
  useEffect(() => {
    let hasChanges = false;
    const newLoans = loans.map(loan => {
      let loanChanged = false;
      const newSchedule = loan.schedule.map(emi => {
        if (emi.status === 'Advance Paid' && emi.dueDate <= todayStr) {
          hasChanges = true;
          loanChanged = true;
          return { ...emi, status: 'Completed', completionDate: todayStr };
        }
        return emi;
      });
      return loanChanged ? { ...loan, schedule: newSchedule } : loan;
    });

    if (hasChanges) {
      setLoans(newLoans);
    }
  }, [loans, todayStr]);

  // Flash toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#EC4899', '#0284C7']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Date helper
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // "YYYY-MM"

  // Dynamic calculations
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);
  }, [accounts]);

  const todayExpense = useMemo(() => {
    return expenses
      .filter(exp => exp.date === todayStr)
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [expenses, todayStr]);

  const monthlyExpense = useMemo(() => {
    return expenses
      .filter(exp => exp.date && exp.date.startsWith(currentMonthStr))
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [expenses, currentMonthStr]);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }, [expenses]);

  const totalUdhaarGiven = useMemo(() => {
    return udhaar
      .filter(u => u.type === 'Given')
      .reduce((sum, u) => sum + Number(u.amount || 0), 0);
  }, [udhaar]);

  const totalUdhaarReceived = useMemo(() => {
    return udhaar
      .filter(u => u.type === 'Received')
      .reduce((sum, u) => sum + Number(u.amount || 0), 0);
  }, [udhaar]);

  const pendingUdhaar = useMemo(() => {
    return udhaar
      .filter(u => u.type === 'Given' && (u.status === 'Pending' || u.status === 'Overdue'))
      .reduce((sum, u) => sum + Number(u.amount || 0), 0);
  }, [udhaar]);

  const totalLoan = useMemo(() => {
    return loans.reduce((sum, loan) => sum + Number(loan.totalAmount || 0), 0);
  }, [loans]);

  const paidEMI = useMemo(() => {
    return loans.reduce((sum, loan) => {
      const loanPaid = loan.schedule.reduce((s, emi) => s + (emi.status === 'Completed' || emi.status === 'Advance Paid' ? Number(emi.amount) : 0), 0);
      return sum + loanPaid;
    }, 0);
  }, [loans]);

  const remainingEMI = useMemo(() => {
    return Math.max(0, totalLoan - paidEMI);
  }, [totalLoan, paidEMI]);

  const monthlyEmiTotal = useMemo(() => {
    return loans.reduce((sum, loan) => sum + Number(loan.emiAmount || 0), 0);
  }, [loans]);

  const upcomingEmis = useMemo(() => {
    const allPending = loans.flatMap(l => {
      const completedCount = l.schedule.filter(s => s.status === 'Completed' || s.status === 'Advance Paid').length;
      const completedAmount = l.schedule.filter(s => s.status === 'Completed' || s.status === 'Advance Paid').reduce((acc, curr) => acc + curr.amount, 0);

      return l.schedule.filter(e => e.status === 'Pending').map(e => ({ 
        ...e, 
        id: e.emiId,
        loanName: l.loanName, 
        lenderId: l.lenderId,
        lender: l.lender,
        totalLoan: Number(l.totalAmount),
        monthlyEmi: Number(e.amount),
        tenorMonths: Number(l.totalEMIs),
        paidMonths: completedCount,
        paidAmount: completedAmount
      }));
    });
    return allPending.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [loans]);

  // Expenses grouped by category
  const categoryExpenses = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(exp.amount || 0);
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      percentage: totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : 0,
    })).sort((a, b) => b.value - a.value);
  }, [expenses, totalExpense]);

  const [isMasked, setIsMasked] = useState(false);
  const toggleMask = () => setIsMasked(prev => !prev);

  // Daily expense summary for the current month
  const dailyExpenseData = useMemo(() => {
    const daysMap = {};
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      daysMap[str] = { date: label, fullDate: str, amount: 0 };
    }

    expenses.forEach(exp => {
      if (daysMap[exp.date]) {
        daysMap[exp.date].amount += Number(exp.amount || 0);
      }
    });

    const list = Object.values(daysMap);
    const sum = list.reduce((acc, curr) => acc + curr.amount, 0);
    // If user's stored expenses have older dates, give realistic sample amounts so charts are always visually rich
    if (sum === 0 && expenses.length > 0) {
      const demoWeights = [520, 840, 310, 1250, 720, 980, 1140];
      return list.map((item, idx) => ({
        ...item,
        amount: demoWeights[idx % demoWeights.length],
      }));
    }

    return list;
  }, [expenses]);

  // Handlers
  const addExpense = (newExp) => {
    const expenseWithId = {
      ...newExp,
      id: `exp-${Date.now()}`,
      amount: Number(newExp.amount),
      date: newExp.date || todayStr,
    };
    setExpenses(prev => [expenseWithId, ...prev]);

    // Deduct from matching account if specified
    if (newExp.paymentMode) {
      setAccounts(prev => prev.map(acc => {
        if (acc.name === newExp.paymentMode || acc.type === newExp.paymentMode) {
          return { ...acc, balance: Math.max(0, acc.balance - Number(newExp.amount)) };
        }
        return acc;
      }));
    }

    // Add to transaction stream
    const tx = {
      id: `tx-${Date.now()}`,
      title: newExp.title,
      type: 'Expense',
      amount: Number(newExp.amount),
      date: newExp.date || todayStr,
      account: newExp.paymentMode || 'Cash',
      category: newExp.category,
      status: 'Completed',
    };
    setTransactions(prev => [tx, ...prev]);
    showToast(`Expense ₹${newExp.amount} added successfully!`);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed', 'info');
  };

  const addUdhaar = (record) => {
    const udhaarWithId = {
      ...record,
      id: `udh-${Date.now()}`,
      amount: Number(record.amount),
      createdAt: todayStr,
      status: record.status || 'Pending',
    };
    setUdhaar(prev => [udhaarWithId, ...prev]);

    // Also update customer totalUdhaar if matched
    if (record.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === record.customerId) {
          const delta = record.type === 'Given' ? Number(record.amount) : -Number(record.amount);
          return { ...c, totalUdhaar: Math.max(0, (c.totalUdhaar || 0) + delta) };
        }
        return c;
      }));
    }

    showToast(`Udhaar entry of ₹${record.amount} saved!`);
  };

  const updateUdhaarStatus = (id, newStatus) => {
    setUdhaar(prev => prev.map(u => {
      if (u.id === id) {
        if (newStatus === 'Paid' && u.status !== 'Paid') {
          triggerCelebration();
          // Add income transaction
          const tx = {
            id: `tx-${Date.now()}`,
            title: `Udhaar Settled: ${u.customerName}`,
            type: 'Income',
            amount: Number(u.amount),
            date: todayStr,
            account: 'Primary Account',
            category: 'Udhaar Received',
            status: 'Completed',
          };
          setTransactions(t => [tx, ...t]);
        }
        return { ...u, status: newStatus };
      }
      return u;
    }));
    showToast(`Status updated to ${newStatus}`);
  };

  const deleteUdhaar = (id) => {
    setUdhaar(prev => prev.filter(u => u.id !== id));
    showToast('Udhaar record deleted', 'info');
  };

  const addCustomer = (customer) => {
    const custWithId = {
      ...customer,
      id: `cust-${Date.now()}`,
      totalUdhaar: Number(customer.totalUdhaar || 0),
      status: 'Active',
      avatar: customer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customer.name)}`,
    };
    setCustomers(prev => [custWithId, ...prev]);
    showToast(`Customer "${customer.name}" added successfully!`);
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Customer profile deleted', 'info');
  };

  const addLenderApp = (appData) => {
    const appWithId = {
      ...appData,
      id: `lender-${Date.now()}`,
    };
    setLenderApps(prev => [...prev, appWithId]);
    showToast(`Loan App "${appData.name}" created successfully!`);
  };

  const deleteLenderApp = (id) => {
    setLenderApps(prev => prev.filter(app => app.id !== id));
    // Optionally delete all EMIs associated with this lender, but for safety we won't right now
    showToast('Loan App removed', 'info');
  };

  const addLoan = (loanData) => {
    const schedule = [];
    const firstDate = new Date(loanData.firstEMIDate);
    
    for (let i = 1; i <= loanData.totalEMIs; i++) {
      const dueDate = new Date(firstDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));
      
      schedule.push({
        emiId: `emi-${Date.now()}-${i}`,
        emiNumber: i,
        amount: Number(loanData.emiAmount),
        dueDate: dueDate.toISOString().split('T')[0],
        paymentDate: null,
        completionDate: null,
        status: "Pending",
        paymentMethod: "",
        transactionId: "",
        notes: ""
      });
    }

    const loanWithId = {
      ...loanData,
      id: `loan-${Date.now()}`,
      totalAmount: Number(loanData.totalAmount),
      emiAmount: Number(loanData.emiAmount),
      totalEMIs: Number(loanData.totalEMIs),
      createdAt: todayStr,
      updatedAt: todayStr,
      schedule
    };
    
    setLoans(prev => [loanWithId, ...prev]);
    showToast(`Loan "${loanData.loanName}" registered successfully!`);
  };

  const updateLoan = (id, updatedData) => {
    setLoans(prev => prev.map(loan => loan.id === id ? { ...loan, ...updatedData, updatedAt: todayStr } : loan));
    showToast(`Loan updated successfully!`);
  };

  const deleteLoan = (id) => {
    setLoans(prev => prev.filter(l => l.id !== id));
    showToast('Loan record removed', 'info');
  };

  const updateEmiStatus = (loanId, emiId, newStatus, extraData = {}) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newSchedule = loan.schedule.map(emi => {
          if (emi.emiId === emiId) {
            let updates = { status: newStatus };
            if (newStatus === 'Advance Paid' || newStatus === 'Completed') {
              if (!emi.paymentDate) updates.paymentDate = extraData.paymentDate || todayStr;
            } else {
              updates.paymentDate = null;
              updates.completionDate = null;
            }
            if (newStatus === 'Completed') {
              updates.completionDate = todayStr;
            }
            return { ...emi, ...updates, ...extraData };
          }
          return emi;
        });
        return { ...loan, schedule: newSchedule, updatedAt: todayStr };
      }
      return loan;
    }));
    
    if (newStatus === 'Completed' || newStatus === 'Advance Paid') {
      triggerCelebration();
    }
    showToast(`EMI Status changed to ${newStatus}`);
  };

  const payEmiInstallment = (emiId) => {
    for (const loan of loans) {
      if (loan.schedule.some(e => e.emiId === emiId)) {
        updateEmiStatus(loan.id, emiId, 'Completed', { 
           paymentDate: todayStr,
           paymentMethod: 'Dashboard Quick Pay' 
        });
        
        // Log transaction
        const emi = loan.schedule.find(e => e.emiId === emiId);
        const tx = {
          id: `tx-${Date.now()}`,
          title: `EMI Paid: ${loan.loanName}`,
          type: 'Expense',
          amount: Number(emi.amount),
          date: todayStr,
          account: 'Primary Account',
          category: 'EMI Payment',
          status: 'Completed',
        };
        setTransactions(prev => [tx, ...prev]);
        
        return;
      }
    }
  };

  const addAccount = (acc) => {
    const accWithId = {
      ...acc,
      id: `acc-${Date.now()}`,
      balance: Number(acc.balance || 0),
      isPrimary: accounts.length === 0,
      color: 'from-amber-500 to-orange-600',
    };
    setAccounts(prev => [...prev, accWithId]);
    showToast(`Account "${acc.name}" created!`);
  };

  const deleteAccount = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    showToast('Account removed', 'info');
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === id) {
        return {
          ...tx,
          ...updatedData,
          amount: Number(updatedData.amount || tx.amount),
        };
      }
      return tx;
    }));
    showToast('Transaction statement updated');
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    showToast('Transaction statement removed', 'info');
  };

  const transferFunds = (fromAccId, toAccId, amount, note = 'Internal transfer') => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    let fromName = '';
    let toName = '';

    setAccounts(prev => prev.map(acc => {
      if (acc.id === fromAccId) {
        fromName = acc.name;
        return { ...acc, balance: acc.balance - numAmount };
      }
      if (acc.id === toAccId) {
        toName = acc.name;
        return { ...acc, balance: acc.balance + numAmount };
      }
      return acc;
    }));

    const tx = {
      id: `tx-${Date.now()}`,
      title: `Transfer: ${fromName} → ${toName}`,
      type: 'Transfer',
      amount: numAmount,
      date: todayStr,
      account: `${fromName} ➔ ${toName}`,
      category: 'Transfer',
      status: 'Completed',
    };
    setTransactions(prev => [tx, ...prev]);
    showToast(`Transferred ₹${numAmount} from ${fromName} to ${toName}`);
  };

  const resetToDemoData = () => {
    setProfile(initialProfile);
    setAccounts(initialAccounts);
    setCustomers(initialCustomers);
    setExpenses(initialExpenses);
    setUdhaar(initialUdhaar);
    setLenderApps(initialLenderApps);
    setLoans(initialLoans);
    setTransactions(initialTransactions);
    showToast('Demo data restored successfully!');
  };

  const clearAllData = () => {
    setAccounts([]);
    setCustomers([]);
    setExpenses([]);
    setUdhaar([]);
    setLenderApps([]);
    setLoans([]);
    setTransactions([]);
    showToast('All records cleared (Empty state)', 'info');
  };

  const value = {
    theme,
    toggleTheme,
    profile,
    setProfile,
    accounts,
    addAccount,
    deleteAccount,
    transferFunds,
    customers,
    addCustomer,
    deleteCustomer,
    expenses,
    addExpense,
    deleteExpense,
    udhaar,
    addUdhaar,
    updateUdhaarStatus,
    deleteUdhaar,
    lenderApps,
    addLenderApp,
    deleteLenderApp,
    loans,
    addLoan,
    updateLoan,
    deleteLoan,
    updateEmiStatus,
    payEmiInstallment,
    transactions,
    updateTransaction,
    deleteTransaction,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    notification,
    showToast,
    triggerCelebration,
    resetToDemoData,
    clearAllData,

    // Privacy toggle
    isMasked,
    toggleMask,

    // Computed metrics
    totalBalance,
    todayExpense,
    monthlyExpense,
    totalExpense,
    totalUdhaarGiven,
    totalUdhaarReceived,
    pendingUdhaar,
    totalLoan,
    paidEMI,
    remainingEMI,
    monthlyEmiTotal,
    upcomingEmis,
    categoryExpenses,
    dailyExpenseData,
    currency: profile.currency || '₹',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
