/**
 * Profile Page - 个人中心
 * 显示用户发布的资料信息，或在未发布时显示空白提示
 * 与Publish页面联动，保持数据一致
 * 
 * 完整方案：只显示发送给当前用户的申请
 */

import { useLocation } from 'wouter';
import { LogOut, Edit2, Heart, MessageCircle, Settings, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import type { ContactRequest } from '@/contexts/DataContext';
import { maskPhone } from '@/lib/utils';

export default function Profile() {
  const [, setLocation] = useLocation();
  const { userId, userProfile, contactRequests, markAllAsRead, unreadCount } = useData();

  // 当用户进入个人中心时，标记所有消息为已读
  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, []);

  // 只显示发送给当前用户的申请
  const incomingRequests: ContactRequest[] = contactRequests.filter(
    (req) => req.toUserId === userId
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  // 如果用户未发布过资料，显示空白提示
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pb-20 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-4 py-6 text-center">
          <h1 className="text-2xl font-bold">个人中心</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-6xl mb-6">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">还未发布资料</h2>
          <p className="text-gray-600 text-center mb-8 max-w-xs">
            发布您孩子的资料，让感兴趣的家长主动联系您
          </p>
          <Button
            className="bg-[#FF8C42] hover:bg-[#FF7A2F] text-white px-8 py-3 text-lg flex items-center gap-2"
            onClick={() => setLocation('/publish')}
          >
            <Plus size={20} />
            发布资料
          </Button>
        </div>

        {/* CTA Section */}
        <div className="px-4 pb-6 space-y-3">
          <Button
            variant="outline"
            className="w-full border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white flex items-center justify-center gap-2"
            onClick={() => setLocation('/')}
          >
            <Heart size={18} />
            浏览推荐
          </Button>
        </div>
      </div>
    );
  }

  // 用户已发布资料，显示详细信息
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-4 py-6 text-center">
        <h1 className="text-2xl font-bold">个人中心</h1>
      </div>

      {/* User Info Card */}
      <div className="mx-4 -mt-8 relative z-10 warm-card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF7A2F] flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.parentName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">{userProfile.parentName}</h2>
            <p className="text-sm text-gray-600">{userProfile.childName}的家长</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-[#E8E8E6] pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">联系电话</span>
            <span className="font-semibold text-gray-800">
              {maskPhone(userProfile.parentPhone)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">孩子</span>
            <span className="font-semibold text-gray-800">{userProfile.childName} ({userProfile.childAge}岁)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">所在城市</span>
            <span className="font-semibold text-gray-800">{userProfile.childLocation || userProfile.parentLocation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">认证状态</span>
            <span className="warm-badge warm-badge-verified">已认证</span>
          </div>
        </div>
      </div>

      {/* Child Details */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">孩子详情</h3>
        <div className="warm-card space-y-4">
          <div>
            <label className="text-sm text-gray-600">学历</label>
            <p className="font-semibold text-gray-800">{userProfile.childEducation}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">职业</label>
            <p className="font-semibold text-gray-800">{userProfile.childOccupation}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">个人介绍</label>
            <p className="text-gray-700 leading-relaxed">{userProfile.childDescription}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-6 space-y-3">
        <Button
          className="w-full bg-[#4A90E2] hover:bg-[#3A7FD2] text-white flex items-center justify-center gap-2"
          onClick={() => setLocation('/publish')}
        >
          <Edit2 size={18} />
          编辑资料
        </Button>
        <Button
          variant="outline"
          className="w-full border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white flex items-center justify-center gap-2"
          onClick={() => setLocation('/')}
        >
          <Heart size={18} />
          浏览推荐
        </Button>
      </div>

      {/* Contact Requests Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-[#FF8C42]" />
          收到的联系申请 ({incomingRequests.length})
        </h3>

        {incomingRequests.length > 0 ? (
          <div className="space-y-3">
            {incomingRequests.map((request) => (
              <div key={request.id} className="warm-card border-l-4 border-[#FF8C42]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{request.fromChildName}</h4>
                    <p className="text-sm text-gray-600">{request.fromParentName}的孩子</p>
                  </div>
                  {!request.isRead && (
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2"></span>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-[#F5F5F3] p-3 rounded-lg mb-3 line-clamp-3">
                  {request.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatTime(request.timestamp)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white text-xs"
                    onClick={() => {
                      // Copy contact info
                      const contactInfo = `${request.fromParentName}\n${request.message}`;
                      navigator.clipboard.writeText(contactInfo);
                    }}
                  >
                    复制信息
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="warm-card text-center py-8">
            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600">暂无联系申请</p>
            <p className="text-sm text-gray-500 mt-2">感兴趣的家长会向您发送申请</p>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings size={20} className="text-[#4A90E2]" />
          设置
        </h3>

        <div className="warm-card space-y-3">
          <button
            onClick={() => setLocation('/settings/privacy')}
            className="w-full text-left py-3 border-b border-[#E8E8E6] hover:text-[#FF8C42] transition-colors"
          >
            <span className="text-gray-800 font-semibold">隐私设置</span>
          </button>
          <button
            onClick={() => setLocation('/settings/notifications')}
            className="w-full text-left py-3 border-b border-[#E8E8E6] hover:text-[#FF8C42] transition-colors"
          >
            <span className="text-gray-800 font-semibold">通知设置</span>
          </button>
          <button
            onClick={() => setLocation('/settings/about')}
            className="w-full text-left py-3 hover:text-[#FF8C42] transition-colors"
          >
            <span className="text-gray-800 font-semibold">关于我们</span>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 mb-6">
        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          退出登录
        </Button>
      </div>
    </div>
  );
}
