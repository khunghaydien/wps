import React from 'react';

import { useFormikContext } from 'formik';

import styled from 'styled-components';

import DateField, {
  Props as DateFieldProps,
} from '@apps/commons/components/fields/DateField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  required?: boolean;
} & DateFieldProps;

const StyledDateField = styled(DateField)``;

const Component = (props: Props) => {
  const { setFieldValue } = useFormikContext();

  const { label, ...rest } = props;
  return (
    <>
      <Label text={label} required={rest.required} />
      <StyledDateField
        {...rest}
        onChange={(val) => {
          const YYDDMM = val.substring(0, 10);
          setFieldValue(props.name, YYDDMM);
        }}
      />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
