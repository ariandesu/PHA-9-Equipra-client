import {
  bookings as seedBookings,
  categories as seedCategories,
  equipment as seedEquipment,
  favorites as seedFavorites,
  stats as seedStats,
  users as seedUsers,
} from './data.js';
import { quoteBooking } from '../pricing.js';

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 600;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 24;
const HOLD_MINUTES = 30;

const store = {
  equipment: seedEquipment.map((item) => ({ ...item })),
  bookings: seedBookings.map((booking) => ({ ...booking })),
  favorites: seedFavorites.map((favorite) => ({ ...favorite })),
  users: seedUsers.map((user) => ({ ...user })),
};

// The mock session. The server always reads the role from the database.
const viewer = store.users.find((user) => user.role === 'customer');
const ownerUser = store.users.find((user) => user.role === 'owner');

let idCounter = 100;

function delay() {
  const ms =
    MIN_DELAY_MS +
    Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Errors are plain { status, message } objects, exactly like the API contract.
function fail(status, message) {
  throw { status, message };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PHONE_PATTERN = /^(?:\+?880|0)1[3-9]\d{8}$/;

function utcDay(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function normalisePhone(value) {
  if (typeof value !== 'string') return null;
  const digits = value.replace(/[\s-]/g, '');
  if (!PHONE_PATTERN.test(digits)) return null;
  return `+880${digits.slice(-10)}`;
}

function paginate(rows, params = {}) {
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(params.limit, 10) || DEFAULT_LIMIT)
  );
  const total = rows.length;
  return {
    items: rows.slice((page - 1) * limit, (page - 1) * limit + limit),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

function byNewest(a, b) {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

function findEquipment(id) {
  const item = store.equipment.find((row) => row.id === id);
  if (!item) fail(404, 'Equipment not found');
  return item;
}

function findBooking(id) {
  const booking = store.bookings.find((row) => row.id === id);
  if (!booking) fail(404, 'Booking not found');
  return booking;
}

function findUser(id) {
  const user = store.users.find((row) => row.id === id);
  if (!user) fail(404, 'User not found');
  return user;
}

function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

async function listEquipment(params = {}) {
  await delay();
  let rows = store.equipment.filter((item) => item.status === 'approved');

  const search =
    typeof params.search === 'string' ? params.search.trim().slice(0, 60) : '';
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    rows = rows.filter(
      (item) =>
        pattern.test(item.name) ||
        pattern.test(item.location) ||
        pattern.test(item.category)
    );
  }

  if (params.category) {
    rows = rows.filter((item) => item.category === params.category);
  }
  if (params.rentalType) {
    rows = rows.filter((item) => item.rentalType === params.rentalType);
  }
  if (params.minPrice !== undefined && params.minPrice !== '') {
    rows = rows.filter((item) => item.price >= Number(params.minPrice));
  }
  if (params.maxPrice !== undefined && params.maxPrice !== '') {
    rows = rows.filter((item) => item.price <= Number(params.maxPrice));
  }
  if (params.availability === 'available') {
    rows = rows.filter((item) => item.quantity > 0);
  } else if (params.availability === 'unavailable') {
    rows = rows.filter((item) => item.quantity === 0);
  }

  if (params.sort === 'price_asc') {
    rows.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price_desc') {
    rows.sort((a, b) => b.price - a.price);
  } else {
    rows.sort(byNewest);
  }

  return paginate(rows, params);
}

async function getFeatured() {
  await delay();
  const items = store.equipment
    .filter((item) => item.status === 'approved')
    .sort(byNewest)
    .slice(0, 6);
  return { data: items };
}

async function getCategories() {
  await delay();
  return { data: seedCategories.map((entry) => ({ ...entry })) };
}

async function getEquipment(id) {
  await delay();
  return { data: { ...findEquipment(id) } };
}

async function getStats() {
  await delay();
  return { data: { ...seedStats } };
}

async function listFavorites(params = {}) {
  await delay();
  const ids = store.favorites
    .filter((favorite) => favorite.userId === viewer.id)
    .map((favorite) => favorite.equipmentId);
  const rows = store.equipment.filter((item) => ids.includes(item.id));
  return paginate(rows, params);
}

async function getFavoriteIds() {
  await delay();
  const ids = store.favorites
    .filter((favorite) => favorite.userId === viewer.id)
    .map((favorite) => favorite.equipmentId);
  return { data: ids };
}

async function addFavorite(id) {
  await delay();
  findEquipment(id);
  const exists = store.favorites.some(
    (favorite) => favorite.userId === viewer.id && favorite.equipmentId === id
  );
  if (!exists) {
    store.favorites.push({
      userId: viewer.id,
      equipmentId: id,
      createdAt: new Date().toISOString(),
    });
  }
  return { data: { equipmentId: id, favorited: true } };
}

async function removeFavorite(id) {
  await delay();
  store.favorites = store.favorites.filter(
    (favorite) =>
      !(favorite.userId === viewer.id && favorite.equipmentId === id)
  );
  return { data: { equipmentId: id, favorited: false } };
}

async function createBooking(body = {}) {
  await delay();
  const item = findEquipment(body.equipmentId);
  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    fail(400, 'Quantity must be a whole number of at least 1');
  }
  if (quantity > item.quantity) {
    fail(409, 'Requested quantity exceeds the available units');
  }

  const startDay = utcDay(body.startDate);
  const endDay = utcDay(body.endDate);
  if (!startDay || !endDay) {
    fail(400, 'Start and end dates are required');
  }
  if (startDay < new Date().toISOString().slice(0, 10)) {
    fail(400, 'Start date must not be in the past');
  }
  if (endDay < startDay) {
    fail(400, 'End date must not be before the start date');
  }

  const phone = normalisePhone(body.phone);
  if (!phone) {
    fail(400, 'A valid phone number is required');
  }
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (!address) {
    fail(400, 'A delivery address is required');
  }

  const { days, units, totalAmount } = quoteBooking({
    startDate: body.startDate,
    endDate: body.endDate,
    rentalType: item.rentalType,
    price: item.price,
    quantity,
  });

  const now = new Date().toISOString();
  const booking = {
    id: nextId('bk'),
    equipmentId: item.id,
    equipment: {
      name: item.name,
      image: item.image,
      category: item.category,
      rentalType: item.rentalType,
      price: item.price,
    },
    owner: { id: item.owner.id, name: item.owner.name, email: item.owner.email },
    customer: {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      image: viewer.image,
    },
    startDate: body.startDate,
    endDate: body.endDate,
    quantity,
    days,
    units,
    totalAmount,
    phone,
    address,
    notes: body.notes || '',
    status: 'pending',
    paymentStatus: 'unpaid',
    holdExpiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000).toISOString(),
    checkoutSessionId: null,
    transactionId: null,
    createdAt: now,
    updatedAt: now,
  };

  store.bookings.unshift(booking);
  return { data: booking };
}

async function myBookings(params = {}) {
  await delay();
  const rows = store.bookings
    .filter((booking) => booking.customer.id === viewer.id)
    .sort(byNewest);
  return paginate(rows, params);
}

async function ownerBookings(params = {}) {
  await delay();
  const rows = store.bookings
    .filter((booking) => booking.owner.id === ownerUser.id)
    .sort(byNewest);
  return paginate(rows, params);
}

async function adminBookings(params = {}) {
  await delay();
  let rows = store.bookings.slice().sort(byNewest);
  if (params.status) {
    rows = rows.filter((booking) => booking.status === params.status);
  }
  return paginate(rows, params);
}

async function updateBookingStatus(id, status) {
  await delay();
  const booking = findBooking(id);
  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    fail(400, 'Status must be confirmed, completed or cancelled');
  }
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  return { data: { ...booking } };
}

