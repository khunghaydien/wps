import React from 'react';

import { cloneDeep, drop, get, omit, set } from 'lodash';

import { CustomHint } from '../../../../../../domain/models/exp/CustomHint';
import { ExpenseTypeList } from '../../../../../../domain/models/exp/ExpenseType';
import {
  calcItemsTotalAmount,
  newRecordItem,
  Record,
} from '../../../../../../domain/models/exp/Record';
import { Report } from '../../../../../../domain/models/exp/Report';
import {
  AmountInputMode,
  calcTaxFromGstVat,
  ExpTaxTypeList,
} from '../../../../../../domain/models/exp/TaxType';

import { ExpTypesInfo } from '../../../../../../domain/modules/exp/expense-type/childList';

import msg from '../../../../../languages';
import RecordItemsConfirmDialog from './RecordItemsConfirm';
import RecordItemsCreateDialog from './RecordItemsCreate';
import RecordItemsDeleteDialog from './RecordItemsDelete';

export type RecordItemsDialogTypes = {
  // array of exp type list, cached based on target date and parent exp type
  childExpTypeLists: Array<ExpenseTypeList> | ExpTypesInfo;

  isApproval?: boolean;
  isFinanceApproval: boolean;
  recordItemContainer: any;
  recordItemIdx: number;
  tax: {
    [key: string]: {
      [key: string]: ExpTaxTypeList;
    };
  };
  tempSavedRecordItems: Array<{
    amount: number;
    expTypeId: string;
    gstVal: number;
    recordDate: string;
    withoutTax: number;
  }>;

  initForeignCurrencyAndEIs: (expTypeList: ExpenseTypeList) => void;

  initTaxAndEIsForRecordItems: (expTypeList: ExpenseTypeList) => void;

  searchExpTypesByParentRecord: (
    targetDate: string,
    expTypeId: string
  ) => Promise<any> | any;
};

export type Props = RecordItemsDialogTypes & {
  baseCurrency: any;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  currentDialog: string;
  customHint: CustomHint;
  errors: {
    records?: Array<any>;
  };
  expReport: Report;
  foreignCurrency: any;
  isExpense?: boolean;
  readOnly: boolean;
  recordIdx: number;
  touched: {
    records?: Array<any> | any;
  };
  hideAllDialog: () => { [key: string]: unknown };
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2?: any,
    shouldValidate?: boolean
  ) => void;
  openRecordItemsConfirmDialog: () => Function;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: never } | boolean,
    arg2?: boolean
  ) => void;
  setFieldValue: (key: string, value: any) => void;
  setTouched: (value: any, shouldValidate: boolean) => void;
};

type State = {
  expTypeList: ExpenseTypeList;
  recordItemIdx?: number;
};
export default class RecordItemsDialog extends React.Component<Props, State> {
  state = {
    expTypeList: [],
    // for approval page ONLY, because no formik
    recordItemIdx: null,
  };

  componentDidMount() {
    const { recordIdx, expReport, childExpTypeLists, isApproval, readOnly } =
      this.props;
    if (
      isApproval ||
      readOnly ||
      this.props.currentDialog === 'RECORD_ITEMS_DELETE'
    ) {
      return;
    }
    const targetDate = expReport.records[recordIdx].recordDate;
    const parentExpId = expReport.records[recordIdx].items[0].expTypeId;
    const expTypes = get(childExpTypeLists, `${parentExpId}.${targetDate}`);
    let getExpTypeList;

    if (expTypes) {
      getExpTypeList = new Promise((resolve) => resolve(expTypes));
    } else {
      // if not in expTypelists, fetch
      getExpTypeList = this.props.searchExpTypesByParentRecord(
        targetDate,
        parentExpId
      );
    }
    getExpTypeList.then((expTypeList) => {
      this.setState({
        expTypeList,
      });
    });
  }

  // on change methods below is only for 'create' dialog
  onChangeExpenseType = (expTypeId: string, recordItemIdx: number) => {
    const { recordIdx, onChangeEditingExpReport } = this.props;
    const expTypeInfo =
      this.state.expTypeList.find((type) => type.id === expTypeId) || {};

    onChangeEditingExpReport(
      `report.records.${recordIdx}.items.${recordItemIdx}.expTypeId`,
      expTypeId,
      true
    );
    onChangeEditingExpReport(
      `report.records.${recordIdx}.items.${recordItemIdx}.expTypeName`,
      expTypeInfo.name,
      true,
      false
    );
  };

