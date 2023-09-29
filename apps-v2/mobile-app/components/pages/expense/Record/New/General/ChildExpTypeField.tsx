import React, { useEffect } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import msg from '@commons/languages';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';

import { ExpenseTypeList } from '@apps/domain/models/exp/ExpenseType';
import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';
import { Record } from '@apps/domain/models/exp/Record';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxTypeList,
  getTaxTypeList,
} from '@apps/domain/models/exp/TaxType';

import { AppAction } from '@apps/mobile-app/action-dispatchers/AppThunk';

export type Props = {
  values: Record;
  itemIdx?: number;
  isGeneratedPreview?: boolean;
  isDisabled?: boolean;
  searchExpTypesByParentRecord: (targetDate: string, expTypeId: string) => void;
  setValues: (value: Record) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  errors: string[];
  childExpTypes: ExpenseTypeList;
  currencyDecimalPlace: number;
  taxRoundingSetting: RoundingType;
  setRate: (arg0: number) => void;
  getTaxTypeList: (
    arg0: string,
    arg1: string
  ) => AppAction<Promise<ExpTaxTypeList>>;
};

const ChildExpTypeField = (props: Props) => {
  const {
    values,
    itemIdx,
    isDisabled,
    childExpTypes = {},
    searchExpTypesByParentRecord,
    setValues,
    errors,
  } = props;

  const targetDate = values.recordDate;
  const parentExpId = values.items[0].expTypeId;
  const expTypes = get(childExpTypes, `${parentExpId}.${targetDate}`);
  useEffect(() => {
    if (!expTypes) {
      searchExpTypesByParentRecord(targetDate, parentExpId);
    }
  }, []);

  let expTypeOptions = (expTypes || []).map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  const placeholder = { value: '', label: msg().Exp_Lbl_PleaseSelect };
  expTypeOptions = [placeholder, ...expTypeOptions];

  const onChangeItemExpType = async (selectedExpType) => {
    const record = cloneDeep(values);
    let item = record.items[itemIdx];
    const isPrevAllowNegative = item.allowNegativeAmount;
    if (!selectedExpType) {
      item.expTypeId = null;
      item.expTypeName = '';
      setValues(record);
      return;
    }

    const eis = getEIsOnly(selectedExpType, item);
    const {
      allowNegativeAmount,
      id,
      itemizationSetting,
      name,
      useForeignCurrency,
    } = selectedExpType;
    item = {
      ...item,
      ...eis,
      expTypeId: id,
      expTypeName: name,
      expTypeItemizationSetting: itemizationSetting,
      useForeignCurrency,
      allowNegativeAmount,
    };
    record.items[itemIdx] = item;

    // if no item date, only update exp type
    const isForeignCurrency = record.items[itemIdx].useForeignCurrency;
    if (!isForeignCurrency && targetDate) {
      // base currency
      const tax = await props.getTaxTypeList(
        record.items[itemIdx].expTypeId,
        targetDate
      );
      const taxList = get(tax, '0.payload', [{}]);
      const parentItem = record.items[0];
      const filteredTaxList = getTaxTypeList(
        taxList,
        parentItem.taxTypeBaseId,
        parentItem.taxItems
      );
      const {
        rate = 0,
        baseId = '',
        historyId = '',
        name = '',
      } = find(filteredTaxList, {
        historyId: values.items[itemIdx].taxTypeHistoryId,
      }) || get(filteredTaxList, '0', {});
      record.items[itemIdx].taxTypeBaseId = baseId;
      record.items[itemIdx].taxTypeHistoryId = historyId;
      record.items[itemIdx].taxTypeName = name;
      record.items[itemIdx].taxRate = rate;
      props.setRate(rate);

      if (record.amountInputMode === AmountInputMode.TaxIncluded) {
        const { amountWithoutTax, gstVat } = calculateTax(
          rate,
          values.items[itemIdx].amount,
          props.currencyDecimalPlace,
          props.taxRoundingSetting
        );
        record.items[itemIdx].withoutTax = amountWithoutTax;
        record.items[itemIdx].gstVat = gstVat;
        if (itemIdx === 0) {
          record.withoutTax = amountWithoutTax;
        }
      } else {
        const { amountWithTax, gstVat } = calcAmountFromTaxExcluded(
          rate,
          record.items[itemIdx].withoutTax,
          props.currencyDecimalPlace,
          props.taxRoundingSetting
        );
        record.items[itemIdx].amount = amountWithTax;
        record.items[itemIdx].gstVat = gstVat;
        if (itemIdx === 0) {
          record.amount = amountWithTax;
        }
      }
    }

    if (isPrevAllowNegative && !allowNegativeAmount) {
      const { amount, gstVat, withoutTax, localAmount } = record.items[itemIdx];
      record.items[itemIdx].amount = Math.abs(amount);
      record.items[itemIdx].gstVat = Math.abs(gstVat);
      record.items[itemIdx].withoutTax = Math.abs(withoutTax);
      record.items[itemIdx].localAmount = Math.abs(localAmount);
    }

    setValues(record);
    props.setFieldTouched(`items[${itemIdx}]recordDate`, true, false);
  };

  const hanldeChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const selectedId = e.currentTarget.value;
    const selectedExpType = expTypes.find(({ id }) => id === selectedId);
    onChangeItemExpType(selectedExpType);
  };

  return (
    <SelectField
      required
      disabled={isDisabled}
      label={msg().Exp_Clbl_ExpenseType}
      errors={errors}
      options={expTypeOptions}
      onChange={hanldeChange}
      value={values.items[itemIdx].expTypeId}
    />
  );
};

export default ChildExpTypeField;
