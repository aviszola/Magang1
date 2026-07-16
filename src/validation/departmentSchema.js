import { z } from 'zod';

/**
 * Schema validasi untuk form Department.
 * Mengikuti field real dari Directus:
 * - code : required, uppercase
 * - name : required, min 3
 * - department_level : required (UUID) — field relasi
 * - status : required — workflow status
 */
export const departmentSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Kode Department wajib diisi')
    .regex(/^[A-Z0-9_-]+$/, 'Hanya huruf besar, angka, tanda hubung ( - _ )'),
  name: z
    .string()
    .trim()
    .min(1, 'Nama Department wajib diisi')
    .min(3, 'Minimal 3 karakter'),
  department_level: z.string().uuid('Department Level wajib dipilih'),
  status: z.string().min(1, 'Status wajib dipilih'),
});
