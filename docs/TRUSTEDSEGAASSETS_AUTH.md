# TrustedSegaAssets 身份验证使用指南

## 概述

现在 `/trustedsegaassets/` 路径已经集成了 TouNetCore 身份验证系统，需要有效的 NKey 才能访问。

## 权限要求

- **应用ID**: `trustedsegaassets`
- **权限级别**: `trusted`
- **描述**: [高级]音游解包资源查询

## 使用方法

### 1. 获取 NKey

首先需要登录 TouNetCore 系统并生成 NKey：

```bash
# 登录（需要 trusted 用户）
curl -X POST http://localhost:44544/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_trusted_username",
    "password": "your_password"
  }'

# 生成 NKey
curl -X POST http://localhost:44544/api/v1/nkey/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": ["your_trusted_username"],
    "app_ids": ["trustedsegaassets"]
  }'
```

### 2. 访问受保护的资源

有两种方式提供 NKey：

#### 方式1：URL 参数
```
http://localhost:39339/trustedsegaassets/some_file.png?nkey=TOUNET_1_XXXXXX
```

#### 方式2：HTTP 头部
```bash
curl -H "X-NKey: TOUNET_1_XXXXXX" \
  http://localhost:39339/trustedsegaassets/some_file.png
```

## 错误响应

### 缺少 NKey
```
HTTP/1.1 401 Unauthorized
Missing NKey parameter
```

### NKey 无效或过期
```
HTTP/1.1 401 Unauthorized
Authentication failed: invalid or expired NKey
```

### 权限不足
如果用户权限级别低于 `trusted`，TouNetCore 系统会拒绝生成相应的 NKey。

## 配置说明

### TouNetCore API 基础地址
代码中默认配置为 `http://localhost:44544`，如果您的 TouNetCore 服务运行在不同地址，请修改 `server.go` 中的 `TOUNETCORE_API_BASE` 常量。

### 应用配置
确保在 TouNetCore 系统中正确配置了应用：
- **app_id**: `trustedsegaassets`
- **required_permission_level**: `trusted`
- **is_active**: `true`

## 安全注意事项

1. **NKey 有效期**: NKey 有时间限制，过期后需要重新生成
2. **HTTPS**: 生产环境中建议使用 HTTPS 传输 NKey
3. **日志记录**: 系统会记录所有身份验证尝试，包括成功和失败的访问
4. **权限验证**: 每次请求都会实时验证 NKey 的有效性

## 故障排除

### TouNetCore 服务不可用
如果 TouNetCore 服务不可用，所有对 `/trustedsegaassets/` 的请求都会失败。请确保：
1. TouNetCore 服务正在运行
2. 网络连接正常
3. API 基础地址配置正确

### 频繁的身份验证失败
检查：
1. NKey 是否正确
2. NKey 是否过期
3. 用户权限是否为 `trusted` 级别
4. 应用 `trustedsegaassets` 是否已激活
