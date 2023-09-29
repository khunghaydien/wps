import React from 'react';

import styled from 'styled-components';

import TextField, {
  Props as TextFieldProps,
} from '@apps/commons/components/fields/TextField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error?: string;
  name?: string;
  required?: boolean;
} & TextFieldProps;

const StyledTextField = styled(TextField)`
  margin: 4px 0;
  &[type='number'] {
    padding-right: 0;
  }
`;

const Component = (props: Props) => {
  const { label, ...rest } = props;
  return (
    <>
      <Label text={label} required={rest.required} />
      <StyledTextField {...rest} isRequired={rest.required} />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
