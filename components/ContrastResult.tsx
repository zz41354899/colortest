'use client';

import React, { useState, useEffect } from 'react';
import { getWCAGContrast, getReadabilityLevel, ReadabilityLevel } from '@/utils/colorUtils';

interface ContrastResultProps {
  foreground: string;
  background: string;
}

export default function ContrastResult({ foreground, background }: ContrastResultProps) {
  const [contrastScore, setContrastScore] = useState<number>(1);
  const [level, setLevel] = useState<ReadabilityLevel>('Fail');
  const [readable, setReadable] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<string>('');
  
  // Update contrast score and readability whenever foreground or background colors change
  useEffect(() => {
    const score = getWCAGContrast(foreground, background);
    const { level, readable, recommendation } = getReadabilityLevel(score);
    
    // Update state with new values
    setContrastScore(score);
    setLevel(level);
    setReadable(readable);
    setRecommendation(recommendation);
    
    // Log for debugging
    console.log("WCAG Score:", score.toFixed(1), "fg:", foreground, "bg:", background);
  }, [foreground, background]);
  
  const getScoreColor = (level: ReadabilityLevel): string => {
    switch (level) {
      case 'AAA':
        return 'text-green-600 dark:text-green-500';
      case 'AA':
        return 'text-green-600 dark:text-green-500';
      case 'AA Large':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'Fail':
        return 'text-red-600 dark:text-red-500';
      default:
        return 'text-red-600 dark:text-red-500';
    }
  };
  
  const getLevelBadge = (level: ReadabilityLevel): React.ReactNode => {
    switch (level) {
      case 'AAA':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            AAA
          </span>
        );
      case 'AA':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            AA
          </span>
        );
      case 'AA Large':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            AA Large
          </span>
        );
      case 'Fail':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Fail
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Fail
          </span>
        );
    }
  };
  
  const getReadabilityBadge = () => {
    if (readable) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          通過
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        不通過
      </span>
    );
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">對比度結果 (WCAG)</h3>
      
      <div className="space-y-4">
        {/* Score Display */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">對比比率</span>
            <span className={`text-3xl font-bold ${getScoreColor(level)}`}>
              {contrastScore.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              等級: {getLevelBadge(level)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">可讀性評估</span>
            {getReadabilityBadge()}
          </div>
        </div>
        
        {/* Level and Recommendation */}
        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-md">
          <div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">建議</span>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{recommendation}</p>
          </div>
        </div>
        
        {/* WCAG Information */}
        <div className="text-xs text-zinc-500 dark:text-zinc-500 italic">
          <p>
            WCAG 對比度評估是網頁無障礙設計的標準指標，確保視力不同的使用者都能輕鬆閱讀您的內容。
            AAA 級別 (≥7:1) 提供最佳可讀性，AA 級別 (≥4.5:1) 則符合基本需求。
          </p>
        </div>
      </div>
    </div>
  );
} 