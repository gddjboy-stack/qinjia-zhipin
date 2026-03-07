# 亲家直聘 - 环境变量说明

## 项目自定义变量

以下变量需要在 Manus 管理面板的 **Settings → Secrets** 中配置：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_MOCK_ENABLED` | Mock数据开关：`true`=显示mock数据（开发/演示），`false`=不显示（生产） | `true` |

## 代码中读取方式

```typescript
// lib/mockData.ts 中
const MOCK_ENABLED = import.meta.env.VITE_MOCK_ENABLED === 'true';
```

## Manus 平台自动注入变量

以下变量由 Manus 平台自动注入，无需手动配置：

| 变量名 | 用途 |
|--------|------|
| `VITE_APP_ID` | 应用ID |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_APP_LOGO` | 应用Logo URL |
| `VITE_OAUTH_PORTAL_URL` | Manus OAuth 认证门户地址 |
| `VITE_FRONTEND_FORGE_API_KEY` | 前端 AI API 密钥 |
| `VITE_FRONTEND_FORGE_API_URL` | 前端 AI API 地址 |
| `VITE_ANALYTICS_ENDPOINT` | 数据分析端点 |
| `VITE_ANALYTICS_WEBSITE_ID` | 数据分析网站ID |

## 升级为 web-db-user 后新增变量（后端使用）

| 变量名 | 用途 |
|--------|------|
| `JWT_SECRET` | JWT token 签发密钥 |
| `OAUTH_SERVER_URL` | OAuth 服务器地址 |
| `BUILT_IN_FORGE_API_KEY` | 后端 AI API 密钥 |
| `BUILT_IN_FORGE_API_URL` | 后端 AI API 地址 |
| `OWNER_NAME` | 应用所有者名称 |
| `OWNER_OPEN_ID` | 应用所有者 OpenID |
