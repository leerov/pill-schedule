export const ColorUtils = {
  lighten(hex: string, pct: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const nr = Math.round(r + (255 - r) * pct);
    const ng = Math.round(g + (255 - g) * pct);
    const nb = Math.round(b + (255 - b) * pct);
    return `rgb(${nr},${ng},${nb})`;
  },
  darken(hex: string, pct: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const nr = Math.round(r * (1 - pct));
    const ng = Math.round(g * (1 - pct));
    const nb = Math.round(b * (1 - pct));
    return `rgb(${nr},${ng},${nb})`;
  }
};