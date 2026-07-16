import { createDepartment, updateDepartment } from '../../hooks/useDepartment';
import { getDepartmentLevels } from '../../hooks/useDepartment';
import { useCrudForm } from '../../hooks/useCrudForm';
import { departmentSchema } from '../../validation/departmentSchema';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

export default function DepartmentForm({ editItem, onSuccess }) {
  const isEditing = !!editItem;

  // editItem dapet dari mapping List — simpan department_level object utuh
  const level = editItem?.department_level || editItem?._department_level;

  const fs = useCrudForm({
    schema: departmentSchema,
    initial: {
      code: editItem?.code ?? '',
      name: editItem?.name ?? '',
      department_level: level?.id ?? '',
      status: editItem?.status ?? 'draft',
    },
  });

  const createMutation = createDepartment();
  const updateMutation = updateDepartment();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: levels } = getDepartmentLevels();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fs.validate()) return;

    const payload = {
      code: fs.form.code.trim().toUpperCase(),
      name: fs.form.name.trim(),
      department_level: fs.form.department_level || null,
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

      <div className={`field ${fs.errors.department_level ? 'field-error' : ''}`}>
        <label htmlFor="dept-level">Department Level *</label>
        <div className="custom-select">
          <select
            id="dept-level"
            value={fs.form.department_level}
            onChange={(e) => fs.setField('department_level', e.target.value)}
          >
            <option value="">-- Pilih Level --</option>
            {(levels || []).map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.id_number} - {lvl.name}
              </option>
            ))}
          </select>
        </div>
        {fs.errors.department_level && (
          <span className="field-err">{fs.errors.department_level}</span>
        )}
      </div>

      <div className={`field ${fs.errors.code ? 'field-error' : ''}`}>
        <label htmlFor="dept-code">Code *</label>
        <input
          id="dept-code"
          type="text"
          value={fs.form.code}
          onChange={(e) => fs.setField('code', e.target.value.toUpperCase())}
          placeholder="e.g. DPT-PURCHASE"
        />
        {fs.errors.code && <span className="field-err">{fs.errors.code}</span>}
      </div>

      <div className={`field ${fs.errors.name ? 'field-error' : ''}`}>
        <label htmlFor="dept-name">Name *</label>
        <input
          id="dept-name"
          type="text"
          value={fs.form.name}
          onChange={(e) => fs.setField('name', e.target.value)}
          placeholder="e.g. Purchasing"
        />
        {fs.errors.name && <span className="field-err">{fs.errors.name}</span>}
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
