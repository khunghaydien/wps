import React, { useMemo } from 'react';

import MultiSelect from './MultiSelect';
import SingleSelect from './SingleSelect';

type Props = Readonly<{
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  disableReset?: boolean; // disable reset value when value not in the options
  onChange: (value: string | ReadonlyArray<string>) => void;
}>;

const Select = ({ multiple = false, ...props }: Props) => {
  const Select = useMemo(() => {
    return multiple ? MultiSelect : SingleSelect;
  }, [multiple]);

  return <Select {...props} />;
};

export default Select;
