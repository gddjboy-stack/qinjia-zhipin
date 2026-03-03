/**
 * Privacy Settings Page - 隐私设置页
 * 用户可以控制个人资料和申请的可见性
 */

import { useLocation } from 'wouter';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

export default function Privacy() {
  const [, setLocation] = useLocation();
  const { userSettings, updatePrivacySettings } = useData();
  const [settings, setSettings] = useState(userSettings.privacy);

  useEffect(() => {
    setSettings(userSettings.privacy);
  }, [userSettings.privacy]);

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updatePrivacySettings(newSettings);
    toast.success('设置已保存');
  };

  // 当总开关关闭时，其他选项也应该关闭
  const handlePauseToggle = (value: boolean) => {
    if (value) {
      // 关闭总开关时，关闭所有其他选项
      const newSettings = {
        pauseReceivingApplications: true,
        showProfile: false,
        allowApplications: false,
        showLocation: false,
        showContact: false
      };
      setSettings(newSettings);
      updatePrivacySettings(newSettings);
      toast.success('已暂停接收申请');
    } else {
      // 打开总开关时，恢复默认设置
      const newSettings = {
        pauseReceivingApplications: false,
        showProfile: true,
        allowApplications: true,
        showLocation: true,
        showContact: true
      };
      setSettings(newSettings);
      updatePrivacySettings(newSettings);
      toast.success('已恢复接收申请');
    }
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
        <h1 className="text-lg font-bold text-gray-800">隐私设置</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={20} className="text-[#FF8C42]" />
            快速设置
          </h2>

          <div className="warm-card p-4 border-l-4 border-[#FF8C42]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">🔒 暂停接收申请</h3>
                <p className="text-sm text-gray-600 mt-1">
                  关闭后，其他用户无法看到你的资料和申请联系
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.pauseReceivingApplications}
                  onChange={(e) => handlePauseToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Detailed Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">详细设置</h2>

          <div className="space-y-3">
            {/* Show Profile */}
            <div className="warm-card p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">显示我的资料</h3>
                <p className="text-sm text-gray-600 mt-1">
                  关闭后，你的资料不会在首页显示
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.showProfile && !settings.pauseReceivingApplications}
                  onChange={(e) => handleToggle('showProfile', e.target.checked)}
                  disabled={settings.pauseReceivingApplications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>

            {/* Allow Applications */}
            <div className="warm-card p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">接收申请</h3>
                <p className="text-sm text-gray-600 mt-1">
                  关闭后，其他用户无法向你发送申请
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.allowApplications && !settings.pauseReceivingApplications}
                  onChange={(e) => handleToggle('allowApplications', e.target.checked)}
                  disabled={settings.pauseReceivingApplications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>

            {/* Show Location */}
            <div className="warm-card p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">显示位置信息</h3>
                <p className="text-sm text-gray-600 mt-1">
                  关闭后，你的位置信息不会显示在资料卡片上
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.showLocation && !settings.pauseReceivingApplications}
                  onChange={(e) => handleToggle('showLocation', e.target.checked)}
                  disabled={settings.pauseReceivingApplications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>

            {/* Show Contact */}
            <div className="warm-card p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">显示联系方式</h3>
                <p className="text-sm text-gray-600 mt-1">
                  关闭后，你的电话号码不会显示在资料卡片上
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.showContact && !settings.pauseReceivingApplications}
                  onChange={(e) => handleToggle('showContact', e.target.checked)}
                  disabled={settings.pauseReceivingApplications}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF8C42]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF8C42] disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 提示</p>
            <p>你的隐私设置会立即生效。其他用户将看不到被隐藏的信息。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
