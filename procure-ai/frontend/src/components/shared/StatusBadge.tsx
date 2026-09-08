type BadgeVariant = 'draft' | 'active' | 'published' | 'under_evaluation' | 'completed' | 'cancelled' |
  'compliant' | 'non_compliant' | 'manual_review' |
  'verified' | 'pending' | 'failed' | 'missing' | 'warning' | 'processing' | 'uploaded' | 'extracting' | 'ready';

const styles: Record<string, string> = {
  draft: 'bg-surface-tertiary text-text-secondary border-border',
  active: 'bg-primary-50 text-primary-600 border-primary-200',
  published: 'bg-primary-50 text-primary-600 border-primary-200',
  under_evaluation: 'bg-manual-review-bg text-manual-review border-manual-review-border',
  completed: 'bg-compliant-bg text-compliant border-compliant-border',
  cancelled: 'bg-non-compliant-bg text-non-compliant border-non-compliant-border',
  compliant: 'bg-compliant-bg text-compliant border-compliant-border',
  non_compliant: 'bg-non-compliant-bg text-non-compliant border-non-compliant-border',
  manual_review: 'bg-manual-review-bg text-manual-review border-manual-review-border',
  verified: 'bg-compliant-bg text-compliant border-compliant-border',
  ready: 'bg-compliant-bg text-compliant border-compliant-border',
  pending: 'bg-manual-review-bg text-manual-review border-manual-review-border',
  failed: 'bg-non-compliant-bg text-non-compliant border-non-compliant-border',
  missing: 'bg-non-compliant-bg text-non-compliant border-non-compliant-border',
  warning: 'bg-manual-review-bg text-manual-review border-manual-review-border',
  processing: 'bg-primary-50 text-primary-600 border-primary-200',
  uploaded: 'bg-surface-tertiary text-text-secondary border-border',
  extracting: 'bg-primary-50 text-primary-600 border-primary-200',
};

const labels: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  published: 'Published',
  under_evaluation: 'Evaluation',
  completed: 'Completed',
  cancelled: 'Cancelled',
  compliant: 'Compliant',
  non_compliant: 'Non-Compliant',
  manual_review: 'Review Required',
  verified: 'Verified',
  ready: 'Verified',
  pending: 'Pending',
  failed: 'Failed',
  missing: 'Missing',
  warning: 'Warning',
  processing: 'Processing',
  uploaded: 'Uploaded',
  extracting: 'Extracting',
};

interface StatusBadgeProps {
  status: BadgeVariant;
  size?: 'sm' | 'md';
  customLabel?: string;
}

export default function StatusBadge({ status, size = 'sm', customLabel }: StatusBadgeProps) {
  const style = styles[status] || styles.draft;
  const label = customLabel || labels[status] || status;
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium whitespace-nowrap ${style} ${
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        style.includes('compliant') && !style.includes('non') ? 'bg-compliant' :
        style.includes('non-compliant') || style.includes('non_compliant') ? 'bg-non-compliant' :
        style.includes('manual-review') ? 'bg-manual-review' :
        style.includes('primary') ? 'bg-primary-500' :
        'bg-text-tertiary'
      }`} />
      {label}
    </span>
  );
}
