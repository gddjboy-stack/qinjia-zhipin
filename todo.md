# Claude架构审查修复清单

## P0 严重问题
- [x] 问题1：Home.tsx 申请按钮逻辑反向 - 移除allowApplications对发送申请的限制
- [x] 问题2：ProfileDetail.tsx mock数据电话号码硬编码为脱敏格式 - 改为完整号码
- [x] 问题3：ProfileDetail.tsx 脱敏正则使用贪婪匹配 - 改用精确数字匹配
- [x] 问题4：Publish.tsx 电话输入placeholder误导 - 改为完整号码提示
- [x] 问题5：Profile.tsx 个人中心直接暴露完整电话号码 - 添加脱敏处理

## P1 中等问题
- [ ] 问题6：CODING_STANDARDS.md 与实际代码接口定义不一致 - 以DataContext为准同步
- [ ] 中等1：userId未从DataContext暴露 - 添加到context并移除各页面直接读localStorage
- [ ] 中等2：markAllAsRead()会标记所有人消息已读 - 只标记当前用户的
- [ ] 中等3：Publish.tsx 性别未做必填验证 - 添加验证
- [ ] 中等4：Contact.tsx 用户发布资料无法被正确识别 - 从DataContext匹配
- [ ] 中等5：Profile.tsx 存在未使用的硬编码userInfo - 删除
- [ ] 中等6：ProfileDetail.tsx mock接口与DataContext字段名不一致 - 统一

## P2 改进建议
- [ ] 建议1：Mock数据集中管理 - 提取为lib/mockData.ts
- [ ] 建议2：电话号码脱敏提取为工具函数 - lib/utils.ts
- [ ] 建议3：收藏功能持久化 - 存入localStorage
- [ ] 建议4：重复申请检查 - 提交前去重
- [ ] 建议5：Base64图片压缩 - 限制500KB
- [ ] 建议6：电话号码格式验证 - 添加11位手机号正则
