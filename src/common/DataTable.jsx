export default function DataTable({
  columns,
  data,
  keyField = 'id',
  loading,
  error,
  emptyMessage = 'Tidak ada data.',
  searchQuery,
  onEdit,
  deleteLoading,
  onDeleteClick,
}) {
  if (loading) return <p className="status-msg">Memuat data...</p>;
  if (error) return <p className="status-msg error-msg">Gagal memuat: {error.message}</p>;
  if (!data?.length) {
    return <p className="status-msg">{searchQuery ? 'Data tidak ditemukan.' : emptyMessage}</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : col.value ? col.value(row) : row[col.key] ?? '-'}
                </td>
              ))}
              <td className="actions">
                <button className="btn-edit" onClick={() => onEdit(row)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDeleteClick?.(row[keyField])}
                  disabled={deleteLoading}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
