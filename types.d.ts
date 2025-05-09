declare module 'culori' {
  export function rgb(color: any): any;
  export function oklch(color: any): any;
  export function formatHex(color: any): string;
  export function formatRgb(color: any): string;
  export function wcagLuminance(color: any): number;
  export function parse(color: string): any;
} 