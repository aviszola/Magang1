import { fetchGetData, fetchPostData, fetchPatchData, fetchDeleteData } from '../api/useApi';

const ENDPOINT = 'items/mt_department';

/**
 * GET daftar department dengan relasi department_level — satu request.
 * Response shape:
 * {
 *   id, code, name, is_active,
 *   department_level: { id, id_number, name }
 * }
 */
export function getDepartments() {
  return fetchGetData(ENDPOINT, {
    fields: ['*', 'department_level.id_number', 'department_level.name'],
  });
}

export function createDepartment() {
  return fetchPostData(ENDPOINT);
}

export function updateDepartment() {
  return fetchPatchData(ENDPOINT);
}

export function deleteDepartment() {
  return fetchDeleteData(ENDPOINT);
}

/**
 * GET department levels untuk dropdown form.
 * Masih diperlukan secara terpisah karena untuk form select bukan relasi.
 */
export function getDepartmentLevels() {
  return fetchGetData('items/mt_department_level');
}
