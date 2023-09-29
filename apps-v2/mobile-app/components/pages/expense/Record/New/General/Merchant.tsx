import React from 'react';

import msg from '@commons/languages';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';

import Icon from '@mobile/components/atoms/Icon';

import './Merchant.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general__merchant';

type Props = {
  isRequired: boolean;
  value: string;
  readOnly: boolean;
  onChangeValue: (args0: unknown) => void;
  setError: (arg0: string) => string[];
  onClickSearchButton: () => void;
};

const RecordMerchant = (props: Props) => {
  const {
    isRequired,
    value,
    readOnly,
    onChangeValue,
    setError,
    onClickSearchButton,
  } = props;
  return (
    <section className={`${ROOT}__input`}>
      <TextField
        label={msg().Exp_Clbl_Merchant}
        value={value}
        disabled={readOnly}
        required={isRequired}
        onChange={onChangeValue}
        errors={setError('items.0.merchant')}
      />
      <button
        className={`${ROOT}__icon`}
        onClick={onClickSearchButton}
        disabled={readOnly}
        type="button"
      >
        <Icon type="search" />
      </button>
    </section>
  );
};

export default RecordMerchant;
