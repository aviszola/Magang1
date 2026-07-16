import { useState } from 'react';

/**
 * Hook reusable untuk form CRUD.
 * Menangani state form, validasi Zod, error/success message.
 *
 * @param {object} options
 * @param {import('zod').ZodSchema} options.schema   — Zod schema untuk validasi
 * @param {object} options.initial                   — nilai awal form
 */
export function useCrudForm({ schema, initial }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  /** Set nilai field, hapus error field yg bersangkutan */
  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
    if (successMsg) setSuccessMsg('');
  }

  /** Validasi form pakai Zod, return true/false */
  function validate() {
    const result = schema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const f = issue.path[0];
      if (!fieldErrors[f]) fieldErrors[f] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  /** Reset form ke nilai awal */
  function resetForm() {
    setForm(initial);
    setErrors({});
    setServerError('');
    setSuccessMsg('');
  }

  function handleSuccess(msg) {
    setSuccessMsg(msg);
    setServerError('');
  }

  function handleError(err) {
    setServerError(
      err.response?.data?.errors?.[0]?.message ?? err.message ?? 'Gagal menyimpan data',
    );
  }

  return {
    form,
    errors,
    serverError,
    successMsg,
    setField,
    validate,
    resetForm,
    handleSuccess,
    handleError,
  };
}
