'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSource } from './api-source.js';
import { source } from './source.js';

const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

// Public catalog
export function useEquipmentList(params = {}) {
  return useQuery({
    queryKey: ['equipment', 'list', params],
    queryFn: () => source.listEquipment(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useEquipment(id) {
  return useQuery({
    queryKey: ['equipment', 'detail', id],
    queryFn: () => source.getEquipment(id),
    enabled: !!id,
    staleTime: FIVE_MINUTES,
  });
}

export function useFeatured() {
  return useQuery({
    queryKey: ['equipment', 'featured'],
    queryFn: () => source.getFeatured(),
    staleTime: FIVE_MINUTES,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['equipment', 'categories'],
    queryFn: () => source.getCategories(),
    staleTime: TEN_MINUTES,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => source.getStats(),
    staleTime: TEN_MINUTES,
  });
}

// Favorites
export function useFavorites(params = {}) {
  return useQuery({
    queryKey: ['favorites', 'list', params],
    queryFn: () => source.listFavorites(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useFavoriteIds() {
  return useQuery({
    queryKey: ['favorite-ids'],
    queryFn: () => source.getFavoriteIds(),
    staleTime: FIVE_MINUTES,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipmentId, favorited }) =>
      favorited
        ? source.removeFavorite(equipmentId)
        : source.addFavorite(equipmentId),
    onMutate: async ({ equipmentId, favorited }) => {
      await queryClient.cancelQueries({ queryKey: ['favorite-ids'] });
      const previous = queryClient.getQueryData(['favorite-ids']);
      queryClient.setQueryData(['favorite-ids'], (old) => {
        const ids = old?.data ?? [];
        return {
          ...old,
          data: favorited
            ? ids.filter((id) => id !== equipmentId)
            : [...ids, equipmentId],
        };
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['favorite-ids'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Bookings
export function useMyBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', 'mine', params],
    queryFn: () => source.myBookings(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useOwnerBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', 'owner', params],
    queryFn: () => source.ownerBookings(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useAdminBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', 'admin', params],
    queryFn: () => source.adminBookings(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => source.createBooking(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => source.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Equipment management
export function useMyEquipment(params = {}) {
  return useQuery({
    queryKey: ['equipment', 'mine', params],
    queryFn: () => source.myEquipment(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useAdminEquipment(params = {}) {
  return useQuery({
    queryKey: ['equipment', 'admin', params],
    queryFn: () => source.adminEquipment(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => source.createEquipment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }) => source.updateEquipment(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
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

export function useUpdateEquipmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => source.updateEquipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

// Admin users
export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => source.adminUsers(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => source.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => source.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// Analytics
export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'admin'],
    queryFn: () => source.adminAnalytics(),
    staleTime: FIVE_MINUTES,
  });
}

export function useOwnerAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'owner'],
    queryFn: () => source.ownerAnalytics(),
    staleTime: FIVE_MINUTES,
  });
}

// Profile — always the real endpoint, it already exists on the server.
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiSource.getMe(),
    staleTime: FIVE_MINUTES,
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => apiSource.updateMe(body),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
    },
  });
}
