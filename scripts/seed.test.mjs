import { describe, it, expect } from 'node:test';
import { computeUnits, computeTotal, computeDays } from '../src/lib/pricing.js';

describe('pricing utilities', () => {
  describe('computeUnits', () => {
    it('daily: units = days', () => {
      expect(computeUnits(1, 'daily')).toBe(1);
      expect(computeUnits(5, 'daily')).toBe(5);
    });

    it('weekly: units = ceil(days / 7)', () => {
      expect(computeUnits(1, 'weekly')).toBe(1);
      expect(computeUnits(7, 'weekly')).toBe(1);
      expect(computeUnits(8, 'weekly')).toBe(2);
      expect(computeUnits(14, 'weekly')).toBe(2);
      expect(computeUnits(15, 'weekly')).toBe(3);
    });

    it('monthly: units = ceil(days / 30)', () => {
      expect(computeUnits(1, 'monthly')).toBe(1);
      expect(computeUnits(30, 'monthly')).toBe(1);
      expect(computeUnits(31, 'monthly')).toBe(2);
      expect(computeUnits(60, 'monthly')).toBe(2);
    });
  });

  describe('computeTotal', () => {
    it('computes total = units × price × quantity', () => {
      expect(computeTotal(18500, 1, 1)).toBe(18500);
      expect(computeTotal(18500, 3, 1)).toBe(55500);
      expect(computeTotal(18500, 2, 2)).toBe(74000);
    });
  });

  describe('computeDays', () => {
    it('same day = 1 day', () => {
      expect(computeDays('2026-11-20', '2026-11-20')).toBe(1);
    });

    it('two days = 2 days', () => {
      expect(computeDays('2026-11-20', '2026-11-21')).toBe(2);
    });

    it('week spans 7 days', () => {
      expect(computeDays('2026-11-20', '2026-11-26')).toBe(7);
    });
  });
});
