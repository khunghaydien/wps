import React from 'react';

import classNames from 'classnames';

import { Text } from '@apps/core';
import Button from '@commons/components/buttons/Button';
import Warning from '@commons/components/exp/Warning';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import TextUtil from '@commons/utils/TextUtil';

import {
  isAmountMatch,
  RecordItem,
} from '../../../../../../../../../domain/models/exp/Record';

import FormatUtil from '../../../../../../../../utils/FormatUtil';

import msg from '../../../../../../../../languages';
import AmountField from '../../../../../../../fields/AmountField';

type Props = {
  allowNegativeAmount?: boolean;
  allowTaxAmountChange: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  childItemTotalTaxAmount: number;
  className?: string;
  expRecordItem: RecordItem;
  hintMsg?: string;
  isParentChildItems: boolean;
  readOnly: boolean;
  calcTaxFromGstVat: (arg0: number) => void;
  onClickEditButton: () => void;
};

const ROOT = 'ts-expenses-gst-vat-area';

export default class GstVatArea extends React.Component<Props> {
  handleAmountChange = (value: number | null) => {
    this.props.calcTaxFromGstVat(Number(value));
  };

  renderEditButton = () => {
    const { readOnly, onClickEditButton, expRecordItem, allowTaxAmountChange } =
      this.props;
    const isEditable = expRecordItem.taxManual;
    if (!allowTaxAmountChange || (!isEditable && readOnly)) {
      return null;
    }

    return (
      <Button
        type="text"
        data-testid={`${ROOT}__edit-button`}
        disabled={readOnly}
        onClick={onClickEditButton}
      >
        <Text size="large" color={!readOnly ? 'action' : 'disable'}>
          {isEditable ? msg().Exp_Clbl_Edited : msg().Com_Btn_Edit}
        </Text>
      </Button>
    );
  };

  render() {
    const {
      readOnly,
      expRecordItem,
      baseCurrencyDecimal,
      className,
      allowNegativeAmount,
      isParentChildItems,
      childItemTotalTaxAmount,
    } = this.props;
    const isEditable = expRecordItem.taxManual;
    const modifiedClass =
      readOnly && isEditable
        ? 'ts-currency-modified input_disabled_no-border input_disabled_no-background input_disabled_right-aligned'
        : 'input_disabled_no-border input_disabled_no-background input_disabled_right-aligned input_right-aligned';
    const isTotalTaxAmountMatch = isAmountMatch(
      expRecordItem.gstVat || 0,
      childItemTotalTaxAmount
    );

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__tax-area`}>
          <div className="title">
            <LabelWithHint
              text={msg().Exp_Clbl_GstAmount}
              hintMsg={this.props.hintMsg}
            />
            <div data-testid={`${ROOT}-edit`}>{this.renderEditButton()}</div>
          </div>
          {isEditable ? (
            <AmountField
              className={classNames(modifiedClass, className)}
              data-testid={`${ROOT}__amount`}
              value={expRecordItem.gstVat || 0}
              disabled={readOnly || !isEditable}
              fractionDigits={baseCurrencyDecimal}
              onBlur={this.handleAmountChange}
              allowNegative={allowNegativeAmount}
            />
          ) : (
            <input
              type="text"
              className={classNames(
                'slds-input input_disabled_no-border input_disabled_no-background input_disabled_right-aligned gst-vat',
                className
              )}
              data-testid={`${ROOT}-field`}
              disabled
              value={`${this.props.baseCurrencySymbol} ${
                FormatUtil.formatNumber(
                  expRecordItem.gstVat,
                  baseCurrencyDecimal
                ) || 0
              }`}
            />
          )}
          {isParentChildItems && !isTotalTaxAmountMatch && (
            <Warning
              message={TextUtil.template(
                msg().Exp_Msg_TaxAmountOfItemizationDoNotAddUpToTotal,
                `${this.props.baseCurrencySymbol}${FormatUtil.formatNumber(
                  childItemTotalTaxAmount,
                  baseCurrencyDecimal
                )}`
              )}
            />
          )}
        </div>
      </div>
    );
  }
}
