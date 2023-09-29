import React from 'react';

import CheckBox from '@apps/core/elements/CheckBox';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  checked: boolean;
  required?: boolean;
  helpMsg?: string;
  alignTooltip?: string;
};

const Component = (props: Props) => {
  const { label, helpMsg, ...rest } = props;
  return (
    <>
      <Label
        text={label}
        required={rest.required}
        helpMsg={helpMsg}
        alignTooltip={props.alignTooltip}
      />
      <CheckBox {...rest} />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
