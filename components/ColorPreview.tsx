'use client';

import React, { useState, useEffect } from 'react';
import { getWCAGContrast, getReadabilityLevel } from '@/utils/colorUtils';

interface ColorPreviewProps {
  foreground: string;
  background: string;
}

export default function ColorPreview({ foreground, background }: ColorPreviewProps) {
  const foregroundStyle = { color: foreground };
  const backgroundStyle = { backgroundColor: background };
  const combinedStyle = { ...foregroundStyle, ...backgroundStyle };
  
  // 只保留需要在 UI 中顯示的狀態變數
  const [readable, setReadable] = useState<boolean>(false);

  // Update contrast score and readability whenever foreground or background colors change
  useEffect(() => {
    const score = getWCAGContrast(foreground, background);
    const { readable } = getReadabilityLevel(score);
    
    setReadable(readable);
    
    // Log for debugging
    console.log("Preview WCAG Score:", score.toFixed(1), "fg:", foreground, "bg:", background);
  }, [foreground, background]);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">預覽</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${readable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
          {readable ? '可讀性佳' : '可讀性有限'}
        </span>
      </div>
      
      <div className="space-y-6">
        {/* 文字大小與權重預覽 */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-300">文字樣式</h4>
          <div 
            style={backgroundStyle} 
            className="p-4 rounded-md overflow-hidden"
          >
            <div style={foregroundStyle} className="text-3xl font-bold mb-1">大標題</div>
            <div style={foregroundStyle} className="text-2xl font-semibold mb-1">次標題</div>
            <div style={foregroundStyle} className="text-xl font-medium mb-1">中標題</div>
            <div style={foregroundStyle} className="text-base mb-1">正文文字</div>
            <div style={foregroundStyle} className="text-sm mb-1">小型文字</div>
            <div style={foregroundStyle} className="text-xs">超小文字</div>
          </div>
        </div>
        
        {/* Button Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-300">按鈕與互動元素</h4>
          <div 
            style={backgroundStyle}
            className="p-4 rounded-md flex flex-wrap gap-3 overflow-hidden"
          >
            <button 
              style={combinedStyle}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors border border-current"
            >
              主要按鈕
            </button>
            <button 
              style={{ backgroundColor: foreground, color: background }}
              className="px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              反轉按鈕
            </button>
            <div style={combinedStyle} className="px-4 py-2 rounded-full text-xs font-medium border border-current">
              標籤元素
            </div>
            <a href="#" style={foregroundStyle} className="underline text-sm">
              連結文字
            </a>
          </div>
        </div>
        
        {/* Text Block Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-300">文字區塊</h4>
          <div 
            style={backgroundStyle} 
            className="p-4 rounded-md overflow-hidden"
          >
            <h3 style={foregroundStyle} className="text-lg font-bold mb-2">
              無障礙設計的重要性
            </h3>
            <p style={foregroundStyle} className="text-sm mb-3">
              良好的色彩對比度是無障礙設計的關鍵要素。高對比度的文字能夠幫助視覺障礙用戶更容易閱讀內容，同時也能提升所有用戶的使用體驗。
            </p>
            <p style={foregroundStyle} className="text-sm">
              在設計界面時，請確保文字與背景之間有足夠的對比度，尤其是對於小型文字和次要信息。WCAG 標準提供了基本的可讀性評估指標。
            </p>
          </div>
        </div>
        
        {/* Card UI Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-300">卡片元件</h4>
          <div 
            style={backgroundStyle}
            className="rounded-lg p-4 shadow-md overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={foregroundStyle} className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-current">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h5 style={foregroundStyle} className="font-bold">卡片標題</h5>
                <p style={foregroundStyle} className="text-xs opacity-80">範例卡片元件</p>
              </div>
            </div>
            <p style={foregroundStyle} className="text-sm">
              此卡片展示您選擇的色彩組合在 UI 元件中的呈現效果。
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                style={{ ...backgroundStyle, color: foreground, borderColor: foreground }}
                className="px-3 py-1 rounded text-xs font-medium border"
              >
                取消
              </button>
              <button 
                style={{ backgroundColor: foreground, color: background }}
                className="px-3 py-1 rounded text-xs font-medium"
              >
                確認
              </button>
            </div>
          </div>
        </div>
        
        {/* 表單元素預覽 */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-600 dark:text-zinc-300">表單元素</h4>
          <div 
            style={backgroundStyle}
            className="rounded-lg p-4 overflow-hidden"
          >
            <div className="mb-3">
              <label style={foregroundStyle} className="block text-sm font-medium mb-1">輸入標籤</label>
              <input 
                type="text" 
                style={{ ...backgroundStyle, borderColor: foreground, color: foreground }}
                className="w-full px-3 py-2 rounded border text-sm"
                placeholder="請輸入內容..."
              />
            </div>
            <div className="mb-3 flex items-center gap-2">
              <input 
                type="checkbox" 
                style={{ accentColor: foreground }}
                className="w-4 h-4"
              />
              <label style={foregroundStyle} className="text-sm">勾選選項</label>
            </div>
            <div>
              <label style={foregroundStyle} className="block text-sm font-medium mb-1">選擇選項</label>
              <select 
                style={{ ...backgroundStyle, borderColor: foreground, color: foreground }}
                className="w-full px-3 py-2 rounded border text-sm"
              >
                <option style={{ ...backgroundStyle, color: foreground }}>選項 1</option>
                <option style={{ ...backgroundStyle, color: foreground }}>選項 2</option>
                <option style={{ ...backgroundStyle, color: foreground }}>選項 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 