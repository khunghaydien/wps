import React, { FunctionComponent } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import AmountField from '@commons/components/fields/AmountField';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import MultiColumnsGrid from '@commons/components/MultiColumnsGrid';
import msg from '@commons/languages';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  isUseWithholdingTax,
  isWithholdingTaxUsageRequired,
  RecordItem,
} from '@apps/domain/models/exp/Record';

const RECORD_ITEM_ROOT = 'ts-expenses-requests';
const ROOT = `${RECORD_ITEM_ROOT}__contents__withholding-tax`;

type Props = {
  amountClassName: string;
  amountReadOnlyClassName: string;
  baseCurrencyDecimal: number;
  customHint: CustomHint;
  errors: { items?: Array<Record<string, any>> };
  expRecordItem: RecordItem;
  isHighlightAmountPayable: boolean;
  isHighlightWithholdingTaxAmount: boolean;
  readOnly: boolean;
  recordItemIdx: number;
  withholdingTaxUsage: string;
  onChangeTaxWithholdingAmount: (amount: number) => void;
};

const WithholdingTaxArea: FunctionComponent<Props> = (props) => {
  const {
    amountClassName,
    amountReadOnlyClassName,
    baseCurrencyDecimal,
    customHint,
    errors,
    expRecordItem,
    isHighlightAmountPayable,
    isHighlightWithholdingTaxAmount,
    readOnly,
    recordItemIdx,
    withholdingTaxUsage,
    onChangeTaxWithholdingAmount,
  } = props;

  const withholdingTaxAmountError = get(errors, 'items.0.withholdingTaxAmount');
  const amountPayableError = get(errors, 'items.0.amountPayable');
  const { amountPayable, withholdingTaxAmount } = expRecordItem;

  // if withholding tax is not enabled or hotel record item
  if (!isUseWithholdingTax(withholdingTaxUsage) || recordItemIdx > 0)
    return null;

  return (
    <>
      <div className={`${RECORD_ITEM_ROOT}--spacing-border`} />
      <div className={ROOT}>
        <MultiColumnsGrid sizeList={[6, 6]}>
          <></>
          <div className="ts-text-field-container">
            <LabelWithHint
              hintMsg={get(customHint, 'recordWithholdingTaxAmount')}
              isRequired={isWithholdingTaxUsageRequired(withholdingTaxUsage)}
              text={msg().$Exp_Clbl_WithholdingTaxAmount}
            />
            <AmountField
              allowNegative
              className={classNames(amountClassName, {
                'highlight-bg': isHighlightWithholdingTaxAmount,
              })}
              disabled={readOnly}
              fractionDigits={baseCurrencyDecimal}
              value={withholdingTaxAmount || 0}
              onBlur={(value: number) => onChangeTaxWithholdingAmount(value)}
            />
            {withholdingTaxAmountError && (
              <div className="input-feedback">
                {msg()[withholdingTaxAmountError]}
              </div>
            )}
          </div>
        </MultiColumnsGrid>
        <MultiColumnsGrid sizeList={[6, 6]}>
          <></>
          <div className="ts-text-field-container">
            <div className="key">{msg().Exp_Clbl_AmountPayable}</div>
            <AmountField
              className={classNames(amountReadOnlyClassName, {
                'highlight-bg': isHighlightAmountPayable,
              })}
              disabled
              fractionDigits={baseCurrencyDecimal}
              value={amountPayable || 0}
            />
            {amountPayableError && (
              <div className="input-feedback">{msg()[amountPayableError]}</div>
            )}
          </div>
        </MultiColumnsGrid>
      </div>
    </>
  );
};

export default WithholdingTaxArea;
