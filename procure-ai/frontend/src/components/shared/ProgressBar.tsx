interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ value, max = 100, label, showValue = true, color, size = 'sm' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = color || (pct >= 80 ? 'bg-compliant' : pct >= 50 ? 'bg-manual-review' : 'bg-non-compliant');

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-text-primary">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-surface-tertiary rounded-full overflow-hidden ${size === 'sm' ? 'h-2' : 'h-3'}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
