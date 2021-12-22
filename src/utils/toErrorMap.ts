import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]): Record<string, string> =>
  errors.reduce((result, { field, message }) => ({ ...result, [field]: message }), {});
