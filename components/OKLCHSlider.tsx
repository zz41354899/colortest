'use client';

import { useState, useEffect, useMemo } from 'react';
import { OKLCHColor, getHexFromOklch } from '@/utils/colorUtils';

interface OKLCHSliderProps {
  oklchColor: OKLCHColor;
  onChange: (updatedColor: OKLCHColor) => void;
  label?: string;
  // isBackground?: boolean; // 未使用的參數
}

export default function OKLCHSlider({ oklchColor, onChange, label /* , isBackground */ }: OKLCHSliderProps) {
  const [localColor, setLocalColor] = useState<OKLCHColor>(oklchColor);
  
  // 計算當前 OKLCH 顏色的 HEX 值
  const hexPreview = useMemo(() => {
    try {
      return getHexFromOklch(localColor);
    } catch (error) {
      console.error('Error generating preview color:', error);
      return '#000000';
    }
  }, [localColor]);
  
  // 生成用於滑桿背景的 L 漸變
  const getLightnessGradient = () => {
    // 亮度梯度從黑到白
    return 'bg-gradient-to-r from-black via-gray-500 to-white';
  };
  
  // 基於當前色相生成色度滑桿的漸變色
  const getChromaGradient = () => {
    const baseHue = localColor.h; // 當前色相
    
    // 基於色相區間生成不同的漸變色
    if (baseHue >= 0 && baseHue < 60) {
      return 'bg-gradient-to-r from-gray-300 to-red-500';
    } else if (baseHue >= 60 && baseHue < 120) {
      return 'bg-gradient-to-r from-gray-300 to-yellow-500';
    } else if (baseHue >= 120 && baseHue < 180) {
      return 'bg-gradient-to-r from-gray-300 to-green-500';
    } else if (baseHue >= 180 && baseHue < 240) {
      return 'bg-gradient-to-r from-gray-300 to-cyan-500';
    } else if (baseHue >= 240 && baseHue < 300) {
      return 'bg-gradient-to-r from-gray-300 to-blue-500';
    } else {
      return 'bg-gradient-to-r from-gray-300 to-purple-500';
    }
  };
  
  // 當props中的OKLCH值更新時，更新本地狀態
  useEffect(() => {
    setLocalColor({
      l: parseFloat(oklchColor.l.toFixed(4)),
      c: parseFloat(oklchColor.c.toFixed(4)),
      h: parseFloat(oklchColor.h.toFixed(2)),
    });
  }, [oklchColor]);

  // 處理滑桿變更
  const handleSliderChange = (property: keyof OKLCHColor, value: number) => {
    // 根據屬性限制數值範圍
    let safeValue = value;
    
    if (property === 'l') {
      safeValue = Math.max(0, Math.min(1, value));
    } else if (property === 'c') {
      safeValue = Math.max(0, Math.min(0.4, value));
    } else if (property === 'h') {
      // 確保角度在 0-360 範圍內
      safeValue = Math.max(0, Math.min(360, value));
    }
    
    // 更新本地狀態
    const updatedColor = {
      ...localColor,
      [property]: safeValue
    };
    
    setLocalColor(updatedColor);
    
    // 通知父元件
    onChange(updatedColor);
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label || 'OKLCH 調整'}</h3>
        <div 
          className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700" 
          style={{ backgroundColor: hexPreview }}
          title={hexPreview}
        />
      </div>
      
      <div className="space-y-4">
        {/* Lightness slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor={`l-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              亮度 (L)
            </label>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">{localColor.l.toFixed(2)}</span>
          </div>
          <input
            id={`l-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localColor.l}
            onChange={(e) => handleSliderChange('l', parseFloat(e.target.value))}
            className={`w-full h-2 ${getLightnessGradient()} rounded-lg appearance-none cursor-pointer`}
          />
        </div>

        {/* Chroma slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor={`c-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              色度 (C)
            </label>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">{localColor.c.toFixed(3)}</span>
          </div>
          <input
            id={`c-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`}
            type="range"
            min="0"
            max="0.4"
            step="0.005"
            value={localColor.c}
            onChange={(e) => handleSliderChange('c', parseFloat(e.target.value))}
            className={`w-full h-2 ${getChromaGradient()} rounded-lg appearance-none cursor-pointer`}
          />
        </div>

        {/* Hue slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor={`h-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              色相 (H)
            </label>
            <span className="text-sm text-zinc-500 dark:text-zinc-500">{Math.round(localColor.h)}°</span>
          </div>
          <input
            id={`h-slider-${label?.replace(/\s+/g, '-').toLowerCase() || 'oklch'}`}
            type="range"
            min="0"
            max="360"
            step="1"
            value={localColor.h}
            onChange={(e) => handleSliderChange('h', parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* HEX & OKLCH Preview */}
        <div className="pt-2 flex items-center justify-between mt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-500">HEX: <span className="font-mono">{hexPreview}</span></span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
              oklch({localColor.l.toFixed(2)} {localColor.c.toFixed(3)} {Math.round(localColor.h)}°)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 