# TouNetCore Design Guidelines

本文档总结了项目的 UI 设计哲学和设计规范，供后续开发参考。

---

## 1. 核心设计原则

### 1.1 简洁与功能性
- 以内容为中心，避免过度装饰
- 保持界面干净，留白充足
- 功能性优先，样式服务于交互

### 1.2 一致性
- 全局使用统一的圆角、阴影、颜色方案
- 复用组件而非重复代码
- 遵循相同的间距和布局模式

### 1.3 层次感
- 通过背景、阴影、边框建立视觉层次
- 重要操作使用品牌色 `#667eea`
- 次要信息使用中性灰色

---

## 2. 圆角设计 (Border Radius)

### 2.1 基础圆角值

| 元素 | 圆角值 | 说明 |
|------|--------|------|
| 页面主卡片 | `rounded-[15px]` | 主要内容容器 |
| 返回按钮 | `rounded-[20px]` | 固定定位按钮 |
| 应用卡片 | `rounded-lg` | 应用列表项 |
| 输入框 | `rounded-md` | 表单输入 |
| 弹窗/Modal | `rounded-xl` | 详情弹窗 |
| 小标签 | `rounded-full` | 徽章、状态点 |

### 2.2 使用示例

```tsx
// 页面主卡片 - AboutMePage, LicensePage
<div className="bg-[#e0e0e0] rounded-[15px] p-5 shadow-lg">
  {children}
</div>

// 返回按钮 - 固定定位
<button className="fixed top-5 left-5 ... rounded-[20px]">
  返回主页
</button>

// 应用卡片
<div className="rounded-lg p-4 bg-white/90 ...">
  {content}
</div>
```

---

## 3. 磨砂效果 (Backdrop Blur)

### 3.1 磨砂强度等级

| 强度 | 类名 | 适用场景 |
|------|------|----------|
| 弱 | `backdrop-blur-sm` | 浅色遮罩 |
| 中 | `backdrop-blur-md` | 卡片背景 |
| 强 | `backdrop-blur-xl` | 导航栏 |
| 极强 | `backdrop-blur-2xl` | 毛玻璃面板 |

### 3.2 磨砂 + 半透明背景组合

```tsx
// 导航栏/Header - 磨砂效果最强
<header className="bg-white/80 backdrop-blur-sm shadow-sm">
  {content}
</header>

// 应用按钮 - 中等磨砂
<div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
  {content}
</div>

// 返回按钮 - 固定定位磨砂
<button className="bg-white/90 backdrop-blur-md rounded-[20px]">
  返回
</button>
```

### 3.3 磨砂使用原则

- **建议**: 磨砂效果用于需要透过背景看到模糊内容的元素
- **避免**: 过度使用磨砂，影响性能和可读性
- **注意**: 磨砂需要配合半透明背景 `bg-white/xx` 使用

---

## 4. 按钮样式

### 4.1 主要按钮 (Primary)

用于主要操作，如提交、登录、确认。

```tsx
<Button className="bg-[#667eea] hover:bg-[#5a6fd6] text-white">
  {children}
</Button>
```

- 背景色: `#667eea` (品牌紫蓝色)
- hover 颜色: `#5a6fd6` (略深)
- 文字: 白色

### 4.2 次要按钮 (Outline)

用于次要操作，如返回、取消。

```tsx
<Button variant="outline" size="sm">
  <ArrowLeft className="w-4 h-4 mr-2" />
  返回主页
</Button>
```

- 边框: `border-gray-300`
- hover: `hover:bg-gray-50`
- 文字: `text-gray-700`

### 4.3 返回按钮 (固定定位)

页面左上角固定返回按钮。

```tsx
<button
  className="
    fixed top-5 left-5
    bg-white/90
    text-[#667eea]
    px-4 py-2.5
    rounded-[20px]
    backdrop-blur-md
    shadow-lg
    z-50
    hover:bg-[#667eea]
    hover:text-white
    transition-colors
    flex items-center gap-1
  "
>
  <ArrowLeft className="w-4 h-4" />
  返回主页
</button>
```

### 4.4 按钮尺寸

| 尺寸 | 类名 | 使用场景 |
|------|------|----------|
| sm | `size="sm"` | 表格操作、小按钮 |
| md | 默认 | 卡片内按钮 |
| lg | `size="lg"` | 主要操作按钮 |

---

## 5. 阴影设计

### 5.1 阴影层级

| 层级 | 类名 | 适用场景 |
|------|------|----------|
| 基础 | `shadow-sm` | 列表项、卡片 |
| 中等 | `shadow-md` | 悬停效果 |
| 强 | `shadow-lg` | 页面主卡片 |
| 极强 | `shadow-xl` | 弹窗、Modal |
| 自定义 | `shadow-[0_2px_8px_#ccc]` | 特殊场景 |

### 5.2 使用示例

