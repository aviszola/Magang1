import { useState } from 'react';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments';

const TIPE_DEPARTMENT = ['Teknis', 'Non-Teknis', 'Manajemen'];

export default function AddDepartmentForm({ editItem, onCancelEdit }) {
  const [nama, setNama] = useState(editItem?.name ?? '');
  const [tipe, setTipe] = useState('Teknis');
  const [error, setError] = useState('');

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const isEditing = !!editItem;
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama Department wajib diisi');
      return;
    }
    setError('');

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, name: nama.trim() });
      } else {
        await createMutation.mutateAsync({ name: nama.trim() });
      }
      setNama('');
      setTipe('Teknis');
      onCancelEdit?.();
    } catch {
      setError('Gagal menyimpan data');
    }
  }

  function handleCancel() {
    setNama('');
    setTipe('Teknis');
    setError('');
    onCancelEdit?.();
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form">
      <h2>{isEditing ? 'Edit Department' : 'Tambah Department'}</h2>

      <div className="field">
        <label htmlFor="nama-department">Nama Department *</label>
        <input
          id="nama-department"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama department"
        />
      </div>

      <div className="field">
        <label htmlFor="tipe-department">Tipe Department</label>
        <div className="custom-select">
          <select
            id="tipe-department"
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
          >
            {TIPE_DEPARTMENT.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah'}
        </button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
