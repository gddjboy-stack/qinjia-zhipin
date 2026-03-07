# 亲家直聘 - 完整版功能规划（Pro版本）

**文档目的：** 为后续与Claude的架构审查提供完整的功能蓝图，确保当前MVP代码能够平稳升级到Pro版本，支持所有计划中的功能。

**最后更新：** 2026-03-07  
**版本：** Pro规划版

---

## 📊 版本对比

| 功能模块 | MVP（当前） | Pro（计划） |
|---------|-----------|-----------|
| **用户认证** | localStorage（本地ID） | OAuth + 实名认证 |
| **数据存储** | localStorage | 云数据库 |
| **付费功能** | 无 | 分级认证系统 |
| **数据分析** | 无 | 完整埋点系统 |
| **后台管理** | 无 | 数据看板 + 运营后台 |
| **用户交流** | 单向申请 + 留言 | 实时聊天 + 消息系统 |
| **图片存储** | Base64本地 | CDN对象存储 |
| **支付集成** | 无 | Stripe/微信支付 |

---

## 🎯 Pro版本核心功能模块

### 1. 付费认证系统（收费盈利）

#### 功能概述
用户可以通过支付不同等级的认证费用，获得对应的认证标签和权益。这是平台的主要盈利来源。

#### 认证等级设计

| 等级 | 名称 | 价格 | 权益 | 有效期 |
|------|------|------|------|--------|
| 0 | 免费认证 | ¥0 | 基础资料展示 | 永久 |
| 1 | 标准认证 | ¥99/年 | ✅ 实名认证 + 蓝V标签 + 优先排序 | 1年 |
| 2 | 高级认证 | ¥299/年 | ✅ 标准认证所有权益 + 身份证认证 + 视频认证 + 置顶推荐 | 1年 |
| 3 | 尊享认证 | ¥699/年 | ✅ 高级认证所有权益 + 专属客服 + 数据分析报告 | 1年 |

#### 认证流程
1. **用户发起认证申请** → 选择认证等级 → 支付费用
2. **信息提交** → 实名认证（身份证号）→ 手机号验证 → 视频认证（高级以上）
3. **审核流程** → 平台人工审核 → 通过/驳回
4. **生效** → 获得对应认证标签 → 享受权益

#### 数据库字段扩展
```typescript
interface UserCertification {
  id: string;
  userId: string;
  level: 0 | 1 | 2 | 3;  // 认证等级
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  
  // 认证信息
  realName: string;
  idNumber: string;  // 加密存储
  phoneVerified: boolean;
  idVerified: boolean;
  videoVerified: boolean;
  
  // 时间信息
  appliedAt: string;
  approvedAt?: string;
  expiresAt: string;
  
  // 支付信息
  paymentId: string;
  amount: number;
  currency: 'CNY';
}
```

#### 前端页面
- **认证中心** (`/certification`)
  - 显示当前认证状态
  - 认证等级对比表
  - 支付入口（集成Stripe/微信支付）
  - 认证进度查询

- **认证申请表** (`/certification/apply/:level`)
  - 实名信息填写
  - 身份证上传
  - 视频认证（高级以上）
  - 支付确认

#### 后台功能
- 认证申请审核队列
- 认证数据统计（通过率、平均审核时间等）
- 认证过期提醒

---

### 2. 数据埋点系统（分析优化）

#### 埋点目标
通过全面的用户行为数据收集，支持：
- 用户转化漏斗分析
- 功能使用热力图
- 用户留存分析
- A/B测试

#### 埋点事件清单

##### 用户行为事件

