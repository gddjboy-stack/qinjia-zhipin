# 完整方案测试计划

## 测试目标
验证完整方案中用户ID和消息路由逻辑的正确性。

## 测试场景

### 场景1：用户发布资料后收到申请
**步骤：**
1. 打开首页，关闭新用户引导弹窗
2. 点击"发布资料"按钮，进入发布页面
3. 填写完整的资料信息（所有必填字段）
4. 点击"发布"按钮
5. 返回首页，确认用户资料显示在首位，带有"我的资料"标签
6. 点击其他用户的卡片（如"王芳"）
7. 点击"申请联系"按钮
8. 填写联系信息，点击"发送申请"
9. 返回首页，确认"我的资料"卡片上显示未读消息徽章（红色，显示"1"）
10. 点击"我的资料"卡片进入个人中心
11. 在"收到的联系申请"部分，确认显示申请者的信息

**预期结果：**
- ✅ 用户资料成功发布
- ✅ 申请成功提交
- ✅ 首页徽章显示"1"条未读消息
- ✅ 个人中心显示收到的申请

### 场景2：验证消息路由正确性
**步骤：**
1. 在浏览器开发者工具中打开localStorage
2. 查看 `qinjia_contact_requests` 中的数据
3. 验证最新的申请记录中：
   - `fromUserId` 是当前用户的ID
   - `toUserId` 是目标用户的ID（mock_user_2等）
   - `fromProfileId` 是申请者的资料ID
   - `toProfileId` 是被申请者的资料ID

**预期结果：**
- ✅ `fromUserId` 和 `toUserId` 不同
- ✅ 申请者和被申请者的身份正确区分
- ✅ 所有字段都正确填充

### 场景3：验证未读消息计算
**步骤：**
1. 在浏览器开发者工具中打开Console
2. 执行以下代码：
   ```javascript
   const userId = localStorage.getItem('qinjia_user_id');
   const contacts = JSON.parse(localStorage.getItem('qinjia_contact_requests'));
   const unread = contacts.filter(c => !c.isRead && c.toUserId === userId).length;
   console.log('当前用户ID:', userId);
   console.log('总申请数:', contacts.length);
   console.log('发送给我的申请数:', contacts.filter(c => c.toUserId === userId).length);
   console.log('发送给我的未读申请数:', unread);
   ```
3. 验证输出结果与首页徽章显示的数字一致

**预期结果：**
- ✅ 未读消息数计算正确
- ✅ 只统计 `toUserId === userId` 的消息
- ✅ 首页徽章显示的数字与计算结果一致

### 场景4：验证Profile.tsx过滤逻辑
**步骤：**
1. 进入个人中心
2. 在浏览器开发者工具中打开Console
3. 执行以下代码：
   ```javascript
   const userId = localStorage.getItem('qinjia_user_id');
   const contacts = JSON.parse(localStorage.getItem('qinjia_contact_requests'));
   const incoming = contacts.filter(c => c.toUserId === userId);
   console.log('当前用户ID:', userId);
   console.log('收到的申请:', incoming);
   ```
4. 验证输出结果与个人中心显示的申请列表一致

**预期结果：**
- ✅ 个人中心只显示发送给当前用户的申请
- ✅ 不显示由当前用户发送的申请
- ✅ 过滤逻辑正确

### 场景5：验证多个申请的处理
**步骤：**
1. 点击多个不同用户的卡片（如"李明"、"张浩"等）
2. 对每个用户都发送一个申请
3. 返回首页，确认徽章显示正确的未读消息数
4. 进入个人中心，确认所有申请都显示在列表中
5. 点击"复制信息"按钮，验证可以复制申请者的信息

**预期结果：**
- ✅ 首页徽章显示正确的申请数（如"3"）
- ✅ 个人中心显示所有申请
- ✅ 可以复制申请者的信息

### 场景6：验证已读状态
**步骤：**
1. 在个人中心查看申请列表
2. 确认申请旁边有红点（未读标记）
3. 返回首页，再次进入个人中心
4. 确认所有申请的红点消失（已标记为已读）
5. 确认首页徽章消失（未读消息数为0）

**预期结果：**
- ✅ 进入个人中心时自动标记所有消息为已读
- ✅ 红点消失
- ✅ 首页徽章消失

## 测试环境
- 浏览器：Chrome/Safari/Firefox
- localStorage：启用
- 开发者工具：启用

## 测试工具
- 浏览器开发者工具（F12）
- localStorage查看器
- Console控制台

## 注意事项
- 每次测试前可以清空localStorage重新开始
- 测试时注意观察控制台是否有错误信息
- 验证所有字段都正确填充，特别是userId字段
