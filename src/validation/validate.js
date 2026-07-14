/**
 * Validate form data against a Zod schema.
 * Returns { success, errors } where errors maps field → message.
 */
export function validateWithZod(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, errors: {} };

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (!errors[field]) errors[field] = issue.message;
  }
  return { success: false, errors };
}
