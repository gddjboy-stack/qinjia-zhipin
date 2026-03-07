# 亲家直聘 - 编码规范

## 📌 项目概述

- **项目名称**：亲家直聘（QinJia ZhiPin）
- **目标用户**：55-70岁的中国老年人（父母为孩子相亲）
- **技术栈**：React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **数据存储**：localStorage（MVP阶段）
- **部署方式**：Manus静态托管

---

## 🏗️ 数据结构规范

### **核心接口定义**

> 以下接口定义与 `client/src/contexts/DataContext.tsx` 中的实际代码保持同步。
> 如需修改接口，必须同时更新此文档和代码。

#### UserPublishedProfile（用户发布的资料）

```typescript
interface UserPublishedProfile {
  id: string;                    // 资料唯一ID，格式：'profile_' + timestamp
  userId: string;                // 发布者的用户ID，存储在localStorage
  childName: string;             // 孩子的姓名
  childAge: number;              // 孩子的年龄
  childGender: 'male' | 'female'; // 孩子的性别（注意：使用英文值）
  childEducation: string;        // 孩子的学历
  childOccupation: string;       // 孩子的职业
  childLocation: string;         // 孩子的居住地（注意：与parentLocation不同）
  workCity: string;              // 孩子的工作城市
  hasHousing: 'yes' | 'no' | 'unknown'; // 是否有房
  hasCar: 'yes' | 'no' | 'unknown';     // 是否有车
  annualIncome: string;          // 年收入范围，如"30-50万"
  nativePlace: string;           // 籍贯
  zodiacSign: string;            // 属相
  childDescription: string;      // 个人介绍
  parentName: string;            // 家长的姓名
  parentPhone: string;           // 家长的联系电话（完整号码，展示时脱敏）
  parentLocation: string;        // 家长的所在城市（注意：与childLocation不同）
  profileImage: string;          // 头像（Base64压缩后存储）
  isVerified: boolean;           // 是否已认证
  publishedAt: string;           // 发布时间
  certifications: {              // 认证信息
    phoneVerified: boolean;      // 手机号实名
    idVerified: boolean;         // 身份证实名
    profileVerified: boolean;    // 资料真实性验证
  };
  verificationDate?: string;     // 认证日期
}
```

#### ContactRequest（联系申请）

```typescript
interface ContactRequest {
  id: string;                    // 申请唯一ID
  fromUserId: string;            // 申请发送者的用户ID
  fromProfileId: string;         // 申请者的资料ID
  fromParentName: string;        // 申请者的家长名字
  fromChildName: string;         // 申请者的孩子名字
  toUserId: string;              // 申请接收者的用户ID（即资料发布者的userId）
  toProfileId: string;           // 被申请者的资料ID
  toParentName: string;          // 被申请者的家长名字
  toChildName: string;           // 被申请者的孩子名字
  message: string;               // 申请留言
  timestamp: string;             // 申请时间戳
  isRead: boolean;               // 是否已读
}
```

#### UserSettings（用户设置）

```typescript
interface UserSettings {
  privacy: {
    showProfile: boolean;        // 是否在首页显示我的资料（默认true）
    allowApplications: boolean;  // 是否允许接收申请（默认true）
    showLocation: boolean;       // 是否显示位置信息（默认true）
    showContact: boolean;        // 是否显示联系方式（默认true）
    pauseAll: boolean;           // 总开关：暂停接收所有申请（默认false）
  };
  notifications: {
    newApplications: boolean;    // 是否接收新申请通知（默认true）
    messageReplies: boolean;     // 是否接收消息回复通知（默认true）
    recommendations: boolean;    // 推荐更新通知（占位符）
  };
}
```

---

## 📁 数据管理规范

### **Mock数据集中管理**

> 所有mock数据统一在 `client/src/lib/mockData.ts` 中定义和管理。
> 各页面通过导入函数获取数据，禁止在页面组件中重复定义mock数据。

```typescript
// ✅ 正确：从集中管理的mockData导入
import { mockProfiles, getMockProfileById, getMockProfileBrief } from '@/lib/mockData';

// ❌ 错误：在页面组件中重复定义mock数据
const mockProfiles = [{ id: '1', childName: '李明', ... }];
```

