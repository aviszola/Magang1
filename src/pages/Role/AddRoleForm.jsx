import { useCreateRole, useUpdateRole } from '../../hooks/useRoles';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { roleSchema } from '../../validation/schemas';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

export default function AddRoleForm({ editItem, onSuccess }) {
  const isEditing = !!editItem;
  const fs = useFormSubmit({
    schema: roleSchema,
    initial: {
      name: editItem?.name ?? '',
      description: editItem?.description ?? '',
      status: editItem?.status ?? 'draft',
    },
  });

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fs.validate()) return;

    const payload = {
      name: fs.form.name.trim(),
      description: fs.form.description.trim(),
      status: fs.form.status,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, ...payload });
        fs.handleSuccess('Role berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        fs.handleSuccess('Role berhasil ditambahkan!');
      }
      fs.resetForm();
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      fs.handleError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form" noValidate>
      <h2>{isEditing ? 'Edit Role' : 'Tambah Role'}</h2>

      <div className={`field ${fs.errors.name ? 'field-error' : ''}`}>
        <label htmlFor="role-name">Nama Role *</label>
        <input
          id="role-name"
          type="text"
          value={fs.form.name}
          onChange={(e) => fs.setField('name', e.target.value)}
          placeholder="e.g. Admin"
        />
        {fs.errors.name && <span className="field-err">{fs.errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="role-desc">Deskripsi</label>
        <input
          id="role-desc"
          type="text"
          value={fs.form.description}
          onChange={(e) => fs.setField('description', e.target.value)}
          placeholder="e.g. Administrator sistem"
        />
      </div>

      <div className={`field ${fs.errors.status ? 'field-error' : ''}`}>
        <label htmlFor="role-status">Status *</label>
        <div className="custom-select">
          <select
            id="role-status"
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
