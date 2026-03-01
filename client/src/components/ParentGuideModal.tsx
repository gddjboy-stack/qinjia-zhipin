/**
 * Parent Guide Modal - 家长操作指南
 * 为首次访问的父母展示简单的三步骤使用指南
 */

import { X, CheckCircle, ClipboardList, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export default function ParentGuideModal({
  isOpen,
  onClose,
  onGetStarted
}: ParentGuideModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      number: '①',
      title: '注册我的信息',
      description: '点击"发布"按钮，填写孩子的基本信息（年龄、学历、职业等）',
      icon: ClipboardList,
      color: 'from-orange-400 to-orange-500'
    },
    {
      number: '②',
      title: '筛选孩子资料',
      description: '在首页按性别、年龄、地点等条件筛选，找到心仪的资料',
      icon: Search,
      color: 'from-blue-400 to-blue-500'
    },
    {
      number: '③',
      title: '联系亲家',
      description: '点击"申请联系"，向对方父母发送联系申请',
      icon: MessageSquare,
      color: 'from-green-400 to-green-500'
    }
  ];

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
              <h2 className="text-2xl font-bold">👋 欢迎来到亲家直聘</h2>
              <p className="text-sm text-orange-100 mt-1">三步快速找到心仪的亲家</p>
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
            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex gap-4">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent size={28} className="text-white" />
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-[#FF8C42]">{step.number}</span>
                        <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Key Features */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-orange-500" />
                平台保障
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>所有资料都经过实名认证，确保真实可靠</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>隐私保护：您的联系方式只有申请者能看到</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>24小时客服支持，有问题随时咨询</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">💡 小贴士</h4>
              <p className="text-sm text-blue-800">
                完整的资料信息（包括照片、年收入、房产等）会大大提高被匹配的概率。建议先完善自己孩子的信息哦！
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50"
                onClick={onClose}
              >
                稍后再看
              </Button>
              <Button
                className="flex-1 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] hover:from-[#FF7A2F] hover:to-[#FF6A1F] text-white font-bold"
                onClick={onGetStarted}
              >
                开始使用 →
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
