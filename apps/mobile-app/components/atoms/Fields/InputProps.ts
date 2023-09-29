/* eslint-disable import/prefer-default-export */

export type InputProps = Readonly<{
  name?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string | number;
  accept?: string;
  capture?: string;
  multiple?: boolean;
  onChange?: (arg0: React.SyntheticEvent<any>) => void;
  onBlur?:
    | ((arg0: number) => void)
    | ((arg0: React.SyntheticEvent<any>) => void);
  onKeyPress?: (arg0: React.SyntheticEvent<any>) => void;
  onFocus?: (arg0: React.SyntheticEvent<any>) => void;
}>;

export const mapPropsToInputProps = (
  props: Readonly<InputProps>
): InputProps => {
  return {
    name: props.name,
    autoFocus: props.autoFocus,
    disabled: props.disabled,
    max: props.max,
    maxLength: props.maxLength,
    min: props.min,
    minLength: props.minLength,
    placeholder: props.placeholder,
    required: props.required,
    readOnly: props.readOnly,
    value: props.value,
    onChange: props.onChange,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onKeyPress: props.onKeyPress,
    multiple: props.multiple,
  };
};

/* eslint-enable import/prefer-default-export */
