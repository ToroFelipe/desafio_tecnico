import { describe, expect, it } from 'vitest';
import { calculateScore, getScoreReport } from '../src/services/score.service';

describe('calculateScore', () => {
  it('devuelve siempre el mismo score para el mismo RUT', () => {
    const primera = calculateScore('12.345.678-5');
    for (let i = 0; i < 50; i++) {
      expect(calculateScore('12.345.678-5')).toBe(primera);
    }
  });

  it('ignora el formato del RUT', () => {
    const esperado = calculateScore('12.345.678-5');
    expect(calculateScore('12345678-5')).toBe(esperado);
    expect(calculateScore('123456785')).toBe(esperado);
  });

  it('produce scores distintos para RUTs distintos', () => {
    const ruts = ['12.345.678-5', '18.756.066-7', '18.765.432-7', '7.654.321-6'];
    const scores = new Set(ruts.map(calculateScore));
    expect(scores.size).toBe(ruts.length);
  });

  it('siempre esta en el rango 0-100', () => {
    for (let i = 10_000_000; i < 10_000_200; i++) {
      const score = calculateScore(`${i}-0`);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

describe('getScoreReport', () => {
  it('responde con RUT formateado, score y fecha ISO', () => {
    const reporte = getScoreReport('123456785');
    expect(reporte.rut).toBe('12.345.678-5');
    expect(reporte.score).toBe(calculateScore('12.345.678-5'));
    expect(new Date(reporte.fecha).toISOString()).toBe(reporte.fecha);
  });
});