async function myEquipment(params = {}) {
  await delay();
  const rows = store.equipment
    .filter((item) => item.owner.id === ownerUser.id)
    .sort(byNewest);
  return paginate(rows, params);
}

const EQUIPMENT_FIELDS = [
  'name',
  'description',
  'category',
  'location',
  'price',
  'rentalType',
  'quantity',
  'condition',
  'brand',
  'model',
  'image',
  'terms',
];

async function createEquipment(body = {}) {
  await delay();
  const now = new Date().toISOString();
  const item = { id: nextId('eq') };
  for (const field of EQUIPMENT_FIELDS) {
    if (body[field] !== undefined) item[field] = body[field];
  }
  item.status = 'pending';
  item.owner = {
    id: ownerUser.id,
    name: ownerUser.name,
    email: ownerUser.email,
    image: ownerUser.image,
  };
  item.createdAt = now;
  item.updatedAt = now;

  store.equipment.push(item);
  return { data: { ...item } };
}

async function updateEquipment(id, body = {}) {
  await delay();
  const item = findEquipment(id);
  for (const field of EQUIPMENT_FIELDS) {
    if (body[field] !== undefined) item[field] = body[field];
  }
  // An owner edit sends the listing back for review.
  item.status = 'pending';
  item.updatedAt = new Date().toISOString();
  return { data: { ...item } };
}

