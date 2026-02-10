import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LoadingSpinner } from './ui/Loading';
import { cn } from '../lib/utils';

interface StatusPageProps {
  status: 'loading' | 'success' | 'error';
  title?: string;
  message?: string;
  loadingText?: string;
  errorCode?: string;
  onRetry?: () => void;
  onBack?: () => void;
  backText?: string;
  className?: string;
}

export function StatusPage({
  status,
  title,
  message,
  loadingText = 'Loading...',
  errorCode,
  onRetry,
  onBack,
  backText = 'Go Back',
  className,
}: StatusPageProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4',
        className
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Processing...'}
            {status === 'success' && title}
            {status === 'error' && title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
          {status === 'loading' && (
            <>
              <LoadingSpinner size="lg" className="text-blue-500" />
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                {loadingText}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 mb-2" />
                {message && <p className="text-center">{message}</p>}
              </div>
              {onBack && (
                <Button onClick={onBack} variant="outline" className="w-full">
                  {backText}
                </Button>
              )}
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 flex flex-col items-center">
                <AlertCircle className="h-12 w-12 mb-2" />
                {message && <p className="text-center">{message}</p>}
                {errorCode && (
                  <p className="text-xs text-gray-400 mt-2">Error: {errorCode}</p>
                )}
              </div>
              <div className="flex gap-3 w-full">
                {onRetry && (
                  <Button onClick={onRetry} className="flex-1">
                    Try Again
                  </Button>
                )}
                {onBack && (
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    {backText}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
