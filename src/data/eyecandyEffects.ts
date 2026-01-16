// ギラギラくん - テキストエフェクトプロンプト定義
import effectsData from './eyecandyEffects.json';

export interface EyeCandyEffect {
  id: string;
  titleEn: string;
  titleJa: string;
  prompt: string;
}

export const EYECANDY_EFFECTS: EyeCandyEffect[] = effectsData;

// カテゴリ分類（エフェクトの種類別）
export type EffectCategory = 'all' | 'gold' | 'metal' | 'neon' | 'crystal' | 'fire' | 'nature' | 'fantasy' | 'retro';

export interface EffectCategoryInfo {
  id: EffectCategory;
  label: string;
  labelJa: string;
}

export const EFFECT_CATEGORIES: EffectCategoryInfo[] = [
  { id: 'all', label: 'All', labelJa: 'すべて' },
  { id: 'gold', label: 'Gold', labelJa: 'ゴールド系' },
  { id: 'metal', label: 'Metal', labelJa: 'メタル系' },
  { id: 'crystal', label: 'Crystal', labelJa: '宝石・クリスタル系' },
  { id: 'fire', label: 'Fire', labelJa: '炎・雷・エネルギー系' },
  { id: 'neon', label: 'Neon', labelJa: 'ネオン・サイバー系' },
  { id: 'nature', label: 'Nature', labelJa: '自然・季節系' },
  { id: 'fantasy', label: 'Fantasy', labelJa: 'ファンタジー・和風系' },
  { id: 'retro', label: 'Retro', labelJa: 'レトロ・ヴィンテージ系' },
];

// エフェクトIDからカテゴリを判定
export function getEffectCategory(effect: EyeCandyEffect): EffectCategory {
  const title = (effect.titleEn + ' ' + effect.titleJa).toLowerCase();

  // ゴールド系
  if (title.includes('gold') || title.includes('ゴールド') || title.includes('黄金') ||
      title.includes('golden') || title.includes('金箔')) {
    return 'gold';
  }

  // メタル系
  if (title.includes('chrome') || title.includes('metal') || title.includes('silver') ||
      title.includes('クロム') || title.includes('platinum') || title.includes('プラチナ') ||
      title.includes('bronze') || title.includes('ブロンズ') || title.includes('iron') ||
      title.includes('copper') || title.includes('steel') || title.includes('鉄') ||
      title.includes('銀') || title.includes('pearl') || title.includes('パール')) {
    return 'metal';
  }

  // ネオン・サイバー系
  if (title.includes('neon') || title.includes('ネオン') || title.includes('cyber') ||
      title.includes('サイバー') || title.includes('glitch') || title.includes('グリッチ') ||
      title.includes('tokyo') || title.includes('東京') || title.includes('holographic') ||
      title.includes('ホログラフィック') || title.includes('electric') && title.includes('blue')) {
    return 'neon';
  }

  // 宝石・クリスタル系
  if (title.includes('crystal') || title.includes('クリスタル') || title.includes('diamond') ||
      title.includes('ダイヤ') || title.includes('jewel') || title.includes('ice') ||
      title.includes('氷') || title.includes('prism') || title.includes('emerald') ||
      title.includes('エメラルド') || title.includes('ruby') || title.includes('ルビー') ||
      title.includes('sapphire') || title.includes('サファイア') || title.includes('amethyst') ||
      title.includes('アメジスト') || title.includes('opal') || title.includes('オパール') ||
      title.includes('quartz') || title.includes('frost') || title.includes('霜') ||
      title.includes('snow') || title.includes('雪') || title.includes('arctic')) {
    return 'crystal';
  }

  // 炎・雷・エネルギー系
  if (title.includes('fire') || title.includes('炎') || title.includes('magma') ||
      title.includes('マグマ') || title.includes('thunder') || title.includes('雷') ||
      title.includes('lightning') || title.includes('稲妻') || title.includes('lava') ||
      title.includes('溶岩') || title.includes('molten') || title.includes('溶融') ||
      title.includes('inferno') || title.includes('volcanic') || title.includes('火山') ||
      title.includes('plasma') || title.includes('electric') && !title.includes('blue')) {
    return 'fire';
  }

  // 自然・季節系
  if (title.includes('ocean') || title.includes('海') || title.includes('wave') ||
      title.includes('波') || title.includes('cherry') || title.includes('桜') ||
      title.includes('forest') || title.includes('森') || title.includes('leaf') ||
      title.includes('紅葉') || title.includes('bamboo') || title.includes('竹') ||
      title.includes('coral') || title.includes('珊瑚') || title.includes('sunset') ||
      title.includes('夕焼') || title.includes('meadow') || title.includes('草原') ||
      title.includes('tropical') || title.includes('jungle') || title.includes('spring') ||
      title.includes('autumn') || title.includes('moon') || title.includes('月')) {
    return 'nature';
  }

  // ファンタジー・和風系
  if (title.includes('fantasy') || title.includes('runic') || title.includes('arcane') ||
      title.includes('steampunk') || title.includes('スチームパンク') || title.includes('gothic') ||
      title.includes('ゴシック') || title.includes('漆') || title.includes('urushi') ||
      title.includes('和') || title.includes('japanese') || title.includes('galaxy') ||
      title.includes('銀河') || title.includes('nebula') || title.includes('cosmic') ||
      title.includes('宇宙') || title.includes('spirit') || title.includes('精霊')) {
    return 'fantasy';
  }

  // レトロ・ヴィンテージ系
  if (title.includes('retro') || title.includes('レトロ') || title.includes('vintage') ||
      title.includes('ヴィンテージ') || title.includes('80s') || title.includes('80年代') ||
      title.includes('synthwave') || title.includes('vaporwave') || title.includes('ヴェイパー') ||
      title.includes('art deco') || title.includes('アールデコ') || title.includes('sepia') ||
      title.includes('セピア') || title.includes('antique') || title.includes('アンティーク') ||
      title.includes('marquee') || title.includes('電飾') || title.includes('gatsby') ||
      title.includes('candy') || title.includes('キャンディ') || title.includes('pop')) {
    return 'retro';
  }

  return 'gold'; // デフォルト
}

// カテゴリでフィルタリング
export function getEffectsByCategory(category: EffectCategory): EyeCandyEffect[] {
  if (category === 'all') {
    return EYECANDY_EFFECTS;
  }
  return EYECANDY_EFFECTS.filter(effect => getEffectCategory(effect) === category);
}

// IDからエフェクトを取得
export function getEffectById(id: string): EyeCandyEffect | undefined {
  return EYECANDY_EFFECTS.find(effect => effect.id === id);
}
