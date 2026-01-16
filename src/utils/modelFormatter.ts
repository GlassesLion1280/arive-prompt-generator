import type { AIModelId, GeneratedPrompt, PromptPart } from '../types';
import type { OutputLanguage } from '../store/promptStore';

export function formatPromptForModel(
  modelId: AIModelId,
  parts: PromptPart[],
  negativeParts: string[],
  aspectRatio: string | null,
  freeText: string = '',
  outputLanguage: OutputLanguage = 'en',
  thumbnailTextPrompt: string = ''
): GeneratedPrompt {
  const mainText = parts.map((p) => p.text).join(', ');
  const fullMainText = freeText ? (mainText ? `${mainText}, ${freeText}` : freeText) : mainText;

  switch (modelId) {
    case 'midjourney':
      return formatMidjourney(fullMainText, negativeParts, aspectRatio);
    case 'nijijourney':
      return formatNijijourney(fullMainText, negativeParts, aspectRatio);
    case 'firefly':
      return formatFirefly(fullMainText);
    case 'gemini':
    case 'dalle':
      return formatNatural(fullMainText);
    case 'nanobanana':
    case 'nanobanana-thumb':
      return formatNanobanana(fullMainText, negativeParts, aspectRatio, outputLanguage, thumbnailTextPrompt);
    default:
      return formatNatural(fullMainText);
  }
}

function formatMidjourney(
  main: string,
  negativeParts: string[],
  aspectRatio: string | null
): GeneratedPrompt {
  const params: string[] = [];

  if (aspectRatio) {
    params.push(`--ar ${aspectRatio}`);
  }

  const parameters = params.join(' ');
  const fullPrompt = parameters ? `${main} ${parameters}` : main;

  return {
    main,
    negative: negativeParts.length > 0 ? `--no ${negativeParts.join(', ')}` : undefined,
    parameters: parameters || undefined,
    fullPrompt: negativeParts.length > 0
      ? `${fullPrompt} --no ${negativeParts.join(', ')}`
      : fullPrompt,
  };
}

function formatNijijourney(
  main: string,
  negativeParts: string[],
  aspectRatio: string | null
): GeneratedPrompt {
  const prefix = 'is_anime_or_oriental_aesthetic_style: true';
  const params: string[] = ['--v 7'];

  if (aspectRatio) {
    params.push(`--ar ${aspectRatio}`);
  }

  const parameters = params.join(' ');
  const basePrompt = `${main} ${parameters}`;

  let fullPrompt = `${prefix}\n${basePrompt}`;

  if (negativeParts.length > 0) {
    fullPrompt += ` --no ${negativeParts.join(', ')}`;
  }

  return {
    main,
    negative: negativeParts.length > 0 ? negativeParts.join(', ') : undefined,
    parameters,
    fullPrompt,
  };
}

function formatFirefly(main: string): GeneratedPrompt {
  return {
    main,
    fullPrompt: main,
  };
}

function formatNatural(main: string): GeneratedPrompt {
  return {
    main,
    fullPrompt: main,
  };
}

function formatNanobanana(
  main: string,
  negativeParts: string[],
  aspectRatio: string | null,
  outputLanguage: OutputLanguage,
  thumbnailTextPrompt: string = ''
): GeneratedPrompt {
  // サムネイルテキストがある場合はプロンプトに追加
  // 日本語テキスト指示は常にプロンプトの先頭に配置
  let fullMain = main;
  if (thumbnailTextPrompt) {
    fullMain = main ? `${thumbnailTextPrompt}, ${main}` : thumbnailTextPrompt;
  }

  // アスペクト比パラメータを追加
  const params: string[] = [];
  if (aspectRatio) {
    params.push(`--ar ${aspectRatio}`);
  }
  const parameters = params.join(' ');

  // Nanobananaは日本語出力モードをサポート
  if (negativeParts.length > 0) {
    const negative = negativeParts.join(', ');
    const positiveLabel = outputLanguage === 'ja' ? 'ポジティブ' : 'Positive';
    const negativeLabel = outputLanguage === 'ja' ? 'ネガティブ' : 'Negative';
    const mainWithParams = parameters ? `${fullMain} ${parameters}` : fullMain;
    return {
      main: fullMain,
      negative,
      parameters: parameters || undefined,
      fullPrompt: `${positiveLabel}: ${mainWithParams}\n\n${negativeLabel}: ${negative}`,
    };
  }

  const fullPrompt = parameters ? `${fullMain} ${parameters}` : fullMain;
  return {
    main: fullMain,
    parameters: parameters || undefined,
    fullPrompt,
  };
}

