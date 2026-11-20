import api from '@/lib/api';

// The API contract (02 §5): lists { items, total, page, pages }, singles { data },
// errors { message }. The mock source uses the same shapes, so a component never
// has to care which source is active.
async function request(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';
    throw { status, message };
  }
}

async function listEquipment(params = {}) {
  return request(api.get('/equipment', { params }));
}

async function getFeatured() {
  return request(api.get('/equipment/featured'));
}

async function getCategories() {
  return request(api.get('/equipment/categories'));
}

async function getEquipment(id) {
  return request(api.get(`/equipment/${id}`));
}

async function getStats() {
  return request(api.get('/stats/public'));
}

async function listFavorites(params = {}) {
  return request(api.get('/favorites', { params }));
}

async function getFavoriteIds() {
  return request(api.get('/favorites/ids'));
}

async function addFavorite(id) {
  return request(api.post('/favorites', { equipmentId: id }));
}

async function removeFavorite(id) {
  return request(api.delete(`/favorites/${id}`));
}

async function createBooking(body) {
  return request(api.post('/bookings', body));
}

// Returns { url } exactly as 02 §5 specifies (not wrapped in { data }).
async function createCheckout(bookingId) {
  return request(api.post('/payments/checkout', { bookingId }));
}

async function confirmPayment(sessionId) {
  return request(api.post('/payments/confirm', { sessionId }));
}

async function myBookings(params = {}) {
  return request(api.get('/bookings/mine', { params }));
}

async function ownerBookings(params = {}) {
  return request(api.get('/bookings/owner', { params }));
}

async function adminBookings(params = {}) {
  return request(api.get('/admin/bookings', { params }));
}

async function updateBookingStatus(id, status) {
  return request(api.patch(`/admin/bookings/${id}/status`, { status }));
}

async function myEquipment(params = {}) {
  return request(api.get('/equipment/mine/list', { params }));
}

async function createEquipment(body) {
  return request(api.post('/equipment', body));
}

async function updateEquipment(id, body) {
  return request(api.patch(`/equipment/${id}`, body));
}

async function deleteEquipment(id) {
  return request(api.delete(`/equipment/${id}`));
}

async function adminEquipment(params = {}) {
  return request(api.get('/admin/equipment', { params }));
}

async function updateEquipmentStatus(id, status) {
  return request(api.patch(`/admin/equipment/${id}/status`, { status }));
}

async function adminUsers(params = {}) {
  return request(api.get('/admin/users', { params }));
}

async function updateRole(id, role) {
  return request(api.patch(`/admin/users/${id}/role`, { role }));
}

async function deleteUser(id) {
  return request(api.delete(`/admin/users/${id}`));
}

async function adminAnalytics() {
  return request(api.get('/analytics/admin'));
}

async function ownerAnalytics() {
  return request(api.get('/analytics/owner'));
}

async function getMe() {
  return request(api.get('/users/me'));
}

async function updateMe(body) {
  return request(api.patch('/users/me', body));
}

export const apiSource = {
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
  createCheckout,
  confirmPayment,
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
