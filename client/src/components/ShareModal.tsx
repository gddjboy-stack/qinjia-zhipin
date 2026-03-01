/**
 * Share Modal - 分享弹窗
 * 允许用户分享资料卡片到微信、微博等平台
 * 不涉及隐私信息（如电话号码）
 */

import { X, Share2, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    childName: string;
    childAge: number;
    childGender: 'male' | 'female';
    childEducation: string;
    childOccupation: string;
    workCity: string;
    hasHousing: 'yes' | 'no' | 'unknown';
    hasCar: 'yes' | 'no' | 'unknown';
    annualIncome: string;
    nativePlace: string;
    zodiacSign: string;
    parentName: string;
  };
}

export default function ShareModal({ isOpen, onClose, profile }: ShareModalProps) {
  if (!isOpen) return null;

  // 生成分享文本
  const generateShareText = () => {
    const genderText = profile.childGender === 'male' ? '儿子' : '女儿';
    const housingText = profile.hasHousing === 'yes' ? '有房' : profile.hasHousing === 'no' ? '无房' : '未知';
    const carText = profile.hasCar === 'yes' ? '有车' : profile.hasCar === 'no' ? '无车' : '未知';

    return `【亲家直聘】推荐您看看${profile.parentName}的${genderText}
📋 基本信息：
• 姓名：${profile.childName}
• 年龄：${profile.childAge}岁
• 学历：${profile.childEducation}
• 职业：${profile.childOccupation}
• 工作地：${profile.workCity}

💰 资产情况：
• 房产：${housingText}
• 车产：${carText}
• 年收入：${profile.annualIncome}

✨ 其他信息：
• 籍贯：${profile.nativePlace}
• 属相：${profile.zodiacSign}

👉 点击链接查看完整资料：亲家直聘 H5
(在微信中打开)`;
  };

  const shareText = generateShareText();

  // 分享到微信（通过复制到剪贴板）
  const handleShareToWeChat = () => {
    navigator.clipboard.writeText(shareText);
    toast.success('已复制到剪贴板，粘贴到微信分享吧！');
    onClose();
  };

  // 分享到微博（生成微博分享链接）
  const handleShareToWeibo = () => {
    const weiboShareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText.split('\n')[0])}&pic=`;
    window.open(weiboShareUrl, '_blank');
    toast.success('正在打开微博分享...');
  };

  // 复制分享链接
  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success('已复制分享链接');
    onClose();
  };

  // 复制分享文本
  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    toast.success('已复制分享文本');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Slide up from bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-6 py-6 flex items-center justify-between rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-bold">📤 分享资料</h2>
              <p className="text-sm text-orange-100 mt-1">让更多人看到这份优质资料</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            {/* Share Preview */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-bold text-gray-800 mb-3">📋 分享预览</h3>
              <div className="bg-white p-3 rounded text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto">
                <p className="font-semibold text-orange-600 mb-2">{shareText.split('\n')[0]}</p>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{shareText.split('\n').slice(1, 6).join('\n')}</p>
                <p className="text-xs text-gray-500 mt-2">...</p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">选择分享方式</h3>

              {/* WeChat Share */}
              <button
                onClick={handleShareToWeChat}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-lg">
                  <MessageCircle size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">分享到微信</p>
                  <p className="text-sm text-gray-600">复制文本，粘贴到微信朋友圈或群聊</p>
                </div>
                <span className="text-green-600 font-bold">→</span>
              </button>

              {/* Weibo Share */}
              <button
                onClick={handleShareToWeibo}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 rounded-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-lg">
                  <Share2 size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">分享到微博</p>
                  <p className="text-sm text-gray-600">在微博上发布这份资料</p>
                </div>
                <span className="text-red-600 font-bold">→</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-lg">
                  <Copy size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">复制链接</p>
                  <p className="text-sm text-gray-600">复制H5链接，分享到任何平台</p>
                </div>
                <span className="text-blue-600 font-bold">→</span>
              </button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">💡 分享小贴士</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ 分享内容不包含隐私信息，安全可靠</li>
                <li>✓ 分享给朋友或群聊，帮助亲家找到合适的伴侣</li>
                <li>✓ 分享次数越多，资料被看到的概率越高</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <Button
                className="w-full py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] hover:from-[#FF7A2F] hover:to-[#FF6A1F] text-white font-bold"
                onClick={onClose}
              >
                关闭
              </Button>
            </div>

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}
