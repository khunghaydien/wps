type ErrorName = 'ValueTextIsNull' | 'JobIsNull' | 'PrioritiesAreDuplicated';

class ValidationError extends Error {
  name: ErrorName;
  field: string | undefined;
  label: string | undefined;
  record: string | undefined;

  constructor(
    message: string,
    name: ErrorName,
    options?: { field?: string; label?: string; record?: string }
  ) {
    super(message);
    this.name = name;
    this.field = options?.field;
    this.label = options?.label;
    this.record = options?.record;
  }
}
export default ValidationError;
