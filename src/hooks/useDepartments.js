import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const DEPT_KEY = ['departments'];

async function fetchDepartments() {
  const { data } = await api.get('/items/mt_department');
  return data.data;
}

async function createDepartment(payload) {
  const { data } = await api.post('/items/mt_department', payload);
  return data.data;
}

async function updateDepartment({ id, ...payload }) {
  const { data } = await api.patch(`/items/mt_department/${id}`, payload);
  return data.data;
}

async function deleteDepartment(id) {
  await api.delete(`/items/mt_department/${id}`);
}

export function useDepartments() {
  return useQuery({ queryKey: DEPT_KEY, queryFn: fetchDepartments });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/items/mt_department', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPT_KEY }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPT_KEY }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPT_KEY }),
  });
}