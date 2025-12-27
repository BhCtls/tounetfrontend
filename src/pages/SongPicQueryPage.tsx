// 曲绘查询页面 (统一接口版本)
// 后端接口 (统一规范):
//   GET /api/v1/jacket/:game/:sort            -> 返回纯文本，每行一个文件的绝对或相对路径
//   GET /api/v1/jacket/:game/:sort/:name      -> 返回单个曲绘图片（二进制）；:name 支持部分匹配由后端处理（传入 baseName 不含扩展名）
// 支持的 game: chunithm | maimai2 | ongeki | restage
// 使用说明: 选择 game 与 sort (可输入自定义), 可输入 name 进行部分匹配并获取图片；列表展示解析后的 base 与扩展名

import { useState } from 'react';
import { publicApi } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';


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

	const cleanupObjectUrls = () => {
		objectUrls.forEach(u => URL.revokeObjectURL(u));
	};

	// 组件卸载时清理
	// (在函数式组件里可借助 useEffect，但页面较简单，略。若以后扩展请加 useEffect cleanup)

	return (
		<div className="min-h-screen p-4" style={{
			backgroundColor: '#f2f2f2',
			fontFamily: 'Arial, sans-serif'
		}}>
			<Card className="max-w-5xl mx-auto mb-6">
				<CardHeader>
					<CardTitle>曲绘检索</CardTitle>
					<CardDescription>通过后端 Jackets 接口查询/预览资源</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid md:grid-cols-4 gap-4">
						{/* Game Select */}
						<div>
							<label className="block text-sm font-medium mb-1">Game</label>
							<select
								value={game}
								onChange={e => setGame(e.target.value)}
								className="w-full rounded-md border border-gray-300 px-3 py-2"
							>
								{games.map(g => <option key={g} value={g}>{g}</option>)}
							</select>
						</div>
						{/* Sort Preset */}
						<div>
							<label className="block text-sm font-medium mb-1">Sort (预设)</label>
							<select
								value={sort}
								onChange={e => setSort(e.target.value)}
								className="w-full rounded-md border border-gray-300 px-3 py-2"
							>
								{presetSorts.map(s => <option key={s} value={s}>{s}</option>)}
							</select>
						</div>
						{/* Custom Sort */}
						<div>
							<label className="block text-sm font-medium mb-1">自定义 Sort (可选, 优先生效)</label>
							<Input
								placeholder="如: poster"
								value={customSort}
								onChange={e => setCustomSort(e.target.value)}
							/>
						</div>
						{/* Name Filter */}
						<div>
							<label className="block text-sm font-medium mb-1">Name 过滤 (可部分匹配)</label>
							<Input
								placeholder="如: forsa / UI_Jacket_1753"
								value={name}
								onChange={e => setName(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<Button onClick={fetchList} disabled={listLoading}>
							{listLoading ? '加载中...' : '获取列表'}
						</Button>
						<Button variant="outline" onClick={() => { setName(''); setFilteredItems(displayItems); }}>清除过滤</Button>
						<Button variant="outline" onClick={() => { cleanupObjectUrls(); setPreviewUrl(''); setPreviewBase(''); }}>清理预览缓存</Button>
					</div>
					{error && (
						<div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
					)}
					<div className="text-xs text-gray-600">当前参数: game={game} sort={effectiveSort} 列表数={filteredItems.length}</div>
				</CardContent>
			</Card>

			{/* List & Preview */}
			<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>文件列表</CardTitle>
						<CardDescription>点击文件名加载图片</CardDescription>
					</CardHeader>
					<CardContent>
						{listLoading ? (
							<div className="py-6 text-center text-sm text-gray-500">列表加载中...</div>
						) : filteredItems.length === 0 ? (
							<div className="py-6 text-center text-sm text-gray-500">暂无数据或未查询</div>
						) : (
							<ul className="space-y-1 max-h-[520px] overflow-auto pr-2">
								{filteredItems.map(item => (
									<li key={item.path} className="flex items-center justify-between group">
										<button
											onClick={() => fetchImage(item.base)}
											className="text-left flex-1 text-blue-600 hover:underline truncate"
											title={item.path}
										>{item.base}<span className="text-gray-400 text-xs">.{item.ext}</span></button>
										<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
											<Button variant="ghost" size="sm" onClick={() => handleCopyUrl(item.base)}>复制URL</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => window.open(`/api/v1/jacket/${game}/${effectiveSort}/${encodeURIComponent(item.base)}`, '_blank')}
											>新窗口</Button>
										</div>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>预览</CardTitle>
						<CardDescription>{previewBase ? `已加载图片: ${previewBase}` : '选择一个文件以预览'}</CardDescription>
					</CardHeader>
					<CardContent>
						{imageLoading && <div className="text-sm text-gray-500 mb-2">图片加载中...</div>}
						{previewUrl && (
							<img
								src={previewUrl}
								alt="jacket preview"
								className="max-h-[480px] w-auto mx-auto rounded shadow"
							/>
						)}
						{!previewUrl && !imageLoading && (
							<div className="text-xs text-gray-500">暂无预览</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}