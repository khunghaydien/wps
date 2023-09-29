import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

import ForeignCurrencyAmountCell, {
  ContainerProps,
} from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea/GridAmountCell/ForeignCurrencyAmountCell';

import { calcAmountFromRate } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  currencyInfo,
  isFixedAllowanceMulti,
} from '@apps/domain/models/exp/Record';

import { State } from '@apps/requests-pc/modules';
import { AppDispatch } from '@apps/requests-pc/modules/AppThunk';
import { actions as fixedAmountActions } from '@apps/requests-pc/modules/ui/expenses/recordItemPane/fixedAmountOption';

import {
  calculateForeignCurrencyAmount,
  getCurrencyList,
} from '@apps/requests-pc/action-dispatchers/BulkEdit';

const FORMIK_TARGET_FIELD = 'report.records';

const ForeignCurrencyAmountCellContainer = ({
  className,
  hasAmountError,
  isActive,
  record,
  recordIdx,
  onChangeEditingExpReport,
}: ContainerProps): ReactElement => {
  const dispatch = useDispatch() as AppDispatch;
  const { recordDate, recordType } = record;
  const recordItem = record.items[0];
  const { expTypeId } = recordItem;

  const userSetting = useSelector((state: State) => state.userSetting);
  const {
    companyId,
    currencyDecimalPlaces,
    currencySymbol,
    expRoundingSetting,
  } = userSetting;
  const subroleId = useSelector(
    (state: State) => state.ui.expenses.subrole.selectedRole
  );
  const currencyList = useSelector(
    (state: State) => state.ui.expenses.recordItemPane.foreignCurrency.currency
  );
  const expMultiFixedList = useSelector(
    (state: State) => state.ui.expenses.recordItemPane.fixedAmountOption
  );
  const multiFixedList = get(expMultiFixedList, expTypeId, []);

  const calculateAmountFromRate = (localAmount: number, rate: number) => {
    const amount = calcAmountFromRate(
      rate,
      localAmount,
      currencyDecimalPlaces,
      expRoundingSetting
    );
    return Number(amount);
  };

  const calculateForeignCurrencyAmounts = async (
    localAmount: number,
    selectedCurrencyId: string,
    isShowSummaryView: boolean
  ) => {
    const foreignCurrencyAmounts = await dispatch(
      calculateForeignCurrencyAmount(
        localAmount,
        companyId,
        currencyDecimalPlaces,
        expRoundingSetting,
        recordDate,
        undefined,
        selectedCurrencyId
      )
    );
    if (!isShowSummaryView) {
      const {
        amount,
        currencyId,
        currencyInfo,
        exchangeRate,
        exchangeRateManual,
        localAmount,
      } = foreignCurrencyAmounts;
      updateRecord({
        amount,
        'items.0.amount': amount,
        'items.0.currencyId': currencyId,
        'items.0.currencyInfo': currencyInfo,
        'items.0.exchangeRate': exchangeRate,
        'items.0.exchangeRateManual': exchangeRateManual,
        'items.0.localAmount': localAmount,
        'items.0.originalExchangeRate': exchangeRate,
      });
    }
    return foreignCurrencyAmounts;
  };

  const updateRecord = (updateObj: {
    [key: string]: boolean | number | string | currencyInfo;
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
    dispatch(getCurrencyList(companyId));
    if (isFixedAllowanceMulti(recordType) && multiFixedList.length === 0)
      dispatch(fixedAmountActions.search(expTypeId, subroleId, true));
  };

  return (
    <ForeignCurrencyAmountCell
      className={className}
      currencyDecimalPlaces={currencyDecimalPlaces}
      currencyList={currencyList}
      currencySymbol={currencySymbol}
      hasAmountError={hasAmountError}
      isActive={isActive}
      multiFixedList={multiFixedList}
      record={record}
      recordIdx={recordIdx}
      calculateAmountFromRate={calculateAmountFromRate}
      calculateForeignCurrencyAmounts={calculateForeignCurrencyAmounts}
      searchInitialSetting={searchInitialSetting}
      updateRecord={updateRecord}
    />
  );
};

export default ForeignCurrencyAmountCellContainer;