### **工具函数集中管理**

> 通用工具函数统一在 `client/src/lib/utils.ts` 中定义。

```typescript
// ✅ 正确：使用工具函数
import { maskPhone, isValidPhone } from '@/lib/utils';
const display = maskPhone('13812341234'); // => '138****1234'

// ❌ 错误：内联正则表达式
const display = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
```

---

## ⚠️ 字段命名规则

### **严格区分的字段**

以下字段容易混淆，必须严格区分：

| 字段名 | 含义 | 所属对象 | 使用场景 |
|--------|------|----------|----------|
| `childLocation` | 孩子的居住地 | UserPublishedProfile | 详情页"更多信息"→"居住地" |
| `parentLocation` | 家长的所在城市 | UserPublishedProfile | 详情页"家长信息"→"所在地" |
| `workCity` | 孩子的工作城市 | UserPublishedProfile | 详情页顶部位置标签 |

### **命名规范**

1. **前缀区分所属** - `child` 前缀表示孩子的信息，`parent` 前缀表示家长的信息
2. **避免歧义** - 不要使用 `location` 这样的模糊名称，必须加前缀
3. **保持一致** - 同一个字段在所有文件中使用相同的名称

---

## 🔒 隐私设置逻辑规范

### **核心原则**

1. **默认显示** - 所有信息默认显示，只有用户主动关闭才隐藏
2. **总开关优先** - 如果 `pauseAll` 为 true，则覆盖所有其他隐私设置
3. **隐藏时的显示** - 隐藏的信息显示"隐私"文字，而不是空白

### **隐私设置应用位置**

| 设置项 | 影响的页面 | 影响的内容 |
|--------|-----------|-----------|
| `showProfile` | Home.tsx | 是否在首页显示该用户的资料卡片 |
| `allowApplications` | ProfileDetail.tsx | 是否在详情页显示"申请联系"按钮（仅影响自己的资料被他人查看时） |
| `showLocation` | ProfileDetail.tsx | 是否显示 childLocation 和 parentLocation |
| `showContact` | ProfileDetail.tsx | 是否显示 parentPhone |
| `pauseAll` | 所有页面 | 覆盖以上所有设置 |

### **电话号码处理规范**

```typescript
// ✅ 正确：使用maskPhone工具函数
import { maskPhone } from '@/lib/utils';
const maskedPhone = maskPhone(userProfile.parentPhone);

// ✅ 正确：使用isValidPhone验证
import { isValidPhone } from '@/lib/utils';
if (!isValidPhone(formData.parentPhone)) {
  toast.error('请输入有效的11位手机号');
}

// ❌ 错误：硬编码假号码
const maskedPhone = '138****1234';

// ❌ 错误：mock数据中使用脱敏格式
parentPhone: '138****1234', // 应该存储完整号码
```

---

## 📱 页面职责规范

### **各页面的数据来源**

