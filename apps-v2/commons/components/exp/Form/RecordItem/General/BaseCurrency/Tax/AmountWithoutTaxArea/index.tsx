import React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import { Text } from '../../../../../../../../../core';
import Warning from '@commons/components/exp/Warning';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import ImgIconAttention from '@commons/images/icons/attention.svg';
import FormatUtil from '@commons/utils/FormatUtil';
import TextUtil from '@commons/utils/TextUtil';

import {
  isAmountMatch,
  RecordItem,
} from '../../../../../../../../../domain/models/exp/Record';
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
  childItemTotalAmount: number;
  className?: string;
  expRecordItem: RecordItem;
  hintMsg?: string;
  inputMode: AmountInputModeType;
  isFinanceApproval?: boolean;
  isFixedAllowance: boolean;
  isParentChildItems: boolean;
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
    const {
      allowTaxExcludedAmount,
      inputMode,
      toggleInputMode,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      readOnly,
      recordItemIdx,
      isFinanceApproval,
      isFixedAllowance,
      className,
      isRecordCC,
      expRecordItem,
      isParentChildItems,
      childItemTotalAmount,
    } = this.props;
    const withoutTax = expRecordItem.withoutTax;
    const isTaxIncludedMode =
      allowTaxExcludedAmount && inputMode === AmountInputMode.TaxIncluded;
    const isTaxExcludedMode = inputMode === AmountInputMode.TaxExcluded;
    const isDisabled = !allowTaxExcludedAmount || isTaxIncludedMode || readOnly;
    const isTotalAmountMatch = isAmountMatch(
      withoutTax || 0,
      childItemTotalAmount
    );
    const isParentRecord = recordItemIdx === 0;
    const isNegative = !isNil(withoutTax) && withoutTax < 0;
    const amountField = (
      <>
        <AmountField
          className={classNames(
            isTaxIncludedMode
              ? 'slds-input input_right-aligned'
              : 'slds-input input_right-aligned input_disabled_no-border input_disabled_no-background',
            className
          )}
          disabled={isDisabled}
          fractionDigits={baseCurrencyDecimal}
          value={withoutTax}
          onBlur={(value: number | null) =>
            this.props.onChangeAmountOrTaxType(value, false)
          }
          data-testid={'ts-expenses-requests__contents__amount-without-tax'}
          allowNegative={expRecordItem.allowNegativeAmount}
        />
        {isNegative &&
          expRecordItem.allowNegativeAmount &&
          isTaxExcludedMode &&
          isParentRecord && (
            <div className={`${ROOT}__negative-warning`}>
              <ImgIconAttention className={`${ROOT}__negative-warning-svg`} />
              <span className={`${ROOT}__negative-warning-msg`}>
                {TextUtil.template(
                  msg().Exp_Lbl_NegativeAmount,
                  msg().Exp_Clbl_WithoutTax
                )}
              </span>
            </div>
          )}
        {isParentChildItems && !isDisabled && !isTotalAmountMatch && (
          <Warning
            message={TextUtil.template(
              msg().Exp_Msg_AmountOfItemizationDoNotAddUpToTotal,
              `${baseCurrencySymbol}${FormatUtil.formatNumber(
                childItemTotalAmount,
                baseCurrencyDecimal
              )}`
            )}
          />
        )}
      </>
    );

    const isEditBtnDisabled = readOnly || !isTaxIncludedMode;
    const showEditBtn =
      recordItemIdx === 0 &&
      allowTaxExcludedAmount &&
      !isFinanceApproval &&
      !isFixedAllowance &&
      !isRecordCC &&
      !isEditBtnDisabled;

    return (
      <div className="ts-text-field-container">
        <div className={ROOT}>
          <div className="title">
            <LabelWithHint
              text={msg().Exp_Clbl_WithoutTax}
              hintMsg={this.props.hintMsg}
            />
            {showEditBtn ? (
              <Button
                type="text"
                className={`${ROOT}__edit-button`}
                data-testid={`${ROOT}__edit-button`}
                disabled={isEditBtnDisabled}
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
      </div>
    );
  }
}
