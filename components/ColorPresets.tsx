'use client';

interface ColorPreset {
  name: string;
  foreground: string;
  background: string;
  description?: string;
}

interface ColorPresetsProps {
  onSelect: (foreground: string, background: string) => void;
}

export default function ColorPresets({ onSelect }: ColorPresetsProps) {
  // 預設的色彩組合
  const presets: ColorPreset[] = [
    {
      name: '經典黑白',
      foreground: '#000000',
      background: '#FFFFFF',
      description: '最大對比度的黑白組合'
    },
    {
      name: '柔和黑白',
      foreground: '#222222',
      background: '#F8F8F8',
      description: '較舒適的閱讀體驗'
    },
    {
      name: '深夜模式',
      foreground: '#FFFFFF',
      background: '#121212',
      description: '夜間模式風格'
    },
    {
      name: '藍灰閱讀',
      foreground: '#1D3557',
      background: '#F1FAEE',
      description: '舒適的閱讀藍灰色調'
    },
    {
      name: '海水藍綠',
      foreground: '#05668D',
      background: '#E0FBFC',
      description: '清爽的藍綠配色'
    },
    {
      name: '暖色葡萄柚',
      foreground: '#6D466B',
      background: '#FEE9E1',
      description: '溫暖的紫紅色調'
    },
    {
      name: '綠色自然',
      foreground: '#355E3B',
      background: '#F0F7EE',
      description: '自然綠色調'
    },
    {
      name: '橘色強調',
      foreground: '#7A2800',
      background: '#FFECCC',
      description: '充滿活力的橘色組合'
    }
  ];

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">色彩預設</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pb-1">
        {presets.map((preset, index) => (
          <div 
            key={index}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
            onClick={() => onSelect(preset.foreground, preset.background)}
          >
            <div className="flex items-center space-x-3 mb-1">
              <div className="flex h-6">
                <div 
                  className="w-3 h-6 rounded-l-sm"
                  style={{ backgroundColor: preset.foreground }}
                />
                <div 
                  className="w-3 h-6 rounded-r-sm"
                  style={{ backgroundColor: preset.background }}
                />
              </div>
              <div className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{preset.name}</div>
            </div>
            {preset.description && (
              <p className="text-xs text-zinc-500 ml-9">{preset.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 