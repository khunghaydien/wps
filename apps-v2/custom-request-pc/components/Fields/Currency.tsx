import React from 'react';

import { useFormikContext } from 'formik';
import get from 'lodash/get';

import styled from 'styled-components';

import AmountField, {
  Props as AmountFieldProps,
} from '@apps/commons/components/fields/AmountField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error?: string;
  name?: string;
  required?: boolean;
} & AmountFieldProps;

const StyledAmountField = styled(AmountField)`
  margin: 4px 0;
`;

const Component = (props: Props) => {
  const { label, ...rest } = props;
  const setFieldValue = get(useFormikContext(), 'setFieldValue');

  return (
    <>
      <Label text={label} required={rest.required} />
      <StyledAmountField
        {...rest}
        value={rest.value || 0}
        onBlur={(val) => {
          setFieldValue(props.name, val);
        }}
      />
      {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
