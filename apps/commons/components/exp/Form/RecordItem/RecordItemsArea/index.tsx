import React from 'react';

import { get } from 'lodash';

import { Record } from '../../../../../../domain/models/exp/Record';
import { AmountInputMode } from '../../../../../../domain/models/exp/TaxType';

import TextUtil from '../../../../../utils/TextUtil';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';

import './index.scss';

type Props = {
  // baseCurrencySymbol: string,
  // baseCurrencyDecimal: number,
  expRecord: Record;
  hasChildItems: boolean;
  isAmountMatch: boolean;
  isFinanceApproval?: boolean;
  readOnly: boolean;
  onClickRecordItemsConfirmButton: () => void;
  onClickRecordItemsCreateButton: () => void;
  onClickRecordItemsDeleteButton: () => void;
};

const ROOT = 'ts-expenses-requests__record-items-area';
export default class RecordDate extends React.Component<Props> {
  render() {
    const {
      // baseCurrencySymbol,
      // baseCurrencyDecimal,
      expRecord,
      isFinanceApproval,
      isAmountMatch,
      hasChildItems,
      readOnly,
      onClickRecordItemsCreateButton,
      onClickRecordItemsConfirmButton,
      onClickRecordItemsDeleteButton,
    } = this.props;
    const isTaxIncluded =
      expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const useForeignCurrency = get(expRecord, 'items.0.useForeignCurrency');
    const amount =
      (useForeignCurrency && get(expRecord, 'items.0.localAmount', 0)) ||
      (isTaxIncluded && get(expRecord, 'items.0.amount', 0)) ||
      expRecord.withoutTax;
    const amountErrorMsg = useForeignCurrency
      ? msg().Exp_Msg_LocalAmountMismatchItems
      : msg().Exp_Msg_TotalAmountMismatchItems;

    return (
      <React.Fragment>
        {/* <div className={`${ROOT}-amount`}>
         <span className={`${ROOT}-amount-text`}>
           {msg().Exp_Lbl_BillAmount}
         </span>
         <span className={`${ROOT}-amount-number`}>
           {`${baseCurrencySymbol} ${FormatUtil.formatNumber(
             childTotalAmount,
             baseCurrencyDecimal
           )}`}
         </span>
        </div> */}

        {!hasChildItems && !isFinanceApproval && (
          <div className={`${ROOT}-buttons`}>
            <p className="key">
              <span className="is-required">*</span>
              &nbsp;{msg().Exp_Lbl_RecordItems}
            </p>
            <Button
              className={`${ROOT}-create`}
              data-testid={`${ROOT}-create`}
              type="secondary"
              onClick={onClickRecordItemsCreateButton}
              disabled={amount <= 0 || readOnly}
            >
              {msg().Exp_Btn_RecordItemsCreate}
            </Button>
            <div
              className={`${ROOT}-feedback`}
              data-testid={`${ROOT}-feedback`}
            >
              {TextUtil.template(
                msg().Exp_Msg_RecordItemsMandatory,
                expRecord.items[0].expTypeName
              )}
            </div>
          </div>
        )}

        {hasChildItems && (
          <div className={`${ROOT}-buttons`}>
            <p className="key">&nbsp;{msg().Exp_Lbl_RecordItems}</p>
            <Button
              className={`${ROOT}-confirm`}
              data-testid={`${ROOT}-confirm`}
              type="default"
              onClick={onClickRecordItemsConfirmButton} // disabled={readOnly}
            >
              {readOnly
                ? msg().Exp_Btn_RecordItemsCheck
                : msg().Exp_Btn_RecordItemsEdit}
            </Button>

            {!isFinanceApproval && !readOnly && (
              <Button
                data-testid={`${ROOT}-delete`}
                className={`${ROOT}-delete`}
                type="destructive"
                onClick={onClickRecordItemsDeleteButton}
                disabled={readOnly}
              >
                {msg().Exp_Btn_RecordItemsDelete}
              </Button>
            )}

            {!isAmountMatch && (
              <div
                data-testid={`${ROOT}-feedback`}
                className={`${ROOT}-feedback`}
              >
                {amountErrorMsg}
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}
