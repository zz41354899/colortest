import { rgb, oklch, formatHex, formatRgb, wcagLuminance, parse } from 'culori';

// Types for color formats
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

// 完整 OKLCH 物件（包含模式）
export interface CompleteOKLCHColor {
  mode: 'oklch';
  l: number;
  c: number;
  h: number;
}

// 可讀性等級類型
export type ReadabilityLevel = "AAA" | "AA" | "AA Large" | "Fail";

export interface ReadabilityResult {
  level: ReadabilityLevel;
  readable: boolean;
  recommendation: string;
}

// 從 OKLCH 獲取 HEX 值
export function getHexFromOklch(oklchColor: OKLCHColor): string {
  try {
    // 確保數值在有效範圍內
    const safeL = Math.max(0, Math.min(1, oklchColor.l));
    const safeC = Math.max(0, Math.min(0.4, oklchColor.c));
    let safeH = oklchColor.h;
    
    // 規範化色相角度
    while (safeH < 0) safeH += 360;
    while (safeH >= 360) safeH -= 360;
    
    // 建立完整的 OKLCH 物件
    const color = {
      mode: 'oklch',
      l: safeL,
      c: safeC,
      h: safeH
    };
    
    // 使用 culori 轉換並格式化
    return formatHex(color);
  } catch (error) {
    console.error('Error converting OKLCH to HEX:', error);
    return '#000000'; // 失敗時回退到黑色
  }
}

// 從 OKLCH 獲取 RGB 物件
export function getRgbFromOklch(oklchColor: OKLCHColor): RGBColor {
  try {
    // 先轉換為 HEX 保證有效性
    const hex = getHexFromOklch(oklchColor);
    // 然後從 HEX 轉為 RGB
    return hexToRgb(hex);
  } catch (error) {
    console.error('Error converting OKLCH to RGB:', error);
    return { r: 0, g: 0, b: 0 }; // 失敗時回退到黑色
  }
}

// 從 HEX 獲取 OKLCH 物件
export function getOklchFromHex(hex: string): OKLCHColor {
  try {
    // 標準化 HEX 字符串
    const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
    
    // 使用 culori 進行轉換
    const rgbColor = rgb(normalizedHex);
    
    if (!rgbColor) {
      throw new Error('Invalid color');
    }
    
    // 轉換為 OKLCH
    const oklchColor = oklch(rgbColor);
    
    return {
      l: oklchColor?.l || 0,
      c: oklchColor?.c || 0,
      h: oklchColor?.h || 0
    };
  } catch (error) {
    console.error('Error converting HEX to OKLCH:', error);
    return { l: 0, c: 0, h: 0 }; // 失敗時回退到黑色
  }
}

// Convert HEX to RGB
export function hexToRgb(hex: string): RGBColor {
  try {
    // 確保 hex 有效
    if (!hex || typeof hex !== 'string') {
      return { r: 0, g: 0, b: 0 };
    }
    
    // 標準化 hex 字串
    const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;
    
    const color = rgb(normalizedHex);
    
    if (!color) {
      throw new Error('Invalid color');
    }
    
    return {
      r: Math.round((color.r || 0) * 255),
      g: Math.round((color.g || 0) * 255),
      b: Math.round((color.b || 0) * 255)
    };
  } catch (error) {
    console.error('Error converting HEX to RGB:', error);
    return { r: 0, g: 0, b: 0 }; // 失敗時回退到黑色
  }
}

// Convert RGB to HEX
export function rgbToHex(rgb: RGBColor): string {
  try {
    const normalizedRgb = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255
    };
    
    return formatHex(normalizedRgb);
  } catch (error) {
    console.error('Error converting RGB to HEX:', error);
    return '#000000'; // 失敗時回退到黑色
  }
}

