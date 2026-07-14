import { useCreateUser, useUpdateUser } from '../../hooks/useUsers';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import { useVehicles } from '../../hooks/useVehicles';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { userSchema } from '../../validation/schemas';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

export default function UserForm({ editItem, onSuccess }) {
  const isEditing = !!editItem;
  const fs = useFormSubmit({
    schema: userSchema,
    initial: {
      name: editItem?.name ?? '',
      code: editItem?.code ?? '',
      department_id: editItem?.department_id ?? null,
      role_id: editItem?.role_id ?? null,
      vehicle_id: editItem?.vehicle_id ?? null,
      status: editItem?.status ?? 'draft',
    },
  });

  const { data: departments } = useDepartments();
  const { data: roles } = useRoles();
  const { data: vehicles } = useVehicles();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fs.validate()) return;

    const payload = {
      name: fs.form.name.trim(),
      code: fs.form.code.trim(),
      department_id: fs.form.department_id || null,
      status: fs.form.status,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, ...payload });
        fs.handleSuccess('User berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        fs.handleSuccess('User berhasil ditambahkan!');
      }
      fs.resetForm();
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      fs.handleError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form" noValidate>
      <h2>{isEditing ? 'Edit User' : 'Tambah User'}</h2>

      <div className={`field ${fs.errors.name ? 'field-error' : ''}`}>
        <label htmlFor="user-name">Nama User *</label>
        <input
          id="user-name"
          type="text"
          value={fs.form.name}
          onChange={(e) => fs.setField('name', e.target.value)}
          placeholder="e.g. John Doe"
        />
        {fs.errors.name && <span className="field-err">{fs.errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="user-code">Kode User</label>
        <input
          id="user-code"
          type="text"
          value={fs.form.code}
          onChange={(e) => fs.setField('code', e.target.value)}
          placeholder="e.g. USR-001"
        />
      </div>

      <div className={`field ${fs.errors.department_id ? 'field-error' : ''}`}>
        <label htmlFor="user-department">Department</label>
        <div className="custom-select">
          <select
            id="user-department"
            value={fs.form.department_id || ''}
            onChange={(e) => fs.setField('department_id', e.target.value || null)}
          >
            <option value="">-- Pilih Department --</option>
            {(departments || []).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="user-role">Role</label>
        <div className="custom-select">
          <select
            id="user-role"
            value={fs.form.role_id || ''}
            onChange={(e) => fs.setField('role_id', e.target.value || null)}
          >
            <option value="">-- Pilih Role --</option>
            {(roles || []).map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="user-vehicle">Vehicle</label>
        <div className="custom-select">
          <select
            id="user-vehicle"
            value={fs.form.vehicle_id || ''}
            onChange={(e) => fs.setField('vehicle_id', e.target.value || null)}
          >
            <option value="">-- Pilih Vehicle --</option>
            {(vehicles || []).map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`field ${fs.errors.status ? 'field-error' : ''}`}>
        <label htmlFor="user-status">Status *</label>
        <div className="custom-select">
          <select
            id="user-status"
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
