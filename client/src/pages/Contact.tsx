/**
 * Contact Page - 申请联系页
 * 用户可以在此申请与目标用户联系
 */

import { useParams } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('请输入联系信息');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('申请已发送！对方家长将尽快与您联系');
      setLocation('/');
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">隐私保护</p>
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
