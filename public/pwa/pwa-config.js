// PWA 配置和工具函数
const PWAConfig = {
  // 应用信息
  app: {
    name: 'Tounet',
    version: '4.0.0-202509',
    author: '淅淅沥沥又无法捕捉的雨'
  },
  
  // 缓存策略
  cache: {
    strategy: 'cache-first', // cache-first, network-first, stale-while-revalidate
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    maxEntries: 100
  },
  
  // 通知设置
  notifications: {
    enabled: true,
    permission: 'default'
  },
  
  // 更新策略
  update: {
    autoUpdate: false,
    promptUser: true
  }
};

// PWA 工具类
class PWATools {
  constructor() {
    this.init();
  }

  async init() {
    this.checkNotificationPermission();
    this.setupUpdateChecker();
    this.monitorNetworkStatus();
  }

  // 检查通知权限
  async checkNotificationPermission() {
    if ('Notification' in window) {
      PWAConfig.notifications.permission = Notification.permission;
      
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        PWAConfig.notifications.permission = permission;
      }
    }
  }

  // 发送通知
  async sendNotification(title, options = {}) {
    if (PWAConfig.notifications.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/assets/images/icons/emblem2.svg',
        badge: '/assets/images/icons/emblem2.svg',
        ...options
      });
      
      return notification;
    }
    return null;
  }

  // 设置更新检查器
  setupUpdateChecker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          this.handleUpdateAvailable();
        }
      });
    }
  }

  // 处理应用更新
  handleUpdateAvailable() {
    if (PWAConfig.update.promptUser) {
      const updatePrompt = document.createElement('div');
      updatePrompt.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1002;
        display: flex;
        justify-content: space-between;
        align-items: center;
        animation: slideUp 0.3s ease-out;
      `;
      
      updatePrompt.innerHTML = `
        <div>
          <strong>🎉 新版本可用！</strong><br>
          <small>点击更新以获得最新功能</small>
        </div>
        <div>
          <button id="update-btn" style="margin-right: 10px; padding: 8px 16px; border: none; border-radius: 20px; background: white; color: #667eea; cursor: pointer;">更新</button>
          <button id="dismiss-update-btn" style="padding: 8px 16px; border: 1px solid white; border-radius: 20px; background: transparent; color: white; cursor: pointer;">稍后</button>
        </div>
      `;
      
      document.body.appendChild(updatePrompt);
      
      document.getElementById('update-btn').addEventListener('click', () => {
        window.location.reload();
      });
      
      document.getElementById('dismiss-update-btn').addEventListener('click', () => {
        updatePrompt.remove();
      });
      
      // 添加动画样式
      if (!document.getElementById('pwa-animations')) {
        const style = document.createElement('style');
        style.id = 'pwa-animations';
        style.textContent = `
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    } else if (PWAConfig.update.autoUpdate) {
      window.location.reload();
    }
  }

  // 监控网络状态
  monitorNetworkStatus() {
    let isOnline = navigator.onLine;
    
    const updateOnlineStatus = () => {
      const wasOffline = !isOnline;
      isOnline = navigator.onLine;
      
      if (wasOffline && isOnline) {
        this.sendNotification('🌐 网络已恢复', {
          body: '您现在可以正常使用所有功能了',
          tag: 'network-status'
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  // 获取应用使用统计
  getUsageStats() {
    const stats = {
      installDate: localStorage.getItem('pwa-install-date') || new Date().toISOString(),
      launchCount: parseInt(localStorage.getItem('pwa-launch-count') || '0'),
      lastLaunch: new Date().toISOString()
    };
    
    // 更新启动次数
    stats.launchCount++;
    localStorage.setItem('pwa-launch-count', stats.launchCount.toString());
    localStorage.setItem('pwa-last-launch', stats.lastLaunch);
    
    if (!localStorage.getItem('pwa-install-date')) {
      localStorage.setItem('pwa-install-date', stats.installDate);
    }
    
    return stats;
  }

  // 清除应用数据
  async clearAppData() {
    try {
      // 清除缓存
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // 清除本地存储
      localStorage.clear();
      sessionStorage.clear();
      
      // 清除 IndexedDB（如果使用）
      if ('indexedDB' in window) {
        // 这里可以添加清除 IndexedDB 的代码
      }
      
      console.log('应用数据已清除');
      return true;
    } catch (error) {
      console.error('清除应用数据失败:', error);
      return false;
    }
  }

  // 检查应用更新
  async checkForUpdates() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('已检查应用更新');
        }
      } catch (error) {
        console.error('检查更新失败:', error);
      }
    }
  }

  // 导出应用配置
  exportConfig() {
    const config = {
      ...PWAConfig,
      stats: this.getUsageStats(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tounet-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// 全局初始化
if (typeof window !== 'undefined') {
  window.PWATools = PWATools;
  window.PWAConfig = PWAConfig;
  
  // 自动初始化
  document.addEventListener('DOMContentLoaded', () => {
    window.pwaTools = new PWATools();
    console.log('PWA 工具已初始化');
  });
}
