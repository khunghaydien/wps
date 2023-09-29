import React from 'react';

import { get } from 'lodash';

import { CustomHint } from '../../../../../../../../domain/models/exp/CustomHint';

import msg from '../../../../../../../languages';
import AmountField from '../../../../../../fields/AmountField';
import LabelWithHint from '../../../../../../fields/LabelWithHint';
import SelectField from '../../../../../../fields/SelectField';
import IconButton from '../../../../../Icon/IconButton';
import RecordDate from '../../../../RecordItem/RecordDate';

import './index.scss';

type ChildRecord = {
  amount: number;
  expTypeId: string;
  localAmount: number;
  recordDate: string;
  withoutTax: number;
};

export type expTypeDisplay = {
  text: string;
  value: string;
};

type Props = {
  currencyDecimal: number;
  customHint: CustomHint;
  errors: {
    records?: Array<any>;
  };
  expTypesDisplay: Array<expTypeDisplay>;
  index: number;
  isTaxIncluded: boolean;
  parentRecordIdx: number;
  record: ChildRecord;
  recordItemsNumber: number;
  symbol: string;
  touched: {
    records?: Array<any>;
  };
  useForeignCurrency: boolean;
  onChangeAmountField: (idx: number, amount: number | null) => void;
  onChangeExpenseType: (expTypeId: string, recordItemIndex: number) => void;
  onChangeRecordDate: (idx: number, date: string) => void;
  onRemoveBtnClick: (idx: number) => void;
};

const RecordItemRow = ({
  record,
  errors,
  touched,
  onRemoveBtnClick,
  onChangeRecordDate,
  onChangeAmountField,
  onChangeExpenseType,
  parentRecordIdx,
  index,
  recordItemsNumber,
  expTypesDisplay,
  currencyDecimal,
  useForeignCurrency,
  customHint,
  isTaxIncluded,
  symbol,
}: Props) => {
  const ROOT = 'ts-expenses-modal-record-items__create-row';

  const targetRecord = `records.${parentRecordIdx}.items.${index}`;
  const expTypeError = get(errors, `${targetRecord}.expTypeId`);
  const isExpTypeTouched = get(touched, `${targetRecord}.expTypeId`);
  const foreignAmountLabel = `${msg().Exp_Clbl_LocalAmount} ${
    symbol ? `(${symbol})` : ''
  }`;

  return (
    <div className={`${ROOT}`}>
      <RecordDate
        recordDate={record.recordDate}
        targetRecord={targetRecord}
        hintMsg={customHint.recordDate}
        onChangeRecordDate={(selectedDate) =>
          onChangeRecordDate(index, selectedDate)
        }
        readOnly={false}
        errors={errors}
      />

      <div className={`${ROOT}-expense-type`}>
        <LabelWithHint
          text={msg().Exp_Clbl_ExpenseType}
          hintMsg={customHint.recordExpenseType}
          isRequired
        />
        <SelectField
          className={`${ROOT}-expense-type ts-select-input`}
          onChange={(e) => {
            const expTypeId = e.target.value;
            return onChangeExpenseType(expTypeId, index);
          }}
          options={expTypesDisplay}
          value={record.expTypeId || ''}
        />
        {expTypeError && isExpTypeTouched && (
          <div className="input-feedback">{msg()[expTypeError]}</div>
        )}
      </div>

      <div className={`${ROOT}-amount`}>
        <p className="key">
          <span className="is-required">*</span>
          &nbsp;
          {useForeignCurrency
            ? foreignAmountLabel
            : isTaxIncluded
            ? msg().Exp_Clbl_IncludeTax
            : msg().Exp_Clbl_WithoutTax}
        </p>

        <AmountField
          className="input_right-aligned"
          value={
            useForeignCurrency
              ? record.localAmount
              : isTaxIncluded
              ? record.amount
              : record.withoutTax
          }
          fractionDigits={currencyDecimal}
          onBlur={(amount) => onChangeAmountField(index, amount)}
        />
      </div>

      {recordItemsNumber > 2 && (
        <IconButton
          icon="close-copy"
          size="small"
          className={`${ROOT}-remove`}
          onClick={() => onRemoveBtnClick(index)}
        />
      )}
    </div>
  );
};

export default RecordItemRow;
