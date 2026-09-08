import ProgressBar from './ProgressBar';

interface ComplianceScoreProps {
  score: number;
  size?: 'sm' | 'lg';
  breakdown?: { label: string; value: number }[];
}

export default function ComplianceScore({ score, size = 'lg', breakdown }: ComplianceScoreProps) {
  const radius = size === 'lg' ? 60 : 40;
  const stroke = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const color = score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626';
  const bgColor = score >= 80 ? '#ecfdf5' : score >= 50 ? '#fffbeb' : '#fef2f2';
  const riskLabel = score >= 80 ? 'LOW RISK' : score >= 50 ? 'MEDIUM RISK' : 'HIGH RISK';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle cx={radius + stroke} cy={radius + stroke} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <circle cx={radius + stroke} cy={radius + stroke} r={radius}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-3xl' : 'text-xl'}`} style={{ color }}>{score}</span>
          <span className="text-text-tertiary text-xs">/100</span>
        </div>
      </div>
      <span className="text-xs font-bold mt-2 px-3 py-1 rounded-full" style={{ color, backgroundColor: bgColor }}>
        {riskLabel}
      </span>
      {breakdown && breakdown.length > 0 && (
        <div className="w-full mt-6 space-y-3">
          {breakdown.map(b => (
            <ProgressBar key={b.label} label={b.label} value={b.value} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
