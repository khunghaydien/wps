import React from 'react';

import { get } from 'lodash';

import { CustomHint } from '../../../../../../../domain/models/exp/CustomHint';
import { Report } from '../../../../../../../domain/models/exp/Report';
import { AmountInputMode } from '../../../../../../../domain/models/exp/TaxType';

import FormatUtil from '../../../../../../utils/FormatUtil';

import iconAddBlue from '../../../../../../../expenses-pc/images/iconAddBlue.png';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import IconButton from '../../../../../buttons/IconButton';
import DialogFrame from '../../../../../dialogs/DialogFrame';
import RecordItemRow, { expTypeDisplay } from './RecordItemRow';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-items__create';

type Props = {
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  errors: {
    records?: Array<any>;
  };
  expReport: Report;
  expTypesDisplay: Array<expTypeDisplay>;
  recordIdx: number;
  touched: {
    records?: Array<any>;
  };
  addRow: (arg0: boolean) => void;
  onChangeAmountField: (idx: number, amount: number | null) => void;
  onChangeExpenseType: (expTypeId: string, recordItemIndex: number) => void;
  onChangeRecordDate: (idx: number, date: string) => void;
  onClickHideDialogButton: () => void;
  onClickNextButton: () => void;
  removeRow: (idx: number) => void;
};

export default class RecordItemsCreateDialog extends React.Component<Props> {
  componentDidMount() {
    const { expReport, recordIdx } = this.props;
    const hasChildRecords = expReport.records[recordIdx].items.length > 1;
    if (!hasChildRecords) {
      this.props.addRow(true);
    }
  }

  render() {
    const {
      removeRow,
      addRow,
      recordIdx,
      onClickHideDialogButton,
      onChangeRecordDate,
      onChangeAmountField,
      onChangeExpenseType,
      errors,
      touched,
      expReport,
      expTypesDisplay,
      baseCurrencyDecimal,
      baseCurrencySymbol,
    } = this.props;

    const parentItem = expReport.records[recordIdx].items[0];
    const useForeignCurrency = parentItem.useForeignCurrency;
    const isTaxIncluded =
      expReport.records[recordIdx].amountInputMode ===
      AmountInputMode.TaxIncluded;

    let symbol = baseCurrencySymbol;
    let decimalPlaces = baseCurrencyDecimal;
    let amount = isTaxIncluded ? parentItem.amount : parentItem.withoutTax;
    if (useForeignCurrency) {
      symbol = get(parentItem, 'currencyInfo.symbol') || '';
      decimalPlaces = get(parentItem, 'currencyInfo.decimalPlaces', 0);
      amount = parentItem.localAmount;
    }

    const formattedAmount = (number) =>
      FormatUtil.formatNumber(number, decimalPlaces);

    const recordItemRows = expReport.records[recordIdx].items.map(
      (item, index) => {
        // currently the first record item is parent record
        if (index === 0) {
          return null;
        }

        return (
          <RecordItemRow
            record={item}
            key={`recordItem${index}`}
            index={index}
            customHint={this.props.customHint}
            onRemoveBtnClick={removeRow}
            onChangeRecordDate={onChangeRecordDate}
            onChangeAmountField={onChangeAmountField}
            onChangeExpenseType={onChangeExpenseType}
            errors={errors}
            touched={touched}
            parentRecordIdx={recordIdx}
            recordItemsNumber={expReport.records[recordIdx].items.length}
            expTypesDisplay={expTypesDisplay}
            currencyDecimal={decimalPlaces}
            useForeignCurrency={useForeignCurrency}
            isTaxIncluded={isTaxIncluded}
            symbol={symbol}
          />
        );
      }
    );

    return (
      <DialogFrame
        title={msg().Exp_Lbl_RecordItemsDetail}
        hide={onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.onClickNextButton}>
              {msg().Com_Lbl_NextButton}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <section className={`${ROOT}__header`}>
            <span className={`${ROOT}__header-name`}>
              {parentItem.expTypeName}
            </span>
            <span className={`${ROOT}__header-amount`}>
              {`${symbol} ${formattedAmount(amount)}`}
            </span>
          </section>

          <section className={`${ROOT}__body`}>
            <div className={`${ROOT}__body-title`}>
              {msg().Exp_Lbl_OtherExpenses}
            </div>
            {recordItemRows}
          </section>

          <section className={`${ROOT}__action`}>
            <IconButton
              className={`${ROOT}__btn-add-row`}
              src={iconAddBlue}
              alt="add"
              onClick={() => addRow(true)}
            >
              <span>{msg().Exp_Btn_AddNewItem}</span>
            </IconButton>
          </section>
        </div>
      </DialogFrame>
    );
  }
}
