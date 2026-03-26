'use client';

import Sidebar from '@/components/Sidebar';
import TokenCountdown from '@/components/TokenCountdown';
import { FilterProvider } from '@/components/GlobalFilters';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-[260px] transition-all duration-300 flex flex-col min-h-screen">
          {/* Top bar with token countdown */}
          <div className="flex items-center justify-end px-6 py-2 border-b border-white/5">
            <TokenCountdown />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
            {children}
          </div>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-white/5 text-center">
            <p className="text-[11px] text-slate-600">
              Built with technology and strategically designed by{' '}
              <span className="text-slate-500 font-medium">People Digital Culture</span>
            </p>
          </footer>
        </main>
      </div>
    </FilterProvider>
  );
}
