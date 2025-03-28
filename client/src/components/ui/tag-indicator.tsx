import { cn } from '@/lib/utils';

interface TagIndicatorProps {
  status: string;
  value?: string;
}

export default function TagIndicator({ status, value }: TagIndicatorProps) {
  const getStatusClasses = () => {
    switch(status) {
      case 'good':
        return 'bg-success bg-opacity-10 text-success';
      case 'warning':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'missing':
      case 'error':
        return 'bg-danger bg-opacity-10 text-danger';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = () => {
    if (value) return value;
    
    switch(status) {
      case 'good':
        return 'Good';
      case 'warning':
        return 'Warning';
      case 'missing':
        return 'Missing';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
        getStatusClasses()
      )}
    >
      {getStatusText()}
    </span>
  );
}
