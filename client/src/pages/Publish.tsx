/**
 * Publish Page - 发布/编辑子女资料页
 * 按父母视角重构，突出"硬通货"信息
 * 
 * 必填项（前6个）：相片、年龄、学历、职业、现在工作地、有无住房
 * 选填项：有无车、年收入范围、籍贯、属相、个人介绍
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { isValidPhone } from '@/lib/utils';

const ZODIAC_SIGNS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const INCOME_RANGES = ['20万以下', '20-30万', '30-50万', '50-80万', '80-100万', '100万以上', '不便透露'];

export default function Publish() {
  const [, setLocation] = useLocation();
  const { userProfile, publishProfile, clearProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    childEducation: '',
    childOccupation: '',
    workCity: '',
    hasHousing: 'unknown',
    hasCar: 'unknown',
    annualIncome: '',
    nativePlace: '',
    zodiacSign: '',
    childLocation: '',
    childDescription: '',
    parentName: '',
    parentPhone: '',
    parentLocation: ''
  });

  // 初始化表单：如果已有发布的资料，则填充表单
  useEffect(() => {
    // 埋点：发布页进入
    trackEvent(ANALYTICS_EVENTS.PUBLISH_PAGE_ENTER, {
      is_editing: !!userProfile
    });

    if (userProfile) {
      setFormData({
        childName: userProfile.childName,
        childAge: userProfile.childAge.toString(),
        childGender: userProfile.childGender,
        childEducation: userProfile.childEducation,
        childOccupation: userProfile.childOccupation,
        workCity: userProfile.workCity,
        hasHousing: userProfile.hasHousing,
        hasCar: userProfile.hasCar,
        annualIncome: userProfile.annualIncome,
        nativePlace: userProfile.nativePlace,
        zodiacSign: userProfile.zodiacSign,
        childLocation: userProfile.childLocation,
        childDescription: userProfile.childDescription,
        parentName: userProfile.parentName,
        parentPhone: userProfile.parentPhone,
        parentLocation: userProfile.parentLocation
      });
      setProfileImage(userProfile.profileImage);
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

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 等比例缩放
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建画布上下文'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小（限制在5MB以内）
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB');
        return;
      }

      try {
        // 压缩图片到最大800px宽，70%质量
        const compressed = await compressImage(file, 800, 0.7);
        setProfileImage(compressed);
        toast.success('图片上传成功');
      } catch {
        toast.error('图片处理失败，请重试');
      }
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填项（前6个）
    if (!profileImage) {
      toast.error('请上传相片');
      return;
    }
    if (!formData.childName || !formData.childAge || !formData.childGender || !formData.childEducation || !formData.childOccupation || !formData.workCity || !formData.hasHousing) {
      toast.error('请填写所有必填项');
      return;
    }
    if (!formData.parentName || !formData.parentPhone) {
      toast.error('请填写您的信息');
      return;
    }
    if (!isValidPhone(formData.parentPhone)) {
      toast.error('请输入有效的11位手机号');
      return;
    }

    setIsSubmitting(true);
    
    // 埋点：表单提交
    trackEvent(ANALYTICS_EVENTS.PUBLISH_FORM_COMPLETE, {
      child_gender: formData.childGender,
      education: formData.childEducation,
      occupation: formData.childOccupation,
      has_housing: formData.hasHousing,
      has_car: formData.hasCar,
      is_editing: isEditing
    });
    
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
        workCity: formData.workCity,
        hasHousing: formData.hasHousing as 'yes' | 'no' | 'unknown',
        hasCar: formData.hasCar as 'yes' | 'no' | 'unknown',
        annualIncome: formData.annualIncome,
        nativePlace: formData.nativePlace,
        zodiacSign: formData.zodiacSign,
        childDescription: formData.childDescription,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentLocation: formData.parentLocation,
        profileImage: profileImage,
        certifications: {
          phoneVerified: true,
          idVerified: false,
          profileVerified: true
        },
        verificationDate: new Date().toISOString()
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
        workCity: '',
        hasHousing: 'unknown',
        hasCar: 'unknown',
        annualIncome: '',
        nativePlace: '',
        zodiacSign: '',
        childLocation: '',
        childDescription: '',
        parentName: '',
        parentPhone: '',
        parentLocation: ''
      });
      setProfileImage('');
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
        {/* Section 1: Photo Upload - REQUIRED */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">*</span>
            孩子相片（必填）
          </h2>

          <div className="space-y-4">
            {profileImage ? (
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#FF8C42] rounded-lg p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors">
                <Upload size={32} className="mx-auto text-[#FF8C42] mb-2" />
                <p className="text-gray-800 font-semibold mb-1">点击上传相片</p>
                <p className="text-sm text-gray-600">支持 JPG、PNG 格式，不超过 2MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 2: Basic Info - REQUIRED */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">*</span>
            基本信息（必填）
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">孩子姓名</label>
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
                <label className="block text-sm font-semibold text-gray-800 mb-2">性别</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">学历 *</label>
              <Select value={formData.childEducation} onValueChange={(value) => handleSelectChange('childEducation', value)}>
                <SelectTrigger>
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
              <label className="block text-sm font-semibold text-gray-800 mb-2">职业 *</label>
              <Input
                type="text"
                name="childOccupation"
                placeholder="例如：软件工程师"
                value={formData.childOccupation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">现在工作地 *</label>
              <Input
                type="text"
                name="workCity"
                placeholder="例如：北京"
                value={formData.workCity}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">孩子居住地</label>
              <Input
                type="text"
                name="childLocation"
                placeholder="例如：北京"
                value={formData.childLocation}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hard Assets - REQUIRED */}
        <div className="warm-card border-l-4 border-red-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">*</span>
            资产情况（必填）
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">有无住房 *</label>
              <Select value={formData.hasHousing} onValueChange={(value) => handleSelectChange('hasHousing', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择住房情况" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">有房</SelectItem>
                  <SelectItem value="no">无房</SelectItem>
                  <SelectItem value="unknown">不便透露</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">有无车</label>
              <Select value={formData.hasCar} onValueChange={(value) => handleSelectChange('hasCar', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择车产情况" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">有车</SelectItem>
                  <SelectItem value="no">无车</SelectItem>
                  <SelectItem value="unknown">不便透露</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">年收入范围</label>
              <Select value={formData.annualIncome} onValueChange={(value) => handleSelectChange('annualIncome', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择年收入范围" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_RANGES.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 4: Additional Info - OPTIONAL */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">其他信息（选填）</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">籍贯</label>
              <Input
                type="text"
                name="nativePlace"
                placeholder="例如：山东"
                value={formData.nativePlace}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">属相</label>
              <Select value={formData.zodiacSign} onValueChange={(value) => handleSelectChange('zodiacSign', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择属相" />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map(sign => (
                    <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Section 5: Parent Info */}
        <div className="warm-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">*</span>
            您的信息（必填）
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
                placeholder="请输入完整手机号，如13812341234"
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
