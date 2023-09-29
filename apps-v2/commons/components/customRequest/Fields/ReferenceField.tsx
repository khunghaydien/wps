import React from 'react';

import { useFormikContext } from 'formik';

import styled from 'styled-components';

import Button from '@commons/components/buttons/Button';
import BtnDelete from '@commons/images/btnDelete.svg';
import msg from '@commons/languages';

import Error from './Error';
import Label from './Label';

type Props = {
  label: string;
  error?: string;
  name: string;
  objectName: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  helpMsg?: string;
  alignTooltip?: string;
} & ExtraProps;

type ExtraProps = {
  displayValue: string;
  openReferenceDialog: (objName, fieldName) => void;
};

const S = {
  ClearIcon: styled(BtnDelete)`
    margin-left: 12px;
    cursor: pointer;
    height: 16px;
    width: 16px;

    & path {
      fill: #fff;
    }
  `,
};

const Component = (props: Props) => {
  const { setFieldValue } = useFormikContext();
  const { label, value, displayValue, ...rest } = props;
  const isCleared = !value;

  const onClickClearBtn = () => {
    setFieldValue(props.name, null);
  };

  const renderSelectBtn = () => {
    const btn = (
      <Button
        type="default"
        onClick={() => props.openReferenceDialog(props.objectName, props.name)}
        disabled={props.disabled}
      >
        {msg().Com_Btn_Select}
      </Button>
    );

    return isCleared && btn;
  };

  const renderClearBtn = () => {
    const clearBtn = (
      <S.ClearIcon aria-hidden="true" onClick={onClickClearBtn} />
    );
    return !isCleared && !props.disabled && clearBtn;
  };

  return (
    <>
      <Label
        text={label}
        required={rest.required}
        helpMsg={props.helpMsg}
        alignTooltip={props.alignTooltip}
      />
      {!isCleared && displayValue}
      {renderClearBtn()}
      {renderSelectBtn()} {props.error && <Error text={props.error} />}
    </>
  );
};

export default Component;
