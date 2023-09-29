import React from 'react';

import { cloneDeep, drop, get, isEmpty, isNil } from 'lodash';

import { CustomHint } from '../../../../../../../domain/models/exp/CustomHint';
import { ExpenseTypeList } from '../../../../../../../domain/models/exp/ExpenseType';
import {
  calcItemsTotalAmount,
  isAmountMatch,
} from '../../../../../../../domain/models/exp/Record';
import { Report } from '../../../../../../../domain/models/exp/Report';
import { AmountInputMode } from '../../../../../../../domain/models/exp/TaxType';

import DateUtil from '../../../../../../utils/DateUtil';
import FormatUtil from '../../../../../../utils/FormatUtil';

import iconAddBlue from '../../../../../../../expenses-pc/images/iconAddBlue.png';
import ImgIconAttention from '../../../../../../images/icons/attention.svg';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import IconButton from '../../../../../buttons/IconButton';
import DialogFrame from '../../../../../dialogs/DialogFrame';
import Currency from '../../../../../Grid/Formatters/Currency';
import Grid from '../../../../../Grid/index';
import { expTypeDisplay } from '../../../RecordItem/ChildRecordItem/index';
import RecordItemDisplay from './RecordItemDisplay';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-items__confirm';

type Props = {
  baseCurrency: any;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  errors: {
    records?: Array<any>;
  };
  expReport: Report;
  expTypeList: ExpenseTypeList;
  expTypesDisplay: Array<expTypeDisplay>;
  foreignCurrency: any;
  isApproval?: boolean;
  isExpense: boolean;
  isFinanceApproval: boolean;
  readOnly: boolean;
  recordIdx: number;
  recordItemContainer: any;
  recordItemIdx?: number;
  touched: {
    records?: Array<any>;
  };
  addRow: (arg0: boolean) => void;
  initForeignCurrencyAndEIs: (arg0: ExpenseTypeList) => void;
  initTaxAndEIsForRecordItems: (arg0: ExpenseTypeList) => void;
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2: any) => void;
  onClickHideDialogButton: () => void;
  onClickSaveButton: (isTotalAmountMatch: boolean) => void;
  removeRow: (idx: number) => void;
  setFieldError: (key: string, value: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: Record<string, unknown> | boolean,
    arg2?: boolean
  ) => void;
  setRecordItemIdx: (idx?: number) => void;
};

export default class RecordItemsConfirmDialog extends React.Component<Props> {
  componentDidMount() {
    const {
      recordItemIdx,
      readOnly,
      isApproval,
      expReport,
      recordIdx,
      expTypeList,
    } = this.props;

    // idx 0 is parent record
    let defaultIdx = 1;
    if (!isNil(recordItemIdx) && recordItemIdx > 0) {
      defaultIdx = recordItemIdx;
    }
    this.props.setRecordItemIdx(defaultIdx);

    const displayOnly = readOnly || isApproval;
    if (displayOnly) {
      return;
    }

    const useForeignCurrency = get(
      expReport,
      `records.${recordIdx}.items.0.useForeignCurrency`
    );

    if (useForeignCurrency) {
      this.props.initForeignCurrencyAndEIs(expTypeList);
    } else {
      this.props.initTaxAndEIsForRecordItems(expTypeList);
    }
  }

  browseDetail = (idx: string | number) => {
    const recordItemIdx = parseInt(String(idx));
    this.props.setRecordItemIdx(recordItemIdx);
  };

  handleClickAddBtn = () => {
    const latestBrowseIdx =
      this.props.expReport.records[this.props.recordIdx].items.length;
    this.props.addRow(false);
    this.browseDetail(latestBrowseIdx);
  };

  handleClickDeleteBtn = (idx: number) => {
    this.props.removeRow(idx);
    this.props.setRecordItemIdx(null);
  };

  warningIconFormatter = (props: { value: Record<string, any> }) => {
    const error = props.value;
    if (isEmpty(error)) {
      return null;
    }
    return <ImgIconAttention className={`${ROOT}__warning`} />;
  };

