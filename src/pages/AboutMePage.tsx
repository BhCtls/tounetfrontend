import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDynamicAssets } from '../hooks/useDynamicAssets';

export function AboutMePage() {
  const navigate = useNavigate();
  const { fontLoaded, backgroundLoaded, backgroundUrl } = useDynamicAssets();
  const [showContact, setShowContact] = useState(false);

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: '#f2f2f2',
        backgroundImage: backgroundLoaded ? `url("${backgroundUrl}")` : 'url("/assets/images/backgrounds/bg3.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundSize: 'cover'
      }}
    >
      {/* Back Link */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-5 left-5 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        返回主页
      </button>

      {/* Main Container */}
      <div 
        className="max-w-4xl mx-auto my-12 p-5 relative"
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: fontLoaded ? "'DynamicFont', Arial, sans-serif" : "'FWQingYin', Arial, sans-serif"
        }}
      >
        {/* Title */}
        <div className="flex justify-center mb-6">
          <h1 
            className="text-3xl"
            style={{ 
              color: 'cornflowerblue', 
              textShadow: 'darkgray 1px 1px 1px' 
            }}
          >
            关于透明
          </h1>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-5 mb-6">
          <img 
            src="/assets/images/icons/icon.png" 
            alt="Profile Icon"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-2xl mb-2">透明</h1>
            <p className="mb-1">透明是一个简单的人。人如其名，透明是小透明一枚。</p>
            <p className="mb-1">04 | 男性 | 石家庄&杭州</p>
            <p>wds | restage | 街机&移动端音游 | 同人音乐 | 写博客</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">兴趣爱好</h2>
            <p className="mb-2">喜欢音乐游戏(特别是街机)与写博客。编程未入门。美食和逛街也是我人生中不可或缺的部分。</p>
            <p className="mb-2">SEGA三家平均游戏经验4年以上，三虹极曾达成。</p>
            <p className="mb-2">🚰SDVX vf17或帝，💿二寺sp初段，🎹钢琴机泼盆仅摸过。</p>
            <p>个人买一些周边专辑做收藏，不过我更青睐数字专辑。</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">关于自推</h2>
            <p className="mb-2">
              目前主推
              <span className="font-bold text-lg" style={{ color: 'skyblue' }}>三角葵</span>
              （如生命般激推），在推
              <span className="font-bold text-lg" style={{ color: 'lightskyblue' }}>双葉湊音</span>，
              <span className="font-bold text-lg" style={{ color: 'sandybrown' }}>しぐれうい</span>，
              <span className="font-bold text-lg" style={{ color: 'rgb(255, 140, 184)' }}>鳳ここな</span>。
              喜欢玉桂狗视频。
            </p>
            <p className="mb-2">您若是BlackY与onoken的粉丝，也欢迎与我交友！</p>
            <p className="mb-2">如果您是我的同担，那么随时欢迎探讨推活事宜。若您有忌讳请提前考虑，我恐怕难以顾及所有忌讳。</p>
            <p>自己虽年迈，但等待发现更多可爱且值得一推的生命!</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">关于交友</h2>
            <p className="mb-2">只要没有聊到闹掰，加不加好友，无非只是方便或不方便看看聊聊。</p>
            <p className="mb-2">
              最大的雷点是
              <span className="font-bold text-lg text-red-600">云玩家发言·行为</span>。
              我极端讨厌狗屁不懂且乐意当串子的人。
            </p>
            <p className="mb-2">
              空间会发
              <span className="font-bold text-lg text-red-600">无预警血图</span>的,
              <span className="font-bold text-lg text-red-600">待人刻薄者</span>也不建议加好友。
            </p>
            <p 
              className="inline-block cursor-pointer rounded-lg px-4 py-2"
              style={{ 
                background: '#fffbe6', 
                color: '#b08a00' 
              }}
              onClick={() => handleExternalLink('/assets/images/misc/kl_image.png')}
            >
              关注我，获取更多细碎生活日常！
              <span className="block text-xs text-gray-500">点击此处获取扩列图全图</span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">成就解锁（全都可以点）</h2>
            <p className="mb-2">
              音乐游戏：
              <span className="text-blue-600">舞萌祭将星将</span>|
              <span className="text-blue-600">中二sun&plus全鸟</span>|
              <span className="text-blue-600">音击赤击确认。</span>
            </p>
            <p className="mb-2">
              ai辅助编程：
              <span 
                className="text-blue-600 cursor-pointer hover:underline" 
                onClick={() => handleExternalLink('/wxtk/')}
              >
                语法填空生成器
              </span>｜
              <span 
                className="text-blue-600 cursor-pointer hover:underline" 
                onClick={() => handleExternalLink('/')}
              >
                中二节奏读图算rating
              </span>｜
              <span 
                className="text-blue-600 cursor-pointer hover:underline" 
                onClick={() => handleExternalLink('/searchallv3')}
              >
                数据库查找工具
              </span>｜
              <span 
                className="text-blue-600 cursor-pointer hover:underline" 
                onClick={() => handleExternalLink('/')}
              >
                文字游戏：魔法花园
              </span>
            </p>
            <p className="mb-2">博客：三年来已持续书写80000余字（略摸），仍在持续更新</p>
            <p>同音：电子专辑墙有100+张专辑（含二寺ost等）</p>
          </div>
        </div>

        {/* Contact Container */}
        <div className="absolute bottom-2 right-2">
          {!showContact ? (
            <div 
              className="cursor-pointer text-center p-2 rounded-lg"
              style={{
                backgroundColor: 'pink',
                fontFamily: fontLoaded ? "'DynamicFont', Arial, sans-serif" : "'FWQingYin', Arial, sans-serif",
                lineHeight: '1.2'
              }}
              onClick={toggleContact}
            >
              <p>&nbsp;</p>
              <p>&lt;</p>
              <p>&nbsp;</p>
            </div>
          ) : (
            <div 
              className="cursor-pointer text-center p-2 rounded-lg"
              style={{
                backgroundColor: 'pink',
                fontFamily: fontLoaded ? "'DynamicFont', Arial, sans-serif" : "'FWQingYin', Arial, sans-serif",
                lineHeight: '1.2'
              }}
              onClick={toggleContact}
            >
              <p className="text-xs">＞＞＞＞关闭＞＞＞＞</p>
              <p>
                B站：
                <span 
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExternalLink('https://space.bilibili.com/123109251');
                  }}
                >
                  三角葵
                </span>
              </p>
              <p>
                QQ:
                <span 
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExternalLink('https://qm.qq.com/cgi-bin/qm/qr?k=fdiUIj5qJFRDaK6y4CrRjMtN8KsgGUwx#');
                  }}
                >
                  1084701403
                </span>
              </p>
              <img 
                src="/assets/images/misc/qr.png" 
                alt="点击下载扩列二维码" 
                className="w-24 h-24 mt-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive adjustments */}
      <style>{`
        @media (max-width: 600px) {
          .container {
            padding: 15px;
            margin: 20px 10px;
          }
          .header-section img {
            width: 70px;
            height: 70px;
          }
        }
      `}</style>
    </div>
  );
}
