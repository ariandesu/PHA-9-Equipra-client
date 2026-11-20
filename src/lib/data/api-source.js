import api from '@/lib/api';

export async function getEquipment(params = {}) {
  const res = await api.get('/equipment', { params });
  return res.data;
}

export async function getEquipmentById(id) {
  const res = await api.get(`/equipment/${id}`);
  return res.data;
}

export async function getFeatured() {
  const res = await api.get('/equipment/featured');
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/equipment/categories');
  return res.data;
}

export async function getStats() {
  const res = await api.get('/stats/public');
  return res.data;
}

export async function getFavorites() {
  const res = await api.get('/favorites');
  return res.data;
}

export async function getFavoriteIds() {
  const res = await api.get('/favorites/ids');
  return res.data;
}

export async function toggleFavorite(equipmentId) {
  const res = await api.post(`/favorites/${equipmentId}`);
  return res.data;
}

export async function createBooking(data) {
  const res = await api.post('/bookings', data);
  return res.data;
}

export async function getMe() {
  const res = await api.get('/users/me');
  return res.data;
}

export async function updateMe(data) {
  const res = await api.patch('/users/me', data);
  return res.data;
}

export async function createEquipment(data) {
  const res = await api.post('/equipment', data);
  return res.data;
}

export async function updateEquipment(id, data) {
  const res = await api.patch(`/equipment/${id}`, data);
  return res.data;
}

export async function deleteEquipment(id) {
  const res = await api.delete(`/equipment/${id}`);
  return res.data;
}

export async function getMyEquipment() {
  const res = await api.get('/equipment/mine/list');
  return res.data;
}

export async function getMyEquipmentRentals() {
  const res = await api.get('/bookings/owner');
  return res.data;
}

export async function getMyRentals() {
  const res = await api.get('/bookings/mine');
  return res.data;
}

export async function getAllEquipment() {
  const res = await api.get('/admin/equipment');
  return res.data;
}

export async function updateEquipmentStatus(id, status) {
  const res = await api.patch(`/admin/equipment/${id}/status`, { status });
  return res.data;
}

export async function getAllUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}

export async function updateUserRole(id, role) {
  const res = await api.patch(`/admin/users/${id}/role`, { role });
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
}

export async function getAdminBookings() {
  const res = await api.get('/admin/bookings');
  return res.data;
}

export async function getOwnerBookings() {
  const res = await api.get('/bookings/owner');
  return res.data;
}

export async function updateBookingStatus(id, status) {
  const res = await api.patch(`/admin/bookings/${id}/status`, { status });
  return res.data;
}

export async function getAnalytics(isAdmin = false) {
  const res = await api.get(isAdmin ? '/analytics/admin' : '/analytics/owner');
  return res.data;
}