| 事件名 | 触发时机 | 关键字段 |
|--------|---------|---------|
| `user_login` | 用户登录 | userId, loginMethod, timestamp |
| `user_logout` | 用户登出 | userId, sessionDuration |
| `profile_view` | 查看资料详情 | viewerId, profileId, viewDuration |
| `profile_like` | 收藏资料 | userId, profileId, liked |
| `application_start` | 开始填写申请 | userId, targetProfileId |
| `application_submit` | 提交申请 | fromUserId, toProfileId, messageLength |
| `application_view` | 查看收到的申请 | userId, applicationId, viewDuration |
| `certification_start` | 开始认证流程 | userId, certLevel |
| `certification_complete` | 完成认证 | userId, certLevel, duration |
| `payment_start` | 开始支付 | userId, amount, certLevel |
| `payment_success` | 支付成功 | userId, amount, certLevel, paymentMethod |
| `payment_failed` | 支付失败 | userId, amount, failureReason |
| `message_send` | 发送聊天消息 | fromUserId, toUserId, messageLength |
| `message_read` | 阅读聊天消息 | userId, messageId, readTime |
| `search_filter` | 使用搜索筛选 | userId, filters, resultCount |
| `settings_change` | 修改隐私设置 | userId, settingKey, oldValue, newValue |

##### 页面访问事件

| 事件名 | 触发时机 | 关键字段 |
|--------|---------|---------|
| `page_view` | 访问页面 | userId, pageName, referrer |
| `page_leave` | 离开页面 | userId, pageName, duration |
| `feature_error` | 功能出错 | userId, errorType, errorMessage |

#### 埋点实现

**埋点工具函数** (`client/src/lib/analytics.ts`)
```typescript
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
    properties: properties || {}
  };
  
  // 发送到分析后端
  fetch(`${ANALYTICS_API}/events`, {
    method: 'POST',
    body: JSON.stringify(event)
  });
};
```

**埋点集成点**
- 每个页面组件的 `useEffect` 中调用 `trackEvent('page_view', ...)`
- 关键操作（申请、支付、认证）的成功/失败回调中埋点
- 表单提交前后埋点

#### 后台分析功能
- **用户转化漏斗**：登录 → 浏览资料 → 发起申请 → 支付认证
- **功能热力图**：哪些功能被使用最频繁
- **留存分析**：日/周/月活跃用户
- **支付分析**：认证等级分布、支付转化率、平均客单价
- **用户分群**：按认证等级、活跃度、消费金额分群

---

### 3. 后台数据看板（运营管理）

#### 看板类型

##### A. 运营看板 (`/admin/dashboard`)
- **关键指标**
  - 日活用户数 (DAU)
  - 月活用户数 (MAU)
  - 新注册用户数
  - 认证用户数（按等级分类）
  - 平均会话时长

- **收入指标**
  - 日收入 / 周收入 / 月收入
  - 认证等级收入分布
  - 平均客单价 (ARPU)
  - 支付转化率

- **业务指标**
  - 申请总数
  - 申请成功率（有回复的申请占比）
  - 平均响应时间
  - 用户满意度评分

- **图表展示**
  - 收入趋势曲线
  - 用户增长曲线
  - 认证等级分布饼图
  - 申请漏斗图

##### B. 用户管理看板 (`/admin/users`)
- 用户列表（支持搜索、筛选、排序）
- 用户详情（注册时间、认证状态、消费金额、申请数量等）
- 用户操作（禁用账户、重置密码、发送通知等）
- 用户申诉处理

##### C. 认证管理看板 (`/admin/certifications`)
- 待审核认证列表（按优先级排序）
- 认证详情查看（身份证、视频等）
- 批量审核操作
- 审核统计（通过率、平均审核时间等）

##### D. 内容管理看板 (`/admin/content`)
- 举报内容审核
- 违规用户处理
- 内容下架/恢复

#### 技术实现
- 后端API：`/api/admin/dashboard`, `/api/admin/users`, `/api/admin/certifications` 等
- 前端框架：使用 Recharts/ECharts 绘制图表
- 权限控制：仅管理员可访问（基于 `role` 字段）
- 数据更新：实时更新或定时刷新（可配置）

---

### 4. 用户交流增强（社交功能）

#### 当前状态（MVP）
- 单向申请 + 一次性留言
- 被申请者可在"我的"页面查看申请
- 无法进行多轮对话

#### Pro版本扩展

##### A. 实时聊天系统

