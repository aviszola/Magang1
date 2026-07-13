import { useDepartments, useDeleteDepartment } from '../hooks/useDepartments';

export default function DepartmentList({ onEdit }) {
  const { data: depts, isLoading, isError, error } = useDepartments();
  const deleteMutation = useDeleteDepartment();

  if (isLoading) return <p className="status-msg">Memuat data...</p>;
  if (isError) return <p className="status-msg error-msg">Gagal memuat: {error.message}</p>;

  async function handleDelete(id) {
    if (!confirm('Yakin hapus department ini?')) return;
    deleteMutation.mutate(id);
  }

  return (
    <div className="dept-list">
      <h2>Daftar Department ({depts?.length ?? 0})</h2>
      {!depts?.length ? (
        <p className="status-msg">Belum ada department.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Kode</th>
                <th>Nama Department</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {depts.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.status}</td>
                  <td><code className="dept-code">{dept.code}</code></td>
                  <td>{dept.name}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(dept)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(dept.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}