import { useCreateDepartment, useUpdateDepartment } from '../../hooks/useDepartments';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { departmentSchema } from '../../validation/schemas';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

export default function AddDepartmentForm({ editItem, onSuccess }) {
  const isEditing = !!editItem;
  const fs = useFormSubmit({
    schema: departmentSchema,
    initial: {
      name: editItem?.name ?? '',
      code: editItem?.code ?? '',
      status: editItem?.status ?? 'draft',
    },
  });

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fs.validate()) return;

    const payload = {
      name: fs.form.name.trim(),
      code: fs.form.code.trim().toUpperCase(),
      status: fs.form.status,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, ...payload });
        fs.handleSuccess('Department berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        fs.handleSuccess('Department berhasil ditambahkan!');
      }
      fs.resetForm();
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      fs.handleError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form" noValidate>
      <h2>{isEditing ? 'Edit Department' : 'Tambah Department'}</h2>

      <div className={`field ${fs.errors.name ? 'field-error' : ''}`}>
        <label htmlFor="dept-name">Nama Department *</label>
        <input
          id="dept-name"
          type="text"
          value={fs.form.name}
          onChange={(e) => fs.setField('name', e.target.value)}
          placeholder="e.g. Gudang Pusat"
        />
        {fs.errors.name && <span className="field-err">{fs.errors.name}</span>}
      </div>

      <div className={`field ${fs.errors.code ? 'field-error' : ''}`}>
        <label htmlFor="dept-code">Kode Department *</label>
        <input
          id="dept-code"
          type="text"
          value={fs.form.code}
          onChange={(e) => fs.setField('code', e.target.value.toUpperCase())}
          placeholder="e.g. DPT-GUDANG"
        />
        {fs.errors.code && <span className="field-err">{fs.errors.code}</span>}
      </div>

      <div className={`field ${fs.errors.status ? 'field-error' : ''}`}>
        <label htmlFor="dept-status">Status *</label>
        <div className="custom-select">
          <select
            id="dept-status"
            value={fs.form.status}
            onChange={(e) => fs.setField('status', e.target.value)}
          >
            <option value="" disabled>Pilih Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {fs.errors.status && <span className="field-err">{fs.errors.status}</span>}
      </div>

      {fs.successMsg && <p className="success-msg">{fs.successMsg}</p>}
      {fs.serverError && <p className="error-msg">{fs.serverError}</p>}

      <div className="form-actions">
        <button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah'}
        </button>
      </div>
    </form>
  );
}
