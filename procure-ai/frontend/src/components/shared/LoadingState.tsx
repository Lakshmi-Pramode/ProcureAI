import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
