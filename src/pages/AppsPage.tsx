import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi, nkeyApi, adminApi } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loading } from '../components/ui/Loading';
import { Key, User, Copy, Check, RefreshCw, Smartphone } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';

const updateProfileSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  pushdeer_token: z.string().optional(),
});

const generateNKeySchema = z.object({
  username: z.string().min(1, 'Username is required'),
  app_ids: z.string().min(1, 'At least one app must be selected'),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
type GenerateNKeyForm = z.infer<typeof generateNKeySchema>;

export function AppsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copiedNKey, setCopiedNKey] = useState<string>('');
  const [generatedNKey, setGeneratedNKey] = useState<string>('');
  const [accessingApp, setAccessingApp] = useState<string>('');
  const [appStatus, setAppStatus] = useState<Record<string, 'checking' | 'online' | 'offline'>>({});

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['user', 'apps'],
    queryFn: async () => {
      const response = await userApi.getMyApps();
      return response.data;
    },
  });

  const updateProfileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phone: user?.phone || '',
      pushdeer_token: user?.pushdeer_token || '',
    },
  });

  const generateNKeyForm = useForm<GenerateNKeyForm>({
    resolver: zodResolver(generateNKeySchema),
    defaultValues: {
      username: user?.username || '',
      app_ids: '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateMe,
  });

  const generateNKeyMutation = useMutation({
    mutationFn: nkeyApi.generate,
    onSuccess: (response: any) => {
      setGeneratedNKey(response.data.nkey);
      generateNKeyForm.reset();
    },
  });

  const onUpdateProfile = (data: UpdateProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const onGenerateNKey = async (data: GenerateNKeyForm) => {
    const isTrusted = user?.status === 'trusted' || user?.status === 'admin';

    try {
      let response;
      if (isTrusted) {
        response = await adminApi.generateNKey({
          username: data.username,
          app_ids: data.app_ids.split(',').map(id => id.trim()),
        });
      } else {
        response = await nkeyApi.generate({
          username: [data.username],
          app_ids: data.app_ids.split(',').map(id => id.trim()),
        });
      }

      setGeneratedNKey(response.data.nkey);
      generateNKeyForm.reset({
        username: isTrusted ? '' : user?.username || '',
        app_ids: '',
      });
    } catch (error) {
      console.error('Failed to generate NKey:', error);
      alert('Failed to generate NKey. Please check the username and try again.');
    }
  };

  const handleCopyNKey = async (nkey: string) => {
    await copyToClipboard(nkey);
    setCopiedNKey(nkey);
    setTimeout(() => setCopiedNKey(''), 2000);
  };

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
    return <Loading text="Loading applications..." />;
  }

  return (
    <PageLayout backgroundImage="bg.png">
      <PageHeader
        title="应用管理"
        subtitle={user?.username}
        showBack
        backText="返回主页"
        onBack={() => navigate('/')}
        actions={
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="w-4 h-4" />
            <span>{user?.username}</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Apps Grid in Index.html Style */}
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
                    <span className="text-xl">{app.emoji || '🎮'}</span>
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

                  {accessingApp === app.app_id && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-xs">登录中...</span>
                    </div>
                  )}

                  {app.url && (
                    <div className="mt-2 flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          checkAppStatus(app.app_id, app.url);
                        }}
                        title="检查状态"
                        disabled={appStatus[app.app_id] === 'checking'}
                      >
                        <RefreshCw className={`w-3 h-3 ${appStatus[app.app_id] === 'checking' ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!apps?.length && (
              <div className="text-center py-8 text-gray-500">
                没有可用的应用
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                个人资料修改
              </CardTitle>
              <CardDescription>
                更新联系信息和通知设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <Input
                  label="手机号码"
                  {...updateProfileForm.register('phone')}
                  error={updateProfileForm.formState.errors.phone?.message}
                />
                <Input
                  label="PushDeer Token (可选)"
                  {...updateProfileForm.register('pushdeer_token')}
                  error={updateProfileForm.formState.errors.pushdeer_token?.message}
                  placeholder="PUSHDEER_XXXXXXXXX"
                />
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? '更新中...' : '更新资料'}
                </Button>
                {updateProfileMutation.isSuccess && (
                  <p className="text-sm text-green-600">资料更新成功！</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* NKey Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Nkey生成
                {(user?.status === 'trusted' || user?.status === 'admin') && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    信任用户
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {(user?.status === 'trusted' || user?.status === 'admin')
                  ? '为任何用户及其应用生成临时访问密钥'
                  : '为您的应用生成临时访问密钥'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateNKeyForm.handleSubmit(onGenerateNKey)} className="space-y-4">
                <Input
                  label={
                    (user?.status === 'trusted' || user?.status === 'admin')
                      ? "目标用户名"
                      : "用户名"
                  }
                  {...generateNKeyForm.register('username')}
                  error={generateNKeyForm.formState.errors.username?.message}
                  readOnly={!(user?.status === 'trusted' || user?.status === 'admin')}
                  placeholder={
                    (user?.status === 'trusted' || user?.status === 'admin')
                      ? "输入任何用户名"
                      : user?.username
                  }
                />
                <Input
                  label="应用ID (逗号分隔)"
                  {...generateNKeyForm.register('app_ids')}
                  error={generateNKeyForm.formState.errors.app_ids?.message}
                  placeholder="searchall, CardPreview"
                />
                <Button
                  type="submit"
                  disabled={generateNKeyMutation.isPending}
                >
                  {generateNKeyMutation.isPending ? '生成中...' : '生成Nkey'}
                </Button>
              </form>

              {generatedNKey && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Nkey已生成:</p>
                      <code className="text-sm text-green-700 break-all">{generatedNKey}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyNKey(generatedNKey)}
                    >
                      {copiedNKey === generatedNKey ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    此密钥将在15分钟后过期，请立即复制！
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
