/**
 * Bottom Navigation Component
 * 移动端底部导航栏
 */

import { Home, Plus, User } from 'lucide-react';
import { useLocation } from 'wouter';

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E6] px-4 py-3 flex justify-around items-center">
      {/* Home */}
      <button
        onClick={() => setLocation('/')}
        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
          isActive('/') 
            ? 'text-[#FF8C42]' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Home size={24} />
        <span className="text-xs font-semibold">首页</span>
      </button>

      {/* Publish */}
      <button
        onClick={() => setLocation('/publish')}
        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
          isActive('/publish')
            ? 'text-[#FF8C42]'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <Plus size={24} />
        <span className="text-xs font-semibold">发布</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setLocation('/me')}
        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
          isActive('/me')
            ? 'text-[#FF8C42]'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <User size={24} />
        <span className="text-xs font-semibold">我的</span>
      </button>
    </div>
  );
}
