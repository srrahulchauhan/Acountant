import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES } from '../data/dummyData';


export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, accounts, currency } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: todayStr,
    paymentMode: accounts[0]?.name || 'Paytm / UPI',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    addExpense({
      ...formData,
      amount: Number(formData.amount),
    });
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: todayStr,
      paymentMode: accounts[0]?.name || 'Paytm / UPI',
      notes: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Daily Expense"
      subtitle="Record money spent on food, travel, shopping or other categories"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Expense Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Cafeteria Lunch, Swiggy, Metro Recharge"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Amount ({currency}) *
            </label>
            <input
              type="number"
              placeholder="e.g. 250"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 cursor-pointer"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Payment Mode / Account
            </label>
            <select
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.name}>
                  {acc.name} ({currency}{acc.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Notes / Details (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Split with Amit & Sneha"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-soft transition-all"
          >
            Save Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AddUdhaarModal = ({ isOpen, onClose }) => {
  const { addUdhaar, customers, currency } = useApp();
  const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    type: 'Given', // 'Given' | 'Received'
    amount: '',
    dueDate: defaultDueDate,
    reason: '',
  });

  const handleCustomerChange = (e) => {
    const val = e.target.value;
    const found = customers.find((c) => c.name === val || c.id === val);
    if (found) {
      setFormData({ ...formData, customerName: found.name, customerId: found.id });
    } else {
      setFormData({ ...formData, customerName: val, customerId: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.amount) return;

    addUdhaar({
      ...formData,
      amount: Number(formData.amount),
    });

    setFormData({
      customerName: '',
      customerId: '',
      type: 'Given',
      amount: '',
      dueDate: defaultDueDate,
      reason: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Udhaar Khata Entry"
      subtitle="Record money given to a friend or borrowed from someone"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'Given' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              formData.type === 'Given'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            I Gave (Maine Diya)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'Received' })}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              formData.type === 'Received'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            I Received (Maine Liya)
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Customer / Friend Name *
          </label>
          <input
            type="text"
            list="customers-list"
            placeholder="e.g. Rahul, Amit, Priya"
            value={formData.customerName}
            onChange={handleCustomerChange}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-pink-400"
            required
            autoFocus
          />
          <datalist id="customers-list">
            {customers.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Amount ({currency}) *
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-pink-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Expected Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-pink-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Reason / Purpose
          </label>
          <input
            type="text"
            placeholder="e.g. Room rent advance, emergency medical, trip split"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-pink-400"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-soft transition-all"
          >
            Save Udhaar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AddCustomerModal = ({ isOpen, onClose }) => {
  const { addCustomer, currency } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Friend',
    trustScore: 'High',
    totalUdhaar: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addCustomer({
      ...formData,
      totalUdhaar: Number(formData.totalUdhaar || 0),
    });

    setFormData({
      name: '',
      phone: '',
      email: '',
      role: 'Friend',
      trustScore: 'High',
      totalUdhaar: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer / Contact"
      subtitle="Keep track of friends, flatmates, or business clients"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sneha Reddy"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-sky-400"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Relationship / Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="Friend">Friend</option>
              <option value="Flatmate">Flatmate</option>
              <option value="Colleague">Colleague</option>
              <option value="Vendor">Vendor / Shopkeeper</option>
              <option value="Family">Family Member</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Initial Udhaar ({currency})
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.totalUdhaar}
              onChange={(e) => setFormData({ ...formData, totalUdhaar: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Trust Rating
            </label>
            <select
              value={formData.trustScore}
              onChange={(e) => setFormData({ ...formData, trustScore: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="High">High (Very Reliable)</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-soft transition-all"
          >
            Save Contact
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AddLoanModal = ({ isOpen, onClose, editData }) => {
  const { addLoan, updateLoan, currency, lenderApps } = useApp();
  const defaultDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    loanName: '',
    lenderId: '',
    lender: '',
    totalAmount: '',
    emiAmount: '',
    totalEMIs: 12,
    firstEMIDate: defaultDueDate,
    interestRate: 0,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData(editData);
      } else {
        setFormData({
          loanName: '',
          lenderId: lenderApps.length > 0 ? lenderApps[0].id : '',
          lender: lenderApps.length > 0 ? lenderApps[0].name : '',
          totalAmount: '',
          emiAmount: '',
          totalEMIs: 12,
          firstEMIDate: defaultDueDate,
          interestRate: 0,
          notes: '',
        });
      }
    }
  }, [isOpen, editData, defaultDueDate, lenderApps]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.loanName || !formData.totalAmount || !formData.emiAmount) return;

    if (editData) {
      updateLoan(editData.id, formData);
    } else {
      addLoan(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Loan" : "Create New Loan"}
      subtitle="The system will automatically generate the EMI schedule"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Loan / Asset Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Royal Enfield Bike, iPhone 16"
            value={formData.loanName}
            onChange={(e) => setFormData({ ...formData, loanName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Financier / Bank *
            </label>
            <select
              value={formData.lenderId}
              onChange={(e) => {
                const selectedApp = lenderApps.find(app => app.id === e.target.value);
                setFormData({
                  ...formData,
                  lenderId: e.target.value,
                  lender: selectedApp ? selectedApp.name : ''
                });
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
              required
            >
              <option value="" disabled>Select Bank</option>
              {lenderApps.map(app => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Total Loan ({currency}) *
            </label>
            <input
              type="number"
              placeholder="e.g. 150000"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Monthly EMI ({currency}) *
            </label>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={formData.emiAmount}
              onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Total EMIs (Tenure) *
            </label>
            <input
              type="number"
              value={formData.totalEMIs}
              onChange={(e) => setFormData({ ...formData, totalEMIs: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              First EMI Date *
            </label>
            <input
              type="date"
              value={formData.firstEMIDate}
              onChange={(e) => setFormData({ ...formData, firstEMIDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Notes
            </label>
            <input
              type="text"
              placeholder="Optional"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            {editData ? "Update Loan" : "Create Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditEmiModal = ({ isOpen, onClose, emiData, loanId }) => {
  const { updateEmiStatus, currency } = useApp();

  const [formData, setFormData] = useState({
    amount: '',
    dueDate: '',
    paymentDate: '',
    status: 'Pending',
    paymentMethod: '',
    transactionId: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen && emiData) {
      setFormData({
        amount: emiData.amount,
        dueDate: emiData.dueDate,
        paymentDate: emiData.paymentDate || new Date().toISOString().split('T')[0],
        status: emiData.status,
        paymentMethod: emiData.paymentMethod || 'UPI',
        transactionId: emiData.transactionId || '',
        notes: emiData.notes || '',
      });
    }
  }, [isOpen, emiData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.status !== emiData.status) {
      const confirmMsg = "Are you sure you want to change this EMI status?";
      if (!window.confirm(confirmMsg)) return;
    }
    
    // Call the context function to update
    updateEmiStatus(loanId, emiData.emiId, formData.status, {
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      notes: formData.notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit EMI Details"
      subtitle={`EMI ${emiData?.emiNumber}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              EMI Amount ({currency})
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            >
              <option value="Pending">Pending</option>
              <option value="Advance Paid">Advance Paid</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={formData.paymentDate}
              disabled={formData.status === 'Pending'}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none"
            >
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Txn ID (Optional)
            </label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AddAccountModal = ({ isOpen, onClose }) => {
  const { addAccount, currency } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank',
    accountNumber: '',
    balance: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addAccount({
      ...formData,
      balance: Number(formData.balance || 0),
    });

    setFormData({
      name: '',
      type: 'Bank',
      accountNumber: '',
      balance: '',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Financial Account"
      subtitle="Connect a Bank Account, UPI Wallet, or Cash Ledger"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Account Name *
          </label>
          <input
            type="text"
            placeholder="e.g. SBI Savings, GPay, Emergency Cash"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-400"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="Bank">Bank Account</option>
              <option value="UPI">UPI / Digital Wallet</option>
              <option value="Cash">Physical Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Starting Balance ({currency})
            </label>
            <input
              type="number"
              placeholder="e.g. 10000"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Account Number / UPI ID
          </label>
          <input
            type="text"
            placeholder="e.g. •••• 9821 or user@okhdfcbank"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-400"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            Create Account
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const TransferFundsModal = ({ isOpen, onClose }) => {
  const { accounts, transferFunds, currency } = useApp();
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('ATM Withdrawal / Wallet top-up');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromId || !toId || fromId === toId || !amount) return;

    transferFunds(fromId, toId, Number(amount), note);
    setAmount('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Funds Between Accounts"
      subtitle="Move money between your Bank account, UPI wallet, or Cash"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              From Account
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} disabled={acc.id === toId}>
                  {acc.name} ({currency}{acc.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              To Account
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400 cursor-pointer"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} disabled={acc.id === fromId}>
                  {acc.name} ({currency}{acc.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Amount to Transfer ({currency}) *
          </label>
          <input
            type="number"
            placeholder="e.g. 2000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Transfer Purpose / Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-amber-400"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-soft transition-all"
          >
            Execute Transfer
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditTransactionModal = ({ isOpen, onClose, editData }) => {
  const { updateTransaction, currency } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    account: '',
    status: 'Completed',
  });

  useEffect(() => {
    if (isOpen && editData) {
      setFormData({
        title: editData.title || '',
        amount: editData.amount || '',
        date: editData.date || '',
        category: editData.category || '',
        account: editData.account || '',
        status: editData.status || 'Completed',
      });
    }
  }, [isOpen, editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    updateTransaction(editData.id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Statement"
      subtitle="Update transaction details"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Description
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Amount ({currency})
            </label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold font-mono focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Account/Mode
            </label>
            <input
              type="text"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Advance Payment">Advance Payment</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            Update Statement
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const AddLenderAppModal = ({ isOpen, onClose }) => {
  const { addLenderApp } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    color: 'from-blue-500 to-indigo-600',
    icon: 'Landmark',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    addLenderApp(formData);
    setFormData({ name: '', color: 'from-blue-500 to-indigo-600', icon: 'Landmark' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Loan App"
      subtitle="Register a new financier or loan tracking app"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            App / Financier Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Bajaj Finserv, ZestMoney, HDFC"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            Theme Gradient
          </label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="from-blue-600 to-indigo-700">Blue/Indigo</option>
            <option value="from-rose-500 to-pink-600">Rose/Pink</option>
            <option value="from-amber-500 to-orange-600">Amber/Orange</option>
            <option value="from-emerald-500 to-teal-600">Emerald/Teal</option>
            <option value="from-purple-500 to-fuchsia-600">Purple/Fuchsia</option>
            <option value="from-slate-700 to-slate-900">Dark Slate</option>
          </select>
        </div>

        <div className="pt-3 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-soft transition-all"
          >
            Add Loan App
          </button>
        </div>
      </form>
    </Modal>
  );
};
