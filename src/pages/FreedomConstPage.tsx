import { useState, useEffect, useRef, Fragment } from 'react';
import type { SongData, GameType, ConstBlock, BlockItem } from '../types/freedomConst';
import { Search, Plus, Trash2, Download, Maximize, Minimize, Palette, ArrowLeftRight, ArrowUpDown, Image as ImageIcon, ArrowLeft, Pen, RotateCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const GAME_URLS = {
  maimai: 'https://reiwa.f5.si/maimai_official.json',
  chunithm: 'https://reiwa.f5.si/chunithm_official.json',
  ongeki: 'https://reiwa.f5.si/ongeki_official.json',
};

const IMAGE_BASE_URL = 'https://reiwa.f5.si/jackets/';

const BG_IMAGES = {
  simplebg: 'https://reiwa.f5.si/freedom_const/simplebg.png',
  ultima: 'https://reiwa.f5.si/freedom_const/ultima.png',
  worldsend: 'https://reiwa.f5.si/freedom_const/worldsend.png',
  lunatic: 'https://reiwa.f5.si/freedom_const/lunatic.png',
  remaster: 'https://reiwa.f5.si/freedom_const/remaster.png',
};

const DIFFICULTIES: Record<string, { label: string; bg: keyof typeof BG_IMAGES; color: string }> = {
  bas: { label: 'BASIC', bg: 'simplebg', color: '#22c55e' },
  adv: { label: 'ADVANCED', bg: 'simplebg', color: '#fff237' },
  exp: { label: 'EXPERT', bg: 'simplebg', color: '#ef4444' },
  mas: { label: 'MASTER', bg: 'simplebg', color: '#a855f7' },
  ult: { label: 'ULTIMA', bg: 'ultima', color: '#674242' },
  we: { label: "WORLD'S END", bg: 'worldsend', color: '#3cff7d' },
  lun: { label: 'LUNATIC', bg: 'lunatic', color: '#e1c4c4' },
  rem: { label: 'Re:MASTER', bg: 'remaster', color: '#eec1e4' },
};

const GAME_NAMES = {
  maimai: '舞萌 (Maimai)',
  chunithm: '中二节奏 (Chunithm)',
  ongeki: '音击 (Ongeki)',
};

const LEVEL_LABELS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+', '11', '11+', '12', '12+', '13', '13+', '14', '14+', '15', '15+', '0'
];

