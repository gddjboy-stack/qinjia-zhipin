/**
 * Placeholder.tsx
 * 占位页面组件，用于 Pro 阶段尚未实现的功能路由
 * Pro 阶段替换为对应的真实页面组件
 */

import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: string;
}

export function PlaceholderPage({ title, description, icon = '🚧' }: PlaceholderPageProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col items-center justify-center px-6 pb-24">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">{icon}</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{description}</p>
        <Button
          variant="outline"
          onClick={() => setLocation('/')}
          className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
        >
          返回首页
        </Button>
      </div>
    </div>
  );
}

// 认证页面占位（Pro 阶段替换为 Manus OAuth 流程）
export function AuthPage() {
  return (
    <PlaceholderPage
      title="身份认证"
      description="实名认证功能即将上线，认证后可获得专属认证标识，提升可信度。"
      icon="🔐"
    />
  );
}

// 支付/会员页面占位（Pro 阶段替换为 Stripe 支付流程）
export function PricingPage() {
  return (
    <PlaceholderPage
      title="会员认证"
      description="付费认证功能即将上线，认证会员可享受优先展示、更多曝光等专属权益。"
      icon="⭐"
    />
  );
}

// 后台管理页面占位（Pro 阶段替换为完整管理后台）
export function AdminPage() {
  return (
    <PlaceholderPage
      title="管理后台"
      description="管理后台功能正在开发中，将提供用户管理、数据统计、内容审核等功能。"
      icon="📊"
    />
  );
}