| 页面 | 数据来源 | 职责 |
|------|----------|------|
| Home.tsx | DataContext + lib/mockData.ts | 展示所有资料卡片，应用隐私过滤 |
| ProfileDetail.tsx | DataContext + lib/mockData.ts | 展示资料详情，应用隐私设置 |
| Publish.tsx | 用户输入 → DataContext | 收集用户信息，保存到DataContext |
| Contact.tsx | DataContext + lib/mockData.ts | 提交联系申请，记录fromUserId和toUserId |
| Profile.tsx | DataContext | 展示用户收到的申请（toUserId过滤） |
| Settings/*.tsx | DataContext | 管理用户设置 |

### **userId获取规范**

```typescript
// ✅ 正确：从DataContext获取userId
const { userId, userProfile } = useData();

// ❌ 错误：直接从localStorage读取
const userId = localStorage.getItem('qinjia_user_id');
```

### **数据流方向**

```
用户输入 → Publish.tsx → DataContext → localStorage
                                    ↓
Home.tsx ← DataContext ← localStorage
ProfileDetail.tsx ← DataContext ← localStorage
Profile.tsx ← DataContext ← localStorage
```

---

## 🔄 消息路由规范

### **核心原则**

1. **fromUserId** - 始终是发送申请的用户ID
2. **toUserId** - 始终是接收申请的用户ID（即资料发布者的userId）
3. **过滤规则** - Profile.tsx 只显示 `toUserId === currentUserId` 的申请
4. **未读计数** - 只统计 `toUserId === currentUserId && isRead === false` 的申请
5. **全部已读** - markAllAsRead 只标记 `toUserId === currentUserId` 的消息
6. **重复检查** - 提交申请前检查是否已向同一资料发送过申请

### **申请流程**

```
用户A浏览首页 → 点击用户B的资料 → 填写申请表 → 重复检查 → 提交
                                                              ↓
ContactRequest {
  fromUserId: 用户A的ID,
  fromProfileId: 用户A的资料ID,
  fromParentName: 用户A的家长名字,
  fromChildName: 用户A的孩子名字,
  toUserId: 用户B的ID（资料发布者）,
  toProfileId: 资料ID,
  toParentName: 用户B的家长名字,
  toChildName: 用户B的孩子名字,
  message: 申请留言
}
```

---

## 🎨 UI/UX规范

### **老年用户友好设计**

1. **字体大小** - 最小14px，标题18px以上
2. **按钮大小** - 最小44x44px（触摸友好）
3. **颜色对比** - 文字与背景对比度至少4.5:1
4. **操作反馈** - 每个操作都要有明确的视觉反馈
5. **简洁文案** - 避免专业术语，使用日常用语

### **导航规范**

1. **底部导航** - 首页、发布、我的（三个标签）
2. **返回按钮** - 所有子页面必须有返回按钮
3. **面包屑** - 设置页面使用设置中心作为入口

---

## 📝 代码风格规范

### **TypeScript**

```typescript
// ✅ 正确：明确的类型注解
const userId: string = localStorage.getItem(USER_ID_KEY) || '';

// ❌ 错误：使用any
const userId: any = localStorage.getItem(USER_ID_KEY);
```

### **React组件**

```typescript
// ✅ 正确：函数式组件 + Hooks
const MyComponent: React.FC = () => {
  const [state, setState] = useState<string>('');
  // ...
};

// ❌ 错误：类组件
class MyComponent extends React.Component {
  // ...
}
```

### **状态管理**

```typescript
// ✅ 正确：从DataContext获取数据
const { userId, userSettings, updatePrivacySettings } = useData();

// ❌ 错误：直接操作localStorage
const settings = JSON.parse(localStorage.getItem('settings') || '{}');
```

---

## 🚀 未来扩展预留

### **升级Pro时需要修改的地方**

1. **DataContext** - 将localStorage替换为API调用
2. **用户认证** - 将localStorage的userId替换为OAuth认证
3. **数据存储** - 将localStorage替换为数据库
4. **消息系统** - 添加实时推送通知
5. **图片存储** - 将Base64压缩替换为CDN上传

### **接口预留建议**

```typescript
// 当前MVP：localStorage
const saveProfile = (profile: UserPublishedProfile) => {
  localStorage.setItem(key, JSON.stringify(profile));
};

// 未来Pro：API调用（只需修改这一层）
const saveProfile = async (profile: UserPublishedProfile) => {
  await api.post('/profiles', profile);
};
```

---

## 📋 代码审查清单

每次提交代码前，必须检查以下项目：

- [ ] 字段名称是否正确（特别是 childLocation vs parentLocation）
- [ ] 隐私设置逻辑是否正确（默认显示，主动关闭才隐藏）
- [ ] 电话号码是否使用maskPhone工具函数脱敏（不要硬编码）
- [ ] 电话号码验证是否使用isValidPhone工具函数
- [ ] fromUserId 和 toUserId 是否正确
- [ ] 未读消息计数是否只统计 toUserId === currentUserId
- [ ] markAllAsRead 是否只标记 toUserId === currentUserId 的消息
- [ ] 重复申请检查是否生效
- [ ] userId 是否从DataContext获取（不要直接读localStorage）
- [ ] mock数据是否引用lib/mockData.ts（不要在页面中重复定义）
- [ ] TypeScript编译是否通过
- [ ] 所有页面是否有返回按钮
- [ ] 新增的表单字段是否在Publish.tsx中有对应的输入框
- [ ] 图片上传是否经过压缩处理
