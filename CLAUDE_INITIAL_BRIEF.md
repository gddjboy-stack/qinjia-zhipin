# 亲家直聘项目 - Claude首次沟通文案

亲爱的Claude，

我正在开发一个名叫**"亲家直聘"**的H5应用，这是一个为中国老年人设计的相亲平台。我希望邀请你和Manus一起完成这个项目的开发。在正式开始之前，我想向你介绍一下这个项目的背景、目标和当前的开发情况。

---

## 📱 项目背景与目标

### **核心需求**
亲家直聘是一个**父母相亲神器**，专门为中国老年人（主要是55-70岁的父母）设计。这些父母希望为自己的成年子女找到合适的伴侣。

### **用户画像**
- **年龄**：55-70岁
- **技术水平**：低到中等（主要使用微信、支付宝）
- **需求**：简单直观的界面，快速找到合适的相亲对象
- **特点**：对隐私和安全非常敏感

### **核心价值主张**
- 简化相亲流程：用户只需填入子女的基本信息，就能在首页浏览其他人的资料
- 快速匹配：通过申请联系功能，快速建立联系
- 隐私保护：用户可以灵活控制哪些信息对其他人可见

---

## 🎯 MVP功能清单

### **已完成的功能**
1. ✅ **首页浏览** - 显示所有发布的资料卡片，用户可以浏览
2. ✅ **发布资料** - 用户可以填写子女信息并发布资料
3. ✅ **申请联系** - 用户可以向其他人发送申请
4. ✅ **个人中心** - 用户可以查看收到的申请
5. ✅ **隐私设置** - 用户可以控制哪些信息对其他人可见
6. ✅ **通知设置** - 用户可以控制是否接收通知
7. ✅ **关于我们** - 显示应用信息、服务条款、隐私政策和客服二维码

### **数据存储方式**
- 当前使用**localStorage**存储所有数据（MVP阶段）
- 未来升级Pro版本时，会迁移到真实数据库和用户认证系统
- 每个用户有唯一的userId（UUID），存储在localStorage中

---

## 🔴 当前遇到的问题

在开发过程中，Manus（另一个AI）遇到了几次编程错误：

### **问题1：字段混淆**
- 在ProfileDetail.tsx中，混淆了两个位置字段：
  - `childLocation`（孩子的居住地）
  - `parentLocation`（家长的所在城市）
- 导致用户发布的资料中，这两个字段显示不正确

### **问题2：缺少输入字段**
- Publish.tsx中缺少"孩子居住地"的输入框
- 用户无法填入孩子的居住地，导致该字段始终为空

### **问题3：硬编码数据**
- 电话号码显示被硬编码为'138****1234'，而不是用户实际输入的号码

### **问题4：隐私设置逻辑**
- 最初的隐私设置逻辑不正确，默认应该显示所有信息，只有用户主动关闭才隐藏
- 但代码实现时反向了

---

## 📊 项目技术栈

- **前端框架**：React 19 + TypeScript
- **路由**：Wouter（轻量级路由库）
- **UI组件**：shadcn/ui + Tailwind CSS 4
- **状态管理**：React Context + localStorage
- **部署**：Manus平台（内置hosting）

---

## 🏗️ 项目结构

```
client/
  src/
    pages/          ← 页面组件
      Home.tsx      ← 首页（浏览资料）
      Publish.tsx   ← 发布资料页
      Profile.tsx   ← 个人中心（查看申请）
      ProfileDetail.tsx ← 资料详情页
      Contact.tsx   ← 申请联系页
      Settings/     ← 设置页面
        Index.tsx   ← 设置中心
        Privacy.tsx ← 隐私设置
        Notifications.tsx ← 通知设置
        About.tsx   ← 关于我们
    components/     ← 可复用UI组件
    contexts/       ← React Context
      DataContext.tsx ← 全局数据管理
    lib/            ← 工具函数
```

---

## 💾 核心数据结构

### **UserPublishedProfile（用户发布的资料）**
```typescript
interface UserPublishedProfile {
  id: string;                    // UUID
  userId: string;                // 用户ID
  childName: string;             // 孩子姓名
  childAge: number;              // 孩子年龄
  childGender: 'male' | 'female';// 孩子性别
  childEducation: string;        // 孩子学历
  childOccupation: string;       // 孩子职业
  workCity: string;              // 孩子现在工作地
  childLocation: string;         // 孩子居住地（可选）
  childDescription: string;      // 孩子个人介绍
  annualIncome: string;          // 年收入
  nativePlace: string;           // 籍贯
  zodiacSign: string;            // 属相
  hasHousing: 'yes' | 'no' | 'unknown';
  hasCar: 'yes' | 'no' | 'unknown';
  parentName: string;            // 家长姓名
  parentPhone: string;           // 家长电话
  parentLocation: string;        // 家长所在城市
  profileImage: string;          // 资料图片（base64）
  isVerified: boolean;           // 是否认证
}
```

### **ContactRequest（申请记录）**
```typescript
interface ContactRequest {
  id: string;                    // UUID
  fromUserId: string;            // 申请者的userId
  toUserId: string;              // 被申请者的userId
  fromUserName: string;          // 申请者名字
  toUserName: string;            // 被申请者名字
  message: string;               // 申请消息
  isRead: boolean;               // 是否已读
  createdAt: string;             // 创建时间
}
```

### **UserSettings（用户设置）**
```typescript
interface UserSettings {
  privacy: {
    pauseReceiving: boolean;     // 暂停接收申请（总开关）
    showProfile: boolean;        // 显示我的资料
    allowApplications: boolean;  // 接收申请
    showLocation: boolean;       // 显示位置信息
    showContact: boolean;        // 显示联系方式
  };
  notifications: {
    newApplications: boolean;    // 新申请通知
    messageReplies: boolean;     // 消息回复通知（占位符）
    recommendations: boolean;    // 推荐更新通知（占位符）
  };
}
```

---

## 🤝 协作方式

我希望你和Manus能够一起完成这个项目的开发。具体的协作方式还在探讨中，但基本思路是：

1. **Manus负责**：快速原型开发、前端UI实现、架构设计
2. **你的角色**：代码审查、发现潜在问题、提出改进建议、确保代码质量
3. **我的角色**：需求管理、测试验证、最终决策

---

## ❓ 我对你的初步问题

在正式开始协作之前，我想听听你的想法：

1. **工作流程** - 你认为什么样的协作流程最高效？是否有更好的方式来最小化我的协调成本？

2. **编程规范** - 对于这个项目，你建议采用什么样的编程风格和规范？（考虑到Manus已经遇到了几次错误）

3. **准备工作** - 在正式开始编程之前，你认为需要做哪些准备工作？（例如：详细的需求文档、数据流图、API设计等）

4. **质量保证** - 你有什么建议来确保代码质量，避免Manus之前遇到的那些错误？

期待你的回复！



