'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Settings, User, Lock, Check, AlertCircle, Mail, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, updatePassword } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!name.trim()) {
      setProfileMsg({ type: 'error', text: 'O nome não pode estar vazio.' });
      return;
    }
    updateProfile(name.trim());
    setProfileMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Informe a senha atual.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 3000);
    } else {
      setPasswordMsg({ type: 'error', text: result.error || 'Erro ao alterar senha.' });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Configurações</h1>
        <p className="text-sm text-slate-400">Gerencie seu perfil e segurança</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
              <User size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Perfil do Usuário</h3>
              <p className="text-xs text-slate-500">Informações da sua conta</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/3 border border-white/5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">
                {name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{name || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{email}</p>
            </div>
          </div>

          {/* Name field */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome Completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 pl-10 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-1">O e-mail não pode ser alterado</p>
            </div>
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-xs ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {profileMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
              {profileMsg.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            className="w-full mt-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/10"
          >
            Salvar Alterações
          </button>
        </div>

        {/* Alteração de Senha */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
              <Lock size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Segurança</h3>
              <p className="text-xs text-slate-500">Altere sua senha de acesso</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Senha Atual</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/40 transition-colors"
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nova Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/40 transition-colors"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmar Nova Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-xs ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {passwordMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
              {passwordMsg.text}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            className="w-full mt-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/10"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
