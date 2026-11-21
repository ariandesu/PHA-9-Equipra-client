import test from 'node:test';
import assert from 'node:assert/strict';
import { mockSource } from './source.js';

const PHONE_PATTERN = /^(?:\+?880|0)1[3-9]\d{8}$/;

function futureDay(offset) {
  return new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
}

function bookingBody(extra = {}) {
  return {
    equipmentId: 'eq-001',
    startDate: futureDay(10),
    endDate: futureDay(11),
    quantity: 1,
    phone: '017-1234-5678',
    address: 'Dhaka',
    ...extra,
  };
}

test('the mock owner is Riverbank Plant (o1)', async () => {
  const mine = await mockSource.myEquipment({});
  assert.equal(mine.total, 3);
  assert.ok(mine.items.every((item) => item.owner.id === 'o1'));

  const rentals = await mockSource.ownerBookings({});
  assert.ok(rentals.total > 0);
  assert.ok(rentals.items.every((booking) => booking.owner.id === 'o1'));
});

test('createBooking rejects invalid input with 400', async () => {
  const invalid = [
    { startDate: futureDay(-400), endDate: futureDay(-399) },
    { startDate: futureDay(10), endDate: futureDay(5) },
    { phone: '12345' },
    { address: '' },
  ];

  for (const extra of invalid) {
    let status = null;
    try {
      await mockSource.createBooking(bookingBody(extra));
    } catch (error) {
      status = error.status;
    }
    assert.equal(status, 400, `expected 400 for ${JSON.stringify(extra)}`);
  }
});

test('createBooking stores the phone normalised as +8801…', async () => {
  const created = await mockSource.createBooking(bookingBody());
  assert.equal(created.data.phone, '+8801712345678');
  assert.equal(PHONE_PATTERN.test(created.data.phone), true);
  assert.equal(created.data.address, 'Dhaka');
});

test('getFeatured returns eq-001 through eq-006 in that exact order', async () => {
  const res = await mockSource.getFeatured();
  assert.equal(res.data.length, 6);
  assert.deepEqual(
    res.data.map((item) => item.id),
    ['eq-001', 'eq-002', 'eq-003', 'eq-004', 'eq-005', 'eq-006']
  );
});

test('createEquipment stamps the owner as Riverbank (o1)', async () => {
  const created = await mockSource.createEquipment({
    name: 'Test Wheel Loader',
    category: 'Construction Equipment',
    location: 'Shipyard Road, Khulna',
    price: 13000,
    rentalType: 'daily',
    quantity: 1,
  });
  assert.equal(created.data.owner.id, 'o1');
  assert.equal(created.data.owner.name, 'Riverbank Plant');
  assert.equal(created.data.status, 'pending');
});
