import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { userApi, nkeyApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LogIn, User, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import type { App } from '../types/api';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function HomePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);
  const [accessingApp, setAccessingApp] = useState<string>('');

  // 获取用户可用的应用列表
  const { data: apiApps, isLoading: appsLoading } = useQuery({
    queryKey: ['user', 'apps'],
    queryFn: async () => {
      const response = await userApi.getMyApps();
      return response.data;
    },
    enabled: !!user, // 只有登录用户才获取应用列表
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response: any) => {
      login(response.data.token);
      // Stay on homepage after login
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
    },
  });

  // 处理应用访问 - API应用（需要ntoken）
  const handleApiAppAccess = async (app: App) => {
    if (!app.url || !user?.username) {
      return;
    }

    setAccessingApp(app.app_id);
    
    try {
      const response = await nkeyApi.generate({
        username: [user.username],
        app_ids: [app.app_id],
      });

      const nkey = response.data.nkey;
      const urlWithNkey = `${app.url}${app.url.includes('?') ? '&' : '?'}ntoken=${nkey}`;
      window.location.href = urlWithNkey;
    } catch (error) {
      console.error('Failed to generate NKey for app access:', error);
      alert('Failed to access application. Please try again.');
    } finally {
      setAccessingApp('');
    }
  };

  // 处理静态应用访问（不需要ntoken）
  const handleStaticAppAccess = (app: any) => {
    if (app.requireAuth && !user) {
      alert('请先登录后访问此功能');
      return;
    }
    window.location.href = app.url;
  };

  // 生成应用的显示图标（优先使用emoji，静态应用用预设emoji，API应用用emoji或首字母）
  const getAppIcon = (app: any) => {
    if (app.isStatic) {
      return app.emoji;
    }
    // API应用优先使用emoji字段，没有emoji时使用首字母
    if (app.apiApp?.emoji) {
      return app.apiApp.emoji;
    }
    return app.name?.charAt(0) || '📱';
  };

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const apps = [
    {
      name: '博客（不定期更新）',
      emoji: '✍️',
      url: '/sjkblog',
      description: '个人博客，不定期更新各种内容',
      isStatic: true
    },
    {
      name: '三角葵reve',
      emoji: '📁',
      url: '/live',
      description: '音乐相关内容',
      isStatic: true
    },
    {
      name: 'Nkey申请',
      emoji: '🔑',
      url: '/frontend',
      description: '申请访问密钥',
      requireAuth: true,
      isStatic: true
    },
    {
      name: '音游数据库查询',
      emoji: '📊',
      url: '/searchallv3',
      description: '查询音游相关数据',
      isStatic: true
    }
  ];

  const toolApps = [
    {
      name: '预算检查器',
      emoji: '💰',
      url: '/tools/BudgetChecker.html',
      description: '检查和管理预算',
      isStatic: true
    },
    {
      name: 'dxpass渲染器',
      emoji: '🌸',
      url: '/tools/dxprender.html',
      description: '生成dxpass图片',
      isStatic: true
    },
    {
      name: '语法填空生成器',
      emoji: '📄',
      url: '/wxtk/',
      description: '生成语法填空练习',
      isStatic: true
    },
    {
      name: '部分解包资源查找',
      emoji: '🐰',
      url: '/segaassets/',
      description: '查找游戏资源文件',
      isStatic: true
    },
    {
      name: '音撃風卡面预览',
      emoji: '🃏',
      url: '/card-preview/CardPreview.html',
      description: '预览卡片设计',
      isStatic: true
    },
    {
      name: '赞助我……',
      emoji: '🥺',
      url: '/pages/basic/sponsor.html',
      description: '支持开发者',
      isStatic: true
    },
    {
      name: '安装应用',
      emoji: '📱',
      url: '/pwa/install.html',
      description: '安装PWA应用',
      isStatic: true
    },
    {
      name: 'Null Definition',
      emoji: '🚫',
      url: '/scoresheet/',
      description: '暂时未定义功能',
      isStatic: true
    }
  ];

  // 合并静态应用和API应用
  const allBasicApps = [
    ...apps.map(app => ({ ...app, app_id: undefined, apiApp: undefined })),
    ...(user && apiApps || []).map((app: App) => ({
      name: app.name,
      emoji: app.emoji || app.name.charAt(0).toUpperCase(), // 优先使用API应用的emoji字段
      url: app.url || '',
      description: app.description,
      app_id: app.app_id,
      requireAuth: true,
      isStatic: false,
      apiApp: app
    }))
  ];

  const allToolApps = [
    ...toolApps.map(app => ({ ...app, app_id: undefined, apiApp: undefined })),
    // 可以在这里添加更多从API获取的工具应用
  ];

  const debugApps = [
    {
      name: '内网穿透管理（不可用）',
      emoji: '🔧',
      url: 'https://192.168.1.3:4101/',
      description: '内网穿透管理'
    },
    {
      name: '虚拟花园（暂不可用）',
      emoji: '🌸',
      url: '/function2',
      description: '虚拟花园功能'
    },
    {
      name: 'PWA测试',
      emoji: '🎵',
      url: 'pwa/pwa-test.html',
      description: 'PWA功能测试'
    }
  ];

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#f2f2f2',
      backgroundImage: 'url("assets/images/backgrounds/bg.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      margin: 0,
      fontFamily: 'SEGA_Humming, Arial, sans-serif'
    }}>
      {/* Title */}
      <div className="flex justify-center" style={{
        color: 'rgb(53, 53, 53)',
        fontFamily: 'SEGA_Humming, Arial, sans-serif',
        fontSize: 'x-large',
        textShadow: 'darkgray 1px 1px 1px'
      }}>
        <h1>Tounet -2025.9-</h1>
      </div>

      {/* Switch and Login */}
      <div className="text-right px-4 mb-4">
        <div className="inline-flex items-center gap-4">
          <span>Debug Button</span>
          <Button variant="outline" size="sm" onClick={toggleDebug}>
            switch
          </Button>
        </div>
        
        <div className="flex justify-end mt-2">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                {user.username}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogIn className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Card className="w-80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  快速登录
                </CardTitle>
                <CardDescription>登录后可访问更多功能</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}
                  <Input
                    placeholder="Username"
                    {...register('username')}
                    error={errors.username?.message}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="flex-1"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 'Logging in...' : 'Login'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/register')}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Basic Functions */}
      <div className="flex justify-center" style={{
        color: 'rgb(53, 53, 53)',
        fontFamily: 'SEGA_Humming, Arial, sans-serif',
        fontSize: 'large'
      }}>
        <h3>基本功能</h3>
      </div>
      
      <div 
        className="app-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '20px',
          padding: '20px',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          margin: '0 auto',
          maxWidth: '95vw'
        }}
      >
        {allBasicApps.map((app, index) => (
          <div
            key={index}
            className="app-button"
            onClick={async () => {
              // 如果是API应用且用户已登录，使用一键登录
              if (!app.isStatic && app.apiApp && user) {
                await handleApiAppAccess(app.apiApp);
              } else {
                // 静态应用直接跳转
                handleStaticAppAccess(app);
              }
            }}
            style={{
              margin: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              flexDirection: 'row',
              opacity: accessingApp === app.app_id ? 0.6 : 1,
              pointerEvents: accessingApp === app.app_id ? 'none' : 'auto'
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '10px' }}>
              {getAppIcon(app)}
            </span>
            <span>{app.name}</span>
            {accessingApp === app.app_id && (
              <div style={{ marginLeft: '10px', fontSize: '12px' }}>登录中...</div>
            )}
          </div>
        ))}
      </div>

        {/* Other Tools */}
        <div className="flex justify-center" style={{
          color: 'rgb(53, 53, 53)',
          fontFamily: 'SEGA_Humming, Arial, sans-serif',
          fontSize: 'large',
          marginTop: '20px'
        }}>
          <h3>其他功能（修正检讨中……）</h3>
        </div>
        
        <div 
          className="app-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '20px',
            padding: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            margin: '20px auto',
            maxWidth: '95vw'
          }}
        >
          {allToolApps.map((app, index) => (
            <div
              key={index}
              className="app-button"
              onClick={() => handleStaticAppAccess(app)}
              style={{
                margin: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                flexDirection: 'row'
              }}
            >
              <span style={{ fontSize: '20px', marginRight: '10px' }}>
                {getAppIcon(app)}
              </span>
              <span>{app.name}</span>
            </div>
          ))}
        </div>

        {/* Debug Apps */}
        {showDebug && (
          <div 
            className="app-container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '20px',
              padding: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              margin: '20px auto',
              maxWidth: '95vw'
            }}
          >
            {debugApps.map((app, index) => (
              <div
                key={index}
                className="app-button"
                onClick={() => window.location.href = app.url}
                style={{
                  margin: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  flexDirection: 'row'
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '10px' }}>{app.emoji}</span>
                <span>{app.name}</span>
              </div>
            ))}
          </div>
        )}

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        textAlign: 'right'
      }}>
        <span style={{ color: 'green', cursor: 'pointer' }}>powered by LLMs</span> | 
        <span style={{ color: 'green' }}> 仅供个人学习使用，备案号：</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => window.location.href = 'pages/basic/aboutme.html'}>关于🔗</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => window.location.href = 'docs/license.html'}>LICENSE🔗</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => window.location.href = 'announce.html'}>公告🔗</span>
      </div>
    </div>
  );
}
