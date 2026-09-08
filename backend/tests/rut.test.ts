import { describe, expect, it } from 'vitest';
import { formatRut, hasValidRutFormat, isValidRut, normalizeRut } from '../src/utils/rut';

describe('normalizeRut', () => {
  it('convierte distintos formatos al mismo resultado', () => {
    const esperado = '123456785';
    expect(normalizeRut('12.345.678-5')).toBe(esperado);
    expect(normalizeRut('12345678-5')).toBe(esperado);
    expect(normalizeRut('123456785')).toBe(esperado);
  });

  it('convierte K a mayuscula', () => {
    expect(normalizeRut('11.111.111-k')).toBe('11111111K');
  });
});

describe('isValidRut', () => {
  it('acepta RUTs con digito verificador correcto', () => {
    expect(isValidRut('12.345.678-5')).toBe(true);
    expect(isValidRut('18.756.066-7')).toBe(true);
  });

  it('rechaza un digito verificador incorrecto', () => {
    expect(isValidRut('12.345.678-9')).toBe(false);
  });

  it('rechaza entradas invalidas', () => {
    expect(isValidRut('abc')).toBe(false);
    expect(isValidRut('')).toBe(false);
  });
});

describe('hasValidRutFormat', () => {
  it('valida estructura sin verificar el digito', () => {
    expect(hasValidRutFormat('12.345.678-9')).toBe(true);
    expect(hasValidRutFormat('hola-1')).toBe(false);
  });
});

describe('formatRut', () => {
  it('devuelve el RUT con puntos y guion', () => {
    expect(formatRut('123456785')).toBe('12.345.678-5');
    expect(formatRut('187560667')).toBe('18.756.066-7');
  });
});