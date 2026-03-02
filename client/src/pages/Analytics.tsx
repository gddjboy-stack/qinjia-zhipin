/**
 * Analytics Page - 数据分析页面
 * 用于查看和导出埋点数据
 * 仅在开发环境下显示
 */

import { useState } from 'react';
import { ArrowLeft, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  exportAnalyticsAsJson, 
  downloadAnalyticsJson, 
  clearAnalyticsData, 
  getAnalyticsStats,
  getUserId,
  getSessionId
} from '@/lib/analytics';

export default function Analytics() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState(getAnalyticsStats());
  const [showRawData, setShowRawData] = useState(false);

  const handleDownload = () => {
    downloadAnalyticsJson();
  };

  const handleClear = () => {
    if (confirm('确定要清空所有埋点数据吗？此操作不可撤销。')) {
      clearAnalyticsData();
      setStats(getAnalyticsStats());
    }
  };

  const handleRefresh = () => {
    setStats(getAnalyticsStats());
  };

  const rawData = exportAnalyticsAsJson();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E8E8E6] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setLocation('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">数据分析</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
            <div className="text-sm text-gray-600 mb-1">总事件数</div>
            <div className="text-3xl font-bold text-[#FF8C42]">{stats.total_events}</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
            <div className="text-sm text-gray-600 mb-1">独立用户数</div>
            <div className="text-3xl font-bold text-[#4A90E2]">{stats.unique_users}</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
            <div className="text-sm text-gray-600 mb-1">独立会话数</div>
            <div className="text-3xl font-bold text-[#00C9A7]">{stats.unique_sessions}</div>
          </div>
        </div>

        {/* Event Types */}
        <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
          <h2 className="font-bold text-gray-800 mb-3">事件类型分布</h2>
          <div className="space-y-2">
            {Object.entries(stats.events_by_type).map(([eventName, count]) => (
              <div key={eventName} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{eventName}</span>
                <span className="text-sm font-bold text-[#FF8C42]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
          <h2 className="font-bold text-gray-800 mb-3">调试信息</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">用户ID: </span>
              <span className="font-mono text-[#FF8C42]">{getUserId()}</span>
            </div>
            <div>
              <span className="text-gray-600">会话ID: </span>
              <span className="font-mono text-[#FF8C42]">{getSessionId()}</span>
            </div>
          </div>
        </div>

        {/* Raw Data */}
        {showRawData && (
          <div className="bg-white rounded-xl p-4 border border-[#E8E8E6]">
            <h2 className="font-bold text-gray-800 mb-3">原始数据</h2>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96 text-gray-800">
              {rawData}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            className="w-full bg-[#4A90E2] text-white py-3 rounded-lg font-bold hover:bg-[#3A7FCC] transition-colors"
          >
            刷新数据
          </Button>

          <Button
            onClick={() => setShowRawData(!showRawData)}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            {showRawData ? '隐藏' : '查看'}原始数据
          </Button>

          <Button
            onClick={handleDownload}
            className="w-full bg-[#00C9A7] text-white py-3 rounded-lg font-bold hover:bg-[#00B896] transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} />
            导出为JSON
          </Button>

          <Button
            onClick={handleClear}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            清空数据
          </Button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 这是开发者工具页面，仅用于测试和调试。生产环境中不应暴露此页面。
          </p>
        </div>
      </div>
    </div>
  );
}
