/**
 * Notifications Settings Page - 通知设置页
 * 用户可以控制接收哪些类型的通知
 */

import { useLocation } from 'wouter';
import { ArrowLeft, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { userSettings, updateNotificationSettings } = useData();
  const [settings, setSettings] = useState(userSettings.notifications);

  useEffect(() => {
    setSettings(userSettings.notifications);
  }, [userSettings.notifications]);

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateNotificationSettings(newSettings);
    toast.success('设置已保存');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => setLocation('/settings')}
          className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">通知设置</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Bell size={20} className="text-[#FF8C42]" />
          应用内通知
        </h2>

        <div className="space-y-3">
          {/* New Applications */}
          <div className="warm-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">🔔 新申请通知</h3>
              <p className="text-sm text-gray-600 mt-1">
                当有人向你发送申请时，首页会显示未读消息提醒
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={settings.newApplications}
                onChange={(e) => handleToggle('newApplications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42]"></div>
            </label>
          </div>

          {/* Message Replies */}
          <div className="warm-card p-4 flex items-center justify-between opacity-60">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">💬 消息回复通知</h3>
              <p className="text-sm text-gray-600 mt-1">
                敬请期待 - 即将推出消息回复功能
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={settings.messageReplies}
                onChange={(e) => handleToggle('messageReplies', e.target.checked)}
                disabled
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
            </label>
          </div>

          {/* Recommendations */}
          <div className="warm-card p-4 flex items-center justify-between opacity-60">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">⭐ 推荐更新通知</h3>
              <p className="text-sm text-gray-600 mt-1">
                敬请期待 - 即将推出个性化推荐功能
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={settings.recommendations}
                onChange={(e) => handleToggle('recommendations', e.target.checked)}
                disabled
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">✓ 隐私保护</p>
            <p>我们不会向你发送垃圾通知。你可以随时修改通知设置。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
