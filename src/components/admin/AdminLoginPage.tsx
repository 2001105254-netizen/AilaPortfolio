import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Lock, Mail, KeyRound, ArrowLeft, Shield, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginPageProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onShowToast }) => {
  const { loginAdmin, navigateTo } = usePortfolio();
  const [authMethod, setAuthMethod] = useState<'password' | 'passcode'>('passcode');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    let credentials: { email?: string; password?: string; passcode?: string } = {};

    if (authMethod === 'password') {
      if (!email || !password) {
        setErrorMessage('Please provide both admin email and password.');
        setIsLoading(false);
        return;
      }
      credentials = { email, password };
    } else {
      if (!passcode) {
        setErrorMessage('Please enter the owner passcode.');
        setIsLoading(false);
        return;
      }
      credentials = { passcode };
    }

    const result = await loginAdmin(credentials);
    setIsLoading(false);

    if (result.success) {
      onShowToast('Admin authentication verified. Welcome!', 'success');
      navigateTo('/admin');
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Access denied.');
      onShowToast('Authentication failed', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10"
      >
        {/* Back Link */}
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portfolio</span>
        </button>

        {/* Lock Icon & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Admin Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
            Restricted area for portfolio owner. Server-side session verification required.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setAuthMethod('passcode'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authMethod === 'passcode'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Owner Passcode
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('password'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              authMethod === 'password'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMethod === 'passcode' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Owner Passcode / Master PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.99] mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Authorization...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Protected with server-side crypto token authorization. All changes synchronize live to the permanent database.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
