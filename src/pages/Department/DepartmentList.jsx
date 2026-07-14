import { useState, useMemo } from 'react';
import { useDepartments, useDeleteDepartment } from '../../hooks/useDepartments';
import DataTable from '../../common/DataTable';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';

const COLUMNS = [
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama Department' },
];

export default function DepartmentList({ search, onSearchChange, onAdd, onEdit }) {
  const { data: depts, isLoading, isError, error } = useDepartments();
  const deleteMutation = useDeleteDepartment();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const filtered = useMemo(() => {
    if (!depts) return [];
    if (!search.trim()) return depts;
    const q = search.toLowerCase();
    return depts.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.status?.toLowerCase().includes(q)
    );
  }, [depts, search]);

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
