import React from 'react';

// import Button from '@commons/components/buttons/Button';
import TextField from '@commons/components/fields/TextField';
// import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import withLoadingHOC from '@commons/components/withLoading';
import msg from '@commons/languages';

import './index.scss';

type Props = {
  disabled: boolean;
  isShowLabel?: boolean;
  // onConfirm: () => void;
  placeholder?: string;
  // isLoading: boolean;
  value: string;
  onChange: (arg0: string) => void;
};

const ROOT = 'ts-expenses__form-record-item-jct-number';

const JctRegistrationNumber = ({
  onChange,
  value,
  // onConfirm,
  // isLoading,
  disabled,
  placeholder,
  isShowLabel,
}: Props) => {
  return (
    <div className={ROOT}>
      {isShowLabel && (
        <div className={`${ROOT}__label key`}>
          {msg().Exp_Clbl_JctRegistrationNumber}
        </div>
      )}
      {/* <MultiColumnsGrid sizeList={[10, 2]} alignments={['top', 'end']}> */}
      <TextField
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={14}
      />
      {/* <Button
          type="primary"
          className={`${ROOT}__btn-confirm`}
          onClick={onConfirm}
          disabled={disabled}
        >
          {msg().Com_Btn_Confirm}
        </Button>
      </MultiColumnsGrid>
      {msgKey && !isLoading && (
        <div className={`${ROOT}__msg-area`}>{msg()[msgKey]}</div>
      )} */}
    </div>
  );
};

export default withLoadingHOC(JctRegistrationNumber);
