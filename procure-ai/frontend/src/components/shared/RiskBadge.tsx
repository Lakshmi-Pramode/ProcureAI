import type { RiskLevel } from '../../types';
import { AlertTriangle, AlertCircle, ShieldAlert, Shield } from 'lucide-react';

const config: Record<string, { bg: string; text: string; icon: typeof Shield; label: string }> = {
  low: { bg: 'bg-compliant-bg border-compliant-border', text: 'text-compliant', icon: Shield, label: 'Low Risk' },
  medium: { bg: 'bg-manual-review-bg border-manual-review-border', text: 'text-manual-review', icon: AlertTriangle, label: 'Medium Risk' },
  high: { bg: 'bg-non-compliant-bg border-non-compliant-border', text: 'text-non-compliant', icon: AlertCircle, label: 'High Risk' },
  critical: { bg: 'bg-non-compliant-bg border-non-compliant-border', text: 'text-non-compliant', icon: ShieldAlert, label: 'Critical' },
};

interface RiskBadgeProps {
  level: RiskLevel | 'critical';
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ level, showIcon = true, size = 'sm' }: RiskBadgeProps) {
  const c = config[level] || config.low;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${c.bg} ${c.text} ${
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    }`}>
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {c.label}
    </span>
  );
}
