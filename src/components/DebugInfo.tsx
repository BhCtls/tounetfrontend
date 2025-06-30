import React from 'react';

export function DebugInfo() {
  const [debugInfo, setDebugInfo] = React.useState<any>({});

  React.useEffect(() => {
    const checkAPIs = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        location: window.location.href,
      };

      // 测试API连接
      try {
        const response = await fetch('http://localhost:44544/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const data = await response.json();
        info.apiConnection = { status: 'success', data };
      } catch (error) {
        info.apiConnection = { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }

      // 检查localStorage
      info.localStorage = {
        token: localStorage.getItem('token') ? 'exists' : 'missing',
        keys: Object.keys(localStorage)
      };

      setDebugInfo(info);
    };

    checkAPIs();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md z-50 border">
      <h3 className="font-bold text-sm mb-2">调试信息</h3>
      <div className="text-xs space-y-1">
        <div>时间: {debugInfo.timestamp}</div>
        <div>URL: {debugInfo.location}</div>
        <div>API: {debugInfo.apiConnection?.status || '检查中...'}</div>
        <div>Token: {debugInfo.localStorage?.token || '检查中...'}</div>
      </div>
      <details className="mt-2">
        <summary className="text-xs cursor-pointer">详细信息</summary>
        <pre className="text-xs mt-1 overflow-auto max-h-32">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}
