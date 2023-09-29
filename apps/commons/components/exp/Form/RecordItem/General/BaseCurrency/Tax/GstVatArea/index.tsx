import React from 'react';

import classNames from 'classnames';

import { RecordItem } from '../../../../../../../../../domain/models/exp/Record';

import FormatUtil from '../../../../../../../../utils/FormatUtil';

import ImgEditOff from '../../../../../../../../images/btnEditOff.svg';
import ImgEditOn from '../../../../../../../../images/btnEditOn.svg';
import msg from '../../../../../../../../languages';
import IconButton from '../../../../../../../buttons/IconButton';
import AmountField from '../../../../../../../fields/AmountField';

type Props = {
  allowTaxAmountChange: boolean;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  expRecordItem: RecordItem;
  readOnly: boolean;
  calcTaxFromGstVat: (arg0: number) => void;
  onClickEditButton: () => void;
};

const ROOT = 'ts-expenses-gst-vat-area';

export default class GstVatArea extends React.Component<Props> {
  handleAmountChange = (value: number | null) => {
    this.props.calcTaxFromGstVat(Number(value));
  };

  renderEditImage = () => {
    const { readOnly, onClickEditButton, expRecordItem, allowTaxAmountChange } =
      this.props;
    const isEditable = expRecordItem.taxManual;
    const imgEdit = isEditable ? ImgEditOn : ImgEditOff;
    const imgEditAlt = isEditable ? 'ImgEditOn' : 'ImgEditOff';

    if (!allowTaxAmountChange || (!isEditable && readOnly)) {
      return null;
    }

    return (
      <IconButton
        src={imgEdit}
        onClick={onClickEditButton}
        srcType="svg"
        alt={imgEditAlt}
        disabled={readOnly}
      />
    );
  };

  render() {
    const {
      readOnly,
      expRecordItem,
      allowTaxAmountChange,
      baseCurrencyDecimal,
    } = this.props;
    const isEditable = expRecordItem.taxManual;
    const modifiedClass =
      readOnly && isEditable
        ? 'ts-currency-modified input_disabled_no-border input_disabled_no-background input_disabled_right-aligned'
        : 'input_disabled_no-border input_disabled_no-background input_disabled_right-aligned input_right-aligned';

    const editClassName = classNames('ts-tax-auto', {
      'ts-tax-auto-non-editable':
        !allowTaxAmountChange || (!isEditable && readOnly),
    });
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__tax-area`}>
          <div className="key">{msg().Exp_Clbl_GstAmount}</div>
          {isEditable ? (
            <AmountField
              className={modifiedClass}
              data-testid={`${ROOT}__amount`}
              value={expRecordItem.gstVat || 0}
              disabled={readOnly || !isEditable}
              fractionDigits={baseCurrencyDecimal}
              onBlur={this.handleAmountChange}
            />
          ) : (
            <input
              type="text"
              className="slds-input input_disabled_no-border input_disabled_no-background input_disabled_right-aligned gst-vat"
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
        </div>
        <div className={editClassName} data-testid={`${ROOT}-edit`}>
          {this.renderEditImage()}
        </div>
      </div>
    );
  }
}
