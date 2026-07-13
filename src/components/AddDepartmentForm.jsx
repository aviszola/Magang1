import { useState } from 'react';
import { useCreateDepartment, useUpdateDepartment } from '../hooks/useDepartments';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

const INITIAL = { name: '', code: '', status: 'draft' };

export default function AddDepartmentForm({ editItem, onCancelEdit }) {
  const [form, setForm] = useState(() => ({
    name: editItem?.name ?? '',
    code: editItem?.code ?? '',
    status: editItem?.status ?? 'draft',
  }));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const isEditing = !!editItem;
  const isPending = createMutation.isPending || updateMutation.isPending;

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama Department wajib diisi';
    else if (form.name.trim().length < 3) errs.name = 'Minimal 3 karakter';
    if (!form.code.trim()) errs.code = 'Kode Department wajib diisi';
    else if (!/^[A-Z0-9_-]+$/.test(form.code.trim()))
      errs.code = 'Hanya huruf besar, angka, tanda hubung ( - _ )';
    if (!form.status) errs.status = 'Status harus dipilih';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      status: form.status,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setForm(INITIAL);
      setErrors({});
      onCancelEdit?.();
    } catch (err) {
      setServerError(
        err.response?.data?.errors?.[0]?.message ?? 'Gagal menyimpan data'
      );
    }
  }

  function handleCancel() {
    setForm(INITIAL);
    setErrors({});
    setServerError('');
    onCancelEdit?.();
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form" noValidate>
      <h2>{isEditing ? 'Edit Department' : 'Tambah Department'}</h2>
      {isEditing && (
        <p className="edit-indicator">
          Sedang mengedit: <strong>{editItem.name}</strong>
        </p>
      )}

      <div className={`field ${errors.name ? 'field-error' : ''}`}>
        <label htmlFor="dept-name">Nama Department *</label>
        <input
          id="dept-name"
          type="text"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="e.g. Gudang Pusat"
        />
        {errors.name && <span className="field-err">{errors.name}</span>}
      </div>

      <div className={`field ${errors.code ? 'field-error' : ''}`}>
        <label htmlFor="dept-code">Kode Department *</label>
        <input
          id="dept-code"
          type="text"
          value={form.code}
          onChange={(e) => setField('code', e.target.value.toUpperCase())}
          placeholder="e.g. DPT-GUDANG"
        />
        {errors.code && <span className="field-err">{errors.code}</span>}
      </div>

      <div className={`field ${errors.status ? 'field-error' : ''}`}>
        <label htmlFor="dept-status">Status *</label>
        <div className="custom-select">
          <select
            id="dept-status"
            value={form.status}
            onChange={(e) => setField('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {errors.status && <span className="field-err">{errors.status}</span>}
      </div>

      {serverError && <p className="error-msg">{serverError}</p>}

      <div className="form-actions">
        <button type="submit" disabled={isPending}>
          {isPending
            ? 'Menyimpan...'
            : isEditing
              ? 'Simpan Perubahan'
              : 'Tambah'}
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
