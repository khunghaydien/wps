import React from 'react';

import CheckBox from '../../../core/elements/CheckBox';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  checked: boolean;
  required?: boolean;
};

const Component = (props: Props) => {
  const { label, ...rest } = props;
  return (
    <>
      <Label text={label} required={rest.required} />
      <CheckBox {...rest} />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
