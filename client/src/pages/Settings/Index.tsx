/**
 * Settings Center Page - 设置中心
 * 用户可以访问所有设置选项
 */

import { useLocation } from 'wouter';
import { ArrowLeft, Lock, Bell, Info } from 'lucide-react';

export default function Settings() {
  const [, setLocation] = useLocation();

  const settingsOptions = [
    {
      icon: Lock,
      title: '隐私设置',
      description: '控制你的资料和申请的可见性',
      path: '/settings/privacy',
      color: 'text-[#FF8C42]'
    },
    {
      icon: Bell,
      title: '通知设置',
      description: '管理你想要接收的通知类型',
      path: '/settings/notifications',
      color: 'text-[#4A90E2]'
    },
    {
      icon: Info,
      title: '关于我们',
      description: '了解应用信息和服务条款',
      path: '/settings/about',
      color: 'text-[#10B981]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => setLocation('/profile')}
          className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">设置</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {settingsOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.path}
              onClick={() => setLocation(option.path)}
              className="w-full warm-card p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className={`${option.color} flex-shrink-0`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800">{option.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
              <div className="text-gray-400 flex-shrink-0">
                →
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="px-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 提示</p>
            <p>你的所有设置都会自动保存。隐私设置会立即生效，其他用户将看不到被隐藏的信息。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
