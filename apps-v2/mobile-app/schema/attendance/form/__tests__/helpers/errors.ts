import { AnyObjectSchema, ValidationError } from 'yup';

export const create =
  (schema: () => AnyObjectSchema) =>
  (data: unknown): Promise<unknown> =>
    schema()
      .validate(data, {
        abortEarly: false,
      })
      .then(() => true)
      .catch((err) => {
        if (err instanceof ValidationError) {
          throw convert(err);
        } else {
          throw err;
        }
      });

export const convert = (err: ValidationError): { [name: string]: string[] } =>
  err.inner.reduce(
    (acc, e) => ({
      ...acc,
      [e.path]: e.errors,
    }),
    {}
  );
