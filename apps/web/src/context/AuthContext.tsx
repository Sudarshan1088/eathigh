import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile, RegisterBody, LoginBody } from "@eathigh/shared";
import { registerUser, loginUser, getMe } from "../api/auth";
import { setToken, getToken } from "../api/client";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (body: LoginBody) => Promise<string | null>;
  register: (body: RegisterBody) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a saved token and fetch user
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            setToken(null);
          }
        })
        .catch(() => setToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (body: LoginBody): Promise<string | null> => {
    const res = await loginUser(body);
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return null; // no error
    }
    return res.error || "Login failed";
  }, []);

  const register = useCallback(async (body: RegisterBody): Promise<string | null> => {
    const res = await registerUser(body);
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return null;
    }
    return res.error || "Registration failed";
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await getMe();
    if (res.success && res.data) {
      setUser(res.data);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
