/**
 * Publish Page - 发布/编辑子女资料页
 * 统一的资料管理中心，支持创建新资料和编辑已发布资料
 * 
 * 设计理念：温暖关怀型现代主义
 * - 清晰的表单结构
 * - 逐步引导用户填写
 * - 友好的错误提示
 * - 发布/更新后立即在首页显示
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

export default function Publish() {
  const [, setLocation] = useLocation();
  const { userProfile, publishProfile, clearProfile } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  // 初始化表单：如果已有发布的资料，则填充表单
  useEffect(() => {
    if (userProfile) {
      setFormData({
        childName: userProfile.childName,
        childAge: userProfile.childAge.toString(),
        childGender: userProfile.childGender,
        childEducation: userProfile.childEducation,
        childOccupation: userProfile.childOccupation,
        childLocation: userProfile.childLocation,
        childDescription: userProfile.childDescription,
        parentName: userProfile.parentName,
        parentPhone: userProfile.parentPhone,
        parentLocation: userProfile.parentLocation
      });
      setIsEditing(true);
    }
  }, [userProfile]);

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
      // Save to local storage via DataContext
      publishProfile({
        childName: formData.childName,
        childAge: parseInt(formData.childAge),
        childGender: formData.childGender as 'male' | 'female',
        childEducation: formData.childEducation,
        childOccupation: formData.childOccupation,
        childLocation: formData.childLocation,
        childDescription: formData.childDescription,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentLocation: formData.parentLocation
      });

      setIsSubmitting(false);
      toast.success(isEditing ? '资料更新成功！' : '资料发布成功！');
      
      // Redirect to home after a short delay
      setTimeout(() => {
        setLocation('/');
      }, 500);
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除已发布的资料吗？此操作不可撤销。')) {
      clearProfile();
      setFormData({
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
      setIsEditing(false);
      toast.success('资料已删除');
    }
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
        <h1 className="text-lg font-bold text-gray-800">
          {isEditing ? '编辑孩子资料' : '发布孩子资料'}
        </h1>
      </div>

      {/* Status Banner */}
      {isEditing && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <CheckCircle size={16} />
            <span>您已发布过资料。修改下方信息后，其他用户看到的资料会同步更新。</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Section 1: Child Info */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#FF8C42] text-white text-xs flex items-center justify-center font-bold">1</span>
            孩子信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">孩子姓名 *</label>
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
                <label className="block text-sm font-semibold text-gray-800 mb-2">年龄 *</label>
                <Input
                  type="number"
                  name="childAge"
                  placeholder="例如：32"
                  value={formData.childAge}
                  onChange={handleInputChange}
                  min="18"
                  max="80"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">性别 *</label>
                <Select value={formData.childGender} onValueChange={(value) => handleSelectChange('childGender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">学历</label>
                <Select value={formData.childEducation} onValueChange={(value) => handleSelectChange('childEducation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择学历" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="大专">大专</SelectItem>
                    <SelectItem value="本科">本科</SelectItem>
                    <SelectItem value="硕士">硕士</SelectItem>
                    <SelectItem value="博士">博士</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">职业</label>
                <Input
                  type="text"
                  name="childOccupation"
                  placeholder="例如：软件工程师"
                  value={formData.childOccupation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">所在城市</label>
              <Input
                type="text"
                name="childLocation"
                placeholder="例如：北京"
                value={formData.childLocation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">个人介绍</label>
              <Textarea
                name="childDescription"
                placeholder="简要介绍孩子的性格、爱好、期望等（100-200字最佳）"
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
            <span className="w-6 h-6 rounded-full bg-[#FF8C42] text-white text-xs flex items-center justify-center font-bold">2</span>
            您的信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">您的姓名 *</label>
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
              <label className="block text-sm font-semibold text-gray-800 mb-2">联系电话 *</label>
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
              <label className="block text-sm font-semibold text-gray-800 mb-2">所在城市</label>
              <Input
                type="text"
                name="parentLocation"
                placeholder="例如：北京"
                value={formData.parentLocation}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="warm-card bg-orange-50 border border-orange-200">
          <div className="flex gap-3">
            <CheckCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">提示</p>
              <p>您的信息将被安全保存，仅用于配对联系。我们不会将您的信息用于其他目的。</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF8C42] hover:bg-[#FF7A2F] text-white py-3 text-lg"
          >
            {isSubmitting ? '处理中...' : (isEditing ? '保存修改' : '发布资料')}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={18} />
              删除资料
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setLocation('/')}
          >
            返回
          </Button>
        </div>
      </form>
    </div>
  );
}
