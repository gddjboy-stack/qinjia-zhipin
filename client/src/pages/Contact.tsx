/**
 * Contact Page - 申请联系页
 * 用户可以在此申请与目标用户联系
 * 申请提交后会保存到全局状态，并在首页显示未读提醒
 * 
 * 完整方案：正确记录申请者和被申请者的用户ID，为升级Pro版本做准备
 */

import { useParams } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useContacts } from '@/contexts/ContactContext';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { getMockProfileBrief } from '@/lib/mockData';

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { userId } = useAuth();
  const { userProfile } = useProfile();
  const { addContactRequest, contactRequests } = useContacts();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 优先从userProfile匹配用户发布的资料，否则从集中管理的mock数据查找
  let targetProfile: { childName: string; parentName: string; userId: string };
  if (userProfile && userProfile.id === id) {
    targetProfile = {
      childName: userProfile.childName,
      parentName: userProfile.parentName,
      userId: userProfile.userId
    };
  } else {
    targetProfile = getMockProfileBrief(id || '') || { childName: '用户', parentName: '家长', userId: 'unknown' };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('请输入联系信息');
      return;
    }

    // 如果用户没有发布资料，无法接收申请
    if (!userProfile) {
      toast.error('请先发布您的资料后再申请联系');
      setLocation('/publish');
      return;
    }

    // 检查是否已经向该资料发送过申请
    const hasDuplicate = contactRequests.some(
      req => req.fromUserId === userId && req.toProfileId === id
    );
    if (hasDuplicate) {
      toast.error('您已经向该资料发送过申请，请勿重复发送');
      return;
    }

    setIsSubmitting(true);
    
    // 埋点：申请提交
    trackEvent(ANALYTICS_EVENTS.APPLICATION_SUBMIT, {
      to_profile_id: id,
      message_length: message.length
    });
    
    // Simulate API call
    setTimeout(() => {
      // 添加联系申请到全局状态
      // 完整方案：正确记录申请者(fromUserId)和被申请者(toUserId)的用户ID
      addContactRequest({
        fromUserId: userId,                        // 申请者的用户ID（当前用户）
        fromProfileId: userProfile?.id || 'unknown',  // 申请者的资料ID
        fromParentName: userProfile?.parentName || '未知',  // 申请者的家长名字
        fromChildName: userProfile?.childName || '未知',    // 申请者的孩子名字
        fromPhone: userProfile?.parentPhone,               // 申请者电话，accepted 后对被申请方可见
        toUserId: targetProfile.userId,            // 被申请者的用户ID（目标用户）
        toProfileId: id || '',                     // 被申请者的资料ID
        toParentName: targetProfile.parentName,    // 被申请者的家长名字
        toChildName: targetProfile.childName,      // 被申请者的孩子名字
        message: message
      });

      setIsSubmitting(false);
      toast.success('申请已发送！对方家长将尽快与您联系');
      
      // 延迟后返回首页
      setTimeout(() => {
        setLocation('/');
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => setLocation(`/profile/${id}`)}
          className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">申请联系</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Info Box */}
        <div className="warm-card bg-orange-50 border border-orange-200">
          <div className="flex gap-3">
            <CheckCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">申请说明</p>
              <p>您的申请将发送给对方家长。请在下方输入您的联系信息和简短介绍，帮助对方了解您。</p>
            </div>
          </div>
        </div>

        {/* Target Profile Info */}
        <div className="warm-card bg-blue-50 border border-blue-200">
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">您要申请联系：</p>
            <p><span className="font-bold">{targetProfile.childName}</span> ({targetProfile.parentName}的孩子)</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="warm-card">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              您的联系信息
            </label>
            <Textarea
              placeholder="请输入您的姓名、电话、微信等联系方式，以及简短的自我介绍..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-32"
            />
            <p className="text-xs text-gray-500 mt-2">
              建议包含：姓名、年龄、职业、联系方式、简短的自我介绍
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-xs text-green-800">
              <p className="font-semibold mb-1">✓ 隐私保护</p>
              <p>您的信息将被安全保存，仅用于此次配对。我们不会将您的信息用于其他目的。</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF8C42] hover:bg-[#FF7A2F] text-white py-3 text-lg"
          >
            {isSubmitting ? '发送中...' : '发送申请'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setLocation(`/profile/${id}`)}
          >
            返回
          </Button>
        </form>
      </div>
    </div>
  );
}
