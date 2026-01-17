// ギラギラくん - 最終仕上げエフェクトプロンプト定義

export interface FinishingEffect {
  id: string;
  titleEn: string;
  titleJa: string;
  prompt: string;
}

// カテゴリ分類
export type FinishingCategory = 'all' | 'element' | 'glow' | 'impact' | 'atmosphere' | 'frame' | 'filter';

export interface FinishingCategoryInfo {
  id: FinishingCategory;
  label: string;
  labelJa: string;
}

export const FINISHING_CATEGORIES: FinishingCategoryInfo[] = [
  { id: 'all', label: 'All', labelJa: 'すべて' },
  { id: 'element', label: 'Element', labelJa: 'エレメント系' },
  { id: 'glow', label: 'Glow', labelJa: '光・発光系' },
  { id: 'impact', label: 'Impact', labelJa: '爆発・インパクト系' },
  { id: 'atmosphere', label: 'Atmosphere', labelJa: '雰囲気演出系' },
  { id: 'frame', label: 'Frame', labelJa: 'フレーム・装飾系' },
  { id: 'filter', label: 'Filter', labelJa: '質感変更系' },
];

// 最終仕上げエフェクト一覧
export const FINISHING_EFFECTS: FinishingEffect[] = [
  // =====================================
  // エレメント系 (element)
  // =====================================
  {
    id: 'finish-fire-aura',
    titleEn: 'Fire Aura',
    titleJa: '炎オーラ',
    prompt: 'surrounded by intense flames, fire aura effect, burning energy radiating outward, dynamic fire particles',
  },
  {
    id: 'finish-fire-wings',
    titleEn: 'Fire Wings',
    titleJa: '炎の翼',
    prompt: 'majestic fire wings spreading behind, phoenix-like flame wings, burning wing silhouette',
  },
  {
    id: 'finish-lightning-aura',
    titleEn: 'Lightning Aura',
    titleJa: '雷オーラ',
    prompt: 'surrounded by crackling lightning, electric aura effect, thunder energy sparking around, blue electric arcs',
  },
  {
    id: 'finish-lightning-strike',
    titleEn: 'Lightning Strike',
    titleJa: '落雷エフェクト',
    prompt: 'dramatic lightning bolt striking from above, thunder strike effect, electric discharge, bright flash',
  },
  {
    id: 'finish-ice-crystal',
    titleEn: 'Ice Crystal Aura',
    titleJa: '氷結オーラ',
    prompt: 'surrounded by floating ice crystals, frozen aura effect, icy mist particles, crystalline fragments',
  },
  {
    id: 'finish-ice-shatter',
    titleEn: 'Ice Shatter',
    titleJa: '氷砕けエフェクト',
    prompt: 'shattering ice fragments explosion, frozen pieces flying outward, ice break dramatic effect',
  },
  {
    id: 'finish-water-splash',
    titleEn: 'Water Splash',
    titleJa: '水しぶき',
    prompt: 'dynamic water splash effect, water droplets spraying, liquid splash motion, aqua burst',
  },
  {
    id: 'finish-water-wave',
    titleEn: 'Water Wave',
    titleJa: '水波エフェクト',
    prompt: 'surging water waves surrounding, ocean wave energy, flowing water motion effect',
  },
  {
    id: 'finish-wind-spiral',
    titleEn: 'Wind Spiral',
    titleJa: '風の渦',
    prompt: 'swirling wind vortex around, tornado-like wind spiral, air current visible motion',
  },
  {
    id: 'finish-wind-leaves',
    titleEn: 'Wind & Leaves',
    titleJa: '風と木の葉',
    prompt: 'leaves dancing in the wind, autumn leaves swirling, wind-blown foliage motion',
  },
  {
    id: 'finish-light-holy',
    titleEn: 'Holy Light',
    titleJa: '聖なる光',
    prompt: 'divine light radiating from above, holy aura blessing, sacred golden light beams',
  },
  {
    id: 'finish-light-pillar',
    titleEn: 'Light Pillar',
    titleJa: '光の柱',
    prompt: 'powerful light pillar ascending to sky, vertical light beam effect, column of light',
  },
  {
    id: 'finish-dark-aura',
    titleEn: 'Dark Aura',
    titleJa: '闇オーラ',
    prompt: 'surrounded by dark energy aura, shadowy mist emanating, sinister dark particles',
  },
  {
    id: 'finish-dark-flames',
    titleEn: 'Dark Flames',
    titleJa: '黒炎',
    prompt: 'black flames burning intensely, dark fire aura, shadowy inferno effect',
  },
  {
    id: 'finish-sakura-storm',
    titleEn: 'Sakura Storm',
    titleJa: '桜吹雪',
    prompt: 'cherry blossom petals swirling dramatically, sakura storm effect, pink petals dancing',
  },
  {
    id: 'finish-snow-falling',
    titleEn: 'Snowfall',
    titleJa: '降雪エフェクト',
    prompt: 'gentle snowflakes falling, snow particles in air, winter snowfall atmosphere',
  },
  {
    id: 'finish-star-burst',
    titleEn: 'Star Burst',
    titleJa: '星屑エフェクト',
    prompt: 'sparkling stars bursting outward, stardust explosion, glittering star particles',
  },
  {
    id: 'finish-galaxy-swirl',
    titleEn: 'Galaxy Swirl',
    titleJa: '銀河の渦',
    prompt: 'cosmic galaxy swirl surrounding, nebula spiral effect, starfield rotation',
  },

  // =====================================
  // 光・発光系 (glow)
  // =====================================
  {
    id: 'finish-halo',
    titleEn: 'Halo Effect',
    titleJa: '後光',
    prompt: 'radiant halo behind, divine backlight glow, circular light ring effect',
  },
  {
    id: 'finish-lens-flare',
    titleEn: 'Lens Flare',
    titleJa: 'レンズフレア',
    prompt: 'cinematic lens flare effect, bright light flare, dramatic sun flare overlay',
  },
  {
    id: 'finish-neon-leak',
    titleEn: 'Neon Light Leak',
    titleJa: 'ネオン光漏れ',
    prompt: 'neon light leaking from edges, colorful neon glow bleed, vibrant light overflow',
  },
  {
    id: 'finish-god-rays',
    titleEn: 'God Rays',
    titleJa: 'ゴッドレイ',
    prompt: 'volumetric god rays from above, crepuscular rays effect, dramatic light beams through clouds',
  },
  {
    id: 'finish-glow-outline',
    titleEn: 'Glow Outline',
    titleJa: '発光アウトライン',
    prompt: 'glowing outline effect, luminous edge highlight, bright contour glow',
  },
  {
    id: 'finish-bloom',
    titleEn: 'Bloom Effect',
    titleJa: 'ブルームエフェクト',
    prompt: 'soft bloom lighting effect, dreamy light diffusion, ethereal glow atmosphere',
  },
  {
    id: 'finish-rim-light',
    titleEn: 'Rim Light',
    titleJa: 'リムライト',
    prompt: 'strong rim lighting from behind, backlit edge highlight, dramatic silhouette lighting',
  },
  {
    id: 'finish-rainbow-glow',
    titleEn: 'Rainbow Glow',
    titleJa: '虹色発光',
    prompt: 'rainbow spectrum glow effect, colorful prismatic light, iridescent aura',
  },
  {
    id: 'finish-pulse-glow',
    titleEn: 'Pulse Glow',
    titleJa: 'パルス発光',
    prompt: 'pulsing energy glow, rhythmic light waves emanating, power surge effect',
  },
  {
    id: 'finish-spotlight',
    titleEn: 'Spotlight',
    titleJa: 'スポットライト',
    prompt: 'dramatic spotlight from above, focused beam illumination, stage lighting effect',
  },

  // =====================================
  // 爆発・インパクト系 (impact)
  // =====================================
  {
    id: 'finish-explosion',
    titleEn: 'Explosion',
    titleJa: '爆発エフェクト',
    prompt: 'dramatic explosion effect behind, fiery blast burst, explosive impact',
  },
  {
    id: 'finish-explosion-debris',
    titleEn: 'Explosion Debris',
    titleJa: '爆発破片',
    prompt: 'explosion with flying debris, scattered fragments, destructive blast particles',
  },
  {
    id: 'finish-shockwave',
    titleEn: 'Shockwave',
    titleJa: '衝撃波',
    prompt: 'powerful shockwave ripple effect, circular impact wave, energy burst ring',
  },
  {
    id: 'finish-speed-lines',
    titleEn: 'Speed Lines',
    titleJa: '集中線',
    prompt: 'manga style speed lines converging, motion blur lines, focus impact lines',
  },
  {
    id: 'finish-radial-blur',
    titleEn: 'Radial Blur',
    titleJa: '放射ブラー',
    prompt: 'radial motion blur effect, zoom blur from center, dynamic speed blur',
  },
  {
    id: 'finish-lightning-bg',
    titleEn: 'Lightning Background',
    titleJa: '稲妻背景',
    prompt: 'dramatic lightning bolts in background, electric storm sky, thunder flash backdrop',
  },
  {
    id: 'finish-ground-crack',
    titleEn: 'Ground Crack',
    titleJa: '地割れエフェクト',
    prompt: 'ground cracking from power, earth shatter effect, impact crater cracks',
  },
  {
    id: 'finish-power-up',
    titleEn: 'Power Up',
    titleJa: 'パワーアップ',
    prompt: 'intense power up aura, energy gathering effect, charging power surge',
  },
  {
    id: 'finish-sonic-boom',
    titleEn: 'Sonic Boom',
    titleJa: 'ソニックブーム',
    prompt: 'sonic boom wave effect, breaking sound barrier, circular air compression',
  },
  {
    id: 'finish-impact-flash',
    titleEn: 'Impact Flash',
    titleJa: 'インパクトフラッシュ',
    prompt: 'bright impact flash effect, sudden light burst, dramatic hit flash',
  },

  // =====================================
  // 雰囲気演出系 (atmosphere)
  // =====================================
  {
    id: 'finish-bokeh',
    titleEn: 'Bokeh',
    titleJa: 'ボケエフェクト',
    prompt: 'beautiful bokeh light circles, soft focus light dots, dreamy background blur',
  },
  {
    id: 'finish-smoke',
    titleEn: 'Smoke',
    titleJa: '煙エフェクト',
    prompt: 'atmospheric smoke wisps, flowing smoke tendrils, mysterious fog effect',
  },
  {
    id: 'finish-colored-smoke',
    titleEn: 'Colored Smoke',
    titleJa: 'カラースモーク',
    prompt: 'vibrant colored smoke effect, colorful smoke plumes, artistic color fog',
  },
  {
    id: 'finish-dust',
    titleEn: 'Dust Particles',
    titleJa: 'ダストエフェクト',
    prompt: 'floating dust particles in light, atmospheric dust motes, sparkling debris in air',
  },
  {
    id: 'finish-confetti',
    titleEn: 'Confetti',
    titleJa: '紙吹雪',
    prompt: 'colorful confetti falling, celebration paper pieces, festive confetti burst',
  },
  {
    id: 'finish-sparkle',
    titleEn: 'Sparkle',
    titleJa: 'キラキラ',
    prompt: 'magical sparkles floating, glittering light particles, shimmering star dust',
  },
  {
    id: 'finish-bubble',
    titleEn: 'Bubbles',
    titleJa: 'シャボン玉',
    prompt: 'floating soap bubbles, iridescent bubble particles, dreamy bubble effect',
  },
  {
    id: 'finish-rain',
    titleEn: 'Rain',
    titleJa: '雨エフェクト',
    prompt: 'falling rain drops, rainy atmosphere, water droplet trails',
  },
  {
    id: 'finish-mist',
    titleEn: 'Mist',
    titleJa: 'ミスト',
    prompt: 'soft misty atmosphere, ethereal fog layer, gentle haze effect',
  },
  {
    id: 'finish-firefly',
    titleEn: 'Fireflies',
    titleJa: '蛍',
    prompt: 'glowing fireflies floating, bioluminescent light dots, magical firefly particles',
  },

  // =====================================
  // フレーム・装飾系 (frame)
  // =====================================
  {
    id: 'finish-fire-frame',
    titleEn: 'Fire Frame',
    titleJa: '炎フレーム',
    prompt: 'burning fire frame border, flames surrounding edges, fiery border effect',
  },
  {
    id: 'finish-lightning-frame',
    titleEn: 'Lightning Frame',
    titleJa: '雷フレーム',
    prompt: 'electric lightning frame border, crackling energy surrounding edges, thunder border',
  },
  {
    id: 'finish-light-frame',
    titleEn: 'Light Frame',
    titleJa: '光フレーム',
    prompt: 'glowing light frame border, luminous edge decoration, radiant frame effect',
  },
  {
    id: 'finish-neon-frame',
    titleEn: 'Neon Frame',
    titleJa: 'ネオンフレーム',
    prompt: 'neon light frame border, glowing neon edge decoration, cyberpunk frame effect',
  },
  {
    id: 'finish-gold-frame',
    titleEn: 'Gold Frame',
    titleJa: 'ゴールドフレーム',
    prompt: 'luxurious gold frame border, ornate golden edge decoration, royal frame effect',
  },
  {
    id: 'finish-ice-frame',
    titleEn: 'Ice Frame',
    titleJa: '氷フレーム',
    prompt: 'frozen ice frame border, crystalline frost edge decoration, winter frame effect',
  },
  {
    id: 'finish-vine-frame',
    titleEn: 'Vine Frame',
    titleJa: 'つるフレーム',
    prompt: 'natural vine frame border, growing plant edge decoration, organic frame effect',
  },
  {
    id: 'finish-chain-frame',
    titleEn: 'Chain Frame',
    titleJa: 'チェーンフレーム',
    prompt: 'metal chain frame border, linked chain edge decoration, heavy chain effect',
  },
  {
    id: 'finish-ribbon-frame',
    titleEn: 'Ribbon Frame',
    titleJa: 'リボンフレーム',
    prompt: 'flowing ribbon frame border, silk ribbon edge decoration, elegant ribbon effect',
  },
  {
    id: 'finish-crack-frame',
    titleEn: 'Crack Frame',
    titleJa: 'ひび割れフレーム',
    prompt: 'cracked edge frame border, broken glass edge effect, shattered frame decoration',
  },

  // =====================================
  // 質感変更系 (filter)
  // =====================================
  {
    id: 'finish-cinematic',
    titleEn: 'Cinematic',
    titleJa: 'シネマティック',
    prompt: 'cinematic color grading, movie-like atmosphere, film quality lighting',
  },
  {
    id: 'finish-cinematic-bars',
    titleEn: 'Cinematic Bars',
    titleJa: 'シネマバー',
    prompt: 'cinematic letterbox black bars, widescreen movie format, film aspect ratio',
  },
  {
    id: 'finish-vintage',
    titleEn: 'Vintage',
    titleJa: 'ヴィンテージ',
    prompt: 'vintage film effect, retro color grading, old photograph atmosphere',
  },
  {
    id: 'finish-high-contrast',
    titleEn: 'High Contrast',
    titleJa: 'ハイコントラスト',
    prompt: 'high contrast dramatic lighting, bold shadows and highlights, intense tonal range',
  },
  {
    id: 'finish-desaturated',
    titleEn: 'Desaturated',
    titleJa: '彩度低め',
    prompt: 'desaturated color palette, muted tones, subdued color grading',
  },
  {
    id: 'finish-warm-tone',
    titleEn: 'Warm Tone',
    titleJa: '暖色トーン',
    prompt: 'warm color temperature, golden hour lighting, warm orange tint',
  },
  {
    id: 'finish-cool-tone',
    titleEn: 'Cool Tone',
    titleJa: '寒色トーン',
    prompt: 'cool color temperature, blue hour lighting, cold blue tint',
  },
  {
    id: 'finish-dramatic',
    titleEn: 'Dramatic',
    titleJa: 'ドラマティック',
    prompt: 'dramatic lighting effect, intense mood atmosphere, theatrical lighting',
  },
  {
    id: 'finish-dreamy',
    titleEn: 'Dreamy',
    titleJa: 'ドリーミー',
    prompt: 'dreamy soft focus, ethereal atmosphere, fantasy-like quality',
  },
  {
    id: 'finish-sharp',
    titleEn: 'Ultra Sharp',
    titleJa: 'ウルトラシャープ',
    prompt: 'ultra sharp details, crisp edges, high definition clarity',
  },
  {
    id: 'finish-grain',
    titleEn: 'Film Grain',
    titleJa: 'フィルムグレイン',
    prompt: 'subtle film grain texture, analog film quality, nostalgic grain effect',
  },
  {
    id: 'finish-vignette',
    titleEn: 'Vignette',
    titleJa: 'ビネット',
    prompt: 'vignette darkening edges, focus on center, dramatic corner fade',
  },
];

