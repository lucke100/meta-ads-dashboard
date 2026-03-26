'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!email.endsWith('@empreendeai.com.br')) {
          setError('Apenas e-mails corporativos @empreendeai.com.br podem se cadastrar na plataforma.');
          setLoading(false);
          return;
        }
        if (!name.trim()) {
          setError('Informe seu nome completo.');
          setLoading(false);
          return;
        }
        const result = await register(email, name, password);
        if (!result.success) {
          setError(result.error || 'Erro ao cadastrar.');
          setLoading(false);
          return;
        }
        router.push('/dashboard');
      } else {
        const success = await login(email, password);
        if (success) {
          router.push('/dashboard');
        } else {
          setError('E-mail ou senha inválidos.');
          setLoading(false);
        }
      }
    } catch {
      setError('Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://empreendeai.com.br/wp-content/uploads/2025/02/LOGO-EA_BRANCO.png"
              alt="Empreende Aí"
              className="h-14 w-auto mb-4"
            />
            <h1 className="text-lg font-bold text-white text-center">
              Empreende Aí <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Meta Ads Pro</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - register only */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Seu nome completo"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder={mode === 'register' ? 'seu@empreendeai.com.br' : 'seu@email.com'}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>
              {mode === 'register' && (
                <p className="text-[10px] text-slate-500 mt-1">Apenas e-mails @empreendeai.com.br</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-0 focus:ring-offset-0" />
                  <span className="text-xs text-slate-400">Lembrar-me</span>
                </label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'login' ? 'Entrando...' : 'Cadastrando...'}
                </span>
              ) : mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-400">
                Não tem conta?{' '}
                <button onClick={() => { setMode('register'); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Já tem conta?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6">
          Built with technology and strategically designed by{' '}
          <span className="text-slate-500">People Digital Culture</span>
        </p>
      </div>
    </div>
  );
}
