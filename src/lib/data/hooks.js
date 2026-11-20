import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { source } from './source.js';

// Equipment queries
export function useEquipment(params = {}) {
  return useQuery({
    queryKey: ['equipment', params],
    queryFn: () => source.getEquipment(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEquipmentById(id) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => source.getEquipmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeatured() {
  return useQuery({
    queryKey: ['featured'],
    queryFn: () => source.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => source.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => source.getStats(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => source.getFavorites(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFavoriteIds() {
  return useQuery({
    queryKey: ['favorite-ids'],
    queryFn: () => source.getFavoriteIds(),
    staleTime: 5 * 60 * 1000,
  });
}

// Mutation hooks
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipmentId }) => source.toggleFavorite(equipmentId),
    onMutate: async (equipmentId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previous = queryClient.getQueryData(['favorites']);
      queryClient.setQueryData(['favorites'], (old) => {
        if (!old) return old;
        return old.map((e) => {
          if (e.id === equipmentId) {
            return { ...e, quantity: e.quantity - 1 };
          }
          return e;
        });
      });
      return { previous };
    },
    onError: (err, equipmentId, context) => {
      queryClient.setQueryData(['favorites'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data) => source.createBooking(data),
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => source.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => source.updateEquipment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', id] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => source.deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useMyEquipment() {
  return useQuery({
    queryKey: ['my-equipment'],
    queryFn: () => source.getMyEquipment(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyEquipmentRentals() {
  return useQuery({
    queryKey: ['my-equipment-rentals'],
    queryFn: () => source.getMyEquipmentRentals(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyRentals() {
  return useQuery({
    queryKey: ['my-rentals'],
    queryFn: () => source.getMyRentals(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOwnerBookings() {
  return useQuery({
    queryKey: ['owner-bookings'],
    queryFn: () => source.getOwnerBookings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => source.getAdminBookings(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllEquipment() {
  return useQuery({
    queryKey: ['all-equipment'],
    queryFn: () => source.getAllEquipment(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => source.getAllUsers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalytics(isAdmin = false) {
  return useQuery({
    queryKey: ['analytics', isAdmin ? 'admin' : 'owner'],
    queryFn: () => source.getAnalytics(isAdmin),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateEquipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => source.updateEquipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-equipment'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => source.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => source.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => source.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => source.getMe(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => source.updateMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
    },
  });
}
