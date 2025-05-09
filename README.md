# OKLCH + APCA Color Contrast Tool

A modern web application built with Next.js, TypeScript, and Tailwind CSS that helps designers and developers create accessible color combinations using the OKLCH color model and APCA contrast metrics.

## Features

- Interactive color inputs for both foreground and background colors
- Support for multiple color formats: HEX, RGB, and OKLCH
- Real-time OKLCH sliders for fine-tuning colors
- Live preview of UI components with the selected colors
- APCA contrast calculation and readability evaluation
- Export color tokens as JSON for design systems

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- `culori` for color format conversions
- `apca-w3` for APCA contrast calculations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Why OKLCH and APCA?

### OKLCH Color Model

OKLCH (Oklab Lightness-Chroma-Hue) is a perceptually uniform color space that better represents how humans perceive color compared to traditional RGB or HSL. It provides:

- More intuitive color adjustments
- Better perceptual uniformity
- Improved color harmony

### APCA Contrast Algorithm

APCA (Accessible Perceptual Contrast Algorithm) is a modern approach to measuring contrast that better predicts readability compared to WCAG 2.0 contrast ratios. It considers:

- The spatial frequency of text
- The actual perception of contrast based on relative luminance
- Polarity effects (dark-on-light vs. light-on-dark)

## License

MIT
