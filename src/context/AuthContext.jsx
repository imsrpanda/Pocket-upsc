import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const AuthContext = createContext();

// Web Client ID (matches capacitor.config.json, AndroidManifest.xml, and strings.xml)
const GOOGLE_WEB_CLIENT_ID = '444455458285-a8l168mpsbv241r5o4c4vt7ae6g3qfkh.apps.googleusercontent.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('pocketUPSC_guestMode') === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Native Plugin Initialization
    if (Capacitor.isNativePlatform()) {
      console.log('[Auth] Initializing GoogleAuth plugin for native platform...');
      GoogleAuth.initialize({
        clientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
        grantOfflineAccess: false,
      });
    }

    // 2. Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('[Auth] onAuthStateChanged fired. User:', currentUser ? currentUser.email : 'null');
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        localStorage.removeItem('pocketUPSC_guestMode');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        console.log('[Auth] Starting Native Google Sign-In...');
        
        // Step A: Trigger Android Google Account Picker
        const googleUser = await GoogleAuth.signIn();
        console.log('[Auth] Native Google Sign-In raw response:', JSON.stringify(googleUser));

        const idToken = googleUser.authentication?.idToken;
        if (!idToken) {
          alert('[Auth Error] No ID Token received from Google Sign-In');
          throw new Error('No ID Token received from Google Sign-In');
        }

        console.log('[Auth] Received idToken, length:', idToken.length);

        // Step B: Handshake with Firebase Auth
        console.log('[Auth] Exchanging token with Firebase Auth...');
        const credential = GoogleAuthProvider.credential(idToken);
        const res = await signInWithCredential(auth, credential);

       
        
        return res.user;
      } else {
        // Web browser development fallback
        console.log('[Auth] Triggering Web signInWithPopup...');
        const res = await signInWithPopup(auth, googleProvider);
        return res.user;
      }
    } catch (err) {
      console.error('[Auth Error] Full sign-in error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      alert(`[Sign-in Error] ${err.code || ''}: ${err.message || JSON.stringify(err)}`);
      throw err;
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('pocketUPSC_guestMode', 'true');
  };

  const logout = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await GoogleAuth.signOut();
      }
    } catch (err) {
      console.warn('[Auth Warning] Native Google signout warning:', err);
    }
    await signOut(auth);
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('pocketUPSC_guestMode');
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, loginWithGoogle, continueAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);