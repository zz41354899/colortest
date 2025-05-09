'use client';

import { useState } from 'react';
import ColorInputPanel from '@/components/ColorInputPanel';
import OKLCHSlider from '@/components/OKLCHSlider';
import ColorPreview from '@/components/ColorPreview';
import ContrastResult from '@/components/ContrastResult';
import ExportTokenPanel from '@/components/ExportTokenPanel';
import SavedPalettes from '@/components/SavedPalettes';
import ColorPresets from '@/components/ColorPresets';
import { hexToOklch, oklchToHex, OKLCHColor } from '@/utils/colorUtils';

type TargetColor = 'foreground' | 'background';

export default function Home() {
  // 顏色狀態
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundOklch, setForegroundOklch] = useState(hexToOklch('#000000'));
  const [backgroundOklch, setBackgroundOklch] = useState(hexToOklch('#ffffff'));
  
  // 當前選中的目標顏色（前景或背景）
  const [activeTarget, setActiveTarget] = useState<TargetColor>('foreground');

  // 處理前景色變更
  const handleForegroundChange = (color: string) => {
    setForegroundColor(color);
    try {
      setForegroundOklch(hexToOklch(color));
    } catch (error) {
      console.error('Error converting foreground color to OKLCH:', error);
    }
  };

  // 處理背景色變更
  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
    try {
      setBackgroundOklch(hexToOklch(color));
    } catch (error) {
      console.error('Error converting background color to OKLCH:', error);
    }
  };

  // 處理 OKLCH 滑桿變更前景色
  const handleForegroundOklchChange = (oklch: OKLCHColor) => {
    try {
      const hex = oklchToHex(oklch);
      setForegroundColor(hex);
      setForegroundOklch(oklch);
    } catch (error) {
      console.error('Error converting OKLCH to hex for foreground:', error);
    }
  };

  // 處理 OKLCH 滑桿變更背景色
  const handleBackgroundOklchChange = (oklch: OKLCHColor) => {
    try {
      const hex = oklchToHex(oklch);
      setBackgroundColor(hex);
      setBackgroundOklch(oklch);
    } catch (error) {
      console.error('Error converting OKLCH to hex for background:', error);
    }
  };

  // 根據當前選中的目標決定要顯示哪個 OKLCH 滑桿
  const activeOklchColor = activeTarget === 'foreground' ? foregroundOklch : backgroundOklch;
  const handleActiveOklchChange = (oklch: OKLCHColor) => {
    if (activeTarget === 'foreground') {
      handleForegroundOklchChange(oklch);
    } else {
      handleBackgroundOklchChange(oklch);
    }
  };

  // 處理色彩組合的選擇
  const handlePaletteSelect = (fg: string, bg: string) => {
    handleForegroundChange(fg);
    handleBackgroundChange(bg);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 md:py-12 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
            OKLCH + WCAG 色彩對比工具
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            使用現代色彩科學設計無障礙色彩組合。採用 OKLCH 色彩模型並透過
            WCAG 對比度指標驗證可讀性。
          </p>
        </div>
        
        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-1">
              <ColorInputPanel 
                color={foregroundColor} 
                label="前景色" 
                onChange={handleForegroundChange} 
                onSelectTarget={() => setActiveTarget('foreground')}
                isActive={activeTarget === 'foreground'}
              />
              <ColorInputPanel 
                color={backgroundColor} 
                label="背景色" 
                onChange={handleBackgroundChange} 
                onSelectTarget={() => setActiveTarget('background')}
                isActive={activeTarget === 'background'}
              />
            </div>
            
            {/* 活動 OKLCH 滑桿 */}
            <div>
              <OKLCHSlider 
                oklchColor={activeOklchColor} 
                onChange={handleActiveOklchChange} 
                label={`${activeTarget === 'foreground' ? '前景色' : '背景色'} OKLCH 調整`} 
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 text-center">
                點擊上方色彩面板來切換調整目標（前景/背景）
              </p>
            </div>
            
            <ExportTokenPanel 
              foreground={foregroundColor} 
              background={backgroundColor} 
            />
          </div>
          
          {/* Middle Column - Preview and Results */}
          <div className="space-y-6 lg:col-span-1">
            <ColorPreview 
              foreground={foregroundColor} 
              background={backgroundColor} 
            />
            
            <ContrastResult 
              foreground={foregroundColor} 
              background={backgroundColor} 
            />
          </div>
          
          {/* Right Column - Presets and Saved Palettes */}
          <div className="space-y-6 lg:col-span-1">
            <ColorPresets onSelect={handlePaletteSelect} />
            <SavedPalettes 
              currentForeground={foregroundColor}
              currentBackground={backgroundColor}
              onSelect={handlePaletteSelect}
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-zinc-500 dark:text-zinc-600">
          <p>使用 Next.js、TailwindCSS 與 culori 進行色彩科學與可訪問性計算。</p>
        </footer>
      </div>
    </main>
  );
} 