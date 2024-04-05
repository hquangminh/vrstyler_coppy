export function clampBuilderPx(minW: number, maxW: number, minFs: number, maxFs: number) {
  const slope = (maxFs - minFs) / (maxW - minW);
  const yAxisIntersection = -minW * slope + minFs;

  return `clamp(${minFs}px, ${yAxisIntersection}px + ${slope * 100}vw, ${maxFs}px)`;
}

export function clampBuilder(
  minWidthPx: number,
  maxWidthPx: number,
  minFontSize: number,
  maxFontSize: number
) {
  const pixelsPerRem = 100; // 10px = 1rem
  const minWidth = minWidthPx / pixelsPerRem;
  const maxWidth = maxWidthPx / pixelsPerRem;

  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minFontSize;

  return `clamp( ${minFontSize}rem, ${yAxisIntersection}rem + ${
    slope * 100
  }vw, ${maxFontSize}rem )`;
}
