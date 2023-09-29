/* eslint-disable import/prefer-default-export */

export type TextAreaProps = Readonly<{
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
  value?: string;
  onChange?: (arg0: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onFocus?: (arg0: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  onBlur?: (arg0: React.SyntheticEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}>;

export const mapPropsToTextAreaProps = (
  props: Readonly<TextAreaProps>
): TextAreaProps => {
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
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    rows: props.rows,
  };
};

/* eslint-enable import/prefer-default-export */
