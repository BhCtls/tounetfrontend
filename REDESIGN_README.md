# TouNetFrontend 重新设计

## 变更概述

按照用户要求重新设计了 tounetfrontend 主页，实现了以下功能：

### 1. 新主页设计
- 主页现在位于根路径 `/`，具有 HTML index.html 的视觉风格
- 集成了登录功能，连接到 tounetfrontend 的认证系统
- 保持了原 index.html 的应用网格布局和视觉效果

### 2. 路由结构
- `/` - 新主页（带登录功能）
- `/login` - 独立登录页面
- `/register` - 注册页面
- `/dashboard` - 用户仪表板
- `/apps` - 应用管理页面（Nkey生成和Profile修改）

### 3. UserDashboard 重新设计
- 采用了 index.html 的应用展示方式
- "跳转到应用" 功能，以原 index.html 中的应用卡片样式呈现
- "Nkey生成"和"profile修改" 作为单独的应用页面 (`/apps`)
- 管理员Dashboard保持不变

### 4. 集成的HTML工具
已将以下纯HTML工程集成到项目中的 `public` 目录：

#### 工具页面
- `/tools/dxprender.html` - DX Pass 渲染器
- `/tools/BudgetChecker.html` - 预算检查器
- `/card-preview/CardPreview.html` - 卡面预览器

这些工具页面：
- 支持自动Nkey验证（通过URL参数）
- 保持原有功能和样式
- 可通过主页或应用页面访问

### 5. 资源文件
- `public/assets/tounet.css` - 统一的样式文件
- `public/assets/fonts/` - 字体文件目录
- `public/assets/images/` - 图片资源目录
- `public/manifest.json` - PWA配置

## 技术实现

### 组件结构
```
src/pages/
├── HomePage.tsx        # 新主页组件
├── AppsPage.tsx        # 应用管理页面
├── LoginPage.tsx       # 登录页面
├── RegisterPage.tsx    # 注册页面
└── DashboardPage.tsx   # 仪表板页面

src/components/
├── UserDashboard_New.tsx  # 重新设计的用户仪表板
└── AdminDashboard.tsx     # 管理员仪表板（不变）
```

### 特色功能
1. **响应式设计**: 适配桌面和移动设备
2. **统一认证**: 所有页面使用相同的认证系统
3. **自动Nkey传递**: 应用访问时自动生成并传递认证密钥
4. **视觉一致性**: 保持原 index.html 的视觉风格

## 使用说明

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:5174` 查看新主页
3. 登录后可访问应用管理和仪表板功能
4. 工具页面可通过主页链接访问，支持Nkey自动认证

## 注意事项

- 确保后端API支持现有的认证接口
- 字体和背景图片需要放置在相应的目录中
- 工具页面的API端点需要与实际服务器配置匹配
