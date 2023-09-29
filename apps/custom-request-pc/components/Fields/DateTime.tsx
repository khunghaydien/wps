import React, { useState } from 'react';

import { useFormikContext } from 'formik';

import styled from 'styled-components';

import DateField from '@apps/commons/components/fields/DateField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error: string;
  name: string;
  required?: boolean;
  value: string;
};

const S = styled.div`
  position: relative;
`;

const StyledDateField = styled(DateField)``;

const StyledInput = styled.input`
  position: absolute;
  width: 124px !important;
  height: 32px;
  margin-left: 10px;
`;

const Component = (props: Props) => {
  const { label, value, ...rest } = props;
  const { setFieldValue } = useFormikContext();
  const [date, setDate] = useState((value || '').substring(0, 10)); // YYYY-MM-DD HH:mm:ss
  const [time, setTime] = useState((value || '').substring(11, 16) || '00:00'); // YYYY-MM-DD HH:mm:ss

  const onChangeDate = (value: string) => {
    setDate(value);
    setFieldValue(props.name, `${value} ${time}:00`);
  };
  const onChangeTime = (e) => {
    const { value } = e.target;
    setTime(value);
    setFieldValue(props.name, `${date} ${value}:00`);
  };

  return (
    <S>
      <Label text={label} required={rest.required} />
      <StyledDateField {...rest} onChange={onChangeDate} value={date} />
      <StyledInput
        onChange={onChangeTime}
        type="time"
        min="00:00"
        max="24:00"
        className="ts-text-field slds-input"
        value={time}
      />
      {props.error && <Error text={props.error} />}
    </S>
  );
};

export default Component;
