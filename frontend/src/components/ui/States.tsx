import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <p className="text-zinc-400 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-medium text-purple-400 border border-purple-700/50 rounded-lg hover:bg-purple-950/50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-10 h-10 text-zinc-700 mb-3" />
      <p className="text-zinc-500 font-medium">{message}</p>
    </div>
  );
}
