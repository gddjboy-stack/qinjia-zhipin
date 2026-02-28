/**
 * Home Page - 亲家直聘首页
 * 展示推荐的子女资料卡片流
 * 
 * 设计理念：温暖关怀型现代主义
 * - 卡片流设计，每个卡片代表一个子女资料
 * - 使用暖橙色主色 + 清爽蓝辅色
 * - 充足的留白和柔和阴影，传达关怀感
 */

import { useState } from 'react';
import { Heart, MapPin, Briefcase, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

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
  }
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedProfiles);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedProfiles(newLiked);
  };

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

      {/* Profile Cards Stream */}
      <div className="px-4 py-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">为您推荐</h2>

        {mockProfiles.map((profile, index) => (
          <div
            key={profile.id}
            className="warm-card cursor-pointer hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setLocation(`/profile/${profile.id}`)}
          >
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="px-4 py-6 text-center">
        <Button
          className="w-full bg-[#4A90E2] hover:bg-[#3A7FD2] text-white py-3 text-lg"
          onClick={() => setLocation('/publish')}
        >
          发布我的孩子资料
        </Button>
      </div>
    </div>
  );
}
