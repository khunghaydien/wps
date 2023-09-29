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
} from '@apps/domain/models/exp/TaxType';

import { AppAction } from '@apps/mobile-app/action-dispatchers/AppThunk';

export type Props = {
  values: Record;
  itemIdx?: number;
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
    if (!selectedExpType) {
      item.expTypeId = null;
      item.expTypeName = '';
      setValues(record);
      return;
    }

    const eis = getEIsOnly(selectedExpType, item);
    const { id, name, useForeignCurrency } = selectedExpType;
    item = {
      ...item,
      ...eis,
      expTypeId: id,
      expTypeName: name,
      useForeignCurrency,
    };
    record.items[itemIdx] = item;

    // if no item date, only update exp type
    const itemDate = record.items[itemIdx].recordDate;
    const isForeignCurrency = record.items[itemIdx].useForeignCurrency;
    if (!isForeignCurrency && itemDate) {
      // base currency
      const tax = await props.getTaxTypeList(
        record.items[itemIdx].expTypeId,
        itemDate
      );
      const taxList = get(tax, '0.payload', [{}]);
      const {
        rate = 0,
        baseId,
        historyId,
        name,
      } = find(taxList, {
        historyId: values.items[itemIdx].taxTypeHistoryId,
      }) || taxList[0];
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

    setValues(record);
    props.setFieldTouched(`items[${itemIdx}]recordDate`, true);
  };

  const hanldeChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const selectedId = e.currentTarget.value;
    const selectedExpType = expTypes.find(({ id }) => id === selectedId);
    onChangeItemExpType(selectedExpType);
  };

  return (
    <SelectField
      required
      label={msg().Exp_Clbl_ExpenseType}
      errors={errors}
      options={expTypeOptions}
      onChange={hanldeChange}
      value={values.items[itemIdx].expTypeId}
    />
  );
};

export default ChildExpTypeField;