// Convert RGB to OKLCH
export function rgbToOklch(rgb: RGBColor): OKLCHColor {
  try {
    const normRgb = {
      r: rgb.r / 255,
      g: rgb.g / 255,
      b: rgb.b / 255
    };
    
    const color = oklch(normRgb);
    
    return {
      l: color?.l || 0,
      c: color?.c || 0,
      h: color?.h || 0
    };
  } catch (error) {
    console.error('Error converting RGB to OKLCH:', error);
    return { l: 0, c: 0, h: 0 }; // 失敗時回退到黑色
  }
}

// Convert OKLCH to RGB
export function oklchToRgb(oklch: OKLCHColor): RGBColor {
  return getRgbFromOklch(oklch);
}

// Convert OKLCH to HEX
export function oklchToHex(oklch: OKLCHColor): string {
  return getHexFromOklch(oklch);
}

// Convert HEX to OKLCH
export function hexToOklch(hex: string): OKLCHColor {
  return getOklchFromHex(hex);
}

/**
 * 計算 WCAG 對比值（使用 HEX）
 */
export function getWCAGContrast(foregroundHex: string, backgroundHex: string): number {
  try {
    // 標準化 HEX 顏色格式
    const fgHex = foregroundHex.startsWith('#') ? foregroundHex : `#${foregroundHex}`;
    const bgHex = backgroundHex.startsWith('#') ? backgroundHex : `#${backgroundHex}`;
    
    const fg = parse(fgHex);
    const bg = parse(bgHex);
    if (!fg || !bg) return 1;
    
    const L1 = wcagLuminance(fg);
    const L2 = wcagLuminance(bg);
    const ratio = L1 > L2 ? (L1 + 0.05) / (L2 + 0.05) : (L2 + 0.05) / (L1 + 0.05);
    
    return ratio;
  } catch (error) {
    console.error('Error calculating WCAG contrast:', error);
    return 1; // 發生錯誤時返回 1 (最低對比度)
  }
}

// 檢查顏色是否有效
export function isValidColor(color: string): boolean {
  try {
    if (!color || typeof color !== 'string') return false;
    const normalizedColor = color.startsWith('#') ? color : `#${color}`;
    const rgbColor = rgb(normalizedColor);
    return rgbColor !== null && rgbColor !== undefined;
  } catch {
    return false;
  }
}

/**
 * 根據對比分數給出可讀性等級與建議
 */
export function getReadabilityLevel(contrastRatio: number): ReadabilityResult {
  if (contrastRatio >= 7) {
    return {
      level: "AAA",
      readable: true,
      recommendation: "適用於所有文字。"
    };
  } else if (contrastRatio >= 4.5) {
    return {
      level: "AA",
      readable: true,
      recommendation: "適用於一般文字。"
    };
  } else if (contrastRatio >= 3) {
    return {
      level: "AA Large",
      readable: true,
      recommendation: "僅適用於大文字。"
    };
  } else {
    return {
      level: "Fail",
      readable: false,
      recommendation: "不建議用於文字，僅裝飾用途。"
    };
  }
}

// 為了向下兼容性，保留別名函數
export function calculateAPCAContrast(foreground: string, background: string): number {
  return getWCAGContrast(foreground, background);
}

export function evaluateReadability(contrast: number): {
  isReadable: boolean;
  level: string;
  recommendation: string;
} {
  const result = getReadabilityLevel(contrast);
  return {
    isReadable: result.readable,
    level: result.level,
    recommendation: result.recommendation
  };
}

// 為了向下兼容性，提供 getWCAGLevel 作為 getReadabilityLevel 的別名
export function getWCAGLevel(contrastRatio: number): ReadabilityResult {
  return getReadabilityLevel(contrastRatio);
}

// Format OKLCH values for display
export function formatOklchValues(oklch: OKLCHColor): OKLCHColor {
  return {
    l: parseFloat(oklch.l.toFixed(2)),
    c: parseFloat(oklch.c.toFixed(2)),
    h: parseFloat(oklch.h.toFixed(0))
  };
}

// Format RGB values for display
export function formatRgbValues(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Format OKLCH for CSS
export function formatOklchCss(oklch: OKLCHColor): string {
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h}deg)`;
} 