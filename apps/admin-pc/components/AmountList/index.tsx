import React from 'react';

import { find, isEmpty } from 'lodash';

import Button from '../../../commons/components/buttons/Button';
import AmountField from '../../../commons/components/fields/AmountField';
import TextField from '../../../commons/components/fields/TextField';
import MultiColumnsGrid from '../../../commons/components/MultiColumnsGrid';
import BtnAddNewItem from '../../../commons/images/btnAddNewItem.svg';
import BtnDelete from '../../../commons/images/btnDelete.svg';
import msg from '../../../commons/languages';

import {
  AmountOption,
  ExpenseType,
} from '../../../domain/models/exp/ExpenseType';
import { FOREIGN_CURRENCY_USAGE } from '../../../domain/models/exp/foreign-currency/Currency';

import { MODE } from '../../modules/base/detail-pane/ui';

import './index.scss';

const ROOT = 'admin-pc-detail-pane-expense-amount-list';
type Props = {
  baseCurrencyDecimal: number;
  currencySet: Record<string, any>;
  disabled: boolean;
  modeBase: string;
  editRecord: ExpenseType;
  fixedAllowanceList: Array<AmountOption>;
  languageSet: Record<string, any>;
  tmpEditRecord: Record<string, any>;
  saveError: Record<string, any>;
  sfObjFieldValues: Record<string, any>;
  onClickAddRow: () => void;
  onChangeDetailItem: (isReset?: boolean | null) => void;
  onChange: (arg0: number, arg1: string, arg2: any) => void;
  onClickRemoveRow: (arg0: number) => void;
  onReset: (arg0: Array<AmountOption> | null | undefined) => void;
  onValidate: () => void;
  convertDecimal: () => void;
};

export default class AmountList extends React.Component<Props> {
  // set to original setting if expense type has amount option list already. Otherwise set to default one
  componentDidMount() {
    const { editRecord, onReset, modeBase } = this.props;
    const originOptionList = editRecord.fixedAllowanceOptionList;
    if (!isEmpty(originOptionList) && modeBase !== MODE.CLONE) {
      onReset(originOptionList);
    } else {
      onReset([
        /* eslint-disable  @typescript-eslint/naming-convention */
        { id: null, label: '', label_L0: '', label_L1: '', allowanceAmount: 0 },
      ]);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      editRecord,
      disabled,
      saveError,
      onReset,
      onChangeDetailItem,
      onValidate,
      tmpEditRecord,
      convertDecimal,
    } = this.props;
    const isCancelledEdit = !prevProps.disabled && disabled;
    const isExpenseTypeChanged = prevProps.editRecord.id !== editRecord.id;
    const originOptionList = editRecord.fixedAllowanceOptionList;
    const isForeignCurrencyChanged =
      prevProps.tmpEditRecord.fixedForeignCurrencyId !==
        tmpEditRecord.fixedForeignCurrencyId ||
      prevProps.tmpEditRecord.foreignCurrencyUsage !==
        tmpEditRecord.foreignCurrencyUsage;
    // when switch between different expense type, update amount list and tmp value
    if (isExpenseTypeChanged) {
      onReset(originOptionList);
      onChangeDetailItem();
    }
    // when cancel edit, reset to original setting
    if (isCancelledEdit) {
      onReset(originOptionList);
    }
    // when save expense type and get error from backend, validate component and update FE error
    if (!prevProps.saveError && saveError) {
      onValidate();
    }
    // when foerign currecy Usage/Id change, update the detail item for saving
    if (isForeignCurrencyChanged) {
      convertDecimal();
    }
  }

  // clean existing data if user change record type
  componentWillUnmount() {
    const { onReset, onChangeDetailItem } = this.props;
    onReset([
      /* eslint-disable  @typescript-eslint/naming-convention */
      { id: null, label: '', label_L0: '', label_L1: '', allowanceAmount: 0 },
    ]);
    onChangeDetailItem(true);
  }

