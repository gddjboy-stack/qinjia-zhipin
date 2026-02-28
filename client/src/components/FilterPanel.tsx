/**
 * Filter Panel Component - 筛选面板
 * 用于按年龄、地点、学历等条件筛选子女资料
 * 
 * 设计理念：温暖关怀型现代主义
 * - 清晰的筛选选项
 * - 易于使用的滑块和选择器
 * - 实时反馈筛选结果数量
 */

import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

export interface FilterOptions {
  ageMin: number;
  ageMax: number;
  gender?: 'male' | 'female' | '';
  location: string;
  education: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  resultCount?: number;
}

const LOCATIONS = [
  '全国',
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '南京',
  '武汉',
  '成都',
  '西安',
  '其他'
];

const EDUCATIONS = [
  '全部',
  '高中及以下',
  '大专',
  '本科',
  '硕士',
  '博士'
];

const GENDERS = [
  { label: '全部', value: '' },
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
];

export default function FilterPanel({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  resultCount = 0
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [expandedSections, setExpandedSections] = useState({
    age: true,
    gender: false,
    location: false,
    education: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAgeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      ageMin: value[0],
      ageMax: value[1]
    }));
  };

  const handleGenderChange = (gender: string) => {
    setFilters(prev => ({
      ...prev,
      gender: gender as 'male' | 'female' | ''
    }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({
      ...prev,
      location: location === '全国' ? '' : location
    }));
  };

  const handleEducationChange = (education: string) => {
    setFilters(prev => ({
      ...prev,
      education: education === '全部' ? '' : education
    }));
  };

  const handleReset = () => {
    setFilters({
      ageMin: 18,
      ageMax: 60,
      gender: '',
      location: '',
      education: ''
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-gray-800">筛选条件</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-4">
          {/* Age Filter */}
          <div className="border-b border-[#E8E8E6] pb-4">
            <button
              onClick={() => toggleSection('age')}
              className="w-full flex items-center justify-between py-3 hover:bg-[#F5F5F3] px-2 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-800">年龄范围</span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  expandedSections.age ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.age && (
              <div className="px-2 py-4 space-y-4">
                <Slider
                  min={18}
                  max={60}
                  step={1}
                  value={[filters.ageMin, filters.ageMax]}
                  onValueChange={handleAgeChange}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {filters.ageMin} - {filters.ageMax} 岁
                  </span>
                  <span className="text-[#FF8C42] font-semibold">
                    {filters.ageMax - filters.ageMin + 1} 岁范围
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Gender Filter */}
          <div className="border-b border-[#E8E8E6] pb-4">
            <button
              onClick={() => toggleSection('gender')}
              className="w-full flex items-center justify-between py-3 hover:bg-[#F5F5F3] px-2 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-800">孩子性别</span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  expandedSections.gender ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.gender && (
              <div className="px-2 py-4 flex gap-3">
                {GENDERS.map(gender => (
                  <button
                    key={gender.value}
                    onClick={() => handleGenderChange(gender.value)}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                      filters.gender === gender.value
                        ? 'bg-[#FF8C42] text-white'
                        : 'bg-[#F5F5F3] text-gray-800 hover:bg-[#E8E8E6]'
                    }`}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="border-b border-[#E8E8E6] pb-4">
            <button
              onClick={() => toggleSection('location')}
              className="w-full flex items-center justify-between py-3 hover:bg-[#F5F5F3] px-2 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-800">所在城市</span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  expandedSections.location ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.location && (
              <div className="px-2 py-4 grid grid-cols-3 gap-2">
                {LOCATIONS.map(location => (
                  <button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      (filters.location === '' && location === '全国') ||
                      filters.location === location
                        ? 'bg-[#FF8C42] text-white'
                        : 'bg-[#F5F5F3] text-gray-800 hover:bg-[#E8E8E6]'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Education Filter */}
          <div className="pb-4">
            <button
              onClick={() => toggleSection('education')}
              className="w-full flex items-center justify-between py-3 hover:bg-[#F5F5F3] px-2 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-800">学历</span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  expandedSections.education ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.education && (
              <div className="px-2 py-4 grid grid-cols-2 gap-2">
                {EDUCATIONS.map(education => (
                  <button
                    key={education}
                    onClick={() => handleEducationChange(education)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      (filters.education === '' && education === '全部') ||
                      filters.education === education
                        ? 'bg-[#FF8C42] text-white'
                        : 'bg-[#F5F5F3] text-gray-800 hover:bg-[#E8E8E6]'
                    }`}
                  >
                    {education}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="px-4 py-3 bg-[#F5F5F3] text-center text-sm text-gray-600">
          找到 <span className="font-bold text-[#FF8C42]">{resultCount}</span> 个符合条件的资料
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 flex gap-3 border-t border-[#E8E8E6]">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100"
            onClick={handleReset}
          >
            重置
          </Button>
          <Button
            className="flex-1 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
            onClick={handleApply}
          >
            应用筛选
          </Button>
        </div>
      </div>
    </>
  );
}
