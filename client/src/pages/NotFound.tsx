import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-[#FF8C42] mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">页面不存在</h1>
      <p className="text-gray-600 mb-6">抱歉，您访问的页面不存在或已被删除。</p>
      <Button
        className="bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
        onClick={() => setLocation('/')}
      >
        返回首页
      </Button>
    </div>
  );
}
