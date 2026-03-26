'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  FileImage,
  Users,
  GitCompareArrows,
  FileBarChart,
  BellRing,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
  { href: '/dashboard/campaigns', label: 'Campanhas', icon: Megaphone },
  { href: '/dashboard/adsets', label: 'Conjuntos', icon: Layers },
  { href: '/dashboard/ads', label: 'Anúncios', icon: FileImage },
  { href: '/dashboard/leads', label: 'Leads / Conversões', icon: Users },
  { href: '/dashboard/compare', label: 'Comparação', icon: GitCompareArrows },
  { href: '/dashboard/reports', label: 'Relatórios', icon: FileBarChart },
  { href: '/dashboard/alerts', label: 'Alertas e Insights', icon: BellRing },
  { href: '/dashboard/integrations', label: 'Integrações', icon: Plug },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={`sidebar fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <img
          src="https://empreendeai.com.br/wp-content/uploads/2025/02/LOGO-EA_BRANCO.png"
          alt="Empreende Aí"
          className={`transition-all duration-300 ${collapsed ? 'w-10 h-10 object-contain' : 'h-9 w-auto'}`}
        />
        {!collapsed && (
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-bold text-xs text-white whitespace-nowrap">Dashboard</span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">Meta Ads Pro</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {user && (
          <div className={`flex items-center gap-2 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.name || 'Usuário'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link flex-1 justify-center"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-sm">Recolher</span>}
          </button>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="sidebar-link justify-center px-3 hover:text-red-400"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
