export function normalizeRut(rut: string): string {
    return rut.replace(/[.\-\s]/g, '').toUpperCase();
  }
  
  function computeCheckDigit(body: string): string {
    let sum = 0;
    let multiplier = 2;
  
    for (let i = body.length - 1; i >= 0; i--) {
      sum += Number(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const remainder = 11 - (sum % 11);
    if (remainder === 11) return '0';
    if (remainder === 10) return 'K';
    return String(remainder);
  }
  
  export function hasValidRutFormat(rut: string): boolean {
    return /^\d{7,8}[\dK]$/.test(normalizeRut(rut));
  }
  
  export function isValidRut(rut: string): boolean {
    const normalized = normalizeRut(rut);
    if (!hasValidRutFormat(normalized)) return false;
  
    const body = normalized.slice(0, -1);
    const checkDigit = normalized.slice(-1);
  
    return computeCheckDigit(body) === checkDigit;
  }
  
  export function formatRut(rut: string): string {
    const normalized = normalizeRut(rut);
    if (normalized.length < 2) return normalized;
  
    const body = normalized.slice(0, -1);
    const checkDigit = normalized.slice(-1);
    const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    return `${withDots}-${checkDigit}`;
  }