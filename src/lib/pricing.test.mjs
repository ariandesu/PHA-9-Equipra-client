import test from 'node:test';
import assert from 'node:assert/strict';
import { computeDays, computeTotal, computeUnits } from './pricing.js';
import { formatBDT, formatDate } from './money.js';

test('computeDays counts both the start and the end date', () => {
  assert.equal(computeDays('2026-11-21', '2026-11-21'), 1);
  assert.equal(computeDays('2026-11-21', '2026-11-23'), 3);
  assert.equal(computeDays('2026-11-21', '2026-11-27'), 7);
});

test('computeUnits charges every started week or month', () => {
  assert.equal(computeUnits(3, 'daily'), 3);
  assert.equal(computeUnits(7, 'weekly'), 1);
  assert.equal(computeUnits(8, 'weekly'), 2);
  assert.equal(computeUnits(14, 'weekly'), 2);
  assert.equal(computeUnits(30, 'monthly'), 1);
  assert.equal(computeUnits(31, 'monthly'), 2);
});

test('computeTotal is units × price × quantity', () => {
  assert.equal(computeTotal(18500, 3, 1), 55500);
  assert.equal(computeTotal(18500, 3, 2), 111000);
  assert.equal(computeTotal(3500, 2, 1), 7000);
});

test('formatBDT renders taka with no decimals', () => {
  assert.equal(formatBDT(18500), '৳18,500');
  assert.equal(formatBDT(6200), '৳6,200');
  assert.equal(formatBDT(0), '৳0');
});

test('formatDate formats in UTC', () => {
  assert.equal(formatDate('2026-11-21'), '21 Nov 2026');
  assert.equal(formatDate('2026-11-21T20:30:00.000Z'), '21 Nov 2026');
});
