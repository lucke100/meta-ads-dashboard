'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

// Data de expiração do token: 24 de maio de 2026
const TOKEN_EXPIRY = new Date('2026-05-24T23:59:59-03:00');

export default function TokenCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      const diff = TOKEN_EXPIRY.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    update();
    const interval = setInterval(update, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const isUrgent = timeLeft.days <= 7;
  const isWarning = timeLeft.days <= 14;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        isUrgent
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : isWarning
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : 'bg-slate-500/10 text-slate-400 border-slate-500/15'
      }`}
    >
      {isUrgent ? <AlertTriangle size={12} /> : <Clock size={12} />}
      <span>
        Token expira em{' '}
        <strong>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </strong>
      </span>
    </div>
  );
}
