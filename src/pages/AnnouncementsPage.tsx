import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommit, Calendar, User } from 'lucide-react';
import commitsData from '../data/commits.json';

interface Commit {
  hash: string;
  date: string;
  message: string;
  author: string;
}

export function AnnouncementsPage() {
  const navigate = useNavigate();
  const commits = commitsData as Commit[];

  return (
    <div 
      className="page-background"
      style={{ 
        backgroundImage: 'url(/assets/images/backgrounds/bg3.png)'
      }}
    >
      {/* Back Link */}
      <button
        onClick={() => navigate('/')}
        className="back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        返回主页
      </button>

      <div className="container mx-auto px-4 py-12">
        <div className="container-main-lg">
          
          {/* Title */}
          <div className="title-container-lg">
            <h1 className="text-3xl font-bold">更新公告</h1>
          </div>

          {/* Commits List */}
          <div className="space-y-4">
            {commits.map((commit) => (
              <div 
                key={commit.hash}
                className="bg-white/80 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-[#667eea]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{commit.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    <GitCommit className="w-3 h-3" />
                    <span>{commit.hash}</span>
                  </div>
                </div>
                
                <p className="text-gray-800 font-medium text-lg mb-2">
                  {commit.message}
                </p>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <User className="w-3 h-3" />
                  <span>{commit.author}</span>
                </div>
              </div>
            ))}
          </div>

          {commits.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              暂无更新记录
              如何更新公告：
              如果未来有新的代码提交，只需在终端运行以下命令即可
              node scripts/generate-commits.js
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