// エフェクトのカテゴリを取得
export function getFinishingCategory(effect: FinishingEffect): FinishingCategory {
  const id = effect.id;

  // IDのプレフィックスでカテゴリを判定
  if (id.includes('fire') || id.includes('lightning') || id.includes('ice') ||
      id.includes('water') || id.includes('wind') || id.includes('light-holy') ||
      id.includes('light-pillar') || id.includes('dark') || id.includes('sakura') ||
      id.includes('snow') || id.includes('star') || id.includes('galaxy')) {
    return 'element';
  }

  if (id.includes('halo') || id.includes('lens') || id.includes('neon-leak') ||
      id.includes('god-rays') || id.includes('glow') || id.includes('bloom') ||
      id.includes('rim-light') || id.includes('rainbow-glow') || id.includes('pulse') ||
      id.includes('spotlight')) {
    return 'glow';
  }

  if (id.includes('explosion') || id.includes('shockwave') || id.includes('speed') ||
      id.includes('radial') || id.includes('lightning-bg') || id.includes('ground') ||
      id.includes('power-up') || id.includes('sonic') || id.includes('impact')) {
    return 'impact';
  }

  if (id.includes('bokeh') || id.includes('smoke') || id.includes('dust') ||
      id.includes('confetti') || id.includes('sparkle') || id.includes('bubble') ||
      id.includes('rain') || id.includes('mist') || id.includes('firefly')) {
    return 'atmosphere';
  }

  if (id.includes('frame')) {
    return 'frame';
  }

  if (id.includes('cinematic') || id.includes('vintage') || id.includes('contrast') ||
      id.includes('desaturated') || id.includes('tone') || id.includes('dramatic') ||
      id.includes('dreamy') || id.includes('sharp') || id.includes('grain') ||
      id.includes('vignette')) {
    return 'filter';
  }

  return 'element'; // デフォルト
}

// カテゴリでフィルタリング
export function getFinishingEffectsByCategory(category: FinishingCategory): FinishingEffect[] {
  if (category === 'all') {
    return FINISHING_EFFECTS;
  }
  return FINISHING_EFFECTS.filter(effect => getFinishingCategory(effect) === category);
}

// IDからエフェクトを取得
export function getFinishingEffectById(id: string): FinishingEffect | undefined {
  return FINISHING_EFFECTS.find(effect => effect.id === id);
}