```tsx
// 页面主卡片 - 最强阴影
<div className="bg-[#e0e0e0] rounded-[15px] p-5 shadow-lg">

// 应用卡片 - 中等阴影
<div className="rounded-lg p-4 shadow-sm hover:shadow-md">

// 返回按钮 - 带阴影
<button className="... shadow-lg z-50">
```

---

## 6. 背景设计

### 6.1 页面背景

所有页面使用固定背景图片方案。

```tsx
<PageLayout backgroundImage="bg3.png">
  {children}
</PageLayout>

// 等效于:
<div
  className="min-h-screen bg-cover bg-top bg-no-repeat bg-fixed font-fwqingyin"
  style={{
    backgroundImage: 'url(/assets/images/backgrounds/bg3.png)',
    backgroundColor: '#f2f2f2'
  }}
>
```

### 6.2 可用背景图

| 背景图 | 用途 |
|--------|------|
| `bg.png` | 应用管理页 |
| `bg3.png` | 关于我、许可证页 |
| `bg6.png` | 仪表盘、登录页 |

### 6.3 背景容器

内容区域使用灰色半透明容器：

```tsx
<div className="bg-[#e0e0e0]/90 backdrop-blur-sm rounded-[15px] p-8">
```

---

## 7. 颜色方案

### 7.1 品牌色

| 颜色 | 值 | 用途 |
|------|------|------|
| Primary | `#667eea` | 主要按钮、链接 |
| Primary Hover | `#5a6fd6` | 按钮悬停 |
| Primary Light | `#667eea/10` | 浅色背景 |

### 7.2 功能色

| 颜色 | 值 | 用途 |
|------|------|------|
| Success | `#10B981` / `green-500` | 成功状态 |
| Warning | `#F59E0B` / `yellow-500` | 警告状态 |
| Error | `#EF4444` / `red-500` | 错误状态 |
| Info | `#3B82F6` / `blue-500` | 信息提示 |

### 7.3 文字颜色

| 颜色 | 值 | 用途 |
|------|------|------|
| Primary Text | `text-gray-900` | 标题 |
| Secondary Text | `text-gray-600` | 描述 |
| Muted Text | `text-gray-500` | 辅助信息 |
| Link | `text-[#667eea]` | 链接 |

### 7.4 特殊文字颜色

```tsx
// 偶像名颜色
<span className="text-[#EFBAA8] font-bold">南风野朱莉</span>
<span className="text-[skyblue] font-bold">三角葵</span>
<span className="text-[orange] font-bold">オランジェント</span>
<span className="text-[purple] font-bold">水户雫</span>
```

---

## 8. 字体设计

### 8.1 主要字体

项目使用 `FWQingYin` (青青字体) 作为主要中文字体。

```css
font-family: FWQingYin, Arial, sans-serif;
```

### 8.2 字体大小

| 元素 | 大小 | 类名 |
|------|------|------|
| 页面标题 | 3xl | `text-3xl font-bold` |
| 卡片标题 | xl | `text-xl font-bold` |
| 章节标题 | lg | `text-lg font-bold` |
| 正文 | base | `text-base` |
| 辅助文字 | sm | `text-sm` |
| 小字 | xs | `text-xs` |

---

## 9. 布局组件

### 9.1 PageLayout

页面基础布局，包含背景和返回按钮。

```tsx
import { PageLayout } from '../components/PageLayout';

<PageLayout
  backgroundImage="bg3.png"  // 可选: bg.png, bg3.png, bg6.png
  showBackButton={true}       // 默认显示返回按钮
>
  {children}
</PageLayout>
```

### 9.2 PageHeader

页面顶部导航栏。

```tsx
import { PageHeader } from '../components/PageHeader';

<PageHeader
  title="应用管理"
  subtitle="用户名"           // 可选
  showBack={true}             // 默认显示返回按钮
  backText="返回主页"         // 自定义返回文字
  onBack={() => navigate('/')} // 自定义返回行为
  actions={<div>...</div>}    // 右侧操作区
/>
```

### 9.3 PageCard

页面内容卡片容器。

```tsx
import { PageCard } from '../components/PageCard';

<PageCard
  maxWidth="xl"              // sm | md | lg | xl | full
  padding={true}             // 是否添加内边距
>
  {children}
</PageCard>
```

### 9.4 AuthPageLayout

登录/注册页面专用布局。

```tsx
import { AuthPageLayout } from '../components/AuthPageLayout';

<AuthPageLayout
  icon={<LogIn className="h-12 w-12" />}
  title="登录到TouNet"
  subtitle={
    <>
      Or <Link to="/register">创建新账号</Link>
    </>
  }
>
  <Card>{children}</Card>
</AuthPageLayout>
```

---

## 10. 状态展示

### 10.1 Alert 组件

```tsx
import { Alert } from '../components/ui/Alert';

<Alert variant="error">错误信息</Alert>
<Alert variant="success">成功信息</Alert>
<Alert variant="info">提示信息</Alert>
```

### 10.2 Loading 组件

