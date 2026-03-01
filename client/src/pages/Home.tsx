/**
 * Home Page - 亲家直聘首页
 * 展示推荐的子女资料卡片流，支持性别切换、筛选和排序
 * 用户发布的资料会优先显示在首页第一位
 * 
 * 设计理念：温暖关怀型现代主义
 * - 卡片流设计，每个卡片代表一个子女资料
 * - 使用暖橙色主色 + 清爽蓝辅色
 * - 充足的留白和柔和阴影，传达关怀感
 * - 新增性别切换功能，让父母快速选择查找儿媳或女婿
 */

import { useState, useMemo } from 'react';
import { Heart, MapPin, Briefcase, BookOpen, CheckCircle, Filter, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import FilterPanel, { FilterOptions } from '@/components/FilterPanel';
import { useData } from '@/contexts/DataContext';

interface ProfileCard {
  id: string;
  childName: string;
  childAge: number;
  childGender: 'male' | 'female';
  childEducation: string;
  childOccupation: string;
  childLocation: string;
  childDescription: string;
  parentName: string;
  isVerified: boolean;
  profileImage: string;
}

// Mock data for MVP
const mockProfiles: ProfileCard[] = [
  {
    id: '1',
    childName: '李明',
    childAge: 32,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '软件工程师',
    childLocation: '北京',
    childDescription: '性格开朗，喜欢运动和旅游，希望找到一个温柔体贴的女性。',
    parentName: '李女士',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '2',
    childName: '王芳',
    childAge: 28,
    childGender: 'female',
    childEducation: '硕士',
    childOccupation: '医生',
    childLocation: '上海',
    childDescription: '温柔贤惠，家庭观念强，希望找到一个有责任心的男性。',
    parentName: '王先生',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '3',
    childName: '张浩',
    childAge: 35,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '企业管理',
    childLocation: '深圳',
    childDescription: '成熟稳重，事业有成，寻找志同道合的伴侣。',
    parentName: '张女士',
    isVerified: false,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '4',
    childName: '陈思',
    childAge: 26,
    childGender: 'female',
    childEducation: '本科',
    childOccupation: '设计师',
    childLocation: '杭州',
    childDescription: '创意十足，热爱生活，期待遇见有趣的灵魂。',
    parentName: '陈先生',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '5',
    childName: '刘军',
    childAge: 38,
    childGender: 'male',
    childEducation: '硕士',
    childOccupation: '律师',
    childLocation: '北京',
    childDescription: '专业素养高，生活品质讲究，寻找志同道合的伴侣。',
    parentName: '刘女士',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '6',
    childName: '周丽',
    childAge: 30,
    childGender: 'female',
    childEducation: '大专',
    childOccupation: '教师',
    childLocation: '南京',
    childDescription: '温柔善良，热爱教育工作，希望找到一个稳定可靠的伴侣。',
    parentName: '周女士',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  {
    id: '7',
    childName: '吴涛',
    childAge: 34,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '销售经理',
    childLocation: '广州',
    childDescription: '外向热情，善于沟通，期待找到一个理解自己的伴侣。',
    parentName: '吴先生',
    isVerified: false,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { userProfile, unreadCount, genderFilter, setGenderFilter } = useData();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    ageMin: 18,
    ageMax: 60,
    gender: '',
    location: '',
    education: ''
  });
  const [sortBy, setSortBy] = useState<'newest' | 'age'>('newest');

  // 筛选和排序逻辑
  const filteredProfiles = useMemo(() => {
    let result: ProfileCard[] = [];

    // 如果用户有发布的资料，将其放在最前面
    if (userProfile) {
      result.push({
        id: userProfile.id,
        childName: userProfile.childName,
        childAge: userProfile.childAge,
        childGender: userProfile.childGender,
        childEducation: userProfile.childEducation,
        childOccupation: userProfile.childOccupation,
        childLocation: userProfile.childLocation,
        childDescription: userProfile.childDescription,
        parentName: userProfile.parentName,
        isVerified: userProfile.isVerified,
        profileImage: userProfile.profileImage
      });
    }

    // 添加其他资料，按性别筛选
    const otherProfiles = mockProfiles.filter(profile => {
      // 按性别筛选
      if (genderFilter && profile.childGender !== genderFilter) {
        return false;
      }

      // 按年龄筛选
      if (profile.childAge < filters.ageMin || profile.childAge > filters.ageMax) {
        return false;
      }

      // 按城市筛选
      if (filters.location && !profile.childLocation.includes(filters.location)) {
        return false;
      }

      // 按学历筛选
      if (filters.education && profile.childEducation !== filters.education) {
        return false;
      }

      return true;
    });

    // 排序
    if (sortBy === 'age') {
      otherProfiles.sort((a, b) => a.childAge - b.childAge);
    }

    result = result.concat(otherProfiles);
    return result;
  }, [userProfile, genderFilter, filters, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E8E8E6] shadow-sm">
        <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-4 py-4 text-center">
          <h1 className="text-2xl font-bold">亲家直聘</h1>
          <p className="text-sm text-orange-100 mt-1">为您的孩子找到合适的伴侣</p>
        </div>

        {/* Gender Toggle Buttons */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => setGenderFilter('female')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                genderFilter === 'female'
                  ? 'bg-[#FF8C42] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 border-2 border-[#FF8C42] hover:bg-orange-50'
              }`}
            >
              <span>👰</span>
              找儿媳
            </button>
            <button
              onClick={() => setGenderFilter('male')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                genderFilter === 'male'
                  ? 'bg-[#FF8C42] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 border-2 border-[#FF8C42] hover:bg-orange-50'
              }`}
            >
              <span>🤵</span>
              找女婿
            </button>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-[#E8E8E6] rounded-lg hover:bg-[#F5F5F3] transition-colors"
            >
              <Filter size={18} className="text-[#FF8C42]" />
              <span className="text-sm font-semibold text-gray-800">筛选</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'age')}
              className="flex-1 py-2 px-3 border border-[#E8E8E6] rounded-lg text-sm font-semibold text-gray-800 hover:bg-[#F5F5F3] transition-colors"
            >
              <option value="newest">最新发布</option>
              <option value="age">年龄从小到大</option>
            </select>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <FilterPanel
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilters}
              currentFilters={filters}
              resultCount={filteredProfiles.length}
            />
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 text-sm text-gray-600">
        找到 {filteredProfiles.length} 个符合条件的资料
      </div>

      {/* Profiles Grid */}
      <div className="px-4 space-y-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => {
            const isUserProfile = userProfile && profile.id === userProfile.id;

            return (
              <div
                key={profile.id}
                className={`warm-card overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-102 animate-fadeIn ${
                  isUserProfile ? 'border-2 border-[#FF8C42]' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setLocation(`/profile/${profile.id}`)}
              >
                {/* User Profile Badge */}
                {isUserProfile && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <div className="bg-[#FF8C42] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles size={14} />
                      我的资料
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Bell size={14} />
                        {unreadCount}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Image */}
                <div className="relative mb-4 -mx-4 -mt-4 rounded-t-2xl overflow-hidden h-40 bg-gradient-to-br from-[#FF8C42] to-[#FF7A2F]">
                  <img
                    src={profile.profileImage}
                    alt={profile.childName}
                    className="w-full h-full object-cover"
                  />
                  {profile.isVerified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={14} />
                      已认证
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="space-y-3">
                  {/* Name and Age */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">{profile.childName}</h3>
                    <span className="text-lg font-bold text-[#FF8C42]">{profile.childAge}岁</span>
                  </div>

                  {/* Parent Info */}
                  <p className="text-sm text-gray-600">{profile.parentName}的孩子</p>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[#4A90E2]" />
                      <span>{profile.childEducation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-[#4A90E2]" />
                      <span>{profile.childOccupation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#4A90E2]" />
                      <span>{profile.childLocation}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 line-clamp-2 bg-[#F5F5F3] p-3 rounded-lg">
                    {profile.childDescription}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLikedProfiles(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(profile.id)) {
                            newSet.delete(profile.id);
                          } else {
                            newSet.add(profile.id);
                          }
                          return newSet;
                        });
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        likedProfiles.has(profile.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-[#F5F5F3] text-gray-700 hover:bg-red-50'
                      }`}
                    >
                      <Heart size={18} fill={likedProfiles.has(profile.id) ? 'currentColor' : 'none'} />
                      {likedProfiles.has(profile.id) ? '已收藏' : '收藏'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/contact/${profile.id}`);
                      }}
                      className="flex-1 py-2 px-3 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white rounded-lg font-semibold transition-colors"
                    >
                      申请联系
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="warm-card text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">未找到匹配资料</h3>
            <p className="text-gray-600 mb-6">调整筛选条件后重试</p>
            <Button
              className="bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
              onClick={() => {
                setFilters({
                  ageMin: 18,
                  ageMax: 60,
                  gender: '',
                  location: '',
                  education: ''
                });
              }}
            >
              重置筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
