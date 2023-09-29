import React, { useCallback, useEffect, useMemo, useState } from 'react';

import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import SelectField from '../../../../commons/components/fields/SelectField';
import msg from '../../../../commons/languages';

type Props = Readonly<{
  disabled?: boolean;
  required?: boolean;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  disableReset?: boolean;
  onChange: (value: string | ReadonlyArray<string>) => void;
}>;

const useOptionsChanged = (
  nextOptions: ReadonlyArray<{ value: string; label: string }> = [],
  callback: (
    prev: ReadonlyArray<{ value: string; label: string }>,
    next: ReadonlyArray<{ value: string; label: string }>
  ) => void,
  deps: ReadonlyArray<any>
) => {
  const [prevOptions, setPrevOptions] = useState([]);
  useEffect(() => {
    // Comparison reference value works because options are always recreated on changed.
    if (!isEqual(prevOptions, nextOptions)) {
      callback(prevOptions, nextOptions);
      // @ts-ignore
      setPrevOptions(nextOptions);
    }
  }, [prevOptions, nextOptions, ...deps]);
};

const Select = ({
  disabled = false,
  required = false,
  value = '',
  options = [],
  onChange,
  disableReset = false,
}: Props) => {
  const onChangeHandler = useCallback(
    (e: React.SyntheticEvent<HTMLSelectElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );
  const defaultValue = '';
  const opts = useMemo(() => {
    const selected = options.find((option) => option.value === value);
    if (isNil(selected)) {
      const defaultOption = {
        text: msg().Admin_Lbl_PleaseSelect,
        value: defaultValue,
      };
      return [defaultOption, ...options];
    } else {
      return [...options];
    }
  }, [options, defaultValue, value]);
  useOptionsChanged(
    options,
    (prev, next) => {
      const isInitializing = prev.length <= 0 && next.length <= 0;

      // Clear value if a selected item is not found for single item select && resetting is not disabled.
      const found = opts.find((option) => option.value === value);
      if (!isInitializing && isNil(found) && value !== '' && !disableReset) {
        onChange('');
      }
    },
    [value, opts]
  );

  return (
    <SelectField
      onChange={onChangeHandler}
      disabled={disabled}
      options={opts}
      value={value || defaultValue}
      required={required}
      multiple={false}
      size={null}
    />
  );
};

export default Select;
