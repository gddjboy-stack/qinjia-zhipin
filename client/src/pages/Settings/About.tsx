/**
 * About Us Page - 关于我们页
 * 显示应用信息、服务条款、隐私政策和客服联系方式
 */

import { useLocation } from 'wouter';
import { ArrowLeft, MessageCircle, FileText, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function About() {
  const [, setLocation] = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
        <h1 className="text-lg font-bold text-gray-800">关于我们</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* App Info */}
        <div className="warm-card text-center py-8">
          <div className="text-5xl mb-4">💍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">亲家直聘</h2>
          <p className="text-gray-600 mb-4">父母的相亲神器，帮助你找到合适的亲家</p>
          <div className="text-sm text-gray-500">
            <p>版本号：1.0.0</p>
          </div>
        </div>

        {/* Service Terms */}
        <div className="warm-card">
          <button
            onClick={() => toggleSection('terms')}
            className="w-full flex items-center justify-between py-4 px-4 hover:bg-[#F5F5F3] rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-[#FF8C42]" />
              <span className="font-semibold text-gray-800">服务条款</span>
            </div>
            <span className={`text-gray-600 transition-transform ${expandedSection === 'terms' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSection === 'terms' && (
            <div className="px-4 py-4 border-t border-[#E8E8E6] text-sm text-gray-700 space-y-3">
              <p>
                <strong>1. 服务说明</strong>
              </p>
              <p>
                亲家直聘是一个为父母提供相亲配对的平台。用户可以发布孩子的基本信息，与其他用户进行匹配和沟通。
              </p>

              <p>
                <strong>2. 用户责任</strong>
              </p>
              <p>
                用户承诺所提供的信息真实、准确、完整。用户不得发布虚假、骚扰、诽谤或违法的内容。用户应遵守法律法规和平台规则。
              </p>

              <p>
                <strong>3. 平台权利</strong>
              </p>
              <p>
                平台有权审核、删除违规内容，暂停或终止违规用户的账户。平台不对用户之间的交易或沟通结果负责。
              </p>

              <p>
                <strong>4. 免责声明</strong>
              </p>
              <p>
                平台仅提供信息发布和匹配服务，不对用户的配对结果、交易安全或人身伤害负责。用户应自行判断和承担风险。
              </p>

              <p>
                <strong>5. 服务变更</strong>
              </p>
              <p>
                平台保留随时修改或终止服务的权利，并会提前通知用户。
              </p>
            </div>
          )}
        </div>

        {/* Privacy Policy */}
        <div className="warm-card">
          <button
            onClick={() => toggleSection('privacy')}
            className="w-full flex items-center justify-between py-4 px-4 hover:bg-[#F5F5F3] rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#4A90E2]" />
              <span className="font-semibold text-gray-800">隐私政策</span>
            </div>
            <span className={`text-gray-600 transition-transform ${expandedSection === 'privacy' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSection === 'privacy' && (
            <div className="px-4 py-4 border-t border-[#E8E8E6] text-sm text-gray-700 space-y-3">
              <p>
                <strong>1. 信息收集</strong>
              </p>
              <p>
                我们收集你的基本信息（姓名、年龄、位置等）用于配对和沟通。这些信息仅在你同意的范围内使用。
              </p>

              <p>
                <strong>2. 信息保护</strong>
              </p>
              <p>
                我们采用行业标准的加密和安全措施保护你的信息。我们不会将你的信息出售给第三方。
              </p>

              <p>
                <strong>3. 信息使用</strong>
              </p>
              <p>
                你的信息仅用于：
              </p>
              <ul className="list-disc list-inside ml-2">
                <li>提供配对和沟通服务</li>
                <li>改进平台功能</li>
                <li>发送必要的通知</li>
              </ul>

              <p>
                <strong>4. 隐私控制</strong>
              </p>
              <p>
                你可以在隐私设置中控制哪些信息对其他用户可见。你也可以随时删除你的账户和信息。
              </p>

              <p>
                <strong>5. 第三方链接</strong>
              </p>
              <p>
                我们的平台可能包含第三方链接。我们对第三方网站的隐私政策不负责。
              </p>

              <p>
                <strong>6. 政策更新</strong>
              </p>
              <p>
                我们可能会更新此隐私政策。重大变更时，我们会通知你。
              </p>
            </div>
          )}
        </div>

        {/* Customer Service */}
        <div className="warm-card">
          <div className="py-4 px-4">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle size={20} className="text-[#FF8C42]" />
              <span className="font-semibold text-gray-800">意见反馈</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              我们很想听到你的想法和建议。扫描下方二维码添加客服微信，告诉我们如何改进。
            </p>
            <div className="bg-white p-4 rounded-lg border border-[#E8E8E6] text-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/wechat_qr_8ff41955.png"
                alt="WeChat QR Code"
                className="w-32 h-32 mx-auto mb-3"
              />
              <p className="text-xs text-gray-600">
                扫码添加客服微信
                <br />
                工作时间：周一至周五 9:00-18:00
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 提示：你也可以截图分享给朋友，让他们帮你转达。
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Info size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">感谢你的使用</p>
              <p>亲家直聘致力于为父母提供安全、可靠的相亲配对服务。如有任何问题，欢迎随时联系我们。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
