import React, { ReactElement, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

import BaseCurrencyAmountCell, {
  ContainerProps,
} from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea/GridAmountCell/BaseCurrencyAmountCell';

import {
  calcAmountFromRate,
  ROUNDING_TYPE,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  isFixedAllowanceMulti,
  WITHHOLDING_TAX_TYPE,
} from '@apps/domain/models/exp/Record';

import { State } from '@apps/expenses-pc/modules';
import { AppDispatch } from '@apps/expenses-pc/modules/AppThunk';
import { actions as fixedAmountActions } from '@apps/expenses-pc/modules/ui/expenses/recordItemPane/fixedAmountOption';

import {
  calculateBaseCurrencyAmount,
  getMileageRateInfo,
} from '@apps/expenses-pc/action-dispatchers/BulkEdit';
import { searchTaxTypeList } from '@apps/expenses-pc/action-dispatchers/Currency';

const FORMIK_TARGET_FIELD = 'report.records';

const BaseCurrencyAmountCellContainer = ({
  className,
  hasAmountError,
  isActive,
  record,
  recordIdx,
  onChangeEditingExpReport,
}: ContainerProps): ReactElement => {
  const dispatch = useDispatch() as AppDispatch;
  const {
    amountInputMode,
    items,
    recordDate,
    recordType,
    withholdingTaxUsage,
  } = record;
  const { expTypeId, withholdingTaxAmount } = items[0];

  const userSettings = useSelector((state: State) => state.userSetting);
  const {
    companyId,
    currencyDecimalPlaces,
    currencySymbol,
    expMileageUnit,
    expRoundingSetting,
  } = userSettings;
  const expMultiFixedList = useSelector(
    (state: State) => state.ui.expenses.recordItemPane.fixedAmountOption
  );
  const multiFixedList = get(expMultiFixedList, expTypeId, []);
  const taxTypeList = useSelector(
    (state: State) => state.ui.expenses.recordItemPane.tax
  );
  const subroleId = useSelector(
    (state: State) => state.ui.expenses.subrole.selectedRole
  );
  const bulkEditRemoveIds = useSelector(
    (state: State) => state.common.exp.ui.bulkEditRecord.removeIds
  );

  const calculateAmountFromRate = (localAmount: number, rate?: number) => {
    const amount = calcAmountFromRate(
      rate || 0,
      localAmount,
      currencyDecimalPlaces,
      ROUNDING_TYPE.RoundUp
    );
    return Number(amount);
  };

  const calculateFromTaxType = async (
    amount: number,
    updateField: { [key: string]: string | number | boolean } = {}
  ) => {
    // prevent fetching of tax type if exp type is not selected
    if (!expTypeId) return;

    const {
      amount: newAmount,
      amountPayable,
      gstVat,
      taxTypeBaseId,
      taxTypeHistoryId,
      taxTypeName,
      taxRate,
      withoutTax,
    } = await dispatch(
      calculateBaseCurrencyAmount(
        Number(amount),
        amountInputMode,
        currencyDecimalPlaces,
        expRoundingSetting,
        recordDate,
        expTypeId,
        withholdingTaxAmount,
        withholdingTaxUsage || WITHHOLDING_TAX_TYPE.NotUsed
      )
    );

    const updatedRecord = (() => {
      const isMultipleTax = record.items[0]?.taxItems?.length > 0;

      const commonProps = {
        amount: newAmount,
        amountPayable,
        'items.0.amount': newAmount,
        'items.0.amountPayable': amountPayable,
      };

      if (isMultipleTax) {
        return {
          ...commonProps,
          ...updateField,
        };
      }

      return {
        withoutTax,
        'items.0.gstVat': gstVat,
        'items.0.taxRate': taxRate,
        'items.0.taxTypeBaseId': taxTypeBaseId,
        'items.0.taxTypeHistoryId': taxTypeHistoryId,
        'items.0.taxTypeName': taxTypeName,
        'items.0.withoutTax': withoutTax,
        ...commonProps,
        ...updateField,
      };
    })();

    updateRecord(updatedRecord);
  };

  const updateRecord = (updateObj: {
    [key: string]: boolean | number | string;
  }) => {
    const tmpRecordList = cloneDeep(record);
    Object.keys(updateObj).forEach((key) => {
      set(tmpRecordList, key, updateObj[key]);
    });
    onChangeEditingExpReport(
      `${FORMIK_TARGET_FIELD}.${recordIdx}`,
      tmpRecordList,
      true
    );
  };

  const searchInitialSetting = () => {
    const selectedTaxType = get(taxTypeList, [expTypeId, recordDate, '0']);
    if (!selectedTaxType) dispatch(searchTaxTypeList(expTypeId, recordDate));
    if (isFixedAllowanceMulti(recordType) && multiFixedList.length === 0)
      dispatch(fixedAmountActions.search(expTypeId, subroleId, true));
  };

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getMileageRateInfo,
        },
        dispatch
      ),
    [dispatch]
  );

  return (
    <BaseCurrencyAmountCell
      bulkEditRemoveIds={bulkEditRemoveIds}
      className={className}
      companyId={companyId}
      currencyDecimalPlaces={currencyDecimalPlaces}
      currencySymbol={currencySymbol}
      expMileageUnit={expMileageUnit}
      hasAmountError={hasAmountError}
      isActive={isActive}
      multiFixedList={multiFixedList}
      record={record}
      recordIdx={recordIdx}
      calculateAmountFromRate={calculateAmountFromRate}
      calculateFromTaxType={calculateFromTaxType}
      // @ts-ignore
      getMileageRateInfo={Actions.getMileageRateInfo}
      searchInitialSetting={searchInitialSetting}
      updateRecord={updateRecord}
    />
  );
};

export default BaseCurrencyAmountCellContainer;
