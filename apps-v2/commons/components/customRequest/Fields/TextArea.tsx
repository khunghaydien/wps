import React from 'react';

import { useFormikContext } from 'formik';
import get from 'lodash/get';

import { TextField } from '@apps/core';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error?: string;
  name?: string;
  required?: boolean;
  value: string;
  readOnly?: boolean;
  helpMsg?: string;
};

const Component = (props: Props) => {
  const setFieldValue = get(useFormikContext(), 'setFieldValue');

  const { label, value, required, error, name, readOnly } = props;
  return (
    <>
      <Label text={label} required={required} helpMsg={props.helpMsg} />
      <TextField
        required={required}
        name={name}
        resize="vertical"
        maxRows={3}
        minRows={3}
        value={value}
        onChange={(e) => {
          setFieldValue(props.name, e.currentTarget.value);
        }}
        readOnly={readOnly}
      />
      {props.error && <Error text={error} />}
    </>
  );
};

export default Component;
