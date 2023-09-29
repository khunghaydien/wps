import React, { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';

import styled from 'styled-components';

import DateField from '@apps/commons/components/fields/DateField';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  disabled: boolean;
  error: string;
  name: string;
  required?: boolean;
  value: string;
  helpMsg?: string;
  alignTooltip?: string;
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

const getDate = (v) => (v || '').substring(0, 10);
const getTime = (v) => (v || '').substring(11, 16);

const Component = (props: Props) => {
  const { disabled, label, value, ...rest } = props;
  const { setFieldValue } = useFormikContext();
  const [date, setDate] = useState(getDate(value)); // YYYY-MM-DD HH:mm:ss
  const [time, setTime] = useState(getTime(value) || '00:00'); // YYYY-MM-DD HH:mm:ss

  useEffect(() => {
    setDate(getDate(value));
  }, [value]);

  useEffect(() => {
    setTime(getTime(value));
  }, [value]);

  const onChangeDate = (value: string) => {
    setDate(value);
    setFieldValue(props.name, value ? `${value} ${time}:00` : '');
  };
  const onChangeTime = (e) => {
    const { value } = e.target;
    setTime(value);
    setFieldValue(props.name, `${date} ${value}:00`);
  };

  return (
    <S>
      <Label
        text={label}
        required={rest.required}
        helpMsg={props.helpMsg}
        alignTooltip={props.alignTooltip}
      />
      <StyledDateField
        {...rest}
        disabled={disabled}
        onChange={onChangeDate}
        value={date}
      />
      <StyledInput
        onChange={onChangeTime}
        type="time"
        min="00:00"
        max="24:00"
        className="ts-text-field slds-input"
        value={time}
        disabled={disabled}
      />
      {props.error && <Error text={props.error} />}
    </S>
  );
};

export default Component;