**新增数据模型**
```typescript
interface Conversation {
  id: string;
  participantIds: [string, string];  // 两个用户ID
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: {
    [userId: string]: number;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice';  // 支持多种消息类型
  attachmentUrl?: string;
  createdAt: string;
  readAt?: string;
  reactions?: {
    [userId: string]: string[];  // 用户的表情反应
  };
}
```

**聊天页面** (`/chat`)
- 对话列表（按最后消息时间排序）
- 对话详情页（实时消息流）
- 消息输入框（支持文本、表情、图片）
- 已读状态显示
- 消息搜索

**实时通知**
- WebSocket 连接实时消息推送
- 离线消息存储和推送
- 消息通知（浏览器通知 + 应用内通知）

##### B. 申请流程优化

**申请状态流转**
```
已发送 → 已查看 → 已回复/已拒绝 → 已接受/已取消
```

**新增功能**
- 申请者可以撤回未回复的申请
- 被申请者可以明确接受/拒绝
- 接受后自动创建 Conversation
- 拒绝后可选择是否屏蔽该申请者

##### C. 用户评价系统

**评价模型**
```typescript
interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: 1 | 2 | 3 | 4 | 5;  // 星级评分
  comment: string;
  createdAt: string;
}
```

**评价入口**
- 在聊天结束后提示用户评价
- 用户中心显示收到的评价
- 评价影响用户排序权重

---

### 5. 支付集成（商业化）

#### 支付方式

| 方式 | 适用场景 | 集成方案 |
|------|---------|---------|
| **Stripe** | 国际用户 | 直接集成Stripe API |
| **微信支付** | 国内用户 | 通过后端代理调用 |
| **支付宝** | 国内用户 | 通过后端代理调用 |

#### 支付流程

1. **选择认证等级** → 显示价格
2. **点击支付** → 跳转支付页面
3. **选择支付方式** → 输入支付信息
4. **支付确认** → 后端验证支付结果
5. **成功回调** → 更新用户认证状态 → 埋点记录

#### 前端实现
- 集成 `@stripe/react-stripe-js` 库
- 支付表单组件 (`PaymentForm.tsx`)
- 支付结果处理（成功/失败/待处理）

#### 后端实现
- Webhook 处理支付回调
- 订单记录存储
- 发票生成

---

### 6. 数据库架构升级

#### 核心表结构

```sql
-- 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  wechatOpenId VARCHAR(255) UNIQUE,  -- 微信OAuth
  email VARCHAR(255) UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户资料表
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL UNIQUE,
  childName VARCHAR(100),
  childAge INT,
  childGender ENUM('male', 'female'),
  parentName VARCHAR(100),
  parentPhone VARCHAR(20),
  -- ... 其他字段
  isVerified BOOLEAN DEFAULT FALSE,
  publishedAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- 认证表
CREATE TABLE certifications (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  level INT,
  status ENUM('pending', 'approved', 'rejected', 'expired'),
  realName VARCHAR(100),
  idNumber VARCHAR(255),  -- 加密
  expiresAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- 联系申请表
CREATE TABLE contact_requests (
  id VARCHAR(36) PRIMARY KEY,
  fromUserId VARCHAR(36) NOT NULL,
  toUserId VARCHAR(36) NOT NULL,
  message TEXT,
  status ENUM('sent', 'viewed', 'replied', 'accepted', 'rejected'),
  createdAt TIMESTAMP,
  FOREIGN KEY (fromUserId) REFERENCES users(id),
  FOREIGN KEY (toUserId) REFERENCES users(id)
);

-- 对话表
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY,
  participant1Id VARCHAR(36) NOT NULL,
  participant2Id VARCHAR(36) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (participant1Id) REFERENCES users(id),
  FOREIGN KEY (participant2Id) REFERENCES users(id)
);

-- 消息表
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  conversationId VARCHAR(36) NOT NULL,
  senderId VARCHAR(36) NOT NULL,
  content TEXT,
  type ENUM('text', 'image', 'voice'),
  attachmentUrl VARCHAR(255),
  createdAt TIMESTAMP,
  readAt TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id),
  FOREIGN KEY (senderId) REFERENCES users(id)
);

-- 订单表
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status ENUM('pending', 'completed', 'failed', 'refunded'),
  paymentMethod ENUM('stripe', 'wechat', 'alipay'),
  paymentId VARCHAR(255),
  createdAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- 埋点事件表
CREATE TABLE analytics_events (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36),
  eventName VARCHAR(100),
  properties JSON,
  createdAt TIMESTAMP,
  INDEX (userId, eventName, createdAt)
);
```

