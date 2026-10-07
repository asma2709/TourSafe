import { type ReactNode } from 'react';

const colorMap: Record<string, string> = {
  ACTIVE: 'bg-red-500/20 text-red-300 border-red-500/40',
  RESOLVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  DISPATCHED: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  COMPLETED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  IN_PROGRESS: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  CANCELLED: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/40',
  INCOME: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  EXPENSE: 'bg-red-500/20 text-red-300 border-red-500/40',
  ASSET: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  LIABILITY: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

interface BadgeProps {
  status: string;
  children?: ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const colors = colorMap[status?.toUpperCase()] || 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors}`}>
      {children || status}
    </span>
  );
}
