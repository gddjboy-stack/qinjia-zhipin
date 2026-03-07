/**
 * Services - 统一导出入口
 *
 * Service层是 Context 和数据源（localStorage/API）之间的抽象层。
 * MVP阶段所有Service操作localStorage，Pro阶段只需修改Service内部实现。
 *
 * 使用方式：
 * import { profileService, contactService } from '@/services';
 * // 或者
 * import * as profileService from '@/services/profileService';
 */

export * as authService from './authService';
export * as profileService from './profileService';
export * as contactService from './contactService';
export * as settingsService from './settingsService';
export * as analyticsService from './analyticsService';
