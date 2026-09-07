import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, Unlock, KeyRound, ShieldAlert, X, Check, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess, onShowToast }) => {
  const { verifyAdminPin, adminPin, setAdminPinCode, isAdmin, lockAdmin } = usePortfolio();
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      onShowToast('Please enter the owner passcode', 'error');
      return;
    }

    const verified = await Promise.resolve(verifyAdminPin(pinInput));
    if (verified) {
      onShowToast('Admin Mode unlocked! You can now edit your portfolio.', 'success');
      setPinInput('');
      onSuccess();
    } else {
      onShowToast('Incorrect passcode. Please try again.', 'error');
    }
  };

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      onShowToast('Passcode must be at least 4 characters', 'error');
      return;
    }
    const result = await setAdminPinCode(newPinInput.trim());
    if (result.success) {
      setIsChangingPin(false);
      setNewPinInput('');
      onShowToast(result.message || 'Owner passcode updated successfully!', 'success');
    } else {
      onShowToast(result.message || 'Failed to update passcode', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isAdmin ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {isAdmin ? 'Owner Admin Mode Unlocked' : 'Owner Access Protection'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAdmin ? 'You have full editing access.' : 'Enter your passcode to edit portfolio photos & data.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!isAdmin ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  This area is reserved for the portfolio owner. Enter your secret passcode to unlock editing mode.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Owner Passcode:
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full px-3.5 py-2.5 pl-10 pr-10 text-sm font-mono tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/20"
                >
                  <Unlock className="w-4 h-4" /> Unlock Editor
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Admin Mode is active. All edit buttons and photo upload tools are currently visible to you.
                </span>
              </div>

              {!isChangingPin ? (
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={onSuccess}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Open Editor & Photo Manager
                  </button>
                  <button
                    onClick={() => setIsChangingPin(true)}
                    className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Change Owner Passcode
                  </button>
                  <button
                    onClick={() => {
                      lockAdmin();
                      onShowToast('Admin Mode locked. Visitors now see read-only view.', 'info');
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Lock Admin Mode (Visitor View)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveNewPin} className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Set New Passcode:
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="Enter new 4+ character passcode"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="flex-1 py-1.5 rounded-lg border text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Passcode
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
