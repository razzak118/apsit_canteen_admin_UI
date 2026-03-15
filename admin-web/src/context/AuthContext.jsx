import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogin, adminSignup, getCurrentUser } from '../api/auth';
import { authStorage } from '../lib/storage';
import { decodeJwt } from '../lib/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => authStorage.get());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = auth?.jwt ? decodeJwt(auth.jwt)?.role : null;
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      if (!auth?.jwt) {
        setLoading(false);
        return;
      }
      try {
        const user = await getCurrentUser();
        if (mounted) setProfile(user);
      } catch {
        logout();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth);
    authStorage.set(nextAuth);
  };

  const login = async ({ username, password }) => {
    const data = await adminLogin({ username, password });
    const nextAuth = {
      jwt: data.jwt,
      refreshToken: data.refreshToken,
      userId: data.userId,
    };
    saveAuth(nextAuth);

    const user = await getCurrentUser();
    setProfile(user);

    const tokenRole = decodeJwt(data.jwt)?.role;
    if (tokenRole !== 'ADMIN') {
      logout();
      throw new Error('Only ADMIN role can access this panel.');
    }

    return user;
  };

  const signupAdmin = async ({ username, password, mobileNumber }) => {
    await adminSignup({ username, password, mobileNumber, role: 'ADMIN' });
  };

  const logout = () => {
    setAuth(null);
    setProfile(null);
    authStorage.clear();
  };

  const value = useMemo(
    () => ({
      auth,
      profile,
      isAuthenticated: Boolean(auth?.jwt),
      isAdmin,
      loading,
      login,
      signupAdmin,
      logout,
    }),
    [auth, isAdmin, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
