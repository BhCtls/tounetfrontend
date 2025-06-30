# 管理员功能测试清单

## 已实现的功能

### 用户管理
- [x] 列出所有用户 (使用正确的 `users` 字段)
- [x] 创建新用户
- [x] 编辑用户信息 (用户名、状态、电话、PushDeer Token)
- [x] 删除用户
- [x] 用户状态显示 (admin/user/disabled)

### 应用程序管理
- [x] 列出所有应用程序
- [x] 创建新应用程序
- [x] 编辑应用程序 (名称、描述、权限级别、状态)
- [x] 启用/停用应用程序 (Toggle功能)
- [x] 删除应用程序
- [x] 应用程序状态显示

### 邀请码管理
- [x] 列出所有邀请码 (使用正确的字段结构)
- [x] 生成新邀请码
- [x] 复制邀请码
- [x] 删除邀请码
- [x] 邀请码状态显示 (已使用/可用)
- [x] 显示使用者信息

## API 端点映射

### 用户相关
- GET `/admin/users` -> `adminApi.getUsers()`
- POST `/admin/users` -> `adminApi.createUser()`
- POST `/admin/users/{id}/update` -> `adminApi.updateUser()`
- POST `/admin/users/{id}/delete` -> `adminApi.deleteUser()`

### 应用程序相关
- GET `/admin/apps` -> `adminApi.getApps()`
- POST `/admin/apps` -> `adminApi.createApp()`
- POST `/admin/apps/{app_id}/update` -> `adminApi.updateApp()`
- POST `/admin/apps/{app_id}/toggle` -> `adminApi.toggleApp()`
- POST `/admin/apps/{app_id}/delete` -> `adminApi.deleteApp()`

### 邀请码相关
- GET `/admin/invite-codes` -> `adminApi.getInviteCodes()`
- POST `/admin/invite-codes` -> `adminApi.generateInviteCode()`
- POST `/admin/invite-codes/{code}/delete` -> `adminApi.deleteInviteCode()`

## 数据结构适配

### 用户列表响应
```json
{
  "code": 200,
  "data": {
    "users": [...],  // 已适配
    "total": 2
  }
}
```

### 邀请码列表响应
```json
{
  "code": 200,
  "data": {
    "invite_codes": [...],  // 已适配
    "total": 10
  }
}
```

### 邀请码字段映射
- `used` (boolean) -> 显示状态
- `used_by` (string) -> 显示使用者
- `created_at` -> 显示创建时间

## UI 功能

### 用户管理界面
- [x] 用户列表表格
- [x] 创建用户表单
- [x] 编辑用户表单 (弹出式)
- [x] 删除确认
- [x] 状态标签颜色编码

### 应用程序管理界面
- [x] 应用程序卡片布局
- [x] 创建应用程序表单
- [x] 编辑应用程序表单 (弹出式)
- [x] 启用/停用按钮
- [x] 删除按钮
- [x] 状态指示器

### 邀请码管理界面
- [x] 邀请码列表表格
- [x] 生成新邀请码按钮
- [x] 复制邀请码功能
- [x] 删除邀请码按钮
- [x] 状态显示 (已使用/可用)

## 测试步骤

1. 登录管理员账户 (admin/admin123)
2. 测试用户管理:
   - 查看用户列表
   - 创建新用户
   - 编辑用户信息
   - 删除用户
3. 测试应用程序管理:
   - 查看应用程序列表
   - 创建新应用程序
   - 编辑应用程序
   - 启用/停用应用程序
   - 删除应用程序
4. 测试邀请码管理:
   - 查看邀请码列表
   - 生成新邀请码
   - 复制邀请码
   - 删除邀请码

所有功能都已实现并应该正常工作！
