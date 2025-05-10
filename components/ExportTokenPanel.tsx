'use client';

import { useState } from 'react';
import { hexToRgb, hexToOklch } from '@/utils/colorUtils';

interface ExportTokenPanelProps {
  foreground: string;
  background: string;
}

export default function ExportTokenPanel({ foreground, background }: ExportTokenPanelProps) {
  const [copied, setCopied] = useState(false);

  const generateTokens = () => {
    try {
      const fgRgb = hexToRgb(foreground);
      const bgRgb = hexToRgb(background);
      const fgOklch = hexToOklch(foreground);
      const bgOklch = hexToOklch(background);
      
      const tokens = {
        colors: {
          foreground: {
            hex: foreground,
            rgb: `rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`,
            oklch: `oklch(${fgOklch.l.toFixed(2)} ${fgOklch.c.toFixed(2)} ${Math.round(fgOklch.h)}deg)`
          },
          background: {
            hex: background,
            rgb: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
            oklch: `oklch(${bgOklch.l.toFixed(2)} ${bgOklch.c.toFixed(2)} ${Math.round(bgOklch.h)}deg)`
          }
        }
      };
      
      return JSON.stringify(tokens, null, 2);
    } catch (error) {
      console.error('Error generating tokens:', error);
      return '{}';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTokens());
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">匯出設計 Token</h3>
      
      <div className="space-y-4">
        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-md font-mono text-xs">
          <pre className="overflow-x-auto text-zinc-800 dark:text-zinc-300">{generateTokens()}</pre>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copied ? '已複製!' : '複製 JSON'}
          </button>
        </div>
      </div>
    </div>
  );
} 