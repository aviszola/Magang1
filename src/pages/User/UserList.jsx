import { useState, useMemo } from 'react';
import { useUsers, useDeleteUser } from '../../hooks/useUsers';
import DataTable from '../../common/DataTable';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';

const COLUMNS = [
  { key: 'name', label: 'Nama' },
  {
    key: 'department_id',
    label: 'Department',
    render: (row) => row.mt_department?.name || '-',
  },
  {
    key: 'role',
    label: 'Role',
    render: () => '-',
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
    render: () => '-',
  },
  { key: 'code', label: 'Kode' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

export default function UserList({ search, onSearchChange, onAdd, onEdit }) {
  const { data: users, isLoading, isError, error } = useUsers();
  const deleteMutation = useDeleteUser();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.code?.toLowerCase().includes(q) ||
        u.status?.toLowerCase().includes(q)
    );
  }, [users, search]);

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onError: (err) => {
        setDeleteError(
          err.response?.data?.errors?.[0]?.message ?? 'Gagal menghapus user'
        );
      },
      onSuccess: () => {
        setDeleteTarget(null);
        setDeleteError('');
        setDeleteSuccess('User berhasil dihapus!');
        setTimeout(() => setDeleteSuccess(''), 3000);
      },
    });
  }

  return (
    <div className="dept-list">
      <div className="list-header">
        <h2>Daftar User ({filtered.length})</h2>
        <button className="btn-add" onClick={onAdd}>+ Tambah</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari user..."
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
        emptyMessage="Belum ada user."
        onEdit={onEdit}
        onDeleteClick={(id) => { setDeleteTarget(id); setDeleteError(''); }}
        deleteLoading={deleteMutation.isPending}
      />

      {deleteTarget && (
        <ConfirmDialog
          message="Yakin hapus user ini?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
