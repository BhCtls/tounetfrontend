import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { userApi, publicApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { App } from '../types/api';
import { BackToHomeButton } from '../components/BackToHomeButton';

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'error' } | null>(null);
  const [confirmAppUrl, setConfirmAppUrl] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 可切换的背景图片列表（位于 public/assets/images/backgrounds）
  const backgrounds = [
    'bg.png',
    'bg1.png',
    'bg2.png',
    'bg3.png',
    'bg4.png',
    'bg5.png',
    'bg6.png',
    'bg7.png',
    'bg8.png',
    'bg9.png'
  ];
  const [bgIndex, setBgIndex] = useState<number>(() => {
    const idx = backgrounds.indexOf('bg8.png');
    return idx >= 0 ? idx : 0;
  });

  // 获取用户可用的应用列表
  const { data: apiApps } = useQuery({
    queryKey: ['apps', user?.username || 'public'],
    queryFn: async () => {
      if (user) {
        const response = await userApi.getMyApps();
        return response.data;
      } else {
        const response = await publicApi.getPublicApps();
        return response.data;
      }
    },
  });


  // 处理应用访问 - API应用（需要ntoken）
  const handleApiAppAccess = async (app: App) => {
    if (!app.url || !user?.username) {
      return;
    }

    // Navigate to the launcher page which handles authentication and redirection
    navigate(`/launch/${app.app_id}`);
  };

  // 处理静态应用访问（不需要ntoken）
  const handleStaticAppAccess = (app: any) => {
    if (app.requireAuth && !user) {
      if (confirmAppUrl !== app.url) {
        setConfirmAppUrl(app.url);
        setToast({ message: '可以尝试注册账号，或再次点击进入应用', type: 'info' });
        return;
      }
      // If clicked again, proceed
      setConfirmAppUrl(null);
    }
    
    // 定义需要客户端路由的内部页面路径
    const internalRoutes = ['/frontend', '/about', '/login', '/register', '/dashboard', '/apps', '/song-pic-query', '/freedom-const'];
    
    // 只有明确定义的内部路由才使用客户端导航
    const isInternalRoute = internalRoutes.includes(app.url);
    
    try {
      if (isInternalRoute) {
        navigate(app.url);
        return;
      }
      // 所有其他路径（包括外部应用、静态文件等）都使用完整页面跳转
      window.location.href = app.url;
    } catch (err) {
      // fallback to full navigation on any unexpected error
      window.location.href = app.url;
    }
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

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const apps = [
    {
      name: '赞助我……',
      emoji: '🥺',
      url: '/sponsor',
      description: '支持开发者',
      isStatic: true
    },
    {
      name: 'Nkey申请',
      emoji: '🔑',
      url: '/apps',
      description: '申请访问密钥',
      requireAuth: true,
      isStatic: true
    },
  ];

  // 合并静态应用和API应用
  const allBasicApps = [
    ...apps.filter(app => !app.requireAuth || user).map(app => ({ ...app, app_id: undefined, apiApp: undefined })),
    ...(apiApps || []).map((app: App) => ({
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

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#f2f2f2',
      backgroundImage: `url("/assets/images/backgrounds/${backgrounds[bgIndex]}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      margin: 0,
      fontFamily: 'FWQingYin, Arial, sans-serif'
    }}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-xl bg-gray-800 text-white bg-opacity-90 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-gray-700">
          <span>{toast.message}</span>
        </div>
      )}

      <BackToHomeButton />

      <div className="home-content">

      {/* Title */}
      <div className="flex justify-center" style={{
        color: 'rgb(53, 53, 53)',
        fontFamily: 'FWQingYin, Arial, sans-serif',
        fontSize: 'x-large',
        textShadow: 'darkgray 1px 1px 1px'
      }}>
  <h1>Tounet 5.5.1 202605</h1>
      </div>

      {/* Switch and Login */}
        <div className="text-right px-4 mb-4">
          <div className="inline-flex items-center gap-4">
            <span>Debug Button</span>
            <Button variant="outline" size="sm" onClick={toggleDebug}>
              switch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBgIndex(i => (i + 1) % backgrounds.length)}
              title="切换背景"
              aria-label="切换主页背景"
            >
              ♻️
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
          ) : null}
        </div>
      </div>

      {/* Basic Functions */}
      <div className="flex justify-center" style={{
        color: 'rgb(53, 53, 53)',
        fontFamily: 'FWQingYin, Arial, sans-serif',
        fontSize: 'large'
      }}>
        <h3>应用列表</h3>
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
            }}
          >
            <span style={{ fontSize: '20px', marginRight: '10px' }}>
              {getAppIcon(app)}
            </span>
            <span>{app.name}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        textAlign: 'right'
      }}>
        <span style={{ color: 'green', cursor: 'pointer' }}>powered by Gemini 3 Pro</span> | 
        <span style={{ color: 'green' }}> 仅供个人学习使用，备案号：</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate('/about')}>关于🔗</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate('/license')}>LICENSE🔗</span> | 
        <span style={{ color: 'green', cursor: 'pointer' }} onClick={() => navigate('/announcements')}>公告🔗</span>
      </div>
      </div>
    </div>
  );
}
