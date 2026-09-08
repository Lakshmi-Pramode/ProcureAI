import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  color?: string;
}

export default function StatCard({ icon, label, value, trend, color = 'text-primary-500' }: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 hover:shadow-lg hover:border-border-strong transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg bg-surface-tertiary ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive ? 'text-compliant bg-compliant-bg' : 'text-non-compliant bg-non-compliant-bg'
          }`}>
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary mt-1">{label}</p>
      </div>
    </div>
  );
}