  onChangeRecordDate = (idx: number, date: string) => {
    const { onChangeEditingExpReport, recordIdx } = this.props;
    onChangeEditingExpReport(
      `report.records.${recordIdx}.items.${idx}.recordDate`,
      date,
      true
    );
  };

  onChangeAmountField = (idx: number, amount: number | null = 0) => {
    const { onChangeEditingExpReport, recordIdx, expReport } = this.props;
    const useForeignCurrency = get(
      expReport,
      `records.${recordIdx}.items.0.useForeignCurrency`
    );
    const inputMode = get(expReport, `records.${recordIdx}.amountInputMode`);
    const isTaxIncluded = inputMode === AmountInputMode.TaxIncluded;
    let path = `report.records.${recordIdx}.items.${idx}.`;
    path +=
      (useForeignCurrency && 'localAmount') ||
      (isTaxIncluded && 'amount') ||
      'withoutTax';

    onChangeEditingExpReport(path, amount, true);
  };

  onClickNextButton = () => {
    // update all fields as touched and validate
    this.updateTouched();
    this.props.setFieldValue('ui.isRecordItemsCreate', true);
    setTimeout(() => {
      const { errors, recordIdx } = this.props;
      const recordItemsErrors = get(errors, `records.${recordIdx}.items`, []);

      // only when CHILD got no errors, can go next
      if (recordItemsErrors.length <= 1) {
        this.props.openRecordItemsConfirmDialog();
        this.props.setFieldValue('ui.isRecordItemsCreate', false);
      }
    }, 1);
  };

  onClickSaveButton = (isTotalAmountMatch: boolean) => {
    this.updateTouched();
    this.props.setFieldValue('ui.isRecordItemsEdit', true);
    setTimeout(() => {
      const { errors, recordIdx, expReport } = this.props;
      const recordItemsErrors = get(errors, `records.${recordIdx}.items`, []);

      // only when CHILD got no errors && total amount match, can save the temp copy
      // recordItemsErrors[0] is for parent record, which should be null in this case
      const isChildItemsNoError = recordItemsErrors.length <= 1;
      if (isTotalAmountMatch && isChildItemsNoError) {
        this.hideDialog();

        const record = cloneDeep(expReport.records[recordIdx]);
        // @ts-ignore
        record.items = record.items.map((item) => {
          return omit(item, ['expTypeEditable']);
        });

        let updatedRecord;
        const useForeignCurrency = get(record, 'items.0.useForeignCurrency');
        if (useForeignCurrency) {
          updatedRecord = this.getUpdatedFCRecord(record);
        } else {
          updatedRecord = this.getUpdatedBCRecord(record);
        }

        this.props.setFieldValue(
          'ui.tempSavedRecordItems',
          updatedRecord.items
        );
        this.props.onChangeEditingExpReport(
          `report.records.${recordIdx}`,
          updatedRecord
        );
      }
    }, 1);
  };

  getUpdatedFCRecord = (record: Record) => {
    const updatedRecord = cloneDeep(record);
    const childItems = drop(updatedRecord.items);
    const totalAmount = calcItemsTotalAmount(
      childItems,
      'amount',
      this.props.baseCurrencyDecimal
    );
    updatedRecord.amount = totalAmount;
    updatedRecord.items[0].amount = totalAmount;
    return updatedRecord;
  };

