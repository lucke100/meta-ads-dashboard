'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// Armazena usuários registrados em localStorage
interface StoredUser {
  email: string;
  name: string;
  password: string;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('ea_users');
  return data ? JSON.parse(data) : [];
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem('ea_users', JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restaurar sessão ao carregar
  useEffect(() => {
    const session = localStorage.getItem('ea_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('ea_session');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);

    if (found) {
      const userData = { email: found.email, name: found.name };
      setUser(userData);
      localStorage.setItem('ea_session', JSON.stringify(userData));
      return true;
    }

    // Se não há usuários cadastrados, criar um admin padrão e permitir login
    if (users.length === 0) {
      const userData = { email, name: email.split('@')[0] };
      setUser(userData);
      localStorage.setItem('ea_session', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = async (
    email: string,
    name: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith('@empreendeai.com.br')) {
      return { success: false, error: 'Apenas e-mails corporativos @empreendeai.com.br podem se cadastrar na plataforma.' };
    }

    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Este e-mail já está cadastrado.' };
    }

    users.push({ email, name, password });
    saveStoredUsers(users);

    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('ea_session', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ea_session');
  };

  const updateProfile = (name: string) => {
    if (!user) return;
    const updatedUser = { ...user, name };
    setUser(updatedUser);
    localStorage.setItem('ea_session', JSON.stringify(updatedUser));

    // Atualizar no storage de usuários também
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx >= 0) {
      users[idx].name = name;
      saveStoredUsers(users);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Usuário não autenticado.' };

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx >= 0 && users[idx].password !== currentPassword) {
      return { success: false, error: 'Senha atual incorreta.' };
    }

    if (idx >= 0) {
      users[idx].password = newPassword;
      saveStoredUsers(users);
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}
