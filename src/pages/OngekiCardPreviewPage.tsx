import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, RefreshCw, Image as ImageIcon, Settings, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './OngekiCardPreviewPage.css';

// Asset Paths
const ASSET_BASE = '/assets/images/ui';
const PREVIEW_BASE = '/card-preview/CardPreview';

const ATTRIBUTES = [
  { label: 'Fire', value: `${ASSET_BASE}/UI_Card_Attribute_00_Red.webp` },
  { label: 'Aqua', value: `${ASSET_BASE}/UI_Card_Attribute_01_Bule.webp` },
  { label: 'Leaf', value: `${ASSET_BASE}/UI_Card_Attribute_02_Green.webp` },
];

const RARITIES = [
  { label: 'SSR', value: `${ASSET_BASE}/UI_Card_Rare_03_SSR.webp` },
  { label: 'SR+', value: `${ASSET_BASE}/UI_Card_Rare_05_SRPlus.webp` },
  { label: 'SR', value: `${ASSET_BASE}/UI_Card_Rare_02_SR.webp` },
  { label: 'R', value: `${ASSET_BASE}/UI_Card_Rare_01_R.webp` },
  { label: 'N', value: `${ASSET_BASE}/UI_Card_Rare_00_N.webp` },
];

const GRADES = [
  { label: '无', value: '' },
  { label: '高中一年级', value: `${ASSET_BASE}/UI_Card_Grade_00001.webp` },
  { label: '高中二年级', value: `${ASSET_BASE}/UI_Card_Grade_00002.webp` },
  { label: '高中三年级', value: `${ASSET_BASE}/UI_Card_Grade_00003.webp` },
  { label: '初中二年级', value: `${ASSET_BASE}/UI_Card_Grade_00005.webp` },
];

const SKILLS = [
  { label: 'Attack', value: `${ASSET_BASE}/UI_Card_Skill_00_Attack.webp` },
  { label: 'Guard', value: `${ASSET_BASE}/UI_Card_Skill_02_Guard.webp` },
  { label: 'Boost', value: `${ASSET_BASE}/UI_Card_Skill_03_Boost.webp` },
];

const STARS = [0, 1, 2, 3, 4, 5];

// Number images for ATK
const getNumberImg = (num: string) => `${PREVIEW_BASE}/${num}.webp`;

