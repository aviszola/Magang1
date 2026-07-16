import { useState } from 'react';
import { getDepartments, deleteDepartment } from '../../hooks/useDepartment';
import DataTable from '../../common/DataTable';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';

const COLUMNS = [
  {
    key: 'departmentId',
    label: 'ID Number',
    render: (row) => row.departmentId ?? '-',
  },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

export default function DepartmentList({ search, onSearchChange, onAdd, onEdit }) {
  const { data: depts, isLoading, isError, error } = getDepartments();
  const deleteMutation = deleteDepartment();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // Map API response ke row model tabel
  const rows = (depts || []).map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    departmentId: d.department_level?.id_number ?? '-',
    status: d.status,
    // Simpan object relasi utuh untuk form edit
    _department_level: d.department_level,
  }));

  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.departmentId?.toLowerCase().includes(q) ||
      r.code?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q)
    );
  });

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onError: (err) => {
        setDeleteError(
          err.response?.data?.errors?.[0]?.message ?? 'Gagal menghapus department'
        );
      },
      onSuccess: () => {
        setDeleteTarget(null);
        setDeleteError('');
        setDeleteSuccess('Department berhasil dihapus!');
        setTimeout(() => setDeleteSuccess(''), 3000);
      },
    });
  }

  return (
    <div className="dept-list">
      <div className="list-header">
        <h2>Daftar Department ({filtered.length})</h2>
        <button className="btn-add" onClick={onAdd}>+ Tambah</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari department..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {deleteError && <p className="error-msg" style={{ marginBottom: '0.75rem' }}>{deleteError}</p>}
      {deleteSuccess && <p className="success-msg" style={{ marginBottom: '0.75rem' }}>{deleteSuccess}</p>}

      <DataTable
        columns={COLUMNS}
        data={filtered}
        loading={isLoading}
        error={isError ? error : null}
        searchQuery={search}
        emptyMessage="Belum ada department."
        onEdit={onEdit}
        onDeleteClick={(id) => { setDeleteTarget(id); setDeleteError(''); }}
        deleteLoading={deleteMutation.isPending}
      />

      {deleteTarget && (
        <ConfirmDialog
          message="Yakin hapus department ini?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
