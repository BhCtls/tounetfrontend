import React from 'react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
      console.error('Global error caught:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(new Error(event.reason?.message || 'Unhandled promise rejection'));
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                应用程序遇到错误
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {error.message}
            </p>
          </div>
          <div className="mb-4">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer">显示错误详情</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
            </details>
          </div>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            重新加载页面
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
