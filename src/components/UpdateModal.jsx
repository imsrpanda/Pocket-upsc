import React, { useEffect, useState } from 'react';
import { dbFirestore, doc, getDoc } from '../firebase';
import { CURRENT_APP_VERSION } from '../config/appVersion';

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Hours
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.imsrpanda.pocketupsc";

export default function UpdateModal() {
  const [latestVersion, setLatestVersion] = useState(null);

  useEffect(() => {
    const verifyAppVersion = async () => {
      try {
        const lastChecked = localStorage.getItem('pocketUPSC_lastVersionCheck');
        const now = Date.now();

        // 1. If checked within the last 24 hours, skip network read completely
        if (lastChecked && now - parseInt(lastChecked, 10) < CHECK_INTERVAL_MS) {
          return;
        }

        // 2. Fetch the remote document from Firestore
        const docRef = doc(dbFirestore, 'appConfig', 'versionInfo');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const remoteVersion = docSnap.data()?.latestVersion;

          // Record this check's timestamp
          localStorage.setItem('pocketUPSC_lastVersionCheck', now.toString());

          // 3. Compare with local build version
          if (remoteVersion && remoteVersion !== CURRENT_APP_VERSION) {
            setLatestVersion(remoteVersion);
          }
        }
      } catch (err) {
        console.error("Version check error:", err);
      }
    };

    verifyAppVersion();
  }, []);

  if (!latestVersion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-6 text-center text-white shadow-2xl">
        <div className="text-4xl mb-2">🚀</div>
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-300">
          UPSC Secretariat Update
        </span>
        <h3 className="text-xl font-black mt-1">New Version Available</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          A new version of <b>pocketUPSC</b> is ready on the Play Store with updated syllabus revisions, PYQs, and fixes.
        </p>

        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>Current: v{CURRENT_APP_VERSION}</span>
          <span>➔</span>
          <span className="text-emerald-400 font-bold">Latest: v{latestVersion}</span>
        </div>

        <div className="mt-6 space-y-2.5">
          {/* Hardcoded Play Store Destination */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 text-amber-200 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95"
          >
            <span>📲 Update on Google Play</span>
          </a>

          
        </div>
      </div>
    </div>
  );
}