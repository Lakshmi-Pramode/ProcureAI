import { FileText, Eye, Download, RefreshCw } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface DocumentCardProps {
  name: string;
  type: string;
  status: string;
  uploadDate?: string;
  size?: string;
  onView?: () => void;
}

export default function DocumentCard({ name, type, status, uploadDate, size, onView }: DocumentCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md hover:border-border-strong transition-all duration-200 group">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-primary-50 text-primary-500 shrink-0 group-hover:scale-105 transition-transform">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
          <p className="text-xs text-text-tertiary mt-0.5">{type}</p>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={status as any} />
            {uploadDate && <span className="text-[11px] text-text-tertiary">{uploadDate}</span>}
            {size && <span className="text-[11px] text-text-tertiary">{size}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
        <button onClick={onView} className="flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary font-medium transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary font-medium transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Replace
        </button>
      </div>
    </div>
  );
}
