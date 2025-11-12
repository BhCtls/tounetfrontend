import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDynamicAssets } from '../hooks/useDynamicAssets';

export function SponsorPage() {
  const navigate = useNavigate();
  const { fontLoaded, backgroundLoaded, backgroundUrl } = useDynamicAssets();

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: '#f2f2f2',
        backgroundImage: backgroundLoaded ? `url("${backgroundUrl}")` : 'url("/assets/images/backgrounds/bg1.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        margin: 0,
        fontFamily: fontLoaded ? "'DynamicFont', Arial, sans-serif" : "'FWQingYin', Arial, sans-serif"
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

      {/* Sponsor Header */}
      <div 
        className="max-w-md mx-auto mt-4 mb-6 text-center"
        style={{
          background: '#888',
          borderRadius: '16px',
          padding: '18px 20px',
          color: '#fff',
          margin: '15px auto 24px auto'
        }}
      >
        <h1 className="text-white mt-0 mb-4 text-2xl">赞助饱饱</h1>
        <p className="text-white mb-2">如果你喜欢我，欢迎赞助我！</p>
        <p className="text-white">你可以通过以下方式支持我：</p>
      </div>

      {/* Payment Methods */}
      <div 
        className="flex justify-between items-center max-w-4xl mx-auto my-8 px-4"
        style={{
          maxWidth: '800px',
          margin: '30px auto 20px auto'
        }}
      >
        <div className="flex flex-col items-center w-[48%]">
          <img 
            src="/assets/images/misc/alipay.png" 
            alt="支付宝"
            className="w-full max-w-md rounded-lg shadow-md mb-2"
            style={{
              maxWidth: '480px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px #ccc'
            }}
          />
          <span 
            className="text-2xl"
            style={{ 
              color: '#6ea8ff', 
              textShadow: '1px 1px 2px #888' 
            }}
          >
            支付宝
          </span>
        </div>
        
        <div className="flex flex-col items-center w-[48%]">
          <img 
            src="/assets/images/misc/wechat.png" 
            alt="微信"
            className="w-full max-w-md rounded-lg shadow-md mb-2"
            style={{
              maxWidth: '480px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px #ccc'
            }}
          />
          <span 
            className="text-2xl"
            style={{ 
              color: '#7eff87', 
              textShadow: '1px 1px 2px #888' 
            }}
          >
            微信
          </span>
        </div>
      </div>

      {/* Other Payment Methods */}
      <div 
        className="max-w-md mx-auto text-center"
        style={{
          background: '#888',
          borderRadius: '16px',
          padding: '10px 20px',
          color: '#fff',
          margin: '15px auto 24px auto'
        }}
      >
        <h3 className="text-white text-lg mb-2">其他支付方式</h3>
        <a 
          href="https://www.paypal.me/BhCtls" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-100 underline"
        >
          PayPal
        </a>
      </div>

      {/* Mobile Responsive - handled by Tailwind classes above */}
    </div>
  );
}
