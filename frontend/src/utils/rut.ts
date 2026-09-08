export function normalizeRut(rut: string): string {
    return rut.replace(/[.\-\s]/g, '').toUpperCase();
  }
  
  export function formatRut(rut: string): string {
    const normalized = normalizeRut(rut).replace(/[^0-9K]/g, '').slice(0, 9);
    if (normalized.length <= 1) return normalized;
    const body = normalized.slice(0, -1);
    const checkDigit = normalized.slice(-1);
    return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${checkDigit}`;
  }
  
  export function hasValidRutFormat(rut: string): boolean {
    return /^\d{7,8}[\dK]$/.test(normalizeRut(rut));
  }