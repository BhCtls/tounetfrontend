import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userApi, nkeyApi } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';
import { PermissionBadge } from './PermissionGuard';
import { Users, Settings, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function UserDashboard() {
  const navigate = useNavigate();
  const [accessingApp, setAccessingApp] = useState<string>('');
  const [appStatus, setAppStatus] = useState<Record<string, 'checking' | 'online' | 'offline'>>({});
  const [signingIn, setSigningIn] = useState<boolean>(false);

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['user', 'apps'],
    queryFn: async () => {
      const response = await userApi.getMyApps();
      return response.data;
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;
    },
  });

  // Check app statuses when apps data is loaded
  useEffect(() => {
    if (apps && Array.isArray(apps)) {
      apps.forEach(app => {
        if (app.url) {
          checkAppStatus(app.app_id, app.url);
        }
      });
    }
  }, [apps]);

  const pingUrl = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.status >= 200 && response.status < 404;
    } catch (error) {
      return false;
    }
  };

  const checkAppStatus = async (appId: string, url: string) => {
    setAppStatus(prev => ({ ...prev, [appId]: 'checking' }));
    const isOnline = await pingUrl(url);
    setAppStatus(prev => ({ 
      ...prev, 
      [appId]: isOnline ? 'online' : 'offline' 
    }));
  };

  const handleAppAccess = async (appId: string, appUrl?: string) => {
    if (!appUrl || !user?.username) {
      return;
    }

    setAccessingApp(appId);
    
    try {
      const response = await nkeyApi.generate({
        username: [user.username],
        app_ids: [appId],
      });

      const nkey = response.data.nkey;
      const urlWithNkey = `${appUrl}${appUrl.includes('?') ? '&' : '?'}ntoken=${nkey}`;
      window.location.href = urlWithNkey;
    } catch (error) {
      console.error('Failed to generate NKey for app access:', error);
      alert('Failed to access application. Please try again.');
    } finally {
      setAccessingApp('');
    }
  };

  if (appsLoading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Welcome, {user?.username}!
          </CardTitle>
          <CardDescription>
            管理您的资料和应用访问权限
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{apps?.length || 0}</div>
              <div className="text-sm text-gray-600">Available Apps</div>
            </div>
            <div className="text-center">
              <PermissionBadge level={user?.status || 'disableduser'} />
              <div className="text-sm text-gray-600 mt-1">Account Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatDate(user?.created_at || '')}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button onClick={() => navigate('/apps')} className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Nkey生成和Profile修改
            </Button>
            <Button
              onClick={async () => {
                if (signingIn) return;

                setSigningIn(true);
                try {
                  const resp = await userApi.signin();
                  // If API follows { code, message }
                  if ((resp as any).code === 200) {
                    alert('签到成功: ' + ((resp as any).message || 'success'));
                  } else {
                    alert('签到返回: ' + ((resp as any).message || JSON.stringify(resp)));
                  }
                } catch (err: any) {
                  console.error('签到失败', err);
                  if (err?.response?.data?.message) {
                    alert('签到失败: ' + err.response.data.message);
                  } else {
                    alert('签到请求失败，请检查网络或登录状态');
                  }
                } finally {
                  setSigningIn(false);
                }
              }}
              className="flex-1"
              disabled={signingIn}
            >
              {signingIn ? '签到中...' : '签到'}
            </Button>
          </div>

          {/* Last sign-in info */}
          <div className="mt-3 text-sm text-gray-600">
            {user?.last_sign_in || user?.last_login ? (
              <span>上次签到/登录: {formatDate(user?.last_sign_in || user?.last_login || '')}</span>
            ) : (
              <span>尚未签到或登录记录</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Apps in Index.html Style */}
      <Card>
        <CardHeader>
          <CardTitle>跳转到应用</CardTitle>
          <CardDescription>
            点击应用图标直接登录访问，系统会自动生成15分钟有效期的访问密钥
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="grid gap-5 p-5"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            }}
          >
            {apps?.map((app: any) => (
              <div
                key={app.id}
                className={`app-button bg-white/90 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:bg-white/95 flex flex-col items-center justify-center text-center font-bold ${
                  accessingApp === app.app_id ? 'opacity-50 pointer-events-none' : ''
                }`}
                onClick={() => app.url && accessingApp !== app.app_id && handleAppAccess(app.app_id, app.url)}
                style={{
                  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  minHeight: '120px'
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xl">🎮</span>
                  {app.url && (
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                  )}
                  {accessingApp === app.app_id && (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${
                    !app.url 
                      ? 'bg-gray-400'
                      : appStatus[app.app_id] === 'checking' 
                        ? 'bg-yellow-400 animate-pulse'
                        : appStatus[app.app_id] === 'online' 
                          ? 'bg-green-400'
                          : 'bg-red-400'
                  }`} />
                </div>
                
                <span className="text-sm mb-2">{app.name}</span>
                <span className="text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                  {app.app_id}
                </span>
                <p className="text-xs text-gray-600 mt-1 text-center">{app.description}</p>
                
                {accessingApp === app.app_id && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs">登录中...</span>
                  </div>
                )}
                
                {app.url && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkAppStatus(app.app_id, app.url);
                      }}
                      title="刷新状态"
                      disabled={appStatus[app.app_id] === 'checking'}
                    >
                      <RefreshCw className={`w-3 h-3 ${appStatus[app.app_id] === 'checking' ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                )}
                
                {!app.url && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    No direct access URL configured
                  </div>
                )}
              </div>
            ))}
          </div>
          {!apps?.length && (
            <div className="text-center py-8 text-gray-500">
              No applications available for your account.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
