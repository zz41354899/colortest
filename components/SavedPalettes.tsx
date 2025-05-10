'use client';

import { useState, useEffect } from 'react';

interface ColorPalette {
  id: string;
  name: string;
  foreground: string;
  background: string;
  createdAt: number;
}

interface SavedPalettesProps {
  currentForeground: string;
  currentBackground: string;
  onSelect: (foreground: string, background: string) => void;
}

export default function SavedPalettes({ 
  currentForeground, 
  currentBackground, 
  onSelect 
}: SavedPalettesProps) {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  
  // 載入已儲存的色彩組合
  useEffect(() => {
    const savedPalettes = localStorage.getItem('oklch-color-palettes');
    if (savedPalettes) {
      try {
        setPalettes(JSON.parse(savedPalettes));
      } catch (e) {
        console.error('Error loading saved palettes:', e);
        setPalettes([]);
      }
    }
  }, []);
  
  // 儲存色彩組合
  const savePalette = () => {
    if (!paletteName.trim()) return;
    
    const newPalette: ColorPalette = {
      id: `palette-${Date.now()}`,
      name: paletteName.trim(),
      foreground: currentForeground,
      background: currentBackground,
      createdAt: Date.now(),
    };
    
    const updatedPalettes = [...palettes, newPalette];
    setPalettes(updatedPalettes);
    localStorage.setItem('oklch-color-palettes', JSON.stringify(updatedPalettes));
    
    setPaletteName('');
    setShowForm(false);
  };
  
  // 刪除色彩組合
  const deletePalette = (id: string) => {
    const updatedPalettes = palettes.filter(p => p.id !== id);
    setPalettes(updatedPalettes);
    localStorage.setItem('oklch-color-palettes', JSON.stringify(updatedPalettes));
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">儲存的色彩組合</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-2 py-1 text-xs rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
        >
          {showForm ? '取消' : '儲存目前組合'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <label className="block text-xs mb-1 text-zinc-500 dark:text-zinc-300">
            組合名稱
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="輸入名稱..."
              className="flex-1 px-2 py-1 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            />
            <button
              onClick={savePalette}
              disabled={!paletteName.trim()}
              className="px-3 py-1 text-xs rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              儲存
            </button>
          </div>
        </div>
      )}
      
      {palettes.length === 0 ? (
        <div className="text-center py-6 text-sm text-zinc-500 dark:text-zinc-400">
          尚未儲存任何色彩組合
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {palettes.map((palette) => (
            <div 
              key={palette.id}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex">
                  <div 
                    className="h-8 w-4 rounded-l-sm"
                    style={{ backgroundColor: palette.foreground }}
                    title={`前景色: ${palette.foreground}`}
                  />
                  <div 
                    className="h-8 w-4 rounded-r-sm"
                    style={{ backgroundColor: palette.background }}
                    title={`背景色: ${palette.background}`}
                  />
                </div>
                <div className="mr-2">
                  <div className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                    {palette.name}
                  </div>
                  <div className="flex text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-mono mr-2">{palette.foreground}</span>
                    <span className="font-mono">{palette.background}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => onSelect(palette.foreground, palette.background)}
                  className="p-1 text-xs rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                  title="套用此色彩組合"
                >
                  套用
                </button>
                <button
                  onClick={() => deletePalette(palette.id)}
                  className="p-1 text-xs rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                  title="刪除此色彩組合"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 