export type LabelProps = {
  label: string;
  error?: string;
};

export type RadioOptions = {
  label: string;
  value: string;
};

export type Props = Readonly<{
  label: LabelProps;
  onChange: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  options: Array<RadioOptions>;
  value: string;
}>;
