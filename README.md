# TouNet Frontend

> TouNet 前端项目 —— 个人门户与应用管理中心

基于 **Vite + React + TypeScript + Tailwind CSS** 构建的个人门户网站，集成了个人主页展示、应用管理面板、用户认证系统等功能。

## 目录结构

```
src/
├── pages/                  # 页面组件
│   ├── HomePage.tsx        # 主页（应用启动器）
│   ├── AboutMePage.tsx     # 关于页面（个人简介）
│   ├── LoginPage.tsx       # 登录页
│   ├── RegisterPage.tsx    # 注册页
│   ├── DashboardPage.tsx   # 用户控制面板
│   ├── AppsPage.tsx        # 应用管理（NKey/资料管理）
│   ├── AppLauncherPage.tsx # 应用一键启动器
│   ├── FreedomConstPage.tsx# 定数表生成工具
│   ├── AnnouncementsPage.tsx # 更新公告
│   ├── LicensePage.tsx     # 许可信息
│   └── SponsorPage.tsx     # 赞助页面
├── components/             # 通用组件
├── contexts/               # React 上下文
├── lib/                    # API 工具函数
├── types/                  # TypeScript 类型定义
├── hooks/                  # 自定义 hooks
└── data/                   # 静态数据（如 commits.json）
```

## 页面功能说明

### 1. 主页 /desktop（HomePage）

项目主入口，展示应用图标网格，支持：
- **背景切换**：内置 10 张背景图片循环切换
- **应用启动**：静态应用直接导航，API 应用通过 `/launch/:appId` 一键登录
- **用户状态**：未登录显示登录入口，已登录显示用户名和 Dashboard 入口
- **底部导航**：关于、许可、公告等页面的快速链接

### 2. 关于页面 / /about（AboutMePage）

个人简介页面（用户"透明"的信息展示）：
- 个人头像、自我介绍、兴趣爱好
- 自推角色展示（南风野朱莉、三角葵等）
- 交友宣言与雷区说明
- **成就画廊**：12 张图片以 3 列网格展示，点击可查看大图（Modal 弹窗）
- **联系方式**：侧边栏展开式设计，包含 B 站、QQ、扩列二维码

### 3. 登录页 /login（LoginPage）

用户登录页面，使用 `AuthPageLayout` 布局：
- 用户名 + 密码表单
- Zod schema 验证
- TanStack Query Mutation 处理登录请求
- 成功登录后跳转 `/desktop`

### 4. 注册页 /register（RegisterPage）

用户注册页面：
- 注册字段：用户名、密码、手机号、PushDeer Token（可选）、邀请码
- 注册成功提示后自动跳转登录页
- 表单验证与错误提示

### 5. 控制面板 /dashboard / /frontend（DashboardPage）

受保护的用户控制面板（需登录）：
- 根据用户角色显示不同内容
  - 普通用户 → `UserDashboard` 组件
  - 管理员 → `AdminDashboard` 组件
- 支持退出登录
- 返回主页按钮

### 6. 应用管理 /apps（AppsPage）

受保护的应用管理页面，包含三大功能模块：

**应用跳转区：**
- 网格展示用户可用的 API 应用
- 一键登录（自动生成 NKey 密钥，15 分钟有效）
- 应用在线状态检测（Ping）

**个人资料修改：**
- 更新手机号码
- 绑定 PushDeer Token（用于推送通知）

**NKey 生成器：**
- 为指定应用生成临时访问密钥
- 信任用户可代其他用户生成
- 一键复制密钥，15 分钟过期提醒

### 7. 应用启动器 /launch/:appId（AppLauncherPage）

受保护的动态路由页面：
- 自动查找目标应用
- 生成 NKey 认证令牌
- 携带 `ntoken` 参数重定向到外部应用 URL
- 支持错误状态展示

### 8. 定数表生成 /freedom-const（FreedomConstPage）

SEGA 音游定数表自定义生成工具（暂不支持手机）：

**支持游戏：**
- 舞萌 Maimai
- 中二节奏 Chunithm
- 音击 Ongeki

**核心功能：**
- 从外部 API 获取实时歌曲数据
- 歌曲搜索与等级筛选
- **区块编辑**：添加/删除定数区块，自定义标签
- **编辑模式**：拖拽移动元素，支持旋转、镜像翻转、黑白滤镜
- **文本组件**：自定义文本内容，支持彩虹色
- **分隔线**：区块内插入换行分隔
- **导出为图片**：使用 html2canvas 导出为 JPG
- 其他设置：标题编辑、字体大小、RGB 渐变模式等

### 9. 更新公告 /announcements（AnnouncementsPage）

基于 Git 提交记录生成的项目更新日志：
- 从 `commits.json` 读取提交数据
- 展示提交哈希、日期、消息、作者
- 运行 `node scripts/generate-commits.js` 可刷新公告

### 10. 许可信息 /license（LicensePage）

项目许可说明页面：
- **Pure HTML 项目**：MIT 协议，可商用修改，不可署名分发
- **其他开源项目**：MIT 协议+附加条款
- **专有项目**：仅限个人学习使用

### 11. 赞助页面 /sponsor（SponsorPage）

赞助支持页面：
- 支付宝收款码
- 微信收款码
- PayPal 链接

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 表单 | react-hook-form + Zod |
| 数据请求 | @tanstack/react-query |
| 图标 | lucide-react |
| 功能库 | html2canvas（定数表导出） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 环境要求

- Node.js >= 18
- npm >= 9

## 许可

详见 [/license 页面](https://tounet.vercel.app/license) 或项目中的 LICENSE 文件。
