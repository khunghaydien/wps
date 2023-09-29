import React, { ReactElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import useClickOutside from '@apps/core/hooks/useClickOutside';
import AmountField from '@commons/components/fields/AmountField';
import usePrevious from '@commons/hooks/usePrevious';
import { MileageRateInfo } from '@commons/utils/exp/BulkEditUtil';
import FormatUtil from '@commons/utils/FormatUtil';

import {
  isCCRecord,
  isGeneralRecord,
  isIcRecord,
  isJorudanRecord,
  isMileageRecord,
  Record,
} from '@apps/domain/models/exp/Record';

import GridDetailModalPortal from '../components/GridDetailModalPortal';

import BaseCurrencyAmountModal, {
  ParentProps,
} from './BaseCurrencyAmountModal';

export type ContainerProps = {
  className: string;
  hasAmountError: boolean;
  isActive: boolean;
  record: Record;
  recordIdx: number;
  onChangeEditingExpReport: (
    field: string,
    value: string | number | Record,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
};

type Props = ParentProps & {
  bulkEditRemoveIds: string[];
  className: string;
  companyId: string;
  hasAmountError?: boolean;
  isActive: boolean;
  isRequest: boolean;
  recordIdx: number;
  getMileageRateInfo: (
    companyId: string,
    recordDate: string,
    mileageRateBaseId: string
  ) => Promise<MileageRateInfo>;
  updateRecord: (updateObj: {
    [key: string]: boolean | number | string;
  }) => void;
};

const BaseCurrencyAmountCell = (props: Props): ReactElement => {
  const {
    bulkEditRemoveIds,
    className,
    companyId,
    currencyDecimalPlaces,
    currencySymbol,
    expMileageUnit,
    hasAmountError,
    isActive,
    isRequest,
    multiFixedList,
    record,
    recordIdx,
    calculateAmountFromRate,
    calculateFromTaxType,
    getMileageRateInfo,
    searchInitialSetting,
    updateRecord,
  } = props;
  const {
    items,
    recordType: expenseType,
    amount,
    routeInfo,
    recordDate,
  } = record;
  const {
    mileageDistance,
    mileageRate,
    mileageRateBaseId,
    allowNegativeAmount,
  } = items[0];
  const [isShowSummaryView, setIsShowSummaryView] = useState(false);

  const isFirstLoad = useRef(true);
  const clickRef = useRef(null);

  const isMileageExpense = isMileageRecord(expenseType);
  const isJorudanExpense = isJorudanRecord(expenseType);
  const isGeneralExpense = isGeneralRecord(expenseType);
  const isRequestICRecord = isRequest && isIcRecord(expenseType);

  const formattedAmount = FormatUtil.formatNumber(
    amount,
    currencyDecimalPlaces
  );

  // update amount on details, record date change
  const jorudanCost = get(routeInfo, 'selectedRoute.cost', 0);
  const jorudanRoundTrip = get(routeInfo, 'roundTrip', false);
  const prevRecordDate = usePrevious(recordDate);
  const prevRemoveIds = usePrevious(bulkEditRemoveIds);
  useEffect(() => {
    const hasNoRecordRemoved = isEqual(prevRemoveIds, bulkEditRemoveIds);
    if (!isFirstLoad.current && !isShowSummaryView && hasNoRecordRemoved) {
      updateAmount();
    }
    if (isFirstLoad.current) {
      // For first time the grid is opened, we don't need to trigger calculation logic for any record
      isFirstLoad.current = false;
    }
  }, [mileageDistance, jorudanCost, jorudanRoundTrip, recordDate]);

  const updateAmount = async (amountInput?: number) => {
    let newAmount = isNil(amountInput) ? amount : amountInput;
    let mileageRateObj = {};
    if (isMileageExpense) {
      // fetch mileage rate if date is changed
      const isDateChanged = prevRecordDate !== recordDate;
      let finalMileageRate = mileageRate;
      if (isDateChanged) {
        const {
          mileageRate = 0,
          mileageRateBaseId: newMileageRateBasedId,
          mileageRateHistoryId,
          mileageRateName,
        } = await getMileageRateInfo(companyId, recordDate, mileageRateBaseId);
        finalMileageRate = mileageRate;
        mileageRateObj = {
          'items.0.mileageRateHistoryId': mileageRateHistoryId,
          'items.0.mileageRateBaseId': newMileageRateBasedId,
          'items.0.mileageRate': mileageRate,
          'items.0.mileageRateName': mileageRateName,
        };
      }
      newAmount = calculateAmountFromRate(finalMileageRate, mileageDistance);
    } else if (isJorudanExpense) {
      newAmount = jorudanRoundTrip
        ? get(routeInfo, 'selectedRoute.roundTripCost', 0)
        : jorudanCost;
    }
    calculateFromTaxType(newAmount, mileageRateObj);
  };

  const onBlurAmountField = (value: number) => {
    if (amount !== value) {
      updateRecord({
        amount: value,
        'items.0.amount': value,
      });
      updateAmount(value);
    }
  };

  const onOpenSummaryView = () => {
    if (isActive) setIsShowSummaryView(true);
  };

  const onCloseSummaryView = () => {
    if (isShowSummaryView) {
      setIsShowSummaryView(false);
    }
  };

  useClickOutside(clickRef, onCloseSummaryView);
  const containerId = `grid-cell-amount-cell-${recordIdx}`;
  const detailCellParentClass = `${className}-cell-amount`;
  const isAmountCellEditable =
    !isCCRecord(record) && (isGeneralExpense || isRequestICRecord);
  if (isAmountCellEditable) {
    return (
      <div
        className={classNames(`${detailCellParentClass}-field`, {
          [`${detailCellParentClass}-error`]: hasAmountError,
        })}
      >
        <AmountField
          currencySymbol={currencySymbol}
          fractionDigits={currencyDecimalPlaces || 0}
          onBlur={onBlurAmountField}
          value={amount}
          allowNegative={allowNegativeAmount}
        />
      </div>
    );
  }
  return (
    <button
      className={classNames(detailCellParentClass, {
        [`${detailCellParentClass}__clickable`]: isActive,
      })}
      id={containerId}
      onClick={onOpenSummaryView}
      type="button"
      ref={clickRef}
    >
      <p className={classNames({ 'field-error': hasAmountError })}>
        {currencySymbol} {formattedAmount}
      </p>
      <GridDetailModalPortal
        containerId={containerId}
        show={isShowSummaryView}
        containerClass={`${detailCellParentClass}__modal-left`}
      >
        <BaseCurrencyAmountModal
          currencyDecimalPlaces={currencyDecimalPlaces}
          currencySymbol={currencySymbol}
          expMileageUnit={expMileageUnit}
          multiFixedList={multiFixedList}
          record={record}
          onCloseSummaryView={onCloseSummaryView}
          calculateAmountFromRate={calculateAmountFromRate}
          calculateFromTaxType={calculateFromTaxType}
          searchInitialSetting={searchInitialSetting}
        />
      </GridDetailModalPortal>
    </button>
  );
};

export default BaseCurrencyAmountCell;
