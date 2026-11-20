import {
  equipment as demoEquipment,
  favorites as demoFavorites,
  reviews,
  stats,
} from './data.js';

const DELAY_MS = 300 + Math.random() * 300;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

function delaySync() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

// Mutable in-memory state
let equipment = [...demoEquipment.map((e) => ({ ...e }))];
let favorites = new Set(demoFavorites.map((f) => f.equipmentId));
let bookings = [];

export async function getEquipmentList(params = {}) {
  await delay();

  let result = [...equipment];

  // Filter: approved only for public catalog
  result = result.filter((e) => e.status === 'approved');

  // Search: matches name OR location OR category (case-insensitive, regex-escaped)
  if (params.search) {
    const searchTerm = params.search.trim().toLowerCase();
    if (searchTerm.length > 0) {
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'i');
      result = result.filter(
        (e) => re.test(e.name) || re.test(e.location) || re.test(e.category)
      );
    }
  }

  // Filter by category
  if (params.category) {
    result = result.filter((e) => e.category === params.category);
  }

  // Filter by rental type
  if (params.rentalType) {
    result = result.filter((e) => e.rentalType === params.rentalType);
  }

  // Filter by price range
  if (params.minPrice !== undefined) {
    result = result.filter((e) => e.price >= params.minPrice);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter((e) => e.price <= params.maxPrice);
  }

  // Filter by availability
  if (params.availability === 'available') {
    result = result.filter((e) => e.quantity > 0);
  } else if (params.availability === 'unavailable') {
    result = result.filter((e) => e.quantity === 0);
  }

  // Sort
  if (params.sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else {
    // newest default
    result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  // Pagination
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(params.limit) || 9));
  const total = result.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = result.slice(offset, offset + limit);

  return { items, total, page, pages };
}

export async function getEquipment(id) {
  await delay();
  const equipmentItem = equipment.find((e) => e.id === id);
  if (!equipmentItem) return null;
  return { ...equipmentItem };
}

export async function getFeatured() {
  await delay();
  return equipment
    .filter((e) => e.status === 'approved')
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6);
}

export async function getCategories() {
  await delay();
  const counts = {};
  equipment.forEach((e) => {
    if (e.status === 'approved') {
      counts[e.category] = (counts[e.category] || 0) + 1;
    }
  });
  return counts;
}

export async function getStats() {
  await delay();
  return { ...stats };
}

export async function getFavorites() {
  await delay();
  return equipment.filter((e) => favorites.has(e.id));
}

export async function getFavoriteIds() {
  await delay();
  return [...favorites];
}

export async function toggleFavorite(equipmentId) {
  await delay();
  if (favorites.has(equipmentId)) {
    favorites.delete(equipmentId);
  } else {
    favorites.add(equipmentId);
  }
  return favorites.has(equipmentId);
}

export async function createBooking(data) {
  await delay();
  const equipmentItem = equipment.find((e) => e.id === data.equipmentId);
  if (!equipmentItem) throw new Error('Equipment not found');
  const booking = {
    id: 'booking-' + Date.now(),
    ...data,
    status: 'pending',
    paymentStatus: 'unpaid',
    holdExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export async function getUser() {
  await delay();
  return null; // No user logged in by default in mock
}

export async function updateMe(data) {
  await delay();
  return { ...data };
}

export async function createEquipment(data) {
  await delay();
  const equipmentItem = {
    id: 'equip-' + Date.now(),
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  equipment.push(equipmentItem);
  return equipmentItem;
}

export async function updateEquipment(id, data) {
  await delay();
  const idx = equipment.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Equipment not found');
  equipment[idx] = { ...equipment[idx], ...data };
  return equipment[idx];
}

export async function deleteEquipment(id) {
  await delay();
  const idx = equipment.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Equipment not found');
  equipment.splice(idx, 1);
}

export async function getMyEquipment() {
  await delay();
  return equipment.filter((e) => e.owner.id === 'o1');
}

export async function getMyEquipmentRentals() {
  await delay();
  return bookings.filter((b) => b.owner.id === 'o1');
}

export async function getMyRentals() {
  await delay();
  return bookings.filter((b) => b.customer.id === 'user-1');
}

export async function getAllEquipment() {
  await delay();
  return equipment;
}

export async function updateEquipmentStatus(id, status) {
  await delay();
  const equipmentItem = equipment.find((e) => e.id === id);
  if (!equipmentItem) throw new Error('Equipment not found');
  equipmentItem.status = status;
  return equipmentItem;
}

export async function getAllUsers() {
  await delay();
  return [
    { id: 'u1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01' },
    { id: 'u2', name: 'Owner User', email: 'owner@example.com', role: 'owner', createdAt: '2026-01-02' },
    { id: 'u3', name: 'Customer User', email: 'customer@example.com', role: 'customer', createdAt: '2026-01-03' },
  ];
}

export async function updateUserRole(id, role) {
  await delay();
  return { id, role };
}

export async function deleteUser(id) {
  await delay();
}

export async function getAdminBookings() {
  await delay();
  return bookings;
}

export async function getOwnerBookings() {
  await delay();
  return bookings.filter((b) => b.owner.id === 'o1');
}

export async function updateBookingStatus(id, status) {
  await delay();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) throw new Error('Booking not found');
  booking.status = status;
  return booking;
}

export async function getAnalytics(admin = false) {
  await delay();
  return {
    totalUsers: 42,
    totalEquipment: equipment.length,
    totalBookings: bookings.length,
    pendingApprovals: equipment.filter((e) => e.status === 'pending').length,
    completedRentals: bookings.filter((b) => b.status === 'completed').length,
    totalRevenue: 1250000,
    monthly: [
      { month: 'Jun', bookings: 120, revenue: 120000 },
      { month: 'Jul', bookings: 140, revenue: 140000 },
      { month: 'Aug', bookings: 110, revenue: 110000 },
      { month: 'Sep', bookings: 150, revenue: 150000 },
      { month: 'Oct', bookings: 170, revenue: 170000 },
      { month: 'Nov', bookings: 190, revenue: 190000 },
    ],
  };
}
