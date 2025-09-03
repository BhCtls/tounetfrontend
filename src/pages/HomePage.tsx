import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
      description: '个人博客，不定期更新各种内容'
    },
    {
      name: '三角葵reve',
      emoji: '📁',
      url: '/live',
      description: '音乐相关内容'
    },
    {
      name: 'Nkey申请',
      emoji: '🔑',
      url: '/frontend',
      description: '申请访问密钥',
      requireAuth: true
    },
    {
      name: '音游数据库查询',
      emoji: '📊',
      url: '/searchallv3',
      description: '查询音游相关数据'
    }
  ];

  const toolApps = [
    {
      name: '预算检查器',
      emoji: '💰',
      url: '/tools/BudgetChecker.html',
      description: '检查和管理预算'
    },
    {
      name: 'dxpass渲染器',
      emoji: '🌸',
      url: '/tools/dxprender.html',
      description: '生成dxpass图片'
    },
    {
      name: '语法填空生成器',
      emoji: '📄',
      url: '/wxtk/',
      description: '生成语法填空练习'
    },
    {
      name: '部分解包资源查找',
      emoji: '🐰',
      url: '/segaassets/',
      description: '查找游戏资源文件'
    },
    {
      name: '音撃風卡面预览',
      emoji: '🃏',
      url: '/card-preview/CardPreview.html',
      description: '预览卡片设计'
    },
    {
      name: '赞助我……',
      emoji: '🥺',
      url: '/pages/basic/sponsor.html',
      description: '支持开发者'
    },
    {
      name: '安装应用',
      emoji: '📱',
      url: '/pwa/install.html',
      description: '安装PWA应用'
    },
    {
      name: 'Null Definition',
      emoji: '🚫',
      url: '/scoresheet/',
      description: '暂时未定义功能'
    }
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
      backgroundAttachment: 'fixed'
    }}>
      {/* Title */}
      <div className="flex justify-center text-gray-700 text-2xl font-bold py-6" style={{
        fontFamily: 'SEGA_Humming, Arial, sans-serif',
        textShadow: 'darkgray 1px 1px 1px'
      }}>
        <h1>Tounet -2025.9-</h1>
      </div>

      {/* Switch and Login */}
      <div className="flex justify-between items-center px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={toggleDebug}>
            Debug Button: {showDebug ? 'ON' : 'OFF'}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
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
      <div className="flex justify-center text-gray-700 text-xl font-bold mb-4" style={{
        fontFamily: 'SEGA_Humming, Arial, sans-serif'
      }}>
        <h3>基本功能</h3>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className="grid gap-5 p-5 backdrop-blur-sm bg-white/50 rounded-lg shadow-lg mb-6 lg:grid-cols-5 lg:max-w-[95vw]"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))'
          }}
        >
          {apps.map((app, index) => (
            <div
              key={index}
              className="app-button bg-white/90 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:bg-white/95 flex flex-col items-center justify-center text-center font-bold"
              onClick={() => {
                if (app.requireAuth && !user) {
                  alert('请先登录后访问此功能');
                  return;
                }
                window.location.href = app.url;
              }}
              style={{
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span className="text-xl mb-2">{app.emoji}</span>
              <span className="text-sm">{app.name}</span>
            </div>
          ))}
        </div>

        {/* Other Tools */}
        <div className="flex justify-center text-gray-700 text-xl font-bold mb-4" style={{
          fontFamily: 'SEGA_Humming, Arial, sans-serif'
        }}>
          <h3>其他功能，建议从申请key页面中进入</h3>
        </div>
        
        <div 
          className="grid gap-5 p-5 backdrop-blur-sm bg-white/50 rounded-lg shadow-lg mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:max-w-[95vw]"
        >
          {toolApps.map((app, index) => (
            <div
              key={index}
              className="app-button bg-white/90 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:bg-white/95 flex flex-col items-center justify-center text-center font-bold"
              onClick={() => window.location.href = app.url}
              style={{
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span className="text-xl mb-2">{app.emoji}</span>
              <span className="text-sm">{app.name}</span>
            </div>
          ))}
        </div>

        {/* Debug Apps */}
        {showDebug && (
          <div 
            className="grid gap-5 p-5 backdrop-blur-sm bg-white/50 rounded-lg shadow-lg mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:max-w-[95vw]"
          >
            {debugApps.map((app, index) => (
              <div
                key={index}
                className="app-button bg-white/90 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:bg-white/95 flex flex-col items-center justify-center text-center font-bold"
                onClick={() => window.location.href = app.url}
                style={{
                  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              >
                <span className="text-xl mb-2">{app.emoji}</span>
                <span className="text-sm">{app.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-2 right-2 text-xs text-right">
        <span className="text-green-600 cursor-pointer">powered by LLMs</span> | 
        <span className="text-green-600"> 仅供个人学习使用，备案号：</span> | 
        <span className="text-green-600 cursor-pointer" onClick={() => window.location.href = 'pages/basic/aboutme.html'}>关于🔗</span> | 
        <span className="text-green-600 cursor-pointer" onClick={() => window.location.href = 'docs/license.html'}>LICENSE🔗</span> | 
        <span className="text-green-600 cursor-pointer" onClick={() => window.location.href = 'announce.html'}>公告🔗</span>
      </div>
    </div>
  );
}
