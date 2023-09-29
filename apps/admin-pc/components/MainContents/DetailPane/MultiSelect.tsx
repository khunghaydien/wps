import React, { useCallback } from 'react';

import SelectField from '../../../../commons/components/fields/SelectField';

type Props = Readonly<{
  disabled?: boolean;
  required?: boolean;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string | ReadonlyArray<string>) => void;
}>;

const MultiSelect = ({
  disabled = false,
  required = false,
  value = '',
  options = [],
  onChange,
}: Props) => {
  const onChangeHandler = useCallback(
    (e: React.SyntheticEvent<HTMLSelectElement>) => {
      const values = [].filter
        .call(e.currentTarget.options, (o) => {
          return o.selected;
        })
        .map((o) => {
          return o.value;
        });
      onChange(values);
    },
    [onChange]
  );
  const defaultValue = [];

  return (
    <SelectField
      multiple
      onChange={onChangeHandler}
      disabled={disabled}
      // @ts-ignore
      options={options}
      value={value || defaultValue}
      required={required}
      size={options.length}
    />
  );
};

export default MultiSelect;
