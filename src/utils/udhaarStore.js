import { getLocalDateString } from './dateUtils';

const KEYS = {
  PERSONS: 'rc_udhaar_persons',
  TRANSACTIONS: 'rc_udhaar_transactions',
};

export const udhaarStore = {
  init() {
    if (!localStorage.getItem(KEYS.PERSONS)) {
      const defaultPersons = [
        { id: 'FRD-101', name: 'Amit', phone: '9876543210', notes: 'Personal Udhaar', createdAt: getLocalDateString() }
      ];
      localStorage.setItem(KEYS.PERSONS, JSON.stringify(defaultPersons));
    }
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      const defaultTransactions = [
        { id: 'UDH-1', personId: 'FRD-101', type: 'Debit', amount: 10000, date: getLocalDateString(), note: 'Udhaar diya', createdAt: Date.now() - 86400000 },
        { id: 'UDH-2', personId: 'FRD-101', type: 'Credit', amount: 4000, date: getLocalDateString(), note: 'Wapas mila (Part payment)', createdAt: Date.now() }
      ];
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(defaultTransactions));
    }
  },

  notify() {
    window.dispatchEvent(new CustomEvent('udhaarStoreUpdated'));
  },

  getPersons() {
    this.init();
    try {
      const persons = JSON.parse(localStorage.getItem(KEYS.PERSONS) || '[]');
      const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');

      return persons.map((person) => {
        const pTx = transactions.filter((t) => t.personId === person.id);
        const totalDebit = pTx
          .filter((t) => t.type === 'Debit')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const totalCredit = pTx
          .filter((t) => t.type === 'Credit')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const netBalance = totalDebit - totalCredit;

        let status = 'Settled';
        if (netBalance > 0) status = 'Receivable';
        else if (netBalance < 0) status = 'Payable';

        const sortedTx = [...pTx].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        const lastTx = sortedTx[0] || null;

        return {
          ...person,
          totalDebit,
          totalCredit,
          netBalance,
          status,
          txCount: pTx.length,
          lastTransactionDate: lastTx ? lastTx.date : person.createdAt,
        };
      });
    } catch (e) {
      console.error('Error fetching udhaar persons:', e);
      return [];
    }
  },

  getPersonById(id) {
    const persons = this.getPersons();
    return persons.find((p) => p.id === id) || null;
  },

  savePerson(person) {
    this.init();
    const persons = JSON.parse(localStorage.getItem(KEYS.PERSONS) || '[]');
    let updated;

    if (person.id) {
      updated = persons.map((p) => (p.id === person.id ? { ...p, ...person } : p));
    } else {
      const newPerson = {
        ...person,
        id: 'FRD-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: getLocalDateString(),
      };
      updated = [newPerson, ...persons];
    }

    localStorage.setItem(KEYS.PERSONS, JSON.stringify(updated));
    this.notify();
    return updated;
  },

  deletePerson(id) {
    this.init();
    const persons = JSON.parse(localStorage.getItem(KEYS.PERSONS) || '[]');
    const filteredPersons = persons.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PERSONS, JSON.stringify(filteredPersons));

    // Also remove associated transactions
    const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
    const filteredTx = transactions.filter((t) => t.personId !== id);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(filteredTx));

    this.notify();
  },

  getTransactions(personId = null) {
    this.init();
    try {
      const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
      let filtered = transactions;
      if (personId) {
        filtered = transactions.filter((t) => t.personId === personId);
      }

      // Sort chronologically ascending to calculate running balance
      const sorted = [...filtered].sort((a, b) => {
        const dDiff = new Date(a.date) - new Date(b.date);
        if (dDiff !== 0) return dDiff;
        return (a.createdAt || 0) - (b.createdAt || 0);
      });

      let runningBal = 0;
      const withRunningBal = sorted.map((tx) => {
        const amt = Number(tx.amount || 0);
        if (tx.type === 'Debit') {
          runningBal += amt;
        } else {
          runningBal -= amt;
        }
        return {
          ...tx,
          runningBalance: runningBal,
        };
      });

      // Return reverse order (newest first) for UI display
      return withRunningBal.reverse();
    } catch (e) {
      console.error('Error fetching transactions:', e);
      return [];
    }
  },

  addTransaction(tx) {
    this.init();
    const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
    const newTx = {
      ...tx,
      id: 'UDH-' + Date.now(),
      amount: Math.abs(Number(tx.amount || 0)),
      date: tx.date || getLocalDateString(),
      note: tx.note || '',
      createdAt: Date.now(),
    };

    const updated = [newTx, ...transactions];
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    this.notify();
    return newTx;
  },

  deleteTransaction(id) {
    this.init();
    const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
    const filtered = transactions.filter((t) => t.id !== id);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(filtered));
    this.notify();
  },

  getDashboardSummary() {
    const persons = this.getPersons();
    const transactions = JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');

    const totalGiven = transactions
      .filter((t) => t.type === 'Debit')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalReceived = transactions
      .filter((t) => t.type === 'Credit')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    let totalReceivable = 0;
    let totalPayable = 0;
    let activeAccounts = 0;

    persons.forEach((p) => {
      if (p.netBalance > 0) {
        totalReceivable += p.netBalance;
        activeAccounts++;
      } else if (p.netBalance < 0) {
        totalPayable += Math.abs(p.netBalance);
        activeAccounts++;
      }
    });

    const netPending = totalGiven - totalReceived;

    return {
      totalGiven,
      totalReceived,
      netPending,
      totalReceivable,
      totalPayable,
      totalPersons: persons.length,
      activeAccounts,
    };
  },
};
