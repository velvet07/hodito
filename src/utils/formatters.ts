// Szám formázása (pontokkal elválasztva)
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Szám kinyerése szövegből (kezeli a szóközöket és pontokat)
export function extractNumber(text: string | null | undefined): number {
  if (!text) return 0;
  return parseInt(text.replace(/[.,\s]/g, '')) || 0;
}

// Százalék formázása
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
}

