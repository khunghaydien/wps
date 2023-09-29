import React from 'react';

import { useFormikContext } from 'formik';

import DualList from '@commons/components/fields/DualList';
import msg from '@commons/languages';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  options: Array<any>;
  required?: boolean;
  value: string;
};

const Component = (props: Props) => {
  const { label, value, name, required } = props;
  const { setFieldValue } = useFormikContext();
  const handleChange = (selected: Array<string> = []) => {
    const formatted = selected.join(';');
    setFieldValue(name, formatted);
  };

  const selected = value ? value.split(';') : [];

  return (
    <>
      <Label text={label} required={required} />
      <div>
        <DualList
          headerLeft={msg().Com_Lbl_Available}
          headerRight={msg().Com_Lbl_Chosen}
          key={props.name}
          options={props.options}
          selected={selected}
          disabled={false}
          onChange={handleChange}
          noAllowOrder={true}
          //   required={props.required}
        />
      </div>
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
