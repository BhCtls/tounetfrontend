// Service Worker for Tounet PWA
const CACHE_NAME = 'tounet-cache-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/pwa/offline.html',
  '/pwa/manifest.json',
  '/assets/images/icons/icon.png',
  '/assets/images/backgrounds/bg.png',
  '/assets/images/backgrounds/bg1.png',
  '/assets/images/backgrounds/bg2.png', 
  '/assets/images/backgrounds/bg3.png',
  '/assets/images/backgrounds/bg4.png',
  '/assets/images/backgrounds/bg5.png',
  '/pages/card-preview/CardPreview.html',
  '/pages/tools/BudgetChecker.html',
  '/pages/basic/sponsor.html',
  '/docs/license.html',
  '/pages/basic/blog.html',
  '/pages/basic/aboutme.html',
  '/pages/tools/hive.html',
  '/pages/tools/shitposter.html',
  '/pages/tools/dxprender.html',
  '/assets/fonts/SEGA_Humming.ttf',
  '/pages/card-preview/styles.3557e117b26a79f9.css',
  '/pages/card-preview/main.0547a4eebdd74823.js.下载',
  '/pages/card-preview/polyfills.c4724e5181d423aa.js.下载',
  '/pages/card-preview/runtime.a177a74581f89b3a.js.下载',
  '/pages/card-preview/scripts.da45db557e586536.js.下载'
];

// Service Worker 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker 正在安装...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('正在缓存文件...');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('缓存文件时出错:', error);
      })
  );
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker 已激活');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即获取控制权
  self.clients.claim();
});

// 网络请求拦截
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 跳过外部请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有匹配的响应，返回缓存
        if (response) {
          console.log('从缓存返回:', event.request.url);
          return response;
        }

        // 否则从网络获取
        console.log('从网络获取:', event.request.url);
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应，因为响应流只能使用一次
          const responseToCache = response.clone();

          // 将响应添加到缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          console.error('网络请求失败:', error);
          
          // 如果是 HTML 请求且网络失败，返回离线页面
          if (event.request.destination === 'document') {
            return caches.match('/pwa/offline.html');
          }
          
          // 对于其他类型的请求，尝试返回缓存的首页
          return caches.match('/index.html');
        });
      })
  );
});

// 处理推送通知
self.addEventListener('push', event => {
  console.log('收到推送消息');
  
  const options = {
    body: event.data ? event.data.text() : '您有新的消息',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icon.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Tounet 通知', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  console.log('通知被点击:', event.notification.tag);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // 只关闭通知，不执行其他操作
    console.log('用户选择关闭通知');
  } else {
    // 默认行为：打开应用
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 后台同步
self.addEventListener('sync', event => {
  console.log('后台同步事件:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 在这里执行后台同步任务
      Promise.resolve()
        .then(() => {
          console.log('后台同步完成');
        })
        .catch(error => {
          console.error('后台同步失败:', error);
        })
    );
  }
});

// 处理消息
self.addEventListener('message', event => {
  console.log('Service Worker 收到消息:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

// 错误处理
self.addEventListener('error', event => {
  console.error('Service Worker 错误:', event.error);
});

// 未处理的 Promise 拒绝
self.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  event.preventDefault();
});
