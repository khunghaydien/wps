/* eslint-disable import/prefer-default-export */

export type SelectProps = Readonly<{
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  multiple?: boolean;
  size?: number;
  onChange?: (arg0: React.SyntheticEvent<HTMLSelectElement>) => void;
}>;

export const mapPropsToSelectProps = (
  props: Readonly<SelectProps>
): SelectProps => {
  return {
    autoFocus: props.autoFocus,
    disabled: props.disabled,
    required: props.required,
    readOnly: props.readOnly,
    multiple: props.multiple,
    size: props.size,
    onChange: props.onChange,
  };
};

/* eslint-enable import/prefer-default-export */
