/**
 * Publish Page - 发布子女资料页
 * 简化的MVP表单，仅包含必填项
 * 
 * 设计理念：温暖关怀型现代主义
 * - 清晰的表单结构
 * - 逐步引导用户填写
 * - 友好的错误提示
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Publish() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    childEducation: '',
    childOccupation: '',
    childLocation: '',
    childDescription: '',
    parentName: '',
    parentPhone: '',
    parentLocation: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.childName || !formData.childAge || !formData.childGender || !formData.parentName || !formData.parentPhone) {
      toast.error('请填写所有必填项');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('资料发布成功！');
      setLocation('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => setLocation('/')}
          className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">发布孩子资料</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Section 1: Child Info */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FF8C42] text-white flex items-center justify-center text-sm font-bold">1</div>
            孩子信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                孩子姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="childName"
                placeholder="例如：李明"
                value={formData.childName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  年龄 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="childAge"
                  placeholder="例如：32"
                  value={formData.childAge}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  性别 <span className="text-red-500">*</span>
                </label>
                <Select value={formData.childGender} onValueChange={(value) => handleSelectChange('childGender', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                学历
              </label>
              <Select value={formData.childEducation} onValueChange={(value) => handleSelectChange('childEducation', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="高中及以下">高中及以下</SelectItem>
                  <SelectItem value="大专">大专</SelectItem>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="硕士">硕士</SelectItem>
                  <SelectItem value="博士">博士</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                职业
              </label>
              <Input
                type="text"
                name="childOccupation"
                placeholder="例如：软件工程师"
                value={formData.childOccupation}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                所在城市
              </label>
              <Input
                type="text"
                name="childLocation"
                placeholder="例如：北京"
                value={formData.childLocation}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                个人介绍
              </label>
              <Textarea
                name="childDescription"
                placeholder="描述孩子的性格、爱好、择偶要求等..."
                value={formData.childDescription}
                onChange={handleInputChange}
                className="w-full min-h-24"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Parent Info */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4A90E2] text-white flex items-center justify-center text-sm font-bold">2</div>
            家长信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                家长姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="parentName"
                placeholder="例如：李女士"
                value={formData.parentName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                联系电话 <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                name="parentPhone"
                placeholder="例如：138****1234"
                value={formData.parentPhone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                所在城市
              </label>
              <Input
                type="text"
                name="parentLocation"
                placeholder="例如：北京"
                value={formData.parentLocation}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">提示</p>
              <p>您的信息将被严格保密，仅用于配对。我们承诺不会主动向任何人披露您的联系方式。</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FF8C42] hover:bg-[#FF7A2F] text-white py-3 text-lg"
        >
          {isSubmitting ? '发布中...' : '发布资料'}
        </Button>
      </form>
    </div>
  );
}
