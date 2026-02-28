/**
 * Home Page - 亲家直聘首页
 * 展示推荐的子女资料卡片流，支持筛选和排序
 * 用户发布的资料会优先显示在首页第一位
 * 
 * 设计理念：温暖关怀型现代主义
 * - 卡片流设计，每个卡片代表一个子女资料
 * - 使用暖橙色主色 + 清爽蓝辅色
 * - 充足的留白和柔和阴影，传达关怀感
 * - 新增筛选功能，帮助父母快速找到合适的资料
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
  const { userProfile, unreadCount } = useData();
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

    // 添加其他资料
    const otherProfiles = mockProfiles.filter(profile => {
      // 年龄筛选
      if (profile.childAge < filters.ageMin || profile.childAge > filters.ageMax) {
        return false;
      }

      // 性别筛选
      if (filters.gender && profile.childGender !== filters.gender) {
        return false;
      }

      // 地点筛选
      if (filters.location && profile.childLocation !== filters.location) {
        return false;
      }

      // 学历筛选
      if (filters.education && profile.childEducation !== filters.education) {
        return false;
      }

      return true;
    });

    // 排序（用户资料始终在最前面）
    if (sortBy === 'age') {
      otherProfiles.sort((a, b) => a.childAge - b.childAge);
    }

    result = result.concat(otherProfiles);
    return result;
  }, [filters, sortBy, userProfile]);

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedProfiles);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedProfiles(newLiked);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // 检查是否有活跃的筛选
  const hasActiveFilters = filters.gender !== '' || 
                           filters.location !== '' || 
                           filters.education !== '' ||
                           filters.ageMin !== 18 ||
                           filters.ageMax !== 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF7A2F] text-white px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">亲家直聘</h1>
        <p className="text-sm opacity-90">为您的孩子找到合适的另一半</p>
      </div>

      {/* Hero Image */}
      <div className="px-4 py-6">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/hero-banner-drRCoc5QTnwZPKCaAsomcg.webp"
          alt="Happy families"
          className="w-full rounded-2xl object-cover h-48 shadow-lg"
        />
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4 flex gap-3 justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#FF8C42]">1000+</div>
          <div className="text-xs text-gray-600">真实用户</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#4A90E2]">500+</div>
          <div className="text-xs text-gray-600">成功配对</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#52C41A]">98%</div>
          <div className="text-xs text-gray-600">用户满意度</div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="px-4 py-4 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 border-[#FF8C42] text-[#FF8C42] hover:bg-orange-50 flex items-center justify-center gap-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={18} />
          筛选
          {hasActiveFilters && (
            <span className="ml-1 bg-[#FF8C42] text-white text-xs px-2 py-0.5 rounded-full">
              已激活
            </span>
          )}
        </Button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'age')}
          className="px-4 py-2 border border-[#E8E8E6] rounded-lg text-sm text-gray-800 bg-white hover:bg-[#F5F5F3] transition-colors"
        >
          <option value="newest">最新发布</option>
          <option value="age">年龄从小到大</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 text-sm text-gray-600">
        找到 <span className="font-bold text-[#FF8C42]">{filteredProfiles.length}</span> 个符合条件的资料
      </div>

      {/* Profile Cards Stream */}
      <div className="px-4 py-4 space-y-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => {
            const isUserProfile = userProfile && profile.id === userProfile.id;
            return (
              <div
                key={profile.id}
                className={`warm-card cursor-pointer hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                  isUserProfile ? 'ring-2 ring-[#FF8C42] shadow-lg' : ''
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
                    <div className="absolute top-3 right-3 warm-badge warm-badge-verified flex items-center gap-1">
                      <CheckCircle size={14} />
                      <span>已认证</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="px-4 pb-4">
                  {/* Name and Age */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {profile.childName}
                      <span className="text-lg ml-2 text-gray-600">{profile.childAge}岁</span>
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(profile.id);
                      }}
                      className="p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Heart
                        size={24}
                        className={likedProfiles.has(profile.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'}
                      />
                    </button>
                  </div>

                  {/* Parent Info */}
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">{profile.parentName}</span> 的孩子
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-[#F5F5F3] px-3 py-2 rounded-lg">
                      <MapPin size={16} className="text-[#FF8C42]" />
                      <span>{profile.childLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-[#F5F5F3] px-3 py-2 rounded-lg">
                      <BookOpen size={16} className="text-[#4A90E2]" />
                      <span>{profile.childEducation}</span>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-[#F5F5F3] px-3 py-2 rounded-lg mb-4">
                    <Briefcase size={16} className="text-[#52C41A]" />
                    <span>{profile.childOccupation}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {profile.childDescription}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isUserProfile ? (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation('/me');
                          }}
                        >
                          编辑资料
                        </Button>
                        <Button
                          className="flex-1 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation('/me');
                          }}
                        >
                          查看联系
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/profile/${profile.id}`);
                          }}
                        >
                          查看详情
                        </Button>
                        <Button
                          className="flex-1 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/contact/${profile.id}`);
                          }}
                        >
                          申请联系
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">未找到符合条件的资料</h3>
            <p className="text-gray-600 mb-6">尝试调整筛选条件</p>
            <Button
              className="bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
              onClick={() => setIsFilterOpen(true)}
            >
              修改筛选条件
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {filteredProfiles.length > 0 && !userProfile && (
        <div className="px-4 py-6 text-center">
          <Button
            className="w-full bg-[#4A90E2] hover:bg-[#3A7FD2] text-white py-3 text-lg"
            onClick={() => setLocation('/publish')}
          >
            发布我的孩子资料
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        resultCount={filteredProfiles.length}
      />
    </div>
  );
}
