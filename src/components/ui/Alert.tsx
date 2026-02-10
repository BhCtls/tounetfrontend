import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const styles = {
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    text: 'text-green-800',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
  },
};

export function Alert({
  variant,
  title,
  children,
  className,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [variant, children]);

  if (!isVisible) return null;

  const Icon = icons[variant];
  const style = styles[variant];

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        style.container,
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', style.icon)} />
        </div>
        <div className={cn('ml-3 flex-1', style.text)}>
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={cn('text-sm', title && 'mt-1')}>{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                onDismiss?.();
              }}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                style.icon,
                `hover:bg-${variant === 'error' ? 'red' : variant === 'success' ? 'green' : 'blue'}-100`
              )}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
