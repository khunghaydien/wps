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
  helpMsg?: string;
  alignTooltip?: string;
  icon?: React.ReactNode;
} & TextFieldProps;

const StyledTextField = styled(TextField)`
  margin: 4px 0;
  &[type='number'] {
    padding-right: 0;
  }
`;

const TextFieldWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledDisabledTextField = styled.div`
  margin: 4px 0;
  background-color: #ecebea;
  border: 1px solid #dddbda;
  border-radius: 0.25rem;
  width: 100%;
  transition: border 0.1s linear, background-color 0.1s linear;
  display: inline-block;
  padding: 0 1rem 0 0.75rem;
  line-height: 1.875rem;
  height: calc(1.875rem + 2px);
  overflow: auto;
  color: #000;
  word-break: break-word;
`;

const Component = (props: Props) => {
  const { label, ...rest } = props;
  return (
    <>
      <Label
        text={label}
        required={rest.required}
        helpMsg={props.helpMsg}
        alignTooltip={props.alignTooltip}
      />
      <TextFieldWrapper>
        {props.disabled ? (
          <StyledDisabledTextField>{props.value}</StyledDisabledTextField>
        ) : (
          <StyledTextField {...rest} isRequired={rest.required} />
        )}
        {props.icon}
      </TextFieldWrapper>
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
