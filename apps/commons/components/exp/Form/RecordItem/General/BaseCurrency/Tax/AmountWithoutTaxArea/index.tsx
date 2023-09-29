import React from 'react';

import { Text } from '../../../../../../../../../core';

import { RecordItem } from '../../../../../../../../../domain/models/exp/Record';
import {
  AmountInputMode,
  AmountInputModeType,
} from '../../../../../../../../../domain/models/exp/TaxType';

import msg from '../../../../../../../../languages';
import Button from '../../../../../../../buttons/Button';
import AmountField from '../../../../../../../fields/AmountField';

type Props = {
  allowTaxExcludedAmount: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRecordItem: RecordItem;
  inputMode: AmountInputModeType;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isRecordCC: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  onChangeAmountOrTaxType: (
    amount: number,
    isTaxIncluded: boolean,
    baseId?: string,
    taxName?: string
  ) => void;
  toggleInputMode: () => void;
};

const ROOT = 'ts-expenses-amount-without-tax';

export default class AmountWithoutTaxArea extends React.Component<Props> {
  render() {
    const withoutTax = this.props.expRecordItem.withoutTax;
    const {
      allowTaxExcludedAmount,
      inputMode,
      toggleInputMode,
      baseCurrencyDecimal,
      readOnly,
      recordItemIdx,
      isFinanceApproval,
      isFixedAllowance,
      isRecordCC,
    } = this.props;
    const isTaxIncludedMode =
      allowTaxExcludedAmount && inputMode === AmountInputMode.TaxIncluded;
    const amountField = (
      <AmountField
        className={
          isTaxIncludedMode
            ? 'slds-input input_right-aligned'
            : 'slds-input input_right-aligned input_disabled_no-border input_disabled_no-background'
        }
        disabled={!allowTaxExcludedAmount || isTaxIncludedMode || readOnly}
        fractionDigits={baseCurrencyDecimal}
        value={withoutTax}
        onBlur={(value: number | null) =>
          this.props.onChangeAmountOrTaxType(value, false)
        }
        data-testid={'ts-expenses-requests__contents__amount-without-tax'}
      />
    );

    const showEditBtn =
      recordItemIdx === 0 &&
      allowTaxExcludedAmount &&
      !isFinanceApproval &&
      !isFixedAllowance &&
      !isRecordCC;

    return (
      <div className={ROOT}>
        <div className="title">
          <div className="key">{msg().Exp_Clbl_WithoutTax}</div>
          {showEditBtn ? (
            <Button
              type="text"
              className={`${ROOT}__edit-button`}
              data-testid={`${ROOT}__edit-button`}
              disabled={readOnly || !isTaxIncludedMode}
              onClick={toggleInputMode}
            >
              <Text
                size="large"
                color={isTaxIncludedMode && !readOnly ? 'action' : 'disable'}
              >
                {msg().Com_Btn_Edit}
              </Text>
            </Button>
          ) : null}
        </div>
        {amountField}
      </div>
    );
  }
}
