import { createHash } from 'node:crypto';
import { formatRut, normalizeRut } from '../utils/rut';
import type { ScoreResponse } from '../types';

export function calculateScore(rut: string): number {
  const normalized = normalizeRut(rut);
  const digest = createHash('sha256').update(normalized).digest();
  return digest.readUInt32BE(0) % 101;
}

export function getScoreReport(rut: string): ScoreResponse {
  return {
    rut: formatRut(rut),
    score: calculateScore(rut),
    fecha: new Date().toISOString(),
  };
}