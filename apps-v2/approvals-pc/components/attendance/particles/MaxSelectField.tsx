import React from 'react';

import SelectField from '@commons/components/fields/SelectField';

const MaxSelectField: React.FC<{
  value: number | null;
  onChange: (arg0: number | null) => void;
}> = ({ value, onChange }) => (
  <SelectField
    value={`${value}`}
    options={['10', '20', '30', '50', '70', '100'].map((value) => ({
      value,
      text: value,
    }))}
    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(Number(event.currentTarget.value));
    }}
  />
);

export default MaxSelectField;