  getUpdatedBCRecord = (record: Record) => {
    const { baseCurrencyDecimal, tax } = this.props;
    const updatedRecord = cloneDeep(record);
    const childItems = drop(updatedRecord.items);
    const isTaxIncluded =
      record.amountInputMode === AmountInputMode.TaxIncluded;
    const totalGstVat = childItems.reduce((sum, { gstVat = 0 }) => {
      return sum + parseFloat(String(gstVat));
    }, 0);
    const formattedGst = parseFloat(totalGstVat.toFixed(baseCurrencyDecimal));
    const calculatedAmount = calcTaxFromGstVat(
      formattedGst,
      isTaxIncluded
        ? updatedRecord.items[0].amount
        : updatedRecord.items[0].withoutTax,
      baseCurrencyDecimal,
      isTaxIncluded
    );

    updatedRecord.items.forEach((item, index) => {
      if (index === 0) {
        item.amount = Number(calculatedAmount.amountWithTax);
        item.gstVat = formattedGst;
        item.withoutTax = Number(calculatedAmount.amountWithoutTax);
      } else if (item.taxTypeBaseId === 'noIdSelected') {
        const { expTypeId, recordDate } = item;
        const selectedTax = get(tax, `${expTypeId}.${recordDate}.0`, {} as any);
        item.taxTypeBaseId = selectedTax.baseId;
      }
    });
    updatedRecord.amount = Number(calculatedAmount.amountWithTax);
    updatedRecord.withoutTax = Number(calculatedAmount.amountWithoutTax);

    return updatedRecord;
  };

  setRecordItemIdx = (recordItemIdx?: number) => {
    if (this.props.isApproval) {
      this.setState({
        recordItemIdx,
      });
    } else {
      this.props.setFieldValue('ui.recordItemIdx', recordItemIdx);
    }
  };

  // update all child record items as touched
  updateTouched = () => {
    const { expReport, recordIdx, setTouched } = this.props;
    const childRecords = cloneDeep(expReport.records[recordIdx].items);

    const tmpTouched = {};
    childRecords.forEach((item, index) => {
      // skip the first one, because it's parent record
      if (index) {
        Object.keys(item).forEach((key) => {
          set(
            tmpTouched,
            `report.records.${recordIdx}.items.${index}.${key}`,
            true
          );
        });
      }
    });
    setTouched(tmpTouched, false);
  };

  removeRow = (idx: number) => {
    const { recordIdx, expReport, onChangeEditingExpReport } = this.props;

    const recordItems = cloneDeep(expReport.records[recordIdx].items);
    if (recordItems.length <= 2) {
      return;
    }

    recordItems.splice(idx, 1);
    onChangeEditingExpReport(`report.records.${recordIdx}.items`, recordItems);
  };

  addRow = (isCreate?: boolean) => {
    const { recordIdx, expReport, onChangeEditingExpReport } = this.props;

    const parentRecord = expReport.records[recordIdx];
    const recordItems = expReport.records[recordIdx].items;
    // record item 0 is parent record
    const childRecordsNumber = recordItems.length - 1;
    const lastRecordItem = recordItems[childRecordsNumber];

    // first child record date is same as parent record; following child records date same as previous row
    const defaultDate =
      childRecordsNumber > 0
        ? lastRecordItem.recordDate
        : parentRecord.recordDate;

    const initItem = newRecordItem('', '', false, null, true, '', '');

    const newItem = {
      ...initItem,
      recordDate: defaultDate,
      useForeignCurrency: lastRecordItem.useForeignCurrency,
      currencyId: lastRecordItem.currencyId,
      exchangeRate:
        lastRecordItem.originalExchangeRate || lastRecordItem.exchangeRate,
      originalExchangeRate: lastRecordItem.originalExchangeRate,
      currencyInfo: lastRecordItem.currencyInfo,
    };

    // when row added in confirm dialog
    if (!isCreate) {
      newItem.exchangeRateManual = !lastRecordItem.originalExchangeRate;
      (newItem as any).expTypeEditable = true;
    }

    onChangeEditingExpReport(
      `report.records.${recordIdx}.items.${childRecordsNumber + 1}`,
      newItem
    );
  };

  hideDialog = () => {
    this.props.hideAllDialog();
    this.setRecordItemIdx(null);
    if (!this.props.isApproval) {
      this.props.setFieldValue('ui.isRecordItemsEdit', false);
      this.props.setFieldValue('ui.isRecordItemsCreate', false);
    }
  };

  hideDialogAndResetValues = () => {
    const { recordIdx, tempSavedRecordItems, expReport } = this.props;
    this.hideDialog();
    if (this.props.isApproval) {
      return;
    }
    const parentRecordItem = cloneDeep(expReport.records[recordIdx].items[0]);
    const updatedItems = [parentRecordItem, ...drop(tempSavedRecordItems)];
    setTimeout(() => {
      // workaround as setFieldValue is asynchronous
      this.props.onChangeEditingExpReport(
        `report.records.${recordIdx}.items`,
        updatedItems
      );
    }, 1);
  };

