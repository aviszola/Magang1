import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';

/**
 * GET data — hook untuk query.
 * Contoh: const { data, isLoading } = fetchGetData('/items/mt_department');
 */
export function fetchGetData(endpoint, options = {}) {
  const queryKey = options.queryKey ?? [endpoint];
  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint, { params: options.params }).then((r) => r.data.data),
    ...options,
  });
}

/**
 * POST data — mutation untuk create.
 * Auto-invalidate queryKey sesuai endpoint setelah sukses.
 */
export function fetchPostData(endpoint) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: (payload) => api.post(endpoint, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

/**
 * PATCH data — mutation untuk update.
 * Menerima { id, ...payload }.
 */
export function fetchPatchData(endpoint) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.patch(`${endpoint}/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

/**
 * DELETE data — mutation untuk hapus.
 */
export function fetchDeleteData(endpoint) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: (id) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}
