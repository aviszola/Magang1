import { useState, useMemo } from 'react';
import { useVehicles, useDeleteVehicle } from '../../hooks/useVehicles';
import DataTable from '../../common/DataTable';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';

const COLUMNS = [
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'name', label: 'Nama Alat' },
  { key: 'brand', label: 'Merek', render: (row) => row.brand || '-' },
  { key: 'type', label: 'Tipe', render: (row) => row.type || '-' },
  { key: 'plate_number', label: 'Plat', render: (row) => row.plate_number || '-' },
];

export default function VehicleList({ search, onSearchChange, onAdd, onEdit }) {
  const { data: vehicles, isLoading, isError, error } = useVehicles();
  const deleteMutation = useDeleteVehicle();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const filtered = useMemo(() => {
    if (!vehicles) return [];
    if (!search.trim()) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.brand?.toLowerCase().includes(q) ||
        v.type?.toLowerCase().includes(q) ||
        v.plate_number?.toLowerCase().includes(q) ||
        v.status?.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onError: (err) => {
        setDeleteError(
          err.response?.data?.errors?.[0]?.message ?? 'Gagal menghapus vehicle'
        );
      },
      onSuccess: () => {
        setDeleteTarget(null);
        setDeleteError('');
        setDeleteSuccess('Vehicle berhasil dihapus!');
        setTimeout(() => setDeleteSuccess(''), 3000);
      },
    });
  }

  return (
    <div className="dept-list">
      <div className="list-header">
        <h2>Daftar Vehicle ({filtered.length})</h2>
        <button className="btn-add" onClick={onAdd}>+ Tambah</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari vehicle..."
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
        emptyMessage="Belum ada vehicle."
        onEdit={onEdit}
        onDeleteClick={(id) => { setDeleteTarget(id); setDeleteError(''); }}
        deleteLoading={deleteMutation.isPending}
      />

      {deleteTarget && (
        <ConfirmDialog
          message="Yakin hapus vehicle ini?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