  removeAll = async () => {
    const { expReport, recordIdx } = this.props;

    const parentRecord = cloneDeep(expReport.records[recordIdx]);
    const isTaxIncluded =
      parentRecord.amountInputMode === AmountInputMode.TaxIncluded;
    if (isTaxIncluded) {
      parentRecord.withoutTax = 0;
      parentRecord.items[0].withoutTax = 0;
    } else {
      parentRecord.amount = 0;
      parentRecord.items[0].amount = 0;
    }
    parentRecord.items[0].gstVat = 0;

    if (parentRecord.items[0].useForeignCurrency) {
      parentRecord.amount = 0;
      parentRecord.items[0].amount = 0;
    }

    // remove all but the first record item which is parent record
    parentRecord.items.splice(1);
    this.props.onChangeEditingExpReport(
      `report.records.${recordIdx}`,
      parentRecord,
      true
    );
    await this.props.onChangeEditingExpReport(
      'ui.tempSavedRecordItems',
      parentRecord.items
    );
    this.hideDialogAndResetValues();
  };

  buildExpTypesDisplay = (expTypeList: ExpenseTypeList) => {
    if (!expTypeList) {
      return [];
    }

    const placeholder = { value: '', text: msg().Exp_Lbl_PleaseSelect };

    const optionList = expTypeList.map((type) => ({
      value: type.id,
      text: type.name,
    }));
    return [placeholder, ...optionList];
  };

  render() {
    const expTypesDisplay = this.buildExpTypesDisplay(this.state.expTypeList);
    // recordItemIdx is saved in state in Approval page
    const recordItemIdx = this.props.isApproval
      ? this.state.recordItemIdx
      : this.props.recordItemIdx;

    switch (this.props.currentDialog) {
      case 'RECORD_ITEMS_CREATE':
        return (
          <RecordItemsCreateDialog
            addRow={this.addRow}
            removeRow={this.removeRow}
            onClickHideDialogButton={this.hideDialogAndResetValues}
            onChangeRecordDate={this.onChangeRecordDate}
            onChangeAmountField={this.onChangeAmountField}
            onChangeExpenseType={this.onChangeExpenseType}
            errors={this.props.errors}
            touched={this.props.touched}
            onClickNextButton={this.onClickNextButton}
            recordIdx={this.props.recordIdx}
            expReport={this.props.expReport}
            expTypesDisplay={expTypesDisplay}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            customHint={this.props.customHint}
          />
        );
      case 'RECORD_ITEMS_CONFIRM':
        return (
          <RecordItemsConfirmDialog
            errors={this.props.errors}
            touched={this.props.touched}
            setFieldError={this.props.setFieldError}
            setFieldTouched={this.props.setFieldTouched}
            recordIdx={this.props.recordIdx}
            recordItemIdx={recordItemIdx}
            baseCurrency={this.props.baseCurrency}
            foreignCurrency={this.props.foreignCurrency}
            isExpense={this.props.isExpense}
            addRow={this.addRow}
            removeRow={this.removeRow}
            onClickHideDialogButton={this.hideDialogAndResetValues}
            onClickSaveButton={this.onClickSaveButton}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            expReport={this.props.expReport}
            expTypeList={this.state.expTypeList}
            expTypesDisplay={expTypesDisplay}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            recordItemContainer={this.props.recordItemContainer}
            isFinanceApproval={this.props.isFinanceApproval}
            isApproval={this.props.isApproval}
            setRecordItemIdx={this.setRecordItemIdx}
            initTaxAndEIsForRecordItems={this.props.initTaxAndEIsForRecordItems}
            initForeignCurrencyAndEIs={this.props.initForeignCurrencyAndEIs}
            readOnly={this.props.readOnly}
            customHint={this.props.customHint}
          />
        );
      case 'RECORD_ITEMS_DELETE':
        return (
          <RecordItemsDeleteDialog
            onClickHideDialogButton={this.hideDialog}
            onClickRemoveAll={this.removeAll}
          />
        );
      default:
        return null;
    }
  }
}