async function deleteEquipment(id) {
  await delay();
  findEquipment(id);
  const hasUpcomingPaidBooking = store.bookings.some(
    (booking) =>
      booking.equipmentId === id &&
      booking.paymentStatus === 'paid' &&
      ['pending', 'confirmed'].includes(booking.status)
  );
  if (hasUpcomingPaidBooking) {
    fail(409, 'This equipment has upcoming paid bookings');
  }
  store.equipment = store.equipment.filter((item) => item.id !== id);
  return { data: { id } };
}

async function adminEquipment(params = {}) {
  await delay();
  let rows = store.equipment.slice().sort(byNewest);
  if (params.status) {
    rows = rows.filter((item) => item.status === params.status);
  }
  return paginate(rows, params);
}

async function updateEquipmentStatus(id, status) {
  await delay();
  const item = findEquipment(id);
  if (!['approved', 'rejected'].includes(status)) {
    fail(400, 'Status must be approved or rejected');
  }
  item.status = status;
  item.updatedAt = new Date().toISOString();
  return { data: { ...item } };
}

async function adminUsers(params = {}) {
  await delay();
  let rows = store.users.slice();
  const search =
    typeof params.search === 'string' ? params.search.trim().slice(0, 60) : '';
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    rows = rows.filter(
      (user) => pattern.test(user.name) || pattern.test(user.email)
    );
  }
  rows.sort(byNewest);
  return paginate(rows, params);
}

async function updateRole(id, role) {
  await delay();
  const user = findUser(id);
  if (!['customer', 'owner', 'admin'].includes(role)) {
    fail(400, 'Role must be customer, owner or admin');
  }
  if (user.id === viewer.id) {
    fail(400, 'You cannot change your own role');
  }
  user.role = role;
  return { data: { ...user } };
}

async function deleteUser(id) {
  await delay();
  const user = findUser(id);
  if (user.id === viewer.id) {
    fail(400, 'You cannot delete your own account');
  }
  store.users = store.users.filter((row) => row.id !== id);
  store.favorites = store.favorites.filter(
    (favorite) => favorite.userId !== id
  );
  return { data: { id } };
}

async function adminAnalytics() {
  await delay();
  return {
    data: {
      totalUsers: 2318,
      totalEquipment: 1286,
      totalBookings: 9904,
      pendingApprovals: 7,
      completedRentals: 9612,
      totalRevenue: 12400000,
      monthly: [
        { month: '2026-06', bookings: 42, revenue: 1640000 },
        { month: '2026-07', bookings: 58, revenue: 1920000 },
        { month: '2026-08', bookings: 51, revenue: 1780000 },
        { month: '2026-09', bookings: 74, revenue: 2160000 },
        { month: '2026-10', bookings: 89, revenue: 2530000 },
        { month: '2026-11', bookings: 112, revenue: 2370000 },
      ],
    },
  };
}

async function ownerAnalytics() {
  await delay();
  return {
    data: {
      listed: 14,
      approved: 11,
      pending: 2,
      rejected: 1,
      completedRentals: 62,
      totalEarnings: 1690000,
      thisMonth: 412000,
      statusMix: [
        { status: 'completed', count: 62, percent: 62 },
        { status: 'confirmed', count: 24, percent: 24 },
        { status: 'pending', count: 14, percent: 14 },
      ],
      monthly: [
        { month: '2026-06', earnings: 182000 },
        { month: '2026-07', earnings: 240000 },
        { month: '2026-08', earnings: 205000 },
        { month: '2026-09', earnings: 298000 },
        { month: '2026-10', earnings: 356000 },
        { month: '2026-11', earnings: 412000 },
      ],
    },
  };
}

async function getMe() {
  await delay();
  return { data: { ...viewer } };
}

const PROFILE_FIELDS = ['name', 'image', 'phone', 'address'];

async function updateMe(body = {}) {
  await delay();
  for (const field of PROFILE_FIELDS) {
    if (body[field] !== undefined) viewer[field] = body[field];
  }
  return { data: { ...viewer } };
}

export const mockSource = {
  listEquipment,
  getFeatured,
  getCategories,
  getEquipment,
  getStats,
  listFavorites,
  getFavoriteIds,
  addFavorite,
  removeFavorite,
  createBooking,
  myBookings,
  ownerBookings,
  adminBookings,
  updateBookingStatus,
  myEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  adminEquipment,
  updateEquipmentStatus,
  adminUsers,
  updateRole,
  deleteUser,
  adminAnalytics,
  ownerAnalytics,
  getMe,
  updateMe,
};
