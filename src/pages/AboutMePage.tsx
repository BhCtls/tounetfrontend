import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AboutMePage() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

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
              src="/assets/images/icons/icon.png" 
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
              <p>🚰SDVX vf17或帝，💿二寺sp初段，🎹钢琴机泼盆仅摸过。</p>
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
              <p>只要没有聊到闹掰，加不加好友，无非只是方便或不方便看看聊聊。</p>
              <p>
                最大的雷点是
                <span className="text-red-600 font-bold text-[110%] mx-1">云玩家发言·行为</span>。
                我极端讨厌狗屁不懂且乐意当串子的人。
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
                onClick={() => window.open('/assets/images/misc/kl_image.png')}
              >
                关注我，获取更多细碎生活日常！
                <span className="text-[80%] text-gray-500 ml-2">点击此处获取扩列图全图</span>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">成就解锁（全都可以点）</h2>
              <p>音乐游戏：<span>舞萌祭将星将</span>|<span>中二 雪男AJ</span>|<span>音击 Viyella's scream ABFB</span></p>
              <p>
                ai辅助编程：
                <span className="cursor-pointer hover:underline" onClick={() => window.open('/wxtk/')}>语法填空生成器</span>｜
                <span className="cursor-pointer hover:underline" onClick={() => window.open('/')}>中二节奏读图算rating</span>｜
                <span className="cursor-pointer hover:underline" onClick={() => window.open('/searchall')}>数据库查找工具</span>｜
                <span className="cursor-pointer hover:underline" onClick={() => window.open('/')}>文字游戏：魔法花园</span>
              </p>
              <p>博客：三年来已持续书写80000余字（略摸），仍在持续更新</p>
              <p>同音：电子专辑墙有100+张专辑（含二寺ost等）</p>
            </section>
          </div>

          {/* Contact Toggle Button (Collapsed) */}
          {!showContact && (
            <div 
              className="absolute bottom-[10px] right-[10px] bg-pink-300 p-[5px] rounded-[10px] cursor-pointer w-[30px] text-center leading-[1.2] font-fwqingyin hover:bg-pink-400 transition-colors"
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
              className="absolute bottom-[10px] right-[10px] bg-pink-300 p-[5px] rounded-[10px] cursor-pointer font-fwqingyin z-10 shadow-lg"
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
                src="/assets/images/misc/qr.png" 
                alt="点击下载扩列二维码" 
                className="w-[170px] h-[170px] bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
