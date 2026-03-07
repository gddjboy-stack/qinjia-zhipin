/**
 * Home Page - 亲家直聘首页
 * 展示推荐的子女资料卡片流，按父母视角突出"硬通货"信息
 * 用户发布的资料会优先显示在首页第一位
 * 
 * 设计理念：温暖关怀型现代主义
 * - 卡片流设计，每个卡片代表一个子女资料
 * - 使用暖橙色主色 + 清爽蓝辅色
 * - 充足的留白和柔和阴影，传达关怀感
 * - 新增性别切换功能，让父母快速选择查找儿媳或女婿
 */

import { useState, useMemo, useEffect } from 'react';
import { Heart, MapPin, Briefcase, BookOpen, CheckCircle, Filter, Sparkles, Bell, Home as HomeIcon, Car, Shield, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import FilterPanel, { FilterOptions } from '@/components/FilterPanel';
import VerificationModal from '@/components/VerificationModal';

import { useData } from '@/contexts/DataContext';
import type { ContactRequest } from '@/contexts/DataContext';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { mockProfiles as centralMockProfiles, type MockProfile } from '@/lib/mockData';

// 使用集中管理的mock数据，MockProfile包含完整字段
type ProfileCard = MockProfile;

export default function Home() {
  const [, setLocation] = useLocation();
  const { userId, userProfile, contactRequests, genderFilter, setGenderFilter, userSettings } = useData();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('qinjia_liked_profiles');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    ageMin: 18,
    ageMax: 60,
    gender: '',
    location: '',
    education: ''
  });
  const [sortBy, setSortBy] = useState<'newest' | 'age'>('newest');

  // 计算只发送给当前用户的未读消息数
  const unreadCount = contactRequests.filter(
    (req) => !req.isRead && req.toUserId === userId
  ).length;
  const [verificationModal, setVerificationModal] = useState<{ isOpen: boolean; profileId?: string }>({ isOpen: false });

  // 埋点：页面浏览
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      page: 'home',
      gender_filter: genderFilter
    });
  }, []);

  // 检查是否在微信中
  const isInWeChat = () => {
    return /micromessenger/i.test(navigator.userAgent);
  };

  // 处理邀请分享
  const handleInviteShare = (profile: ProfileCard) => {
    // 埋点：邀请分享
    trackEvent(ANALYTICS_EVENTS.INVITE_SHARE, {
      profile_id: profile.id,
      child_gender: profile.childGender
    });

    if (!isInWeChat()) {
      alert('💵 请在微信中打开此链接，才能分享给望友');
      return;
    }

    // 检查微信 JS-SDK 是否已加载
    if (typeof (window as any).wx === 'undefined') {
      alert('微信分享功能加载中，请稍后再试');
      return;
    }

    const wx = (window as any).wx;
    const genderText = profile.childGender === 'male' ? '兒子' : '女儿';
    const shareTitle = `我在亲家直聘上发布了我的${genderText}的资料`;
    const shareDesc = '我在亲家直聘上发布了我的孩子的资料，请帮我推荐给合适的人。';

    // 调用微信分享接口
    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: shareTitle,
        desc: shareDesc,
        link: window.location.href,
        imgUrl: profile.profileImage || 'https://via.placeholder.com/200',
        type: 'link',
        dataUrl: '',
        success: () => {
          console.log('分享成功');
        },
        cancel: () => {
          console.log('分享取消');
        }
      });
    });

    // 触发分享按钮
    wx.showMenuItems({
      menuList: ['menuItem.share.appMessage'],
      success: () => {
        console.log('分享按钮已打开');
      }
    });
  };

  // 筛选和排序逻辑辑
  const filteredProfiles = useMemo(() => {
    let result: ProfileCard[] = [];

    // 如果用户有发布的资料，将其放在最前面
    if (userProfile) {
      result.push({
        id: userProfile.id,
        userId: userProfile.userId,
        childName: userProfile.childName,
        childAge: userProfile.childAge,
        childGender: userProfile.childGender,
        childEducation: userProfile.childEducation,
        childOccupation: userProfile.childOccupation,
        childLocation: userProfile.childLocation,
        workCity: userProfile.workCity,
        hasHousing: userProfile.hasHousing,
        hasCar: userProfile.hasCar,
        annualIncome: userProfile.annualIncome,
        nativePlace: userProfile.nativePlace,
        zodiacSign: userProfile.zodiacSign,
        childDescription: userProfile.childDescription,
        parentName: userProfile.parentName,
        parentPhone: userProfile.parentPhone,
        parentLocation: userProfile.parentLocation,
        isVerified: userProfile.isVerified,
        profileImage: userProfile.profileImage,
        certifications: userProfile.certifications,
        verificationDate: userProfile.verificationDate
      });
    }

    // 添加其他资料，按性别筛选
    const otherProfiles = centralMockProfiles.filter(profile => {
      // 按性别筛选
      if (genderFilter && profile.childGender !== genderFilter) {
        return false;
      }

      // 按年龄筛选
      if (profile.childAge < filters.ageMin || profile.childAge > filters.ageMax) {
        return false;
      }

      // 按城市筛选
      if (filters.location && !profile.workCity.includes(filters.location)) {
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
              onClick={() => {
                setGenderFilter('female');
                trackEvent(ANALYTICS_EVENTS.GENDER_SWITCH, { gender: 'female' });
              }}
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
              onClick={() => {
                setGenderFilter('male');
                trackEvent(ANALYTICS_EVENTS.GENDER_SWITCH, { gender: 'male' });
              }}
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
            const currentUserSettings = userSettings;

            return (
              <div
                key={profile.id}
                className={`warm-card overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-102 animate-fadeIn ${
                  isUserProfile ? 'border-2 border-[#FF8C42]' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  trackEvent(ANALYTICS_EVENTS.PROFILE_VIEW, {
                    profile_id: profile.id,
                    child_gender: profile.childGender,
                    from_page: 'home'
                  });
                  setLocation(`/profile/${profile.id}`);
                }}
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
                    <button
                      onClick={() => setVerificationModal({ isOpen: true, profileId: profile.id })}
                      className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      title="点击查看认证详情"
                    >
                      <Shield size={16} className="flex-shrink-0" />
                      <span>已认证</span>
                    </button>
                  )}
                </div>

                {/* Profile Info - Parent-Centric View */}
                <div className="space-y-3">
                  {/* Publisher Identity - Key for Parent Connection */}
                  <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <p className="text-sm font-bold text-blue-800">
                      {profile.parentName}的{profile.childGender === 'female' ? '女儿' : '儿子'}
                    </p>
                  </div>

                  {/* Name and Age - Primary */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E6]">
                    <h3 className="text-xl font-bold text-gray-800">{profile.childName}</h3>
                    <span className="text-lg font-bold text-[#FF8C42]">{profile.childAge}岁</span>
                  </div>

                  {/* Hard Assets - Highlighted Section */}
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-semibold">学历</span>
                      <span className="font-bold text-gray-800">{profile.childEducation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-semibold">职业</span>
                      <span className="font-bold text-gray-800">{profile.childOccupation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-semibold">工作地</span>
                      <span className="font-bold text-gray-800">{profile.workCity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-orange-200 pt-2">
                      <span className="text-gray-700 font-semibold flex items-center gap-1">
                        <HomeIcon className="w-3.5 h-3.5" />
                        住房
                      </span>
                      <span className="font-bold text-[#FF8C42]">
                        {profile.hasHousing === 'yes' ? '有房' : profile.hasHousing === 'no' ? '无房' : '不便透露'}
                      </span>
                    </div>
                  </div>

                  {/* Additional Assets */}
                  {(profile.hasCar !== 'unknown' || profile.annualIncome) && (
                    <div className="space-y-2 text-sm">
                      {profile.hasCar !== 'unknown' && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5" />
                            车产
                          </span>
                          <span className="font-semibold text-gray-800">
                            {profile.hasCar === 'yes' ? '有车' : '无车'}
                          </span>
                        </div>
                      )}
                      {profile.annualIncome && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">年收入</span>
                          <span className="font-semibold text-gray-800">{profile.annualIncome}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Zodiac & Native Place */}
                  {(profile.zodiacSign || profile.nativePlace) && (
                    <div className="space-y-2 text-sm border-t border-[#E8E8E6] pt-2">
                      {profile.nativePlace && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">籍贯</span>
                          <span className="font-semibold text-gray-800">{profile.nativePlace}</span>
                        </div>
                      )}
                      {profile.zodiacSign && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">属相</span>
                          <span className="font-semibold text-gray-800">{profile.zodiacSign}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {profile.childDescription && (
                    <p className="text-sm text-gray-700 line-clamp-2 bg-[#F5F5F3] p-3 rounded-lg">
                      {profile.childDescription}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
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
                          localStorage.setItem('qinjia_liked_profiles', JSON.stringify(Array.from(newSet)));
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
                        handleInviteShare(profile);
                      }}
                      className="flex-1 py-2 px-3 bg-[#F5F5F3] hover:bg-blue-50 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 size={18} />
                      邀请
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isUserProfile) {
                          setLocation(`/contact/${profile.id}`);
                        }
                      }}
                      disabled={!!isUserProfile}
                      className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors ${
                        isUserProfile
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-[#FF8C42] hover:bg-[#FF7A2F] text-white'
                      }`}
                    >
                      {isUserProfile ? '我的资料' : '申请联系'}
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

      {/* Verification Modal */}
      {verificationModal.profileId && (
        <VerificationModal
          isOpen={verificationModal.isOpen}
          onClose={() => setVerificationModal({ isOpen: false })}
          childName={filteredProfiles.find(p => p.id === verificationModal.profileId)?.childName || ''}
          parentName={filteredProfiles.find(p => p.id === verificationModal.profileId)?.parentName || ''}
          certifications={filteredProfiles.find(p => p.id === verificationModal.profileId)?.certifications || { phoneVerified: false, idVerified: false, profileVerified: false }}
          verificationDate={filteredProfiles.find(p => p.id === verificationModal.profileId)?.verificationDate}
        />
      )}

    </div>
  );
}
