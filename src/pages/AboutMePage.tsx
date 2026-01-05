import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

export function AboutMePage() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<{src: string, title: string, desc: string} | null>(null);

  const achievements = [
    { src: '/assets/images/kl/博客_1.png', title: '博客', desc: 'bhctls.github.io' },
    { src: '/assets/images/kl/工具_1.png', title: '实用工具 I', desc: '学科小工具&各种奇思妙想' },
    { src: '/assets/images/kl/工具_2.png', title: '实用工具 II', desc: '音乐游戏相关开发' },
    { src: '/assets/images/kl/活动_1.jpg', title: '线下活动', desc: '2024.10 Google DevFest' },
    { src: '/assets/images/kl/游戏_1.JPG', title: '游戏成就 I', desc: '2025.12 雪男AJ！！！！' },
    { src: '/assets/images/kl/游戏_2.JPG', title: '游戏成就 II', desc: '音击 15.3全鸟' },
    { src: '/assets/images/kl/游戏_3.JPG', title: '游戏成就 III', desc: 'XV版本b50，风呗8247和makear一绿是亮点' },
    { src: '/assets/images/kl/谷饭_1.JPG', title: '谷子与美食 I', desc: '我喜欢三角葵，也喜欢甜点！' },
    { src: '/assets/images/kl/谷饭_2.JPG', title: '谷子与美食 II', desc: '目前最高兴的一次生日饭，感谢朋友们' },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-top bg-no-repeat font-fwqingyin"
      style={{ 
        backgroundImage: 'url(/assets/images/backgrounds/bg3.png)',
        backgroundColor: '#f2f2f2'
      }}
    >
      {/* Back Link */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-5 left-5 bg-white/90 text-[#667eea] px-4 py-2.5 rounded-[20px] backdrop-blur-md shadow-lg z-50 hover:bg-[#667eea] hover:text-white transition-colors flex items-center gap-1 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        返回主页
      </button>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-[#e0e0e0] rounded-[15px] p-5 max-w-[900px] mx-auto shadow-lg relative">
          
          {/* Title */}
          <div className="flex justify-center text-[#6495ed] drop-shadow-[1px_1px_1px_darkgray] mb-5">
            <h1 className="text-3xl font-bold">关于透明</h1>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
            <img 
              src="/assets/images/icons/emblem2.svg" 
              alt="Profile Icon"
              className="w-[100px] h-[100px] rounded-full"
            />
            <div className="font-fwqingyin text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">透明</h1>
              <p className="mb-1">透明是一个简单的人。人如其名，透明是小透明一枚。</p>
              <p className="mb-1">04 | 男性 | 石家庄&杭州</p>
              <p>re:stage | 学マス | 街机&移动端音游 | 同人音乐 | 写博客</p>
            </div>
          </div>

          {/* Introduction Content */}
          <div className="font-fwqingyin space-y-4">
            <section>
              <h2 className="text-xl font-bold mb-2">兴趣爱好</h2>
              <p>喜欢音乐游戏(特别是街机)与写博客。编程未入门。美食和逛街也是我人生中不可或缺的部分。</p>
              <p>SEGA三家平均游戏经验4年以上，三虹极曾达成。</p>
              <p>🚰SDVX vf17或帝，💿二寺sp初段，ub鸟了十几个10级，🎹钢琴机泼盆仅摸过。</p>
              <p>个人买一些周边专辑做收藏，不过我更青睐数字专辑。</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">关于自推</h2>
              <p>
                目前主推
                <span className="text-[skyblue] font-bold text-[110%] mx-1">三角葵</span>
                （如生命般激推），在推
                <span className="text-[lightskyblue] font-bold text-[110%] mx-1">双葉湊音</span>，
                <span className="text-[#ff8cb8] font-bold text-[110%] mx-1">鳳ここな</span>。
                喜欢玉桂狗视频。
              </p>
              <p>您若是BlackY与onoken的粉丝，也欢迎与我交友！</p>
              <p>如果您是我的同担，那么随时欢迎探讨推活事宜。若您有忌讳请提前考虑，我恐怕难以顾及所有忌讳。</p>
              <p>自己虽年迈，但等待发现更多可爱且值得一推的生命!</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">关于交友</h2>
              <p>加不加好友，无非只是方便或不方便看看聊聊。看着顺眼就大胆加好友</p>
              <p>
                最大的雷点是
                <span className="text-red-600 font-bold text-[110%] mx-1">云玩家发言·行为</span>
                （也不要当串子哦）。
              </p>
              <p>
                空间会发
                <span className="text-red-600 font-bold text-[110%] mx-1">无预警血图</span>
                的,
                <span className="text-red-600 font-bold text-[110%] mx-1">待人刻薄者</span>
                也不建议加好友。
              </p>
              <div 
                className="bg-[#fffbe6] rounded-[10px] px-[14px] py-[8px] text-[#b08a00] inline-block mt-2 cursor-pointer hover:opacity-80"
                onClick={() => window.open('/assets/images/kl/kl_image.png')}
              >
                关注我，获取更多细碎生活日常！
                <span className="text-[80%] text-gray-500 ml-2">点击此处获取扩列图全图</span>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">成就解锁（点看大图）</h2>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map((item, index) => (
                  <div 
                    key={index} 
                    className="aspect-square cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                    onClick={() => setSelectedAchievement(item)}
                  >
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Contact Toggle Button (Collapsed) */}
          {!showContact && (
            <div 
              className="absolute bottom-[60%] right-[10px] bg-pink-300 p-[5px] rounded-[10px] cursor-pointer w-[30px] text-center leading-[1.2] font-fwqingyin hover:bg-pink-400 transition-colors"
              onClick={() => setShowContact(true)}
            >
              <p>&nbsp;</p>
              <p>&lt;</p>
              <p>&nbsp;</p>
            </div>
          )}

          {/* Contact Container (Expanded) */}
          {showContact && (
            <div 
              className="absolute bottom-[50%] right-[10px] bg-pink-300 p-[5px] rounded-[10px] cursor-pointer font-fwqingyin z-10 shadow-lg"
              onClick={() => setShowContact(false)}
            >
              <p className="text-[60%] text-center mb-1">＞＞＞＞关闭＞＞＞＞</p>
              <p className="mb-1">
                B站：
                <span 
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://space.bilibili.com/123109251');
                  }}
                >
                  三角葵
                </span>
              </p>
              <p className="mb-1">
                QQ:
                <span 
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://qm.qq.com/cgi-bin/qm/qr?k=fdiUIj5qJFRDaK6y4CrRjMtN8KsgGUwx#');
                  }}
                >
                  1084701403
                </span>
              </p>
              <img 
                src="/assets/images/kl/qr.jpg" 
                alt="点击下载扩列二维码" 
                className="w-[170px] h-[170px] bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 font-fwqingyin"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedAchievement(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 pr-10">{selectedAchievement.title}</h3>
            
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-50 flex justify-center border border-gray-100">
              <img 
                src={selectedAchievement.src} 
                alt={selectedAchievement.title} 
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 text-lg leading-relaxed">{selectedAchievement.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
