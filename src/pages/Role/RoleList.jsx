import { useState, useMemo } from 'react';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import DataTable from '../../common/DataTable';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';

const COLUMNS = [
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'name', label: 'Nama Role' },
  {
    key: 'description',
    label: 'Deskripsi',
    render: (row) => row.description || '-',
  },
];

export default function RoleList({ search, onSearchChange, onAdd, onEdit }) {
  const { data: roles, isLoading, isError, error } = useRoles();
  const deleteMutation = useDeleteRole();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const filtered = useMemo(() => {
    if (!roles) return [];
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
    );
  }, [roles, search]);

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onError: (err) => {
        setDeleteError(
          err.response?.data?.errors?.[0]?.message ?? 'Gagal menghapus role'
        );
      },
      onSuccess: () => {
        setDeleteTarget(null);
        setDeleteError('');
        setDeleteSuccess('Role berhasil dihapus!');
        setTimeout(() => setDeleteSuccess(''), 3000);
      },
    });
  }

  return (
    <div className="dept-list">
      <div className="list-header">
        <h2>Daftar Role ({filtered.length})</h2>
        <button className="btn-add" onClick={onAdd}>+ Tambah</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari role..."
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
        emptyMessage="Belum ada role."
        onEdit={onEdit}
        onDeleteClick={(id) => { setDeleteTarget(id); setDeleteError(''); }}
        deleteLoading={deleteMutation.isPending}
      />

      {deleteTarget && (
        <ConfirmDialog
          message="Yakin hapus role ini?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