export default function FreedomConstPage() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameType>('chunithm');
  const [data, setData] = useState<Record<GameType, SongData[]>>({
    maimai: [],
    chunithm: [],
    ongeki: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set(LEVEL_LABELS));
  const [blocks, setBlocks] = useState<ConstBlock[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const [specialType, setSpecialType] = useState<'blank' | 'empty' | 'text' | null>('blank');
  const [tableName, setTableName] = useState('我的定数表');
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maimai, chunithm, ongeki] = await Promise.all([
          fetch(GAME_URLS.maimai).then(res => res.json()),
          fetch(GAME_URLS.chunithm).then(res => res.json()),
          fetch(GAME_URLS.ongeki).then(res => res.json()),
        ]);

        // Helper to ensure unique IDs
        const ensureIds = (list: any[]) => list.map((item, idx) => ({
          ...item,
          id: item.id ? String(item.id) : `generated-${idx}-${item.title}`
        }));

        setData({
          maimai: ensureIds(maimai),
          chunithm: ensureIds(chunithm),
          ongeki: ensureIds(ongeki)
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter songs
  const filteredSongs = data[activeGame].filter(song => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      (song.reading && song.reading.toLowerCase().includes(query));

    let hasLevel = false;
    const levelsToCheck = activeGame === 'maimai'
      ? ['lev_bas', 'lev_adv', 'lev_exp', 'lev_mas', 'lev_remas', 'dx_lev_bas', 'dx_lev_adv', 'dx_lev_exp', 'dx_lev_mas', 'dx_lev_remas']
      : activeGame === 'chunithm'
        ? ['lev_bas', 'lev_adv', 'lev_exp', 'lev_mas', 'lev_ult']
        : ['lev_bas', 'lev_adv', 'lev_exc', 'lev_mas', 'lev_lnt'];

    for (const key of levelsToCheck) {
      const level = (song as any)[key];
      if (level && selectedLevels.has(level)) {
        hasLevel = true;
        break;
      }
    }

    if (selectedLevels.has('0') && levelsToCheck.every(key => !(song as any)[key])) {
      hasLevel = true;
    }

    return matchesSearch && hasLevel;
  }).slice(0, 100);

  const handleAddBlock = (index?: number) => {
    const newBlock: ConstBlock = {
      id: Date.now().toString(),
      label: '??',
      items: [],
      settings: {
        fontSize: 30,
        areaSize: 30,
        isGaming: false,
        isOverflow: true,
        rotation: 0,
      },
    };

    if (index !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 0, newBlock);
      setBlocks(newBlocks);
    } else {
      setBlocks([...blocks, newBlock]);
    }
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleAddItem = (blockId: string, itemType: 'song' | 'blank' | 'fake' | 'empty' | 'text' | 'separator', song?: SongData, insertIndex?: number) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newItem: BlockItem = {
          id: Date.now().toString(),
          type: itemType,
          song: song,
          game: activeGame,
          text: itemType === 'text' ? 'Text' : undefined,
          fontSize: itemType === 'text' ? 14 : undefined,
          textOffsetY: itemType === 'text' ? 0 : undefined,
          isRainbow: false,
          difficulty: 'mas',
          rotation: 0,
          isGreyscale: false,
          isMirrorX: false,
          isMirrorY: false,
          offsetX: 0,
          offsetY: 0,
        };

        const newItems = [...block.items];
        if (insertIndex !== undefined) {
          newItems.splice(insertIndex, 0, newItem);
        } else {
          newItems.push(newItem);
        }

        return {
          ...block,
          items: newItems
        };
      }
      return block;
    }));
  };

  const handleUpdateItem = (blockId: string, itemId: string, updates: Partial<BlockItem>) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          items: block.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return block;
    }));
  };

  const handleRemoveItem = (blockId: string, itemId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          items: block.items.filter(item => item.id !== itemId)
        };
      }
      return block;
    }));
  };

  const handleMouseDown = (e: React.MouseEvent, blockId: string, itemId: string) => {
    if (!isEditMode) return;

    e.preventDefault();
    e.stopPropagation();

    // Find current item to get initial offsets
    const block = blocks.find(b => b.id === blockId);
    const item = block?.items.find(i => i.id === itemId);
    const initialOffsetX = item?.offsetX || 0;
    const initialOffsetY = item?.offsetY || 0;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      handleUpdateItem(blockId, itemId, {
        offsetX: initialOffsetX + deltaX,
        offsetY: initialOffsetY + deltaY
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent, blockId: string, itemId: string) => {
    if (!isEditMode) return;

    if (e.touches.length !== 1) return;
    e.stopPropagation();

    // Find current item to get initial offsets
    const block = blocks.find(b => b.id === blockId);
    const item = block?.items.find(i => i.id === itemId);
    const initialOffsetX = item?.offsetX || 0;
    const initialOffsetY = item?.offsetY || 0;
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault(); // Prevent scrolling
      const deltaX = moveEvent.touches[0].clientX - startX;
      const deltaY = moveEvent.touches[0].clientY - startY;

      handleUpdateItem(blockId, itemId, {
        offsetX: initialOffsetX + deltaX,
        offsetY: initialOffsetY + deltaY
      });
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  };

  const handleExport = async () => {
    if (!tableRef.current) return;
    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc: Document) => {
          const inputs = clonedDoc.querySelectorAll('input');
          inputs.forEach((input: HTMLInputElement) => {
            const div = clonedDoc.createElement('div');
            div.innerText = input.value;
            div.style.cssText = window.getComputedStyle(input).cssText;
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            // Ensure font size is copied correctly if it was inline
            if (input.style.fontSize) {
              div.style.fontSize = input.style.fontSize;
            }
            input.parentNode?.replaceChild(div, input);
          });

          const textareas = clonedDoc.querySelectorAll('textarea');
          textareas.forEach((textarea: HTMLTextAreaElement) => {
            const div = clonedDoc.createElement('div');
            div.innerText = textarea.value;
            div.style.cssText = window.getComputedStyle(textarea).cssText;
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.whiteSpace = 'pre-wrap';
            if (textarea.style.fontSize) {
              div.style.fontSize = textarea.style.fontSize;
            }
            if (textarea.style.paddingTop) {
              div.style.paddingTop = textarea.style.paddingTop;
            }
            textarea.parentNode?.replaceChild(div, textarea);
          });
        }
      } as any);
      const link = document.createElement('a');
      link.download = `freedom-const-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请检查控制台错误。可能由于跨域图片限制。');
    }
  };

  const getImageUrl = (game: GameType, imageName?: string) => {
    if (!imageName) return '';
    let name = imageName;
    if (game === 'chunithm') {
      name = name.replace('.jpg', '');
    } else {
      name = name.replace('.png', '');
    }
    return `${IMAGE_BASE_URL}${game}/${name}.webp`;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat font-fwqingyin"
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
        <div className="bg-[#e0e0e0]/95 backdrop-blur-sm rounded-[15px] p-6 max-w-[1400px] mx-auto shadow-lg relative">

          {/* Title */}
          <div className="flex flex-col items-center text-[#6495ed] drop-shadow-[1px_1px_1px_darkgray] mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ImageIcon className="w-8 h-8" />
              定数表生成
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-sans">自定义生成定数表 / Freedom Const Generator Clone</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
              <div className="bg-white/60 rounded-xl p-4 space-y-4 shadow-sm border border-white/50">
                <h2 className="text-xl font-bold text-gray-800">设置</h2>

                <div className="flex gap-2">
                  {(Object.keys(GAME_NAMES) as GameType[]).map(game => (
                    <button
                      key={game}
                      onClick={() => setActiveGame(game)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${activeGame === game
                        ? 'bg-[#667eea] text-white'
                        : 'bg-white/50 text-gray-700 hover:bg-white/80'
                        }`}
                    >
                      {GAME_NAMES[game].split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">表标题</label>
                  <Input
                    value={tableName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTableName(e.target.value)}
                    placeholder="输入标题..."
                    className="bg-white/80"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 bg-[#667eea] hover:bg-[#5a6fd6]">
                    <Download size={16} /> 保存图片
                  </Button>
                  <Button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex-none px-3 border ${isEditMode ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-white/50 text-gray-700 border-gray-200'} hover:bg-white/80`}
                    title={isEditMode ? "退出编辑模式" : "进入编辑模式"}
                  >
                    <Pen size={16} />
                  </Button>
                  <Button
                    onClick={() => setIsTitleTruncated(!isTitleTruncated)}
                    className="flex-none px-3 bg-white/50 hover:bg-white/80 text-gray-700 border border-gray-200"
                    title={isTitleTruncated ? "显示完整标题" : "缩略标题"}
                  >
                    {isTitleTruncated ? <Maximize size={16} /> : <Minimize size={16} />}
                  </Button>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-4 space-y-4 shadow-sm border border-white/50">
                <h2 className="text-xl font-bold text-gray-800">歌曲选择</h2>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    className="pl-10 bg-white/80"
                    placeholder="搜索歌曲..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border rounded bg-white/50 custom-scrollbar">
                  <button
                    onClick={() => {
                      if (selectedLevels.size === LEVEL_LABELS.length) {
                        setSelectedLevels(new Set());
                      } else {
                        setSelectedLevels(new Set(LEVEL_LABELS));
                      }
                    }}
                    className={`text-xs px-2 py-1 rounded font-bold ${selectedLevels.size === LEVEL_LABELS.length
                      ? 'bg-blue-600 text-white border border-blue-700'
                      : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                  >
                    {selectedLevels.size === LEVEL_LABELS.length ? '全不选' : '全选'}
                  </button>
                  {LEVEL_LABELS.map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        const newLevels = new Set(selectedLevels);
                        if (newLevels.has(level)) newLevels.delete(level);
                        else newLevels.add(level);
                        setSelectedLevels(newLevels);
                      }}
                      className={`text-xs px-2 py-1 rounded ${selectedLevels.has(level)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      onClick={() => {
                        if (specialType === 'empty') setSpecialType(null);
                        else {
                          setSpecialType('empty');
                          setSelectedSong(null);
                        }
                      }}
                      className={`p-2 rounded border text-xs font-medium transition-colors ${selectedSong === null && specialType === 'empty' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white/40 hover:bg-white/80 text-gray-700'}`}
                    >
                      完全空位
                    </button>
                    <button
                      onClick={() => {
                        if (specialType === 'blank') setSpecialType(null);
                        else {
                          setSpecialType('blank');
                          setSelectedSong(null);
                        }
                      }}
                      className={`p-2 rounded border text-xs font-medium transition-colors ${selectedSong === null && specialType === 'blank' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white/40 hover:bg-white/80 text-gray-700'}`}
                    >
                      占位符
                    </button>
                    <button
                      onClick={() => {
                        if (specialType === 'text') setSpecialType(null);
                        else {
                          setSpecialType('text');
                          setSelectedSong(null);
                        }
                      }}
                      className={`p-2 rounded border text-xs font-medium transition-colors ${selectedSong === null && specialType === 'text' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white/40 hover:bg-white/80 text-gray-700'}`}
                    >
                      文本
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-4 text-gray-500">加载中...</div>
                  ) : (
                    filteredSongs.map(song => (
                      <div
                        key={song.id}
                        className={`p-2 rounded cursor-pointer border flex items-center gap-3 ${selectedSong?.id === song.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-white/80 bg-white/40'
                          }`}
                        onClick={() => {
                          if (selectedSong?.id === song.id) setSelectedSong(null);
                          else {
                            setSelectedSong(song);
                            setSpecialType(null);
                          }
                        }}
                      >
                        <img
                          src={getImageUrl(activeGame, song.image || song.image_url)}
                          alt={song.title}
                          className="w-10 h-10 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="overflow-hidden">
                          <div className="font-medium text-sm truncate">{song.title}</div>
                          <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Content: The Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <div className="min-w-[800px] bg-white p-8 shadow-lg rounded-lg" ref={tableRef}>
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 border-b-2 border-gray-800 pb-4">
                  {tableName}
                </h1>

                <div className="space-y-1" id="constlist">
                  <div className="flex justify-center" data-html2canvas-ignore="true">
                    <button
                      onClick={() => handleAddBlock(0)}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-[#667eea] hover:text-[#667eea] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> 添加定数区块 (顶部)
                    </button>
                  </div>

                  {blocks.map((block, index) => (
                    <div key={block.id} className="relative group border-2 border-gray-200 rounded-lg p-2 hover:border-gray-300 transition-colors">
                      <div className="absolute -right-3 -top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm rounded-full p-1 border z-10" data-html2canvas-ignore="true">
                        <button onClick={() => handleRemoveBlock(block.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-full" title="删除区块">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex gap-4">
                        {/* Constant Label */}
                        <div
                          className={`
                            flex-shrink-0 flex flex-col items-center justify-center border-r-2 border-gray-100 pr-4
                            ${block.settings.isGaming ? 'bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 text-white' : 'bg-transparent text-gray-800'}
                          `}
                          style={{
                            width: '100px',
                            transform: `rotate(${block.settings.rotation * 90}deg)`
                          }}
                        >
                          <input
                            value={block.label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newBlocks = [...blocks];
                              newBlocks[index].label = e.target.value;
                              setBlocks(newBlocks);
                            }}
                            className="text-center font-bold bg-transparent border-none focus:ring-0 w-full"
                            style={{ fontSize: `${block.settings.fontSize / 10}rem` }}
                          />

                          <div className="flex flex-wrap justify-center gap-1 mt-2 w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                const newBlocks = [...blocks];
                                newBlocks[index].settings.fontSize += 5;
                                setBlocks(newBlocks);
                              }}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200" title="增大字体"
                            >
                              <Maximize size={12} />
                            </button>
                            <button
                              onClick={() => {
                                const newBlocks = [...blocks];
                                newBlocks[index].settings.fontSize = Math.max(10, newBlocks[index].settings.fontSize - 5);
                                setBlocks(newBlocks);
                              }}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200" title="减小字体"
                            >
                              <Minimize size={12} />
                            </button>
                            <button
                              onClick={() => {
                                const newBlocks = [...blocks];
                                newBlocks[index].settings.isGaming = !newBlocks[index].settings.isGaming;
                                setBlocks(newBlocks);
                              }}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200" title="RGB模式"
                            >
                              <Palette size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Items Area */}
                        <div className="flex-1 flex flex-wrap gap-2 items-start content-start min-h-[100px]">
                          {(() => {
                            const isAnythingSelected = !!selectedSong || !!specialType;

                            // Helper to render the "add to end of row" buttons
                            const renderRowEndControls = (insertIndex: number) => {
                              if (!isAnythingSelected) return null;
                              return (
                                <div className="flex gap-1" data-html2canvas-ignore="true">
                                  <button
                                    onClick={() => {
                                      if (selectedSong) {
                                        handleAddItem(block.id, 'song', selectedSong, insertIndex);
                                      } else if (specialType) {
                                        handleAddItem(block.id, specialType, undefined, insertIndex);
                                      }
                                    }}
                                    className="w-24 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#667eea] hover:text-[#667eea] transition-colors"
                                    title={selectedSong ? `添加 "${selectedSong.title}"` : `添加 ${specialType === 'empty' ? '空位' : specialType === 'blank' ? '占位符' : '文本'}`}
                                  >
                                    <Plus size={24} />
                                  </button>
                                  <button
                                    onClick={() => handleAddItem(block.id, 'separator', undefined, insertIndex)}
                                    className="w-8 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#667eea] hover:text-[#667eea] transition-colors"
                                    title="添加分隔线"
                                  >
                                    <ArrowUpDown size={16} className="rotate-90" />
                                  </button>
                                </div>
                              );
                            };

                            return block.items.map((item, itemIndex) => (
                              <Fragment key={item.id}>
                                {item.type === 'separator' ? (
                                  <>
                                    {/* Row-end controls before each separator */}
                                    {renderRowEndControls(itemIndex)}
                                    <div className={`w-full h-2 flex items-center justify-center group/sep relative`}>
                                      <div className="w-full h-px bg-gray-300 absolute"></div>
                                      <div className="z-10 flex gap-2 bg-white px-2 opacity-0 group-hover/sep:opacity-100 transition-opacity border border-gray-200 rounded-full shadow-sm" data-html2canvas-ignore="true">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveItem(block.id, item.id);
                                          }}
                                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                                          title="删除分隔线"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className={`relative group/item w-24 ${isEditMode ? 'cursor-move z-20 hover:z-30' : ''}`}
                                    style={{
                                      transform: `translate(${item.offsetX || 0}px, ${item.offsetY || 0}px)`,
                                      touchAction: isEditMode ? 'none' : 'auto',
                                      userSelect: isEditMode ? 'none' : 'auto',
                                      WebkitUserSelect: isEditMode ? 'none' : 'auto',
                                      WebkitTouchCallout: isEditMode ? 'none' : 'default'
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, block.id, item.id)}
                                    onTouchStart={(e) => handleTouchStart(e, block.id, item.id)}
                                  >
                                    {/* Item Controls - Only show when NOT in Edit Mode */}
                                    {!isEditMode && (
                                      <div className="absolute -top-16 -right-8 z-20 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white shadow-lg rounded-lg border p-1 flex flex-col gap-1 w-24" data-html2canvas-ignore="true">
                                        {isAnythingSelected && (
                                          <div className="flex justify-between border-b pb-1">
                                            <span className="text-[10px] font-bold text-gray-500">左侧插入</span>
                                            <div className="flex gap-1">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (selectedSong) {
                                                    handleAddItem(block.id, 'song', selectedSong, itemIndex);
                                                  } else if (specialType) {
                                                    handleAddItem(block.id, specialType, undefined, itemIndex);
                                                  }
                                                }}
                                                className="text-blue-500 hover:bg-blue-50 rounded"
                                                title="在此之前插入"
                                              >
                                                <Plus size={12} />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAddItem(block.id, 'separator', undefined, itemIndex);
                                                }}
                                                className="text-gray-500 hover:bg-gray-50 rounded"
                                                title="插入换行"
                                              >
                                                <ArrowUpDown size={12} className="rotate-90" />
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex justify-between border-b pb-1">
                                          <span className="text-[10px] font-bold text-gray-500">操作</span>
                                          <button onClick={() => handleRemoveItem(block.id, item.id)} className="text-red-500 hover:bg-red-50 rounded">
                                            <Trash2 size={12} />
                                          </button>
                                        </div>

                                        {item.type === 'text' ? (
                                          <>
                                            <div className="flex justify-between gap-1 border-b pb-1">
                                              <button onClick={() => handleUpdateItem(block.id, item.id, { fontSize: (item.fontSize || 14) + 2 })} className="p-1 hover:bg-gray-100 rounded" title="放大">
                                                <Maximize size={12} />
                                              </button>
                                              <button onClick={() => handleUpdateItem(block.id, item.id, { fontSize: Math.max(8, (item.fontSize || 14) - 2) })} className="p-1 hover:bg-gray-100 rounded" title="缩小">
                                                <Minimize size={12} />
                                              </button>
                                              <button onClick={() => handleUpdateItem(block.id, item.id, { textOffsetY: (item.textOffsetY || 0) - 5 })} className="p-1 hover:bg-gray-100 rounded" title="上移">
                                                <ArrowUpDown size={12} />
                                              </button>
                                              <button onClick={() => handleUpdateItem(block.id, item.id, { textOffsetY: (item.textOffsetY || 0) + 5 })} className="p-1 hover:bg-gray-100 rounded" title="下移">
                                                <ArrowUpDown size={12} className="rotate-180" />
                                              </button>
                                            </div>
                                            <div className="flex justify-center border-b pb-1">
                                              <button
                                                onClick={() => handleUpdateItem(block.id, item.id, { isRainbow: !item.isRainbow })}
                                                className={`p-1 rounded w-full flex justify-center ${item.isRainbow ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white' : 'hover:bg-gray-100'}`}
                                                title="彩虹色"
                                              >
                                                <Palette size={12} />
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="grid grid-cols-4 gap-0.5">
                                            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
                                              <button
                                                key={key}
                                                onClick={() => handleUpdateItem(block.id, item.id, { difficulty: key })}
                                                className="w-full h-4 text-[8px] flex items-center justify-center text-white rounded-[1px]"
                                                style={{ backgroundColor: diff.color }}
                                                title={diff.label}
                                              >
                                                {key[0].toUpperCase()}
                                              </button>
                                            ))}
                                          </div>
                                        )}

                                        {item.type !== 'text' && (
                                          <div className="grid grid-cols-4 gap-1 p-1 bg-gray-50 rounded">
                                            <button onClick={() => handleUpdateItem(block.id, item.id, { rotation: (item.rotation || 0) + 1 })} className="p-1 hover:bg-gray-200 rounded flex justify-center text-gray-600" title="旋转">
                                              <RotateCw size={12} />
                                            </button>
                                            <button onClick={() => handleUpdateItem(block.id, item.id, { isMirrorX: !item.isMirrorX })} className="p-1 hover:bg-gray-200 rounded flex justify-center text-gray-600" title="水平翻转">
                                              <ArrowLeftRight size={12} />
                                            </button>
                                            <button onClick={() => handleUpdateItem(block.id, item.id, { isMirrorY: !item.isMirrorY })} className="p-1 hover:bg-gray-200 rounded flex justify-center text-gray-600" title="垂直翻转">
                                              <ArrowUpDown size={12} />
                                            </button>
                                            <button onClick={() => handleUpdateItem(block.id, item.id, { isGreyscale: !item.isGreyscale })} className={`p-1 hover:bg-gray-200 rounded flex justify-center ${item.isGreyscale ? 'text-blue-500' : 'text-gray-600'}`} title="黑白滤镜">
                                              <ImageIcon size={12} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {item.type === 'song' && item.song ? (
                                      <>
                                        <div className="relative aspect-square rounded-md overflow-hidden shadow-sm border border-gray-200 bg-white">
                                          <div className="absolute inset-0 z-0">
                                            <img
                                              src={BG_IMAGES[DIFFICULTIES[item.difficulty || 'mas'].bg]}
                                              alt="bg"
                                              className="w-full h-full object-cover opacity-80"
                                              crossOrigin="anonymous"
                                            />
                                          </div>
                                          {/* Song Image */}
                                          <div className={`absolute inset-0 z-10 p-1 flex items-center justify-center ${isEditMode ? 'pointer-events-none' : ''}`}>
                                            <img
                                              src={getImageUrl(item.game || activeGame, item.song.image || item.song.image_url)}
                                              alt={item.song.title}
                                              className={`w-full h-full object-cover shadow-sm rounded-sm ${item.isGreyscale ? 'grayscale' : ''}`}
                                              style={{
                                                transform: `
                                                   rotate(${(item.rotation || 0) * 90}deg) 
                                                   scaleX(${item.isMirrorX ? -1 : 1}) 
                                                   scaleY(${item.isMirrorY ? -1 : 1})
                                                 `
                                              }}
                                              crossOrigin="anonymous"
                                            />
                                          </div>
                                        </div>
                                        <div
                                          contentEditable={!isEditMode}
                                          suppressContentEditableWarning
                                          className={`text-[10px] text-center mt-1 leading-normal outline-none focus:bg-yellow-50 rounded px-1 pb-0.5 ${isTitleTruncated ? 'truncate w-full' : ''} ${isEditMode ? 'select-none pointer-events-none' : ''}`}
                                        >
                                          {item.song?.title || 'Title'}
                                        </div>
                                      </>
                                    ) : item.type === 'empty' ? (
                                      <div className="w-full aspect-square"></div>
                                    ) : item.type === 'text' ? (
                                      <div
                                        className={`w-full aspect-square flex items-center justify-center bg-white border border-gray-200 rounded-md overflow-hidden ${item.isRainbow ? 'bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500' : ''} ${isEditMode ? 'pointer-events-none' : ''}`}
                                        style={{
                                          transform: `
                                           rotate(${(item.rotation || 0) * 90}deg) 
                                           scaleX(${item.isMirrorX ? -1 : 1}) 
                                           scaleY(${item.isMirrorY ? -1 : 1})
                                         `
                                        }}
                                      >
                                        <div
                                          contentEditable={!isEditMode}
                                          suppressContentEditableWarning
                                          className={`w-full h-full p-1 text-center outline-none focus:bg-white/10 bg-transparent flex items-center justify-center whitespace-pre-wrap leading-tight cursor-text ${item.isRainbow ? 'text-white font-bold' : 'text-gray-800'}`}
                                          style={{
                                            fontSize: `${item.fontSize || 14}px`,
                                            transform: `translateY(${item.textOffsetY || 0}px)`,
                                          }}
                                          onBlur={(e) => handleUpdateItem(block.id, item.id, { text: e.currentTarget.innerText })}
                                          data-placeholder="输入文本"
                                        >
                                          {item.text}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-full aspect-square bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                                        {item.type === 'fake' ? 'Fake' : 'Blank'}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Fragment>
                            ));
                          })()}

                          {/* Block End Controls */}
                          {(() => {
                            const isAnythingSelected = !!selectedSong || !!specialType;
                            if (!isAnythingSelected) return null;
                            return (
                              <div className="flex gap-2" data-html2canvas-ignore="true">
                                <button
                                  onClick={() => {
                                    if (selectedSong) {
                                      handleAddItem(block.id, 'song', selectedSong);
                                    } else if (specialType) {
                                      handleAddItem(block.id, specialType);
                                    }
                                  }}
                                  className="w-24 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#667eea] hover:text-[#667eea] transition-colors"
                                  title={selectedSong ? `添加 "${selectedSong.title}"` : `添加 ${specialType === 'empty' ? '空位' : specialType === 'blank' ? '占位符' : '文本'}`}
                                >
                                  <Plus size={24} />
                                </button>

                                <button
                                  onClick={() => handleAddItem(block.id, 'separator')}
                                  className="w-8 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#667eea] hover:text-[#667eea] transition-colors"
                                  title="添加分隔线"
                                >
                                  <ArrowUpDown size={16} className="rotate-90" />
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10" data-html2canvas-ignore="true">
                        <button
                          onClick={() => handleAddBlock(index + 1)}
                          className="bg-[#667eea] text-white rounded-full p-1 shadow-lg hover:bg-[#5a6fd6]"
                          title="在此处下方插入区块"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {blocks.length === 0 && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg" data-html2canvas-ignore="true">
                      <p className="mb-4">还没有定数区块</p>
                      <Button onClick={() => handleAddBlock()}>
                        <Plus size={16} className="mr-2" /> 添加第一个区块
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                  Forked from https://reiwa.f5.si/freedom_const/
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
