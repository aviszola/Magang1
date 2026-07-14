import { fetchGetData, fetchPostData, fetchPatchData, fetchDeleteData } from '../api/useApi';

const ENDPOINT = '/items/mt_user_profile';

export function useUsers() {
  return fetchGetData(ENDPOINT, {
    params: { fields: '*.*' },
  });
}

export const useCreateUser = () => fetchPostData(ENDPOINT);
export const useUpdateUser = () => fetchPatchData(ENDPOINT);
export const useDeleteUser = () => fetchDeleteData(ENDPOINT);
