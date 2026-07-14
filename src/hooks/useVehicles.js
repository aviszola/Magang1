import { fetchGetData, fetchPostData, fetchPatchData, fetchDeleteData } from '../api/useApi';

const ENDPOINT = '/items/mt_vehicle';

export function useVehicles() {
  return fetchGetData(ENDPOINT);
}

export const useCreateVehicle = () => fetchPostData(ENDPOINT);
export const useUpdateVehicle = () => fetchPatchData(ENDPOINT);
export const useDeleteVehicle = () => fetchDeleteData(ENDPOINT);
