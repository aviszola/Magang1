import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import api from './axios';

/** Directus query params — semua parameter yang didukung oleh Directus API */
export interface DirectusQueryParams {
  /** Field selection, e.g. '*.*' or ['id','name','status'] */
  fields?: string | string[];
  /** Filter object, e.g. { status: { _eq: 'active' } } */
  filter?: Record<string, unknown>;
  /** Sort field(s), prefix '-' for descending, e.g. '-date_created' */
  sort?: string | string[];
  /** Max items to return */
  limit?: number;
  /** Items to skip (for pagination) */
  offset?: number;
  /** Full-text search query */
  search?: string;
  /** Metadata request, e.g. 'total_count' or '*' */
  meta?: string | Record<string, unknown>;
  /** Page number (alternative to offset) */
  page?: number;
  /** Deep filter for nested relations */
  deep?: Record<string, unknown>;
  /** Aggregate functions */
  aggregate?: Record<string, unknown>;
  /** Group by fields */
  groupBy?: string | string[];
  /** Custom query params */
  [key: string]: unknown;
}

/**
 * GET data — hook untuk query.
 *
 * @example
 * const { data } = fetchGetData('/items/mt_department');
 * const { data } = fetchGetData('/items/mt_user', { fields: '*.*', filter: { status: { _eq: 'active' } } });
 */
export function fetchGetData<T = unknown>(
  endpoint: string,
  queryParams: DirectusQueryParams = {},
  options?: Partial<UseQueryOptions<T>>
): UseQueryResult<T> {
  const queryKey = options?.queryKey ?? [endpoint, queryParams];
  return useQuery({
    queryKey,
    queryFn: () =>
      api
        .get(endpoint, {
          params: queryParams,
          // Serialize array values (fields, sort) jadi comma-separated string
          // agar Directus bisa expand relation. Axios default serialize array
          // sbg ?fields[]=*&fields[]=... yang tidak dikenali Directus.
          paramsSerializer: {
            serialize: (params) => {
              const parts: string[] = [];
              for (const key of Object.keys(params)) {
                const value = params[key];
                if (value === undefined || value === null) continue;
                if (Array.isArray(value)) {
                  // fields: ['*', 'a.b'] → fields=*,a.b
                  parts.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`
                  );
                } else if (typeof value === 'object') {
                  // filter, deep — JSON.stringify
                  parts.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
                  );
                } else {
                  parts.push(
                    `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
                  );
                }
              }
              return parts.join('&');
            },
          },
        })
        .then((r) => r.data.data as T),
    ...options,
  });
}

/**
 * POST data — mutation untuk create.
 * Auto-invalidate queryKey sesuai endpoint setelah sukses.
 */
export function fetchPostData(endpoint: string) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post(endpoint, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

/**
 * PATCH data — mutation untuk update.
 * Menerima { id, ...payload }.
 */
export function fetchPatchData(endpoint: string) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string | number } & Record<string, unknown>) =>
      api.patch(`${endpoint}/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

/**
 * DELETE data — mutation untuk hapus.
 */
export function fetchDeleteData(endpoint: string) {
  const qc = useQueryClient();
  const queryKey = [endpoint];
  return useMutation({
    mutationFn: (id: string | number) => api.delete(`${endpoint}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}
