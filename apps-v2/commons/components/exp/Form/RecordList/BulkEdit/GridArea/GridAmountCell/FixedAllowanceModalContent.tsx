import React, { ChangeEvent } from 'react';

import isEmpty from 'lodash/isEmpty';

import FormatUtil from '@apps/commons/utils/FormatUtil';

import { AmountOption } from '@apps/domain/models/exp/ExpenseType';

import AmountSelection from '../../../../RecordItem/AmountSelection';

import './FixedAllowanceModalContent.scss';

type Props = {
  currencySymbol: string;
  decimalPlaces: number;
  isForeignCurrency?: boolean;
  multiFixedList: AmountOption[];
  optionId: string;
  updateFieldInput: (updateObj: { [key: string]: string | number }) => void;
};

const ROOT = 'grid-amount-fixed-allowance-summary-modal-content';
const FixedAllowanceModalContent = (props: Props): React.ReactElement => {
  const {
    currencySymbol,
    decimalPlaces,
    isForeignCurrency,
    multiFixedList,
    optionId,
    updateFieldInput,
  } = props;

  const onChangeAmountSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const selectedAmount = multiFixedList.find((item) => item.id === value);
    const fixedAmount = isEmpty(selectedAmount)
      ? 0
      : selectedAmount.allowanceAmount;
    const amountKey = isForeignCurrency ? 'localAmountInput' : 'amountInput';
    updateFieldInput({
      [amountKey]: fixedAmount,
      fixedAllowanceOptionIdInput: value,
    });
  };

  const amountOptions = multiFixedList.map((item) => ({
    id: item.id,
    text: `${item.label} ${currencySymbol}${FormatUtil.formatNumber(
      item.allowanceAmount,
      decimalPlaces
    )}`,
  }));

  return (
    <div className={ROOT}>
      <AmountSelection
        className={`${ROOT}__amount-selection`}
        value={optionId}
        onChangeAmountSelection={onChangeAmountSelection}
        error={undefined}
        options={amountOptions}
      />
    </div>
  );
};

export default FixedAllowanceModalContent;
