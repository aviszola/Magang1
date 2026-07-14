import { fetchGetData, fetchPostData, fetchPatchData, fetchDeleteData } from '../api/useApi';

const ENDPOINT = '/items/mt_role';

export function useRoles() {
  return fetchGetData(ENDPOINT);
}

export const useCreateRole = () => fetchPostData(ENDPOINT);
export const useUpdateRole = () => fetchPatchData(ENDPOINT);
export const useDeleteRole = () => fetchDeleteData(ENDPOINT);
