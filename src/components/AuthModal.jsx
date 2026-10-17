import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { loginWithGoogle, continueAsGuest } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch {
      alert("Sign-in was cancelled or failed. You can skip and continue as guest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/30 p-6 text-center text-white shadow-2xl">
        <div className="text-3xl mb-2">🏛️</div>
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-300">
          UPSC Secretariat Desk
        </span>
        <h3 className="text-xl font-black mt-1">Officer Identification</h3>
        <p className="text-xs text-slate-400 mt-1">
          Continue with Google to personalize your desk, or skip to start immediately.
        </p>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 font-bold text-xs tracking-wide transition-all active:scale-95 cursor-pointer"
          >
            <span>📧</span>
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <button
            onClick={continueAsGuest}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Skip for now (Officer Trainee)
          </button>
        </div>
      </div>
    </div>
  );
}