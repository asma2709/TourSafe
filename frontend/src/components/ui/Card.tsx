import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-zinc-900/80 rounded-xl border border-purple-900/30 shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, accent = 'bg-purple-600', subtitle }: StatCardProps) {
  return (
    <Card className="p-5 hover:border-purple-700/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <div className={`flex items-center justify-center w-11 h-11 rounded-lg text-white shadow-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
