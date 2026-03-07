/**
 * composeProviders - Provider嵌套扁平化工具
 *
 * 解决"Provider地狱"问题：将多层嵌套的 Provider 转换为单一组件
 *
 * 使用方式：
 * ```tsx
 * // 顺序重要：排在前面的 Provider 是外层，后面的可以访问前面的 Context
 * const AppProviders = composeProviders([
 *   AuthProvider,          // 最外层：提供 userId，被所有其他 Context 依赖
 *   ProfileProvider,       // 依赖 Auth（需要 userId）
 *   ContactProvider,       // 依赖 Auth（需要 userId）
 *   SettingsProvider,      // 依赖 Auth（需要 userId）
 *   UIProvider,            // 无依赖，放最内层
 * ]);
 *
 * // App.tsx 中
 * <AppProviders>
 *   <Router />
 * </AppProviders>
 * ```
 *
 * 新增 Provider 时只需在数组中加一行，不需要修改嵌套结构。
 */

import React from 'react';

type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>;

/**
 * 将多个 Provider 组合为单一组件
 * @param providers - Provider 数组，顺序即为嵌套顺序（第一个为最外层）
 */
export function composeProviders(providers: ProviderComponent[]) {
  return function AppProviders({ children }: { children: React.ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    ) as React.ReactElement;
  };
}
