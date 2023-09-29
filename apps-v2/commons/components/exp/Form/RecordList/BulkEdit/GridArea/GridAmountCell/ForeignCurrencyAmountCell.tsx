import React, { ReactElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import useClickOutside from '@apps/core/hooks/useClickOutside';
import usePrevious from '@commons/hooks/usePrevious';
import FormatUtil from '@commons/utils/FormatUtil';

import { Record } from '@apps/domain/models/exp/Record';

import GridDetailModalPortal from '../components/GridDetailModalPortal';

import ForeignCurrencyAmountModal, {
  ParentProps,
} from './ForeignCurrencyAmountModal';

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
  className: string;
  hasAmountError: boolean;
  isActive: boolean;
  recordIdx: number;
};

const ForeignCurrencyAmountCell = (props: Props): ReactElement => {
  const {
    className,
    currencyDecimalPlaces,
    currencyList,
    currencySymbol,
    hasAmountError,
    isActive,
    multiFixedList,
    record,
    recordIdx,
    calculateAmountFromRate,
    calculateForeignCurrencyAmounts,
    searchInitialSetting,
    updateRecord,
  } = props;
  const { amount, recordDate } = record;
  const { currencyId, localAmount } = record.items[0];
  const [isShowSummaryView, setIsShowSummaryView] = useState(false);
  const isFirstLoad = useRef(true);
  const clickRef = useRef();

  const formattedAmount = FormatUtil.formatNumber(
    amount,
    currencyDecimalPlaces
  );

  // update amounts on record date change
  const prevRecordDate = usePrevious(recordDate);
  useEffect(() => {
    if (
      !isFirstLoad.current &&
      !isShowSummaryView &&
      prevRecordDate !== recordDate
    ) {
      calculateForeignCurrencyAmounts(localAmount, currencyId, false);
    }
    if (isFirstLoad.current) {
      // prevent trigger of calculation logic on first load
      isFirstLoad.current = false;
    }
  }, [recordDate]);

  const onOpenSummaryView = () => {
    if (isActive) setIsShowSummaryView(true);
  };

  const onCloseSummaryView = () => {
    setIsShowSummaryView(false);
  };

  useClickOutside(clickRef, onCloseSummaryView);
  const containerId = `foreign-currency-amount-cell-${recordIdx}`;
  const detailCellParentClass = `${className}-cell-amount`;
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
        <ForeignCurrencyAmountModal
          currencyDecimalPlaces={currencyDecimalPlaces}
          currencyList={currencyList}
          currencySymbol={currencySymbol}
          multiFixedList={multiFixedList}
          record={record}
          onCloseSummaryView={onCloseSummaryView}
          calculateAmountFromRate={calculateAmountFromRate}
          calculateForeignCurrencyAmounts={calculateForeignCurrencyAmounts}
          searchInitialSetting={searchInitialSetting}
          updateRecord={updateRecord}
        />
      </GridDetailModalPortal>
    </button>
  );
};

export default ForeignCurrencyAmountCell;
