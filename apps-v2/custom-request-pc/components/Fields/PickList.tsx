import React from 'react';

import { useFormikContext } from 'formik';

import SelectField from '@apps/commons/components/fields/SelectField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  options: Array<{ value: string; text: string }>;
  required?: boolean;
  value: string;
};

const Component = (props: Props) => {
  const { label } = props;
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Label text={label} required={props.required} />
      <SelectField
        options={props.options}
        required={props.required}
        onChange={(e) => {
          setFieldValue(props.name, e.currentTarget.value);
        }}
        value={props.value}
      />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
