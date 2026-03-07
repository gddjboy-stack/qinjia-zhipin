/**
 * 统一错误处理 - AppError 类和预定义错误
 *
 * 设计原则（与Claude共同确认）：
 * - Service层统一抛出 AppError，不直接抛出原生 Error
 * - Context层捕获 AppError，转化为 UI 状态（loading/error/data 三态）
 * - UI层展示用户友好的中文提示
 * - MVP阶段：console.error + localStorage存储
 * - Pro阶段：发送到后端错误收集API
 */

export class AppError extends Error {
  constructor(
    message: string,                    // 用户友好的中文提示
    public code: string,                // 错误码，如 'NETWORK_ERROR'
    public statusCode?: number,         // HTTP状态码（API错误时使用）
    public retryable: boolean = false,  // 是否可以重试
    public originalError?: unknown      // 原始错误（用于日志）
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 预定义的常见错误
 * 注意：每次使用时应 new 一个新实例，避免共享同一个错误对象
 */
export const Errors = {
  NETWORK: () =>
    new AppError('网络连接失败，请检查网络后重试', 'NETWORK_ERROR', undefined, true),

  AUTH_EXPIRED: () =>
    new AppError('登录已过期，请重新登录', 'AUTH_EXPIRED', 401, false),

  NOT_FOUND: () =>
    new AppError('请求的内容不存在', 'NOT_FOUND', 404, false),

  SERVER: () =>
    new AppError('服务器开小差了，请稍后重试', 'SERVER_ERROR', 500, true),

  PAYMENT: () =>
    new AppError('支付失败，请稍后重试', 'PAYMENT_ERROR', undefined, true),

  STORAGE: () =>
    new AppError('数据保存失败，请重试', 'STORAGE_ERROR', undefined, true),

  VALIDATION: (message: string) =>
    new AppError(message, 'VALIDATION_ERROR', 400, false),

  PERMISSION: () =>
    new AppError('您没有权限执行此操作', 'PERMISSION_ERROR', 403, false),
};

/**
 * 判断是否为 AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 将任意错误转换为 AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', undefined, false, error);
  }
  return new AppError('发生了未知错误，请重试', 'UNKNOWN_ERROR', undefined, false, error);
}

/**
 * 错误上报（MVP阶段打印到console，Pro阶段替换为API调用）
 */
export function reportError(error: AppError, context?: Record<string, unknown>): void {
  console.error('[AppError]', {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    retryable: error.retryable,
    context,
    originalError: error.originalError,
  });

  // Pro阶段：发送到后端错误收集API
  // analyticsService.trackError(error, context);
}

/**
 * 异步状态类型（Context层通用）
 * 用于管理 loading / error / data 三态
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

/**
 * 创建初始异步状态
 */
export function createAsyncState<T>(initialData: T | null = null): AsyncState<T> {
  return { data: initialData, loading: false, error: null };
}

/**
 * 创建加载中状态
 */
export function loadingState<T>(): AsyncState<T> {
  return { data: null, loading: true, error: null };
}

/**
 * 创建成功状态
 */
export function successState<T>(data: T): AsyncState<T> {
  return { data, loading: false, error: null };
}

/**
 * 创建错误状态
 */
export function errorState<T>(error: AppError): AsyncState<T> {
  return { data: null, loading: false, error };
}