```tsx
import { Loading, LoadingSpinner } from '../components/ui/Loading';

// 完整加载状态
<Loading text="加载中..." />

// 仅 spinner
<LoadingSpinner size="lg" />
```

### 10.3 StatusPage 组件

```tsx
import { StatusPage } from '../components/StatusPage';

// 加载状态
<StatusPage status="loading" loadingText="处理中..." />

// 成功状态
<StatusPage
  status="success"
  title="操作成功"
  message="已完成"
  onBack={handleBack}
/>

// 错误状态
<StatusPage
  status="error"
  title="操作失败"
  message="错误信息"
  onRetry={handleRetry}
  onBack={handleBack}
/>
```

---

## 11. 图标使用

项目使用 `lucide-react` 图标库。

### 11.1 常用图标

| 图标 | 用途 |
|------|------|
| `<ArrowLeft />` | 返回 |
| `<LogIn />` | 登录 |
| `<UserPlus />` | 注册 |
| `<Home />` | 主页 |
| `<User />` | 用户 |
| `<Key />` | 密钥 |
| `<Check />` | 成功 |
| `<X />` | 关闭 |
| `<AlertCircle />` | 错误 |
| `<Loader2 />` | 加载中 |
| `<RefreshCw />` | 刷新 |

### 11.2 图标尺寸

```tsx
// 按钮内图标
<ArrowLeft className="w-4 h-4" />

// 大图标
<LogIn className="h-12 w-12" />

// 状态图标
<AlertCircle className="h-12 w-12" />
```

---

## 12. 响应式设计

### 12.1 断点

| 断点 | 前缀 | 宽度 |
|------|------|------|
| sm | `sm:` | ≥640px |
| md | `md:` | ≥768px |
| lg | `lg:` | ≥1024px |
| xl | `xl:` | ≥1280px |
| 2xl | `2xl:` | ≥1536px |

### 12.2 响应式布局示例

```tsx
// 网格响应式
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {children}
</div>

// Flex 响应式
<div className="flex flex-col md:flex-row items-center gap-5">
  {children}
</div>
```

---

## 13. CSS 类名顺序规范

为保持代码一致性，建议按以下顺序排列类名：

```tsx
<div
  className="
    /* 定位 */
    fixed top-5 left-5

    /* 尺寸 */
    w-full h-full

    /* 背景 */
    bg-white/90
    backdrop-blur-md

    /* 圆角 */
    rounded-[20px]

    /* 阴影 */
    shadow-lg

    /* 边框 */
    border border-gray-300

    /* 间距 */
    p-4 m-4

    /* 排版 */
    text-sm text-gray-700

    /* 交互 */
    hover:bg-[#667eea]
    hover:text-white
    transition-colors
    cursor-pointer

    /* 层级 */
    z-50
  "
>
```

---

## 14. 组件导入规范

### 14.1 UI 组件

```tsx
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Loading, LoadingSpinner } from '../components/ui/Loading';
```

### 14.2 布局组件

```tsx
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';
import { PageCard } from '../components/PageCard';
import { AuthPageLayout } from '../components/AuthPageLayout';
import { StatusPage } from '../components/StatusPage';
```

---

## 15. 常见模式

### 15.1 应用卡片

```tsx
<div
  className="
    bg-white/90
    backdrop-blur-sm
    rounded-lg
    p-4
    cursor-pointer
    transition-all
    hover:shadow-md
    hover:bg-white/95
    flex flex-col items-center justify-center text-center
  "
  style={{ boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}
>
  {content}
</div>
```

### 15.2 状态指示点

```tsx
<div className={`w-2 h-2 rounded-full ${
  status === 'online' ? 'bg-green-400' :
  status === 'checking' ? 'bg-yellow-400 animate-pulse' :
  status === 'offline' ? 'bg-red-400' :
  'bg-gray-400'
}`} />
```

### 15.3 模态框

```tsx
<div
  className="
    fixed inset-0
    bg-black/80
    z-[60]
    flex items-center justify-center
    p-4
  "
  onClick={onClose}
>
  <div
    className="
      bg-white
      rounded-xl
      max-w-2xl w-full
      max-h-[90vh]
      overflow-y-auto
      p-6
      relative
    "
    onClick={e => e.stopPropagation()}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
    >
      <X className="w-6 h-6" />
    </button>
    {content}
  </div>
</div>
```

---

## 16. 注意事项

### 16.1 性能优化

- 避免过度使用 `backdrop-blur`，特别是在移动设备上
- 大列表考虑使用虚拟滚动
- 图片使用懒加载

### 16.2 可访问性

- 按钮始终有明确的文字或图标
- 图片添加 alt 描述
- 颜色对比度符合 WCAG 标准
- 支持键盘导航

### 16.3 浏览器兼容性

- 主要支持现代浏览器 (Chrome, Firefox, Safari, Edge)
- 需要时可添加 CSS polyfill

---

## 17. 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-02-10 | 初始文档，整理设计规范 |
