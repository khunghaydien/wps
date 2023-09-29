import React from 'react';

// import CheckIcon from '@commons/images/icons/CheckIcon.svg';
import msg from '@commons/languages';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';

import './JctRegistrationNumber.scss';

type Props = {
  disabled: boolean;
  value: string;
  onChange: (arg0: string) => void;
  placeholder?: string;
  isShowLabel?: boolean;
};

const ROOT =
  'mobile-app-pages-expense-page-record-new-general-jct-registration-number';

const JctRegistrationNumber = ({
  onChange,
  value,
  disabled,
  placeholder,
  isShowLabel,
}: Props) => {
  return (
    <div className={ROOT}>
      <TextField
        label={isShowLabel ? msg().Exp_Clbl_JctRegistrationNumber : ''}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={14}
      />
      {/* <CheckIcon className={`${ROOT}__confirmed-icon`} /> */}
    </div>
  );
};

export default JctRegistrationNumber;