export function OngekiCardPreviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // State
  const [charaImg, setCharaImg] = useState('/custom/assets_mu3/UI_Card_Chara_199001_P.png');
  const [isLocalImg, setIsLocalImg] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  
  const [showMainAttributes, setShowMainAttributes] = useState(true);
  const [attribute, setAttribute] = useState(ATTRIBUTES[1].value);
  const [name, setName] = useState('三角 葵');
  const [nick, setNick] = useState('Individual on Parade!');
  const [rarity, setRarity] = useState(RARITIES[0].value);
  const [grade, setGrade] = useState(GRADES[2].value);

  const [showSubAttributes, setShowSubAttributes] = useState(true);
  const [serial, setSerial] = useState('11010119530615199001');
  const [version, setVersion] = useState('[O.N.G.E.K.I.]2.05-0001');
  const [skill, setSkill] = useState(SKILLS[0].value);
  const [starCount, setStarCount] = useState(5);
  const [atk, setAtk] = useState(331);

  // Load html2canvas
  useEffect(() => {
    if (!(window as any).html2canvas) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCharaImg(url);
      setIsLocalImg(true);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current || !(window as any).html2canvas) return;
    
    try {
      const canvas = await (window as any).html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement('a');
      link.download = `ongeki_card_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('下载失败，请确保图片资源允许跨域访问 (CORS)');
    }
  };

  // Helper to render ATK numbers
  const renderAtkNumbers = () => {
    const atkStr = atk.toString().padStart(3, '0'); // Ensure at least 3 digits logic if needed, but original just renders digits
    return atkStr.split('').map((digit, idx) => (
      <img 
        key={idx} 
        className="card-max-atk-value-number" 
        src={getNumberImg(digit)} 
        alt={digit} 
      />
    ));
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-top bg-no-repeat font-fwqingyin ongeki-card-preview"
      style={{ 
        backgroundImage: 'url(/assets/images/backgrounds/bg3.png)',
        backgroundColor: '#f2f2f2'
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-5 left-5 bg-white/90 text-[#667eea] px-4 py-2.5 rounded-[20px] backdrop-blur-md shadow-lg z-50 hover:bg-[#667eea] hover:text-white transition-colors flex items-center gap-1 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        返回主页
      </button>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-[#e0e0e0]/95 backdrop-blur-sm rounded-[15px] p-6 max-w-[1200px] mx-auto shadow-lg relative">
          
          {/* Title */}
          <div className="flex flex-col items-center text-[#6495ed] drop-shadow-[1px_1px_1px_darkgray] mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ImageIcon className="w-8 h-8" />
              音击卡片生成器
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-sans">自定义并生成你的 Ongeki 风格卡片</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left: Controls */}
            <div className="lg:col-span-5 space-y-6 h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
              
              {/* Image Settings */}
              <div className="bg-white/60 rounded-xl p-5 shadow-sm border border-white/50">
                <h2 className="text-lg font-bold text-[#3a5a8c] mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  卡图设置
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">图片来源</label>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        value={charaImg} 
                        onChange={(e) => { setCharaImg(e.target.value); setIsLocalImg(false); }}
                        placeholder="输入图片 URL"
                        disabled={isLocalImg}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        上传本地图片
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {isLocalImg && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setCharaImg(''); setIsLocalImg(false); }}
                          className="text-red-500"
                        >
                          清除
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">
                      左右偏移: {offsetX}%
                    </label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      value={offsetX} 
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="w-full accent-[#667eea]"
                    />
                  </div>
                </div>
              </div>

              {/* Main Attributes */}
              <div className="bg-white/60 rounded-xl p-5 shadow-sm border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#3a5a8c] flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    主要属性
                  </h2>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showMainAttributes} 
                      onChange={(e) => setShowMainAttributes(e.target.checked)}
                      className="rounded text-[#667eea] focus:ring-[#667eea]"
                    />
                    显示
                  </label>
                </div>

                <div className={`space-y-3 ${!showMainAttributes ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">属性</label>
                    <select 
                      value={attribute} 
                      onChange={(e) => setAttribute(e.target.value)}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      {ATTRIBUTES.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">名称</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">昵称</label>
                      <Input value={nick} onChange={(e) => setNick(e.target.value)} className="bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">稀有度</label>
                      <select 
                        value={rarity} 
                        onChange={(e) => setRarity(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {RARITIES.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">年级</label>
                      <select 
                        value={grade} 
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {GRADES.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub Attributes */}
              <div className="bg-white/60 rounded-xl p-5 shadow-sm border border-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#3a5a8c] flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    其他属性
                  </h2>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showSubAttributes} 
                      onChange={(e) => setShowSubAttributes(e.target.checked)}
                      className="rounded text-[#667eea] focus:ring-[#667eea]"
                    />
                    显示
                  </label>
                </div>

                <div className={`space-y-3 ${!showSubAttributes ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">序列号</label>
                      <Input value={serial} onChange={(e) => setSerial(e.target.value)} className="bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">版本号</label>
                      <Input value={version} onChange={(e) => setVersion(e.target.value)} className="bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">技能</label>
                      <select 
                        value={skill} 
                        onChange={(e) => setSkill(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {SKILLS.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-600 mb-1">星级</label>
                      <select 
                        value={starCount} 
                        onChange={(e) => setStarCount(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">攻击力 (0-999)</label>
                    <Input 
                      type="number" 
                      value={atk} 
                      onChange={(e) => setAtk(Math.min(999, Math.max(0, Number(e.target.value))))} 
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleDownload} className="w-full bg-[#667eea] hover:bg-[#5a6fd6] py-6 text-lg shadow-md">
                <Download className="w-5 h-5 mr-2" />
                下载卡片
              </Button>
              <p className="text-xs text-center text-gray-500">注意：如果使用远程图片，必须支持 CORS 才能下载</p>

            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-7 flex items-start justify-center pt-4 lg:pt-0 sticky top-4">
              <div ref={previewRef} className="card-container user-select-none">
                
                {/* Character Image */}
                <div 
                  className="card-chara"
                  style={{ 
                    backgroundImage: `url("${charaImg}")`,
                    backgroundPositionX: `${offsetX}%`
                  }}
                />

                {/* Main Attributes */}
                <div className={`position-absolute w-100 h-100 ${!showMainAttributes ? 'hidden' : ''}`}>
                  {/* Element */}
                  <div className="">
                    <img className="card-attribute" src={attribute} alt="attribute" />
                  </div>
                  
                  {/* Rarity */}
                  <div className="">
                    <img className="card-rare" src={rarity} alt="rarity" />
                  </div>
                  
                  {/* Grade */}
                  {grade && (
                    <div className="">
                      <img className="card-gakunen" src={grade} alt="grade" />
                    </div>
                  )}
                  
                  {/* Name */}
                  <div className="card-name">
                    <div className="card-name-shadow">
                      <div className="card-name-nick">{nick}</div>
                      <div className="card-name-chara">{name}</div>
                    </div>
                    <div className="card-name-text">
                      <div className="card-name-nick card-text-shadow">{nick}</div>
                      <div className="card-name-chara card-text-shadow">{name}</div>
                    </div>
                  </div>
                </div>

                {/* Sub Attributes */}
                <div className={!showSubAttributes ? 'hidden' : ''}>
                  {/* Footer */}
                  <div className="card-info-footer">
                    <span>　　{serial} </span>
                    <span>{version} </span>
                  </div>

                  {/* Evolution Mark (Fixed for now) */}
                  <div className="">
                    <img 
                      draggable="false" 
                      className="card-kaika-state"
                      src="/assets/images/ui/UI_CMN_PrintMark_02_tyoukaika.webp"
                      alt="kaika"
                    />
                  </div>

                  {/* Skill */}
                  <div className="">
                    <div className="">
                      <img 
                        draggable="false"
                        className="card-skill-bg" 
                        src={skill}
                        alt="skill"
                      />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="card-star-container">
                    {Array.from({ length: starCount }).map((_, i) => (
                      <img 
                        key={i}
                        className="card-star" 
                        src="/assets/images/ui/UI_Card_star_00.webp"
                        alt="star"
                      />
                    ))}
                  </div>

                  {/* ATK */}
                  <img 
                    draggable="false" 
                    className="card-max-atk-title"
                    src="/assets/images/ui/UI_Card_max_00.webp"
                    alt="max"
                  />
                  <div className="card-max-atk-value-container">
                    {renderAtkNumbers()}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
