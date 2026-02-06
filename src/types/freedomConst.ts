export interface SongData {
  id: string;
  catname: string;
  newflag: string;
  title: string;
  reading: string;
  artist: string;
  lev_bas?: string;
  lev_adv?: string;
  lev_exp?: string;
  lev_mas?: string;
  lev_ult?: string;
  lev_remas?: string; // For Maimai
  dx_lev_bas?: string; // For Maimai DX
  dx_lev_adv?: string;
  dx_lev_exp?: string;
  dx_lev_mas?: string;
  dx_lev_remas?: string;
  lev_exc?: string; // For Ongeki
  lev_lnt?: string; // For Ongeki
  we_kanji?: string;
  we_star?: string;
  image?: string;
  image_url?: string;
  title_kana?: string; // For Maimai
  title_sort?: string; // For Ongeki
}

export type GameType = 'maimai' | 'chunithm' | 'ongeki';

export interface BlockItem {
  id: string;
  type: 'song' | 'blank' | 'fake' | 'empty' | 'text' | 'separator';
  text?: string;
  song?: SongData;
  game?: GameType;
  difficulty?: string; // 'bas', 'adv', 'exp', 'mas', 'ult', etc.
  rotation?: number; // 0, 1, 2, 3 (x90 deg)
  isGreyscale?: boolean;
  isMirrorX?: boolean;
  isMirrorY?: boolean;
  // Text item specific
  fontSize?: number;
  textOffsetY?: number;
  isRainbow?: boolean;
  // Position offsets for Edit Mode
  offsetX?: number;
  offsetY?: number;
}

export interface ConstBlock {
  id: string;
  label: string;
  items: BlockItem[];
  settings: {
    fontSize: number;
    areaSize: number;
    isGaming: boolean;
    isOverflow: boolean;
    rotation: number;
  };
}