  calculateTotalAmount = () => {
    const { expReport, recordIdx, baseCurrencyDecimal } = this.props;
    const useForeignCurrency = get(
      expReport,
      `records.${recordIdx}.items.0.useForeignCurrency`
    );
    const inputMode = get(expReport, `records.${recordIdx}.amountInputMode`);
    const isTaxIncluded = inputMode === AmountInputMode.TaxIncluded;
    const decimalPlaces = useForeignCurrency
      ? get(
          expReport,
          `records.${recordIdx}.items.0.currencyInfo.decimalPlaces`,
          0
        )
      : baseCurrencyDecimal;
    // recordItems[0] is parent record
    const recordItems = drop(cloneDeep(expReport.records[recordIdx].items), 1);
    const key =
      (useForeignCurrency && 'localAmount') ||
      (isTaxIncluded && 'amount') ||
      'withoutTax';
    const totalAmount = calcItemsTotalAmount(recordItems, key, decimalPlaces);
    return totalAmount;
  };

  dateFormatter = (props: { value: string }) =>
    DateUtil.format(props.value, 'L');

  render() {
    const {
      removeRow,
      recordIdx,
      recordItemIdx,
      isFinanceApproval,
      isApproval,
      onClickHideDialogButton,
      onClickSaveButton,
      onChangeEditingExpReport,
      expReport,
      errors,
      expTypesDisplay,
      expTypeList,
      customHint,
    } = this.props;

    if (recordIdx < 0) {
      return null;
    }
    const inputMode = get(expReport, `records.${recordIdx}.amountInputMode`);
    const isTaxIncluded = inputMode === AmountInputMode.TaxIncluded;

    const displayOnly = this.props.readOnly || isApproval;
    const parentItem = get(expReport, `records.${recordIdx}.items[0]`, {});

    const useForeignCurrency = parentItem.useForeignCurrency;
    let symbol = this.props.baseCurrencySymbol;
    let decimalPlaces = this.props.baseCurrencyDecimal;
    let parentRecordAmount = isTaxIncluded
      ? parentItem.amount
      : parentItem.withoutTax;
    let amountHeadTitle = isTaxIncluded
      ? msg().Exp_Clbl_IncludeTax
      : msg().Exp_Clbl_WithoutTax;
    if (useForeignCurrency) {
      symbol = get(parentItem, 'currencyInfo.symbol') || '';
      decimalPlaces = get(parentItem, 'currencyInfo.decimalPlaces', 0);
      parentRecordAmount = parentItem.localAmount;
      amountHeadTitle = `${msg().Exp_Clbl_LocalAmount} ${
        symbol ? `(${symbol})` : ''
      }`;
    }
    const formatAmount = (amount: number) =>
      FormatUtil.formatNumber(amount, decimalPlaces);

    // map error into cloned items to display warning
    const recordItems = cloneDeep(expReport.records[recordIdx].items).map(
      (item, index) => {
        const error = cloneDeep(
          get(errors, `records.${recordIdx}.items.${index}`, {})
        );
        return { ...item, index: index.toString(), error };
      }
    );
    // recordItems[0] is parent record
    const childRecords = drop(recordItems, 1);
    const amountColumKey =
      (useForeignCurrency && 'localAmount') ||
      (isTaxIncluded && 'amount') ||
      'withoutTax';

    const list = (
      <Grid
        data={childRecords}
        idKey="index"
        columns={[
          {
            name: '',
            key: 'error',
            width: 27,
            shrink: false,
            grow: false,
            formatter: this.warningIconFormatter,
          },
          {
            name: msg().Exp_Clbl_Date,
            key: 'recordDate',
            width: 90,
            shrink: false,
            grow: false,
            formatter: this.dateFormatter,
          },
          {
            name: msg().Exp_Clbl_ExpenseType,
            key: 'expTypeName',
            width: 192,
            shrink: false,
            grow: false,
          },
          {
            name: `${amountHeadTitle}`,
            key: amountColumKey,
            width: 130,
            extraProps: {
              baseCurrencySymbol: symbol,
              baseCurrencyDecimal: decimalPlaces,
            },
            shrink: false,
            grow: false,
            formatter: Currency,
          },
        ]}
        selected={[]}
        browseId={String(recordItemIdx || '')}
        onClickRow={this.browseDetail}
        onChangeRowSelection={() => {}}
      />
    );

    const RecordItemContainer = this.props.recordItemContainer;

    let recordItem = null;
    if (!isNil(recordItemIdx) && recordItemIdx > 0) {
      recordItem = get(
        expReport,
        `records.${recordIdx}.items.${recordItemIdx}`
      );
    }

    const detail = displayOnly ? (
      <RecordItemDisplay
        recordItem={recordItem}
        baseCurrencySymbol={this.props.baseCurrencySymbol}
        baseCurrencyDecimal={this.props.baseCurrencyDecimal}
      />
    ) : (
      <RecordItemContainer
        isExpense={this.props.isExpense}
        isFinanceApproval={isFinanceApproval}
        setFieldTouched={this.props.setFieldTouched}
        setFieldError={this.props.setFieldError}
        expReport={this.props.expReport}
        recordIdx={this.props.recordIdx}
        errors={this.props.errors || {}}
        touched={this.props.touched || {}}
        baseCurrency={this.props.baseCurrency}
        foreignCurrency={this.props.foreignCurrency}
        isChildRecord
        recordItemIdx={this.props.recordItemIdx}
        removeRow={removeRow}
        onChangeEditingExpReport={onChangeEditingExpReport}
        handleClickDeleteBtn={this.handleClickDeleteBtn}
        expTypesDisplay={expTypesDisplay}
        expTypeList={expTypeList}
        customHint={customHint}
      />
    );

    const childRecordsTotalAmount = this.calculateTotalAmount();
    const isTotalAmountMatch = isAmountMatch(
      parentRecordAmount,
      childRecordsTotalAmount
    );

    return (
      <DialogFrame
        title={msg().Exp_Lbl_RecordItemsDetail}
        hide={onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={onClickHideDialogButton}>
              {msg().Com_Btn_Close}
            </Button>
            {!displayOnly && (
              <Button
                type="primary"
                onClick={() => {
                  onClickSaveButton(isTotalAmountMatch);
                }}
              >
                {msg().Com_Btn_Confirm}
              </Button>
            )}
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <div className={`${ROOT}__left`}>
            <section className={`${ROOT}__header`}>
              <span className={`${ROOT}__header-name`}>
                {parentItem.expTypeName}
              </span>
              <span className={`${ROOT}__header-amount`}>
                {`${symbol} ${formatAmount(parentRecordAmount)}`}
              </span>
            </section>

            <section className={`${ROOT}__list`}>{list}</section>

            {!isFinanceApproval && !displayOnly && (
              <section className={`${ROOT}__action`}>
                <IconButton
                  className={`${ROOT}__btn-add-row`}
                  src={iconAddBlue}
                  alt="add"
                  onClick={this.handleClickAddBtn}
                >
                  <span>{msg().Exp_Btn_AddNewItem}</span>
                </IconButton>
              </section>
            )}

            <section className={`${ROOT}__sum`}>
              <div className={`${ROOT}__sum-amount`}>
                <span className={`${ROOT}__sum-text`}>
                  {msg().Exp_Lbl_TotalLong}
                </span>
                <span className={`${ROOT}__sum-number`}>
                  {`${symbol} ${formatAmount(childRecordsTotalAmount)}`}
                </span>
              </div>

              {!isTotalAmountMatch && (
                <div className={`${ROOT}__sum-feedback`}>
                  <ImgIconAttention
                    className={`${ROOT}__sum-feedback-img ${ROOT}__warning`}
                  />
                  {msg().Exp_Msg_TotalAmountMismatch}
                </div>
              )}
            </section>
          </div>

          <div className={`${ROOT}__right`}>{detail}</div>
        </div>
      </DialogFrame>
    );
  }
}
