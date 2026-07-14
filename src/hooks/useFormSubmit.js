import { useState } from 'react';

/**
 * Hook untuk standarisasi form CRUD:
 * - state errors / serverError / successMsg
 * - setField (clear errors on change)
 * - validate terhadap Zod schema
 * - handler sukses/gagal
 *
 * Contoh:
 *   const form = useFormSubmit({ schema, initial: { name: '', status: 'draft' } });
 *   form.setField('name', 'xxx');
 *   form.validate(); // → true/false
 *   form.handleSuccess('Berhasil!');
 *   form.handleError(err);
 */
export function useFormSubmit({ schema, initial }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (serverError) setServerError('');
    if (successMsg) setSuccessMsg('');
  }

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