---

### 7. 后端API设计

#### 认证相关
- `POST /api/auth/login` - 微信登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 获取当前用户信息

#### 认证（Certification）相关
- `GET /api/certifications/levels` - 获取认证等级列表
- `POST /api/certifications/apply` - 提交认证申请
- `GET /api/certifications/status` - 查询认证状态
- `POST /api/certifications/payment` - 支付认证费用

#### 聊天相关
- `GET /api/conversations` - 获取对话列表
- `GET /api/conversations/:id/messages` - 获取对话消息
- `POST /api/conversations/:id/messages` - 发送消息
- `PUT /api/conversations/:id/messages/:messageId/read` - 标记消息已读
- `POST /api/conversations/:id/messages/:messageId/reactions` - 添加表情反应

#### 数据分析相关
- `GET /api/admin/analytics/dashboard` - 获取看板数据
- `GET /api/admin/analytics/events` - 查询埋点事件
- `GET /api/admin/analytics/funnel` - 获取转化漏斗

#### 支付相关
- `POST /api/payments/create-intent` - 创建支付意图（Stripe）
- `POST /api/payments/webhook` - 支付回调处理

---

## 🏗️ 架构升级路径

### 第一阶段：后端基础设施（第1-2个月）
1. 搭建 Node.js/Express 后端
2. 集成数据库（PostgreSQL/MySQL）
3. 实现用户认证系统（OAuth）
4. 部署到云服务器

### 第二阶段：核心功能（第3-4个月）
1. 实现付费认证系统
2. 集成支付网关（Stripe/微信支付）
3. 构建数据埋点系统
4. 实现后台看板

### 第三阶段：社交功能（第5-6个月）
1. 实现实时聊天系统（WebSocket）
2. 优化申请流程
3. 添加用户评价系统
4. 性能优化和测试

### 第四阶段：运营优化（第7-8个月）
1. 数据分析和优化
2. 用户增长策略
3. 运营后台完善
4. 上线推广

---

## 🔒 安全与隐私考虑

### 数据加密
- 身份证号、电话号等敏感信息在数据库中加密存储
- HTTPS 传输
- 敏感API需要认证和授权

### 隐私保护
- 用户可以设置隐私级别
- 认证用户可以选择公开/隐藏某些信息
- 支持数据导出和账户删除

### 风险防控
- 申请频率限制（防止骚扰）
- 举报机制
- 黑名单功能
- 内容审核（AI + 人工）

---

## 📈 商业模式

### 收入来源

| 来源 | 预期占比 | 实现方式 |
|------|---------|---------|
| **认证费用** | 70% | 分级认证系统（¥99-¥699/年） |
| **增值服务** | 20% | 置顶推荐、数据报告等 |
| **广告** | 10% | 平台广告位（未来考虑） |

### 定价策略
- **标准认证（¥99/年）**：目标用户70%，覆盖基础需求
- **高级认证（¥299/年）**：目标用户20%，提供视频认证和置顶
- **尊享认证（¥699/年）**：目标用户10%，VIP客服和数据分析

### 财务预测（第一年）
- 假设：10,000 DAU，认证转化率 20%
- 月活用户：30,000
- 认证用户：6,000（平均等级2）
- 月收入：¥150,000
- 年收入：¥1,800,000

---

## 🔄 代码架构升级建议

