import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { loginUser, registerUser, getProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(session?.user && user);

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession?.user) {
        try { setUser(await getProfile(currentSession.user.id)); } catch { setUser(null); }
      }
      setLoading(false);
    };
    loadSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession?.user) {
        try { setUser(await getProfile(nextSession.user.id)); } catch { setUser(null); }
      } else setUser(null);
      setLoading(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    setSession(data.session);
    const profile = await getProfile(data.user.id);
    setUser(profile);
    return profile;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    if (!data.session) return { requiresEmailConfirmation: true };
    setSession(data.session);
    const profile = await getProfile(data.user.id);
    setUser(profile);
    return profile;
  };

  const logout = () => {
    supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, session, token: session?.access_token || '', loading, isAuthenticated, login, register, logout, setUser }), [user, session, loading, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
