import { PageLayout } from '../components/PageLayout';

export function SponsorPage() {
  return (
    <PageLayout backgroundImage="bg1.png">
      <div className="container mx-auto px-4 py-8">
        {/* Sponsor Header */}
        <div className="max-w-[420px] mx-auto mt-[15px] mb-[24px] text-center bg-[#888] rounded-[16px] py-[18px] px-[20px] text-white">
          <h1 className="text-white mt-0 mb-4 text-2xl font-bold">赞助饱饱</h1>
          <p className="text-white mb-2">如果你喜欢我，欢迎赞助我！</p>
          <p className="text-white">你可以通过以下方式支持我：</p>
        </div>

        {/* Payment Methods */}
        <div className="flex justify-between items-center max-w-[800px] mx-auto my-[30px] mb-[20px] px-4 md:px-0">
          <div className="flex flex-col items-center w-[48%]">
            <img
              src="/assets/images/misc/alipay.png"
              alt="支付宝"
              className="w-full max-w-[480px] rounded-[10px] shadow-[0_2px_8px_#ccc] mb-2"
            />
            <span className="text-2xl text-[#6ea8ff] drop-shadow-[0_0_2px_#888]">
              支付宝
            </span>
          </div>

          <div className="flex flex-col items-center w-[48%]">
            <img
              src="/assets/images/misc/wechat.png"
              alt="微信"
              className="w-full max-w-[480px] rounded-[10px] shadow-[0_2px_8px_#ccc] mb-2"
            />
            <span className="text-2xl text-[#7eff87] drop-shadow-[0_0_2px_#888]">
              微信
            </span>
          </div>
        </div>

        {/* Other Payment Methods */}
        <div className="max-w-[420px] mx-auto text-center bg-[#888] rounded-[16px] py-[10px] px-[20px] text-white my-[15px] mb-[24px]">
          <h3 className="text-white text-lg mb-2 font-bold">其他支付方式</h3>
          <a
            href="https://www.paypal.me/BhCtls"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            PayPal
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
