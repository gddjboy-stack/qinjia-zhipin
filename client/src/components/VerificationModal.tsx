/**
 * Verification Modal - 认证详情弹窗
 * 显示资料的认证信息，增强用户信任度
 */

import { X, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  parentName: string;
  certifications: {
    phoneVerified: boolean;
    idVerified: boolean;
    profileVerified: boolean;
  };
  verificationDate?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  childName,
  parentName,
  certifications,
  verificationDate
}: VerificationModalProps) {
  if (!isOpen) return null;

  const verificationItems = [
    {
      title: '手机号实名',
      description: '已验证发布者的手机号码真实性',
      verified: certifications.phoneVerified,
      icon: '📱'
    },
    {
      title: '身份证实名',
      description: '已验证发布者的身份证信息',
      verified: certifications.idVerified,
      icon: '🆔'
    },
    {
      title: '资料真实性',
      description: '已验证发布的子女信息真实有效',
      verified: certifications.profileVerified,
      icon: '✓'
    }
  ];

  const verifiedCount = Object.values(certifications).filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-4 py-4 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-lg font-bold">认证信息</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-6 space-y-6">
            {/* Profile Info */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">资料所有者</p>
              <p className="text-lg font-bold text-gray-800">
                {parentName}的{childName}
              </p>
            </div>

            {/* Verification Summary */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <p className="font-bold text-green-800">认证进度</p>
              </div>
              <p className="text-sm text-green-700">
                已完成 <span className="font-bold">{verifiedCount}/3</span> 项认证
              </p>
            </div>

            {/* Verification Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">认证详情</h3>
              {verificationItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    item.verified
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        {item.verified ? (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} />
                            已认证
                          </span>
                        ) : (
                          <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                            待认证
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Date */}
            {verificationDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Clock size={16} />
                <span>
                  认证时间：{new Date(verificationDate).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}

            {/* Trust Message */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-bold">安全提示：</span>
                我们严格审核每一份资料。如发现虚假信息，将立即下架并处理。您可以放心使用本平台。
              </p>
            </div>

            {/* Close Button */}
            <Button
              className="w-full bg-[#FF8C42] hover:bg-[#FF7A2F] text-white py-3"
              onClick={onClose}
            >
              关闭
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
