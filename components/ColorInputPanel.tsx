'use client';

import { useState, useEffect } from 'react';
import { 
  hexToRgb, 
  rgbToHex, 
  hexToOklch, 
  oklchToHex, 
  RGBColor,
  OKLCHColor
} from '@/utils/colorUtils';

interface ColorInputPanelProps {
  color: string;
  label: string;
  onChange: (color: string) => void;
  onSelectTarget?: () => void;
  isActive?: boolean;
}

export default function ColorInputPanel({ 
  color, 
  label, 
  onChange, 
  onSelectTarget, 
  isActive = false 
}: ColorInputPanelProps) {
  const [hexValue, setHexValue] = useState(color);
  const [rgbValue, setRgbValue] = useState<RGBColor>(hexToRgb(color));
  const [oklchValue, setOklchValue] = useState<OKLCHColor>(hexToOklch(color));

  useEffect(() => {
    try {
      setHexValue(color);
      setRgbValue(hexToRgb(color));
      setOklchValue(hexToOklch(color));
    } catch (error) {
      console.error('Color conversion error:', error);
    }
  }, [color]);

  const handleHexChange = (value: string) => {
    setHexValue(value);
    
    if (/^#?([0-9A-F]{3}){1,2}$/i.test(value)) {
      const normalizedHex = value.startsWith('#') ? value : `#${value}`;
      
      try {
        const rgb = hexToRgb(normalizedHex);
        const oklch = hexToOklch(normalizedHex);
        
        setRgbValue(rgb);
        setOklchValue(oklch);
        
        onChange(normalizedHex);
      } catch (error) {
        console.error('Error converting hex color:', error);
      }
    }
  };

  const handleRgbChange = (property: keyof RGBColor, value: number) => {
    if (value >= 0 && value <= 255) {
      try {
        const updatedRgb = { ...rgbValue, [property]: value };
        setRgbValue(updatedRgb);
        
        const hex = rgbToHex(updatedRgb);
        const oklch = hexToOklch(hex);
        
        setHexValue(hex);
        setOklchValue(oklch);
        
        onChange(hex);
      } catch (error) {
        console.error('Error converting RGB color:', error);
      }
    }
  };

  const handleOklchChange = (property: keyof OKLCHColor, value: number) => {
    const limits: Record<keyof OKLCHColor, { min: number; max: number }> = {
      l: { min: 0, max: 1 },
      c: { min: 0, max: 0.4 },
      h: { min: 0, max: 360 }
    };

    if (value >= limits[property].min && value <= limits[property].max) {
      try {
        const updatedOklch = { ...oklchValue, [property]: value };
        setOklchValue(updatedOklch);
        
        const hex = oklchToHex(updatedOklch);
        const rgb = hexToRgb(hex);
        
        setHexValue(hex);
        setRgbValue(rgb);
        
        onChange(hex);
      } catch (error) {
        console.error('Error converting OKLCH color:', error);
      }
    }
  };

  const handlePanelClick = () => {
    if (onSelectTarget) {
      onSelectTarget();
    }
  };

  const panelClasses = `p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border 
    ${isActive 
      ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' 
      : 'border-zinc-200 dark:border-zinc-800'}
    transition-all cursor-pointer
  `;

  return (
    <div className={panelClasses} onClick={handlePanelClick}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</h3>
        <div
          className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 mr-2"
          style={{ backgroundColor: hexValue }}
        />
      </div>
      
      {/* HEX Input */}
      <div className="mb-3">
        <label htmlFor={`hex-${label}`} className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          HEX
        </label>
        <input
          id={`hex-${label}`}
          type="text"
          value={hexValue}
          onChange={(e) => handleHexChange(e.target.value)}
          className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      
      {/* RGB Inputs */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          RGB
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgbValue.r}
              onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">R</span>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgbValue.g}
              onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">G</span>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgbValue.b}
              onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">B</span>
          </div>
        </div>
      </div>
      
      {/* OKLCH Inputs */}
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
          OKLCH
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={parseFloat(oklchValue.l.toFixed(2))}
              onChange={(e) => handleOklchChange('l', parseFloat(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">L</span>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="0.4"
              step="0.01"
              value={parseFloat(oklchValue.c.toFixed(2))}
              onChange={(e) => handleOklchChange('c', parseFloat(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">C</span>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="360"
              value={Math.round(oklchValue.h)}
              onChange={(e) => handleOklchChange('h', parseFloat(e.target.value))}
              className="w-full p-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 
              bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">H</span>
          </div>
        </div>
      </div>
    </div>
  );
} 