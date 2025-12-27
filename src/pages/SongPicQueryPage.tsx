// 曲绘查询页面 (统一接口版本)
// 后端接口 (统一规范):
//   GET /api/v1/jacket/:game/:sort            -> 返回纯文本，每行一个文件的绝对或相对路径
//   GET /api/v1/jacket/:game/:sort/:name      -> 返回单个曲绘图片（二进制）；:name 支持部分匹配由后端处理（传入 baseName 不含扩展名）
// 支持的 game: chunithm | maimai2 | ongeki | restage
// 使用说明: 选择 game 与 sort (可输入自定义), 可输入 name 进行部分匹配并获取图片；列表展示解析后的 base 与扩展名

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Search, Image as ImageIcon, ExternalLink, Copy, Trash2, RefreshCw, Loader2 } from 'lucide-react';

const games = ['chunithm', 'maimai2', 'ongeki', 'restage'] as const;
const presetSorts = ['jacket', 'poster', 'Card', 'icon', 'chara', 'illust'];

export function SongPicQueryPage() {
  const [game, setGame] = useState<string>('maimai2');
  const [sort, setSort] = useState<string>('jacket');
  const [customSort, setCustomSort] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [listLoading, setListLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string>('');
  // Display items derived from paths
  const [displayItems, setDisplayItems] = useState<{ path: string; base: string; ext: string }[]>([]);
  const [filteredItems, setFilteredItems] = useState<{ path: string; base: string; ext: string }[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewBase, setPreviewBase] = useState<string>('');
  const [objectUrls, setObjectUrls] = useState<string[]>([]); // cleanup
  const navigate = useNavigate();

  const effectiveSort = customSort.trim() !== '' ? customSort.trim() : sort;

  const fetchList = async () => {
    setError('');
    setListLoading(true);
    setPreviewUrl('');
    setPreviewBase('');
    try {
      const paths = await publicApi.getJacketList(game, effectiveSort); // now returns string[]
      // derive display items
      const items = paths.map(p => {
        const segments = p.split(/[/\\]/);
        const filename = segments[segments.length - 1] || '';
        const dotIdx = filename.lastIndexOf('.');
        const base = dotIdx > 0 ? filename.substring(0, dotIdx) : filename;
        const ext = dotIdx > 0 ? filename.substring(dotIdx + 1) : '';
        return { path: p, base, ext };
      });
      setDisplayItems(items);
      if (name.trim()) {
        const lower = name.trim().toLowerCase();
        setFilteredItems(items.filter(it => it.base.toLowerCase().includes(lower)));
      } else {
        setFilteredItems(items);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? (e as any).response?.data?.message || e.message : '获取列表失败';
      setError(errorMessage);
      setDisplayItems([]);
      setFilteredItems([]);
    } finally {
      setListLoading(false);
    }
  };

  // Filter effect
  useEffect(() => {
    if (displayItems.length > 0) {
      if (name.trim()) {
        const lower = name.trim().toLowerCase();
        setFilteredItems(displayItems.filter(it => it.base.toLowerCase().includes(lower)));
      } else {
        setFilteredItems(displayItems);
      }
    }
  }, [name, displayItems]);

  const fetchImage = async (baseName: string) => {
    setError('');
    setImageLoading(true);
    try {
      // backend matches partial name; we send baseName without extension
      const blob = await publicApi.getJacketFile(game, effectiveSort, baseName);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewBase(baseName);
      setObjectUrls(prev => [...prev, url]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? (e as any).response?.data?.message || e.message : '获取图片失败';
      setError(errorMessage);
    } finally {
      setImageLoading(false);
    }
  };

  const handleCopyUrl = (baseName: string) => {
    // API endpoint URL (not current window origin)
    const apiBase = 'https://api.riv62hjux.nyat.app:43419/api/v1';
    const direct = `${apiBase}/jacket/${encodeURIComponent(game)}/${encodeURIComponent(effectiveSort)}/${encodeURIComponent(baseName)}`;
    navigator.clipboard.writeText(direct);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, []);

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
        <div className="bg-[#e0e0e0]/95 backdrop-blur-sm rounded-[15px] p-6 max-w-[1100px] mx-auto shadow-lg relative">
          
          {/* Title */}
          <div className="flex flex-col items-center text-[#6495ed] drop-shadow-[1px_1px_1px_darkgray] mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ImageIcon className="w-8 h-8" />
              曲绘检索
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-sans">通过后端 Jackets 接口查询/预览资源</p>
          </div>

          {/* Controls Section */}
          <div className="bg-white/60 rounded-xl p-6 mb-6 shadow-sm border border-white/50">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Game Select */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">Game</label>
                <select
                  value={game}
                  onChange={e => setGame(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {games.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              
              {/* Sort Preset */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">Sort (预设)</label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {presetSorts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Custom Sort */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">自定义 Sort</label>
                <Input
                  placeholder="如: poster"
                  value={customSort}
                  onChange={e => setCustomSort(e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Name Filter */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 ml-1">搜索</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="文件名过滤..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-8 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-between border-t border-gray-200/50 pt-4">
              <div className="flex gap-2">
                <Button onClick={fetchList} disabled={listLoading} className="bg-[#667eea] hover:bg-[#5a6fd6]">
                  {listLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  获取列表
                </Button>
                <Button variant="outline" onClick={() => { setName(''); }} className="bg-white/50">
                  清除过滤
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono bg-gray-100/50 px-3 py-1 rounded-full">
                <span>Game: {game}</span>
                <span>Sort: {effectiveSort}</span>
                <span>Count: {filteredItems.length}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-12 gap-6 h-[600px]">
            
            {/* Left: File List */}
            <div className="md:col-span-7 flex flex-col bg-white/60 rounded-xl shadow-sm border border-white/50 overflow-hidden">
              <div className="p-4 border-b border-gray-200/50 bg-white/40 backdrop-blur flex justify-between items-center">
                <h2 className="font-bold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#667eea]"></span>
                  文件列表
                </h2>
                <span className="text-xs text-gray-500">点击预览</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {listLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>加载数据中...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>暂无数据</p>
                    <p className="text-xs mt-1">请点击"获取列表"或修改筛选条件</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {filteredItems.map((item, idx) => (
                      <li 
                        key={item.path + idx} 
                        className={`
                          group flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer
                          ${previewBase === item.base ? 'bg-[#667eea]/10 text-[#667eea]' : 'hover:bg-white/80 text-gray-700'}
                        `}
                        onClick={() => fetchImage(item.base)}
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 opacity-50 shrink-0" />
                          <span className="truncate font-medium text-sm">{item.base}</span>
                          <span className="text-xs opacity-50 shrink-0">.{item.ext}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.base); }}
                            title="复制链接"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              window.open(`/api/v1/jacket/${game}/${effectiveSort}/${encodeURIComponent(item.base)}`, '_blank'); 
                            }}
                            title="新窗口打开"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="bg-white/60 rounded-xl shadow-sm border border-white/50 p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    预览
                  </h2>
                  {previewUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setPreviewUrl(''); setPreviewBase(''); }}
                      className="text-xs text-gray-500 hover:text-red-500 h-6"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      清除
                    </Button>
                  )}
                </div>

                <div className="flex-1 bg-gray-100/50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                  {imageLoading ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs">加载图片中...</span>
                    </div>
                  ) : previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="max-w-full max-h-full object-contain shadow-lg rounded-md"
                      />
                      <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          {previewBase}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">选择左侧文件以预览</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-100 text-xs text-blue-800">
                <p className="font-bold mb-1">💡 提示</p>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  <li>支持部分名称匹配搜索</li>
                  <li>点击文件名即可加载预览</li>
                  <li>图片加载可能需要一定时间</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}