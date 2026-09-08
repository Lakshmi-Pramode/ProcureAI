import { CheckCircle, Clock, AlertCircle, Loader2, type LucideIcon } from 'lucide-react';

interface TimelineStep {
  id: string;
  label: string;
  detail?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  timestamp?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

const statusConfig: Record<string, { icon: LucideIcon; color: string; line: string }> = {
  completed: { icon: CheckCircle, color: 'text-compliant bg-compliant-bg', line: 'bg-compliant' },
  in_progress: { icon: Loader2, color: 'text-primary-500 bg-primary-50', line: 'bg-primary-200' },
  pending: { icon: Clock, color: 'text-text-tertiary bg-surface-tertiary', line: 'bg-border' },
  failed: { icon: AlertCircle, color: 'text-non-compliant bg-non-compliant-bg', line: 'bg-non-compliant' },
};

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className="relative">
      {steps.map((step, i) => {
        const cfg = statusConfig[step.status];
        const Icon = cfg.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
                <Icon className={`w-4 h-4 ${step.status === 'in_progress' ? 'animate-spin' : ''}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-1 ${cfg.line}`} />
              )}
            </div>
            <div className="pt-1 pb-2 min-w-0">
              <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-text-tertiary' : 'text-text-primary'}`}>
                {step.label}
              </p>
              {step.detail && <p className="text-xs text-text-secondary mt-0.5">{step.detail}</p>}
              {step.timestamp && <p className="text-[11px] text-text-tertiary mt-1">{step.timestamp}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
