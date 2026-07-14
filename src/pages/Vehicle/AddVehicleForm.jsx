import { useCreateVehicle, useUpdateVehicle } from '../../hooks/useVehicles';
import { useFormSubmit } from '../../hooks/useFormSubmit';
import { vehicleSchema } from '../../validation/schemas';

const STATUS_OPTIONS = ['draft', 'published', 'active'];

export default function AddVehicleForm({ editItem, onSuccess }) {
  const isEditing = !!editItem;
  const fs = useFormSubmit({
    schema: vehicleSchema,
    initial: {
      name: editItem?.name ?? '',
      brand: editItem?.brand ?? '',
      type: editItem?.type ?? '',
      plate_number: editItem?.plate_number ?? '',
      status: editItem?.status ?? 'draft',
    },
  });

  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fs.validate()) return;

    const payload = {
      name: fs.form.name.trim(),
      brand: fs.form.brand.trim(),
      type: fs.form.type.trim(),
      plate_number: fs.form.plate_number.trim(),
      status: fs.form.status,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: editItem.id, ...payload });
        fs.handleSuccess('Vehicle berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        fs.handleSuccess('Vehicle berhasil ditambahkan!');
      }
      fs.resetForm();
      setTimeout(() => onSuccess?.(), 1500);
    } catch (err) {
      fs.handleError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="dept-form" noValidate>
      <h2>{isEditing ? 'Edit Vehicle' : 'Tambah Vehicle'}</h2>

      <div className={`field ${fs.errors.name ? 'field-error' : ''}`}>
        <label htmlFor="vehicle-name">Nama Alat *</label>
        <input
          id="vehicle-name"
          type="text"
          value={fs.form.name}
          onChange={(e) => fs.setField('name', e.target.value)}
          placeholder="e.g. Laptop Dell"
        />
        {fs.errors.name && <span className="field-err">{fs.errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="vehicle-brand">Merek</label>
        <input
          id="vehicle-brand"
          type="text"
          value={fs.form.brand}
          onChange={(e) => fs.setField('brand', e.target.value)}
          placeholder="e.g. Dell"
        />
      </div>

      <div className="field">
        <label htmlFor="vehicle-type">Tipe</label>
        <input
          id="vehicle-type"
          type="text"
          value={fs.form.type}
          onChange={(e) => fs.setField('type', e.target.value)}
          placeholder="e.g. Latitude 5540"
        />
      </div>

      <div className="field">
        <label htmlFor="vehicle-plate">Plat Nomor</label>
        <input
          id="vehicle-plate"
          type="text"
          value={fs.form.plate_number}
          onChange={(e) => fs.setField('plate_number', e.target.value)}
          placeholder="e.g. B 1234 XYZ"
        />
      </div>

      <div className={`field ${fs.errors.status ? 'field-error' : ''}`}>
        <label htmlFor="vehicle-status">Status *</label>
        <div className="custom-select">
          <select
            id="vehicle-status"
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