  render() {
    const {
      baseCurrencyDecimal,
      fixedAllowanceList,
      editRecord,
      disabled,
      languageSet,
      currencySet,
      tmpEditRecord,
      onChange,
      onChangeDetailItem,
      onClickRemoveRow,
      onClickAddRow,
      onValidate,
      sfObjFieldValues,
    } = this.props;

    const isUseForeignCurrency =
      tmpEditRecord.foreignCurrencyUsage === FOREIGN_CURRENCY_USAGE.Fixed;
    const fixedForeignCurrencyId =
      isUseForeignCurrency && tmpEditRecord.fixedForeignCurrencyId;
    const targetForignCurrency =
      fixedForeignCurrencyId &&
      currencySet.find((item) => item.id === fixedForeignCurrencyId);
    let decimalDigit = baseCurrencyDecimal;
    if (!isEmpty(targetForignCurrency)) {
      decimalDigit = targetForignCurrency.decimalPlaces;
    }
    // row number is based on how many language set in system
    const languageList = [];
    for (let i = 0; i < Object.keys(languageSet).length; i++) {
      const lang = find(sfObjFieldValues.language, (o) => {
        return o.value === languageSet[`language${i}`];
      });
      if (lang) {
        languageList.push(`${lang.label}`);
      }
    }

    const rowNum = languageList.length + 1;
    const sizeList = [6, 6];
    const labelHeaderRow = [];

    const updateAndCheck = (
      index: number,
      key: string,
      value: number | null | string
    ) => {
      if (key === 'allowanceAmount') {
        onChange(index, 'allowanceAmount', value);
      }
      onChangeDetailItem();
      onValidate();
    };

    for (let i = 0; i < rowNum; i++) {
      sizeList[i] = 12 / rowNum;
      const label = languageList[i] || '';
      if (i === rowNum - 1) {
        labelHeaderRow[i] = (
          <div>
            <span>*</span>
            <label>{msg().Appr_Lbl_Amount}</label>
          </div>
        );
      } else {
        labelHeaderRow[i] = (
          <div>
            {i === 0 && <span>*</span>}
            <label>{`${msg().Admin_Lbl_Label}(${label})`}</label>
          </div>
        );
      }
    }

    const renderRow = fixedAllowanceList.map((item, index) => {
      return (
        <section className={`${ROOT}-row`}>
          <MultiColumnsGrid
            sizeList={sizeList}
            className={`${ROOT}-row-content`}
          >
            <TextField
              className={
                item.label_L0_error
                  ? `${ROOT}-row-label0-error`
                  : `${ROOT}-row-label0`
              }
              value={item.label_L0}
              disabled={disabled}
              onChange={(e) => onChange(index, 'label_L0', e.target.value)}
              // @ts-ignore
              onBlur={updateAndCheck}
            />
            {languageList.length >= 2 && (
              <TextField
                className={`${ROOT}-row-label1`}
                value={item.label_L1}
                disabled={disabled}
                onChange={(e) => onChange(index, 'label_L1', e.target.value)}
                // @ts-ignore
                onBlur={updateAndCheck}
              />
            )}
            {languageList.length >= 3 && (
              <TextField
                className={`${ROOT}-row-label2`}
                value={item.label_L1}
                disabled={disabled}
                onChange={(e) => onChange(index, 'label_L2', e.target.value)}
                // @ts-ignore
                onBlur={updateAndCheck}
              />
            )}
            <AmountField
              className={
                item.allowanceAmount_error
                  ? `${ROOT}-row-amount-error`
                  : `${ROOT}-row-amount`
              }
              value={item.allowanceAmount}
              fractionDigits={decimalDigit}
              disabled={disabled}
              onBlur={(value) =>
                updateAndCheck(index, 'allowanceAmount', value)
              }
            />
          </MultiColumnsGrid>
          {!disabled && fixedAllowanceList.length > 1 && (
            <Button
              disabled={disabled}
              className={`${ROOT}-remove`}
              onClick={() => {
                onClickRemoveRow(index);
              }}
            >
              <BtnDelete
                aria-hidden="true"
                className="slds-button__icon slds-button__icon-xx--small"
              />
            </Button>
          )}
        </section>
      );
    });

    return (
      <div className={`${ROOT}`} key={editRecord.id}>
        <section className={`${ROOT}-header`}>
          <MultiColumnsGrid sizeList={sizeList}>
            {labelHeaderRow}
          </MultiColumnsGrid>
        </section>

        <div className={`${ROOT}-content`}>{renderRow}</div>
        <div className={`${ROOT}-bottom`}>
          {!disabled && (
            <Button
              className={`${ROOT}__add`}
              disabled={fixedAllowanceList.length >= 20}
              onClick={onClickAddRow}
            >
              <BtnAddNewItem
                aria-hidden="true"
                className="slds-button__icon slds-button__icon-xx--small"
              />
              <span>{msg().Exp_Btn_AddNewItem}</span>
            </Button>
          )}
        </div>
      </div>
    );
  }
}
