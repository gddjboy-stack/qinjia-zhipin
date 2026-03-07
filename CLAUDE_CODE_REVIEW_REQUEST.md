# 亲家直聘 - 代码架构审查请求

Claude，你好！

代码已经推送到GitHub Public仓库。请帮我对整个项目进行**架构审查**，重点关注代码质量、数据结构设计、潜在问题和未来扩展性。

---

## 📦 仓库地址

**GitHub仓库主页**：https://github.com/gddjboy-stack/qinjia-zhipin

---

## 📂 关键文件链接（raw格式，可直接读取）

### 核心数据管理
- **DataContext.tsx**（全局状态管理，所有数据结构定义）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/contexts/DataContext.tsx

### 主要页面
- **Home.tsx**（首页，展示资料卡片列表）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Home.tsx

- **ProfileDetail.tsx**（资料详情页，展示完整资料信息）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/ProfileDetail.tsx

- **Publish.tsx**（发布页，用户填写和提交资料）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Publish.tsx

- **Contact.tsx**（申请联系页，提交联系申请）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Contact.tsx

- **Profile.tsx**（个人中心，查看收到的申请）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Profile.tsx

### 设置页面
- **Settings/Privacy.tsx**（隐私设置）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Settings/Privacy.tsx

- **Settings/Notifications.tsx**（通知设置）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Settings/Notifications.tsx

- **Settings/About.tsx**（关于我们）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Settings/About.tsx

- **Settings/Index.tsx**（设置中心入口）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/pages/Settings/Index.tsx

### 路由和入口
- **App.tsx**（路由配置）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/client/src/App.tsx

### 编码规范
- **CODING_STANDARDS.md**（编码规范文档）
  https://raw.githubusercontent.com/gddjboy-stack/qinjia-zhipin/main/CODING_STANDARDS.md

---

## 🎯 请重点审查以下方面

### 1. 数据结构设计
- UserPublishedProfile 接口是否合理？
- ContactRequest 接口是否完整？
- UserSettings 接口是否覆盖所有需求？
- 字段命名是否清晰、无歧义？

### 2. 状态管理
- DataContext 的设计是否合理？
- localStorage 的使用是否正确？
- 数据流是否清晰？

### 3. 隐私设置逻辑
- 隐私设置是否在所有页面正确应用？
- 默认值是否正确（默认显示，主动关闭才隐藏）？
- 总开关（pauseAll）的逻辑是否正确？

### 4. 消息路由
- fromUserId 和 toUserId 的使用是否正确？
- 未读消息计数是否只统计发给当前用户的消息？
- 消息过滤逻辑是否正确？

### 5. 未来扩展性
- 升级Pro（添加数据库、用户认证）时，需要修改哪些地方？
- 是否有需要预留的接口？
- 当前架构是否支持未来的功能扩展（如实时聊天、匹配算法）？

### 6. 潜在问题
- 是否有逻辑错误或边界情况未处理？
- 是否有性能问题？
- 是否有安全隐患？

---

## 📋 已知的历史问题（已修复）

以下是之前开发中遇到的问题，已经修复，但请确认修复是否彻底：

1. **字段混淆** - childLocation 和 parentLocation 曾被混淆
2. **电话号码硬编码** - 曾使用 '138****1234' 代替实际号码
3. **缺少输入框** - childLocation 字段曾缺少对应的表单输入框
4. **404问题** - 用户发布的资料（动态UUID）曾无法在详情页显示
5. **隐私设置默认值** - 曾错误地默认隐藏信息

---

## 📝 期望的审查输出格式

请按以下格式返回审查意见：

```markdown
## 🔴 严重问题（必须修复）
1. 问题描述
   - 位置：文件名 + 行号/函数名
   - 影响：影响范围
   - 建议修复方案

## 🟡 中等问题（建议修复）
1. 问题描述
   - ...

## 🟢 改进建议（可选优化）
1. 改进点
   - ...

## 🏗️ 架构建议
1. 建议内容
   - ...

## 🚀 未来扩展建议
1. 建议内容
   - ...
```

谢谢！