### 当前MVP架构问题
1. **数据存储**：localStorage 无法跨设备同步
2. **认证**：本地生成ID，无法验证用户真实身份
3. **隐私**：电话号码脱敏逻辑分散在多个文件
4. **扩展性**：DataContext 直接操作 localStorage，难以升级到API

### Pro版本架构改进

#### 1. 分层架构设计
```
┌─────────────────────────────────────┐
│         React Components             │
├─────────────────────────────────────┤
│      Custom Hooks (useData, etc)     │
├─────────────────────────────────────┤
│      Service Layer (API调用)          │
│  ├─ ProfileService                   │
│  ├─ ContactService                   │
│  ├─ CertificationService             │
│  ├─ ChatService                      │
│  └─ AnalyticsService                 │
├─────────────────────────────────────┤
│      API Client (Axios/Fetch)        │
├─────────────────────────────────────┤
│      Backend API                     │
├─────────────────────────────────────┤
│      Database                        │
└─────────────────────────────────────┘
```

#### 2. Service 层示例
```typescript
// client/src/services/ProfileService.ts
export class ProfileService {
  async getProfile(id: string) {
    return fetch(`/api/profiles/${id}`).then(r => r.json());
  }
  
  async updateProfile(profile: UserPublishedProfile) {
    return fetch(`/api/profiles`, {
      method: 'PUT',
      body: JSON.stringify(profile)
    }).then(r => r.json());
  }
}

// 在 DataContext 中使用
const profileService = new ProfileService();
const profile = await profileService.getProfile(id);
```

#### 3. 数据流改进
```
用户操作 → React组件 → Custom Hook → Service → API → 后端 → 数据库
                                                        ↓
                                                    返回数据
                                                        ↓
                                                    更新状态
```

#### 4. 错误处理和重试
```typescript
// 添加重试机制
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## ✅ 代码审查清单（Pro版本）

在升级到Pro版本前，需要确认以下架构设计：

- [ ] **认证系统**
  - [ ] OAuth集成方案是否明确（微信/支付宝）
  - [ ] 用户ID生成和管理策略
  - [ ] Token存储和刷新机制

- [ ] **支付集成**
  - [ ] Stripe/微信支付集成点
  - [ ] 订单流程和状态管理
  - [ ] 支付失败重试机制

- [ ] **数据埋点**
  - [ ] 埋点事件是否完整
  - [ ] 敏感信息是否过滤
  - [ ] 埋点性能是否可接受

- [ ] **实时聊天**
  - [ ] WebSocket 连接管理
  - [ ] 消息队列和离线存储
  - [ ] 消息加密方案

- [ ] **后台看板**
  - [ ] 数据查询性能（是否需要缓存）
  - [ ] 权限控制是否完善
  - [ ] 图表渲染性能

- [ ] **数据库设计**
  - [ ] 索引策略是否合理
  - [ ] 数据一致性保证
  - [ ] 备份和恢复方案

- [ ] **安全性**
  - [ ] 敏感数据加密存储
  - [ ] API 认证和授权
  - [ ] 速率限制和DDoS防护
  - [ ] SQL注入和XSS防护

- [ ] **扩展性**
  - [ ] Service层是否易于扩展
  - [ ] 是否支持水平扩展
  - [ ] 缓存策略是否合理

- [ ] **性能**
  - [ ] API 响应时间是否可接受
  - [ ] 前端加载时间是否优化
  - [ ] 数据库查询是否优化

- [ ] **测试覆盖**
  - [ ] 单元测试覆盖率
  - [ ] 集成测试覆盖率
  - [ ] E2E测试覆盖率

---

## 📝 后续行动

1. **第一步**：将本文档发送给Claude进行架构审查
2. **第二步**：根据Claude的反馈调整架构设计
3. **第三步**：制定详细的开发计划和时间表
4. **第四步**：开始第一阶段的后端开发

---

## 🔗 相关文档

- [MVP代码审查结果](./CLAUDE_REVIEW.md) - 当前版本的修复清单
- [编码规范](./CODING_STANDARDS.md) - 代码风格和最佳实践
- [数据模型](./shared/types.ts) - 类型定义
