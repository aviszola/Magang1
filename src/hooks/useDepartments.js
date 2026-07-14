import { fetchGetData, fetchPostData, fetchPatchData, fetchDeleteData } from '../api/useApi';

const ENDPOINT = '/items/mt_department';

export function useDepartments() {
  return fetchGetData(ENDPOINT);
}

export const useCreateDepartment = () => fetchPostData(ENDPOINT);
export const useUpdateDepartment = () => fetchPatchData(ENDPOINT);
export const useDeleteDepartment = () => fetchDeleteData(ENDPOINT);