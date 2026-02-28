/**
 * Profile Page - 个人中心
 * 用户可以管理自己的信息和已联系的亲家
 */

import { useLocation } from 'wouter';
import { LogOut, Edit2, Heart, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ContactItem {
  id: string;
  childName: string;
  parentName: string;
  status: 'pending' | 'accepted';
  timestamp: string;
}

const mockContacts: ContactItem[] = [
  {
    id: '1',
    childName: '王芳',
    parentName: '王先生',
    status: 'pending',
    timestamp: '2小时前'
  },
  {
    id: '2',
    childName: '张浩',
    parentName: '张女士',
    status: 'accepted',
    timestamp: '1天前'
  }
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const [userInfo] = useState({
    name: '李女士',
    phone: '138****1234',
    childName: '李明',
    childAge: 32,
    isVerified: true
  });

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
            {userInfo.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">{userInfo.name}</h2>
            <p className="text-sm text-gray-600">{userInfo.childName}的家长</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-[#E8E8E6] pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">联系电话</span>
            <span className="font-semibold text-gray-800">{userInfo.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">孩子</span>
            <span className="font-semibold text-gray-800">{userInfo.childName} ({userInfo.childAge}岁)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">认证状态</span>
            <span className="warm-badge warm-badge-verified">已认证</span>
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

      {/* Contacts Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-[#FF8C42]" />
          已联系的亲家 ({mockContacts.length})
        </h3>

        <div className="space-y-3">
          {mockContacts.map((contact) => (
            <div key={contact.id} className="warm-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-800">{contact.childName}</h4>
                  <p className="text-sm text-gray-600">{contact.parentName}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  contact.status === 'accepted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {contact.status === 'accepted' ? '已接受' : '待回复'}
                </span>
              </div>
              <p className="text-xs text-gray-500">{contact.timestamp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings size={20} className="text-[#4A90E2]" />
          设置
        </h3>

        <div className="warm-card space-y-3">
          <button className="w-full text-left py-3 border-b border-[#E8E8E6] hover:text-[#FF8C42] transition-colors">
            <span className="text-gray-800 font-semibold">隐私设置</span>
          </button>
          <button className="w-full text-left py-3 border-b border-[#E8E8E6] hover:text-[#FF8C42] transition-colors">
            <span className="text-gray-800 font-semibold">通知设置</span>
          </button>
          <button className="w-full text-left py-3 hover:text-[#FF8C42] transition-colors">
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
