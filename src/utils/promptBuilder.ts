import type { AIModelId, SelectedOptions, GeneratedPrompt, PromptPart } from '../types';
import { ALL_CATEGORIES, getOptionById } from '../data/categories';
import { formatPromptForModel } from './modelFormatter';
import type { OutputLanguage, ThumbnailTextConfig, TextVerticalPosition, TextHorizontalPosition } from '../store/promptStore';

// 位置を日本語で説明する関数
function getPositionLabel(v: TextVerticalPosition, h: TextHorizontalPosition): string {
  const vLabels: Record<TextVerticalPosition, string> = { top: '上', center: '中央', bottom: '下' };
  const hLabels: Record<TextHorizontalPosition, string> = { left: '左', center: '中央', right: '右' };

  if (v === 'center' && h === 'center') return '中央';
  if (v === 'center') return hLabels[h];
  if (h === 'center') return vLabels[v];
  return `${vLabels[v]}${hLabels[h]}`;
}

export function generatePrompt(
  modelId: AIModelId,
  selectedOptions: SelectedOptions,
  outputLanguage: OutputLanguage = 'en',
  freeText: string = '',
  showNegativePrompt: boolean = false,
  thumbnailText?: ThumbnailTextConfig
): GeneratedPrompt | null {
  const parts: PromptPart[] = [];
  const negativeParts: string[] = [];

  // 「人物なし」が選択されているかチェック
  const personOptions = selectedOptions['nano-thumb-person'] || [];
  const isNoPerson = personOptions.includes('nano-person-no');

  // 「人物なし」の場合にスキップするカテゴリ
  const skipCategoriesForNoPerson = [
    'nano-thumb-composition',  // 構図・配置（人物用）
    'nano-thumb-expression',   // 表情
    'nano-thumb-person-style', // 人物表現スタイル
  ];

  // 選択されたオプションを収集
  for (const [categoryId, optionIds] of Object.entries(selectedOptions)) {
    if (!optionIds || optionIds.length === 0) continue;

    const category = ALL_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) continue;

    // 「人物なし」の場合、人物関連カテゴリをスキップ
    if (isNoPerson && skipCategoriesForNoPerson.includes(categoryId)) {
      continue;
    }

    // ネガティブプロンプトカテゴリは別処理
    if (categoryId === 'thumb-negative' || categoryId === 'nano-thumb-negative') {
      if (showNegativePrompt) {
        for (const optionId of optionIds) {
          const option = getOptionById(categoryId, optionId);
          if (option) {
            // 言語設定に応じてネガティブプロンプトテキストを選択
            const negText = (outputLanguage === 'ja' && option.promptJa)
              ? option.promptJa
              : option.promptEn;
            negativeParts.push(negText);
          }
        }
      }
      continue;
    }

    // アスペクト比は別処理（パラメータとして出力）
    if (categoryId === 'aspect-ratio') {
      continue;
    }

    for (const optionId of optionIds) {
      const option = getOptionById(categoryId, optionId);
      if (option) {
        // 言語設定に応じてプロンプトテキストを選択
        let promptText: string;
        if (outputLanguage === 'ja' && option.promptJa) {
          promptText = option.promptJa;
        } else {
          // モデル別オーバーライドをチェック（英語のみ）
          promptText = option.modelOverrides?.[modelId] ?? option.promptEn;
        }
        parts.push({
          categoryId,
          promptOrder: category.promptOrder,
          text: promptText,
        });
      }
    }
  }

  // promptOrderでソート
  parts.sort((a, b) => a.promptOrder - b.promptOrder);

  // フリーテキストがあれば追加
  const trimmedFreeText = freeText.trim();

  // サムネイルテキスト処理（Nanobanana Pro サムネイル専用）
  // 日本語テキストを含むプロンプトを生成
  let thumbnailTextPrompt = '';
  if (modelId === 'nanobanana-thumb' && thumbnailText) {
    const activeLines = thumbnailText.lines
      .slice(0, thumbnailText.lineCount)
      .filter((line) => line.text.trim() !== '');

    if (activeLines.length > 0) {
      // 各テキストの位置情報を含むプロンプトを生成
      const textParts = activeLines.map((line) => {
        const posLabel = getPositionLabel(line.verticalPosition, line.horizontalPosition);
        return `「${line.text}」を${posLabel}に`;
      });
      // 視認性向上のための指示を自動追加
      const textStyleHint = '大きく太い文字、白い縁取り付き、視認性の高いテキスト';
      thumbnailTextPrompt = `サムネイルに${textParts.join('、')}配置、${textStyleHint}`;
    }
  }

  // サムネイルテキストがある場合は判定に含める
  const hasThumbnailText = thumbnailTextPrompt !== '';

  if (parts.length === 0 && !trimmedFreeText && !hasThumbnailText) {
    return null;
  }

  // アスペクト比を取得
  const aspectRatio = getSelectedAspectRatio(selectedOptions);

  // モデル別フォーマットを適用
  return formatPromptForModel(
    modelId,
    parts,
    negativeParts,
    aspectRatio,
    trimmedFreeText,
    outputLanguage,
    thumbnailTextPrompt
  );
}

function getSelectedAspectRatio(selectedOptions: SelectedOptions): string | null {
  const aspectOptions = selectedOptions['aspect-ratio'];
  if (!aspectOptions || aspectOptions.length === 0) return null;

  const optionId = aspectOptions[0];
  const option = getOptionById('aspect-ratio', optionId);
  return option?.promptEn ?? null;
}

export function countSelectedOptions(selectedOptions: SelectedOptions): number {
  let count = 0;
  for (const optionIds of Object.values(selectedOptions)) {
    count += optionIds?.length ?? 0;
  }
  return count;
}
