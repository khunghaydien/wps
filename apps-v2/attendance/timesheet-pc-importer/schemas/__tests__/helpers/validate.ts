import { AnySchema, ValidationError } from 'yup';

export const create =
  (schema: AnySchema | (() => AnySchema)) =>
  (data: unknown): Promise<unknown> =>
    (typeof schema === 'function' ? schema() : schema)
      .validate(data, {
        abortEarly: false,
      })
      .then(() => null)
      .catch((err) => {
        if (err instanceof ValidationError) {
          return convert(err);
        } else {
          return err;
        }
      });

export const convert = (
  err: ValidationError
): { [name: string]: string[] } | string[] => {
  if (err.inner.every(({ path }) => !path)) {
    return err.errors;
  } else {
    return err.inner.reduce(
      (acc, e) => ({
        ...acc,
        [e.path]: e.errors,
      }),
      {}
    );
  }
};
