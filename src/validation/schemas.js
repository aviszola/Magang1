import { z } from 'zod';

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama Department wajib diisi')
    .min(3, 'Minimal 3 karakter'),
  code: z
    .string()
    .trim()
    .min(1, 'Kode Department wajib diisi')
    .regex(/^[A-Z0-9_-]+$/, 'Hanya huruf besar, angka, tanda hubung ( - _ )'),
  status: z.string().min(1, 'Pilih Status'),
});

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama Role wajib diisi')
    .min(3, 'Minimal 3 karakter'),
  description: z.string().trim().optional().default(''),
  status: z.string().min(1, 'Pilih Status'),
});

export const vehicleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama Alat wajib diisi')
    .min(3, 'Minimal 3 karakter'),
  brand: z.string().trim().optional().default(''),
  type: z.string().trim().optional().default(''),
  plate_number: z.string().trim().optional().default(''),
  status: z.string().min(1, 'Pilih Status'),
});

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama User wajib diisi')
    .min(3, 'Minimal 3 karakter'),
  code: z.string().trim().optional().default(''),
  department_id: z.string().uuid().nullable().optional(),
  role_id: z.string().uuid().nullable().optional(),
  vehicle_id: z.string().uuid().nullable().optional(),
  status: z.string().min(1, 'Pilih Status'),
});
