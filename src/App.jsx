import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { DailyExpenses } from './pages/DailyExpenses';
import { UdhaarKhata } from './pages/UdhaarKhata';
import { Customers } from './pages/Customers';
import { EmiPayments } from './pages/EmiPayments';
import { AccountStatements } from './pages/AccountStatements';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import {
  AddExpenseModal,
  AddUdhaarModal,
  AddCustomerModal,
  AddEmiModal,
  AddAccountModal,
  TransferFundsModal,
} from './components/AddModals';
import { PasscodeScreen } from './components/PasscodeScreen';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, notification } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [modalState, setModalState] = useState({
    type: null, // 'expense' | 'udhaar' | 'customer' | 'emi' | 'account' | 'transfer'
    isOpen: false,
    data: null,
  });

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  // Render current active page
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onOpenQuickAdd={openModal} />;
      case 'expenses':
        return <DailyExpenses onOpenAddModal={openModal} />;
      case 'udhaar':
        return <UdhaarKhata onOpenAddModal={openModal} />;
      case 'customers':
        return <Customers onOpenAddModal={openModal} />;
      case 'emi':
        return <EmiPayments onOpenAddModal={openModal} />;
      case 'statements':
        return (
          <AccountStatements
            onOpenAddModal={openModal}
            onOpenTransferModal={() => openModal('transfer')}
          />
        );
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onOpenQuickAdd={openModal} />;
    }
  };

  return (
    <div className="min-h-screen ambient-bg-light dark:ambient-bg-dark text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAdd={openModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Interactive Action Modals */}
      <AddExpenseModal
        isOpen={modalState.isOpen && modalState.type === 'expense'}
        onClose={closeModal}
      />
      <AddUdhaarModal
        isOpen={modalState.isOpen && modalState.type === 'udhaar'}
        onClose={closeModal}
      />
      <AddCustomerModal
        isOpen={modalState.isOpen && modalState.type === 'customer'}
        onClose={closeModal}
      />
      <AddEmiModal
        isOpen={modalState.isOpen && modalState.type === 'emi'}
        onClose={closeModal}
        editData={modalState.data}
      />
      <AddAccountModal
        isOpen={modalState.isOpen && modalState.type === 'account'}
        onClose={closeModal}
      />
      <TransferFundsModal
        isOpen={modalState.isOpen && modalState.type === 'transfer'}
        onClose={closeModal}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200"
          >
            {notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            ) : notification.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasscodeScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